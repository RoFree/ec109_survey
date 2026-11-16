/**
 * Career Choices Study (Ec 109): Google Apps Script backend.
 *
 * Receives one JSON submission per completed survey from the website and writes it to
 * two tabs in the Google Sheet this script is attached to:
 *
 *   Respondents : one row per completed survey
 *   Responses   : one row per respondent x job
 *
 * Setup steps are in README.md. In short:
 *   1. Extensions > Apps Script in your Sheet, paste this file, save.
 *   2. Run `setup` once and authorize it.
 *   3. Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.
 *   4. Put the /exec URL into config.js on the website.
 *
 * Columns are matched by header name, so you may reorder columns or add your own
 * analysis columns to the right without breaking anything. Do not rename the headers.
 */

const RESPONDENTS_SHEET = 'Respondents';
const RESPONSES_SHEET = 'Responses';

const RESPONDENT_HEADERS = [
  'submitted_at', 'respondent_id', 'condition', 'phase_order', 'category_order',
  'class_year', 'major', 'name', 'email', 'started_at', 'completed_at',
  'duration_sec', 'prior_attempt', 'survey_version',
];

const RESPONSE_HEADERS = [
  'submitted_at', 'respondent_id', 'condition', 'phase_order', 'category_id',
  'category_name', 'category_position', 'job_id', 'job_title', 'job_position',
  'moral_rating', 'min_salary_usd', 'priceless',
];

const REQUIRED_EMAIL_DOMAIN = 'caltech.edu';
const SALARY_MAX = 10000000;
const MAX_JOBS_PER_SUBMISSION = 60;
const MAX_SUBMISSIONS_PER_MINUTE = 120; // crude flood protection for a public endpoint

const TEXT_COLUMNS = [
  'respondent_id', 'condition', 'phase_order', 'category_order', 'class_year', 'major',
  'name', 'email', 'survey_version', 'category_name', 'job_id', 'job_title',
];
const DATETIME_COLUMNS = ['submitted_at', 'started_at', 'completed_at'];
const USD_COLUMNS = ['min_salary_usd'];

// ============================================================ web app entry points

/** Health check: open the /exec URL in a browser to confirm the deployment works. */
function doGet() {
  return json_({ ok: true, message: 'Survey endpoint is running.' });
}

/** Receives a survey submission (JSON sent as text/plain to avoid a CORS preflight). */
function doPost(e) {
  let payload;
  try {
    payload = JSON.parse((e && e.postData && e.postData.contents) || '');
  } catch (err) {
    return json_({ ok: false, error: 'Invalid JSON.' });
  }

  let clean;
  try {
    clean = validate_(payload);
  } catch (err) {
    return json_({ ok: false, error: 'Invalid submission: ' + (err && err.message ? err.message : err) });
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    return json_({ ok: false, error: 'The server is busy. Please try again.' });
  }
  try {
    if (!underRateLimit_()) {
      return json_({ ok: false, error: 'Too many submissions right now. Please try again in a minute.' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const respondents = getOrCreateSheet_(ss, RESPONDENTS_SHEET, RESPONDENT_HEADERS);
    const responses = getOrCreateSheet_(ss, RESPONSES_SHEET, RESPONSE_HEADERS);

    // Idempotent: a retried submission with the same respondent_id is not written twice.
    const knownIds = columnValues_(respondents, 'respondent_id').map(String);
    if (knownIds.indexOf(clean.respondent_id) !== -1) {
      return json_({ ok: true, duplicate: true });
    }

    // Flag repeat takers in the identified condition (same email submitted before).
    let priorAttempt = false;
    if (clean.email) {
      const knownEmails = columnValues_(respondents, 'email').map((v) => String(v).trim().toLowerCase());
      priorAttempt = knownEmails.indexOf(clean.email) !== -1;
    }

    const now = new Date();
    const common = {
      submitted_at: now,
      respondent_id: clean.respondent_id,
      condition: clean.condition,
      phase_order: clean.phase_order,
    };

    const responseRows = clean.responses.map((r) => Object.assign({}, common, r));
    const respondentRow = Object.assign({}, common, {
      category_order: clean.category_order,
      class_year: clean.class_year,
      major: clean.major,
      name: clean.name,
      email: clean.email,
      started_at: clean.started_at,
      completed_at: clean.completed_at,
      duration_sec: clean.duration_sec,
      prior_attempt: priorAttempt,
      survey_version: clean.survey_version,
    });

    // Write the per-job rows first; the Respondents row marks the submission as complete.
    appendRecords_(responses, responseRows);
    appendRecords_(respondents, [respondentRow]);
    SpreadsheetApp.flush();

    return json_({ ok: true });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: 'Server error while saving. Please try again.' });
  } finally {
    lock.releaseLock();
  }
}

// ============================================================ one-time setup & testing

/** Run once from the Apps Script editor: creates both tabs with headers and formatting. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  getOrCreateSheet_(ss, RESPONDENTS_SHEET, RESPONDENT_HEADERS, true);
  getOrCreateSheet_(ss, RESPONSES_SHEET, RESPONSE_HEADERS, true);
  console.log('Setup complete: "%s" and "%s" tabs are ready.', RESPONDENTS_SHEET, RESPONSES_SHEET);
}

/**
 * Optional: run from the editor to write one fake submission (2 jobs) and confirm the
 * sheet fills in. Delete the TEST rows afterwards.
 */
function testSubmission() {
  const payload = {
    survey_version: 'TEST',
    respondent_id: 'test-' + Utilities.getUuid(),
    condition: 'identified',
    phase_order: 'rating_first',
    category_order: '2,1',
    class_year: '2028',
    major: 'Physics',
    name: 'Test Person',
    email: 'test@' + REQUIRED_EMAIL_DOMAIN,
    started_at: new Date(Date.now() - 600000).toISOString(),
    completed_at: new Date().toISOString(),
    duration_sec: 600,
    responses: [
      { category_id: 2, category_name: 'TEST set', category_position: 1, job_id: '2A', job_title: 'TEST job A',
        job_position: 1, moral_rating: 2, min_salary_usd: 100000, priceless: false },
      { category_id: 1, category_name: 'TEST set', category_position: 2, job_id: '1D', job_title: 'TEST job D',
        job_position: 1, moral_rating: 10, min_salary_usd: null, priceless: true },
    ],
  };
  const out = doPost({ postData: { contents: JSON.stringify(payload) } });
  console.log(out.getContent());
}

// ============================================================ validation

function validate_(p) {
  if (!p || typeof p !== 'object') throw new Error('payload must be an object');

  const condition = oneOf_(p.condition, ['anonymous', 'identified'], 'condition');
  const identified = condition === 'identified';

  let name = '';
  let email = '';
  if (identified) {
    name = text_(p.name, 100, 'name', true);
    email = String(p.email || '').trim().toLowerCase();
    const emailRe = new RegExp('^[^\\s@]+@' + REQUIRED_EMAIL_DOMAIN.replace(/\./g, '\\.') + '$');
    if (email.length > 100 || !emailRe.test(email)) throw new Error('email must end in @' + REQUIRED_EMAIL_DOMAIN);
  }
  // In the anonymous condition, name/email are never stored even if sent.

  const respondentId = String(p.respondent_id || '');
  if (!/^[A-Za-z0-9-]{8,64}$/.test(respondentId)) throw new Error('bad respondent_id');

  const categoryOrder = String(p.category_order || '');
  if (!/^\d{1,3}(,\d{1,3}){0,49}$/.test(categoryOrder)) throw new Error('bad category_order');

  if (!Array.isArray(p.responses) || p.responses.length < 1 || p.responses.length > MAX_JOBS_PER_SUBMISSION) {
    throw new Error('responses must be a non-empty list');
  }
  const seen = {};
  const responses = p.responses.map((r, i) => {
    if (!r || typeof r !== 'object') throw new Error('response ' + i + ' is not an object');
    const jobId = String(r.job_id || '');
    if (!/^\d{1,2}[A-Z]$/.test(jobId)) throw new Error('bad job_id at ' + i);
    if (seen[jobId]) throw new Error('duplicate job_id ' + jobId);
    seen[jobId] = true;
    const priceless = r.priceless === true;
    let salary = '';
    if (!priceless) {
      salary = Number(r.min_salary_usd);
      if (r.min_salary_usd === null || r.min_salary_usd === '' || !isFinite(salary) || salary < 0 || salary > SALARY_MAX) {
        throw new Error('bad min_salary_usd for ' + jobId);
      }
    }
    return {
      category_id: int_(r.category_id, 1, 99, 'category_id'),
      category_name: text_(r.category_name, 100, 'category_name', false),
      category_position: int_(r.category_position, 1, 99, 'category_position'),
      job_id: jobId,
      job_title: text_(r.job_title, 150, 'job_title', false),
      job_position: int_(r.job_position, 1, 99, 'job_position'),
      moral_rating: int_(r.moral_rating, 1, 10, 'moral_rating'),
      min_salary_usd: salary,
      priceless: priceless,
    };
  });

  const duration = Number(p.duration_sec);
  return {
    survey_version: text_(p.survey_version, 40, 'survey_version', false),
    respondent_id: respondentId,
    condition: condition,
    phase_order: oneOf_(p.phase_order, ['rating_first', 'salary_first'], 'phase_order'),
    category_order: categoryOrder,
    class_year: text_(p.class_year, 40, 'class_year', true),
    major: text_(p.major, 120, 'major', true),
    name: name,
    email: email,
    started_at: date_(p.started_at),
    completed_at: date_(p.completed_at),
    duration_sec: isFinite(duration) && duration >= 0 && duration <= 7 * 86400 && p.duration_sec !== null ? Math.round(duration) : '',
    responses: responses,
  };
}

function oneOf_(v, allowed, field) {
  if (allowed.indexOf(v) === -1) throw new Error('bad ' + field);
  return v;
}

function int_(v, min, max, field) {
  const n = Number(v);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error('bad ' + field);
  return n;
}

/** Cleans free text and stops spreadsheet formula injection (=, +, -, @ prefixes). */
function text_(v, maxLen, field, required) {
  let s = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
  if (required && !s) throw new Error(field + ' is required');
  if (s.length > maxLen) s = s.slice(0, maxLen);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function date_(v) {
  const d = new Date(String(v || ''));
  return isNaN(d.getTime()) ? '' : d;
}

function underRateLimit_() {
  const cache = CacheService.getScriptCache();
  const key = 'rate_' + Math.floor(Date.now() / 60000);
  const count = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(count), 120);
  return count <= MAX_SUBMISSIONS_PER_MINUTE;
}

// ============================================================ sheet helpers

/**
 * Returns the named tab, creating it (and any missing header columns) if needed.
 * Formatting is applied only when something changed or `forceFormat` is set, so normal
 * submissions stay fast.
 */
function getOrCreateSheet_(ss, name, headers, forceFormat) {
  let sheet = ss.getSheetByName(name);
  let changed = false;
  if (!sheet) {
    sheet = ss.insertSheet(name);
    changed = true;
  }

  let header = headerOf_(sheet);
  if (header.length === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    header = headers.slice();
    changed = true;
  } else {
    // Add any missing expected columns to the right (never renames or deletes yours).
    const missing = headers.filter((h) => header.indexOf(h) === -1);
    if (missing.length) {
      sheet.getRange(1, header.length + 1, 1, missing.length).setValues([missing]);
      header = header.concat(missing);
      changed = true;
    }
  }

  if (changed || forceFormat) {
    sheet.getRange(1, 1, 1, header.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    formatColumns_(sheet, header);
  }
  return sheet;
}

function formatColumns_(sheet, header) {
  const rows = sheet.getMaxRows() - 1;
  if (rows < 1) return;
  header.forEach((h, i) => {
    let fmt = null;
    if (TEXT_COLUMNS.indexOf(h) !== -1) fmt = '@';
    else if (DATETIME_COLUMNS.indexOf(h) !== -1) fmt = 'yyyy-mm-dd hh:mm:ss';
    else if (USD_COLUMNS.indexOf(h) !== -1) fmt = '$#,##0';
    if (fmt) sheet.getRange(2, i + 1, rows, 1).setNumberFormat(fmt);
  });
}

function headerOf_(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol < 1) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0].map((h) => String(h).trim());
}

function columnValues_(sheet, name) {
  const col = headerOf_(sheet).indexOf(name);
  const lastRow = sheet.getLastRow();
  if (col === -1 || lastRow < 2) return [];
  return sheet.getRange(2, col + 1, lastRow - 1, 1).getValues().map((r) => r[0]);
}

function appendRecords_(sheet, records) {
  if (!records.length) return;
  const header = headerOf_(sheet);
  const rows = records.map((rec) => header.map((h) => (Object.prototype.hasOwnProperty.call(rec, h) && rec[h] !== null ? rec[h] : '')));
  const start = sheet.getLastRow() + 1;
  const needed = start + rows.length - 1 - sheet.getMaxRows();
  if (needed > 0) {
    // New rows copy the formatting of the row above (text/date/currency formats).
    sheet.insertRowsAfter(sheet.getMaxRows(), needed + 500);
  }
  sheet.getRange(start, 1, rows.length, header.length).setValues(rows);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
