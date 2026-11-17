/*
 * Career Choices Study: survey logic.
 * Plain browser JavaScript with no build step or dependencies, suitable for GitHub Pages.
 *
 * Flow: welcome/consent -> (identified only) name + email -> instructions
 *       -> Part 1 (all jobs) -> Part 2 (all jobs) -> class year + major -> submit
 *
 * Randomized per respondent (and kept fixed if the page is reloaded):
 *   - condition:   anonymous | identified           (50/50)
 *   - phase_order: rating_first | salary_first       (50/50)
 *   - order of the job sets, and order of jobs within each set (same order in both parts)
 *
 * Testing: open the page with ?reset=1 to clear this browser's saved state. You can also
 * force an arm with ?reset=1&condition=identified&order=salary_first.
 */
(() => {
  'use strict';

  const C = window.SURVEY_CONFIG;

  const app = document.getElementById('app');
  const pill = document.getElementById('disclosure-pill');
  const progressBar = document.getElementById('progress');
  const progressTrack = document.getElementById('progress-track');
  const progressFill = document.getElementById('progress-fill');
  const progressLabel = document.getElementById('progress-label');
  document.getElementById('brand').textContent = C.STUDY_TITLE;

  // Job sets live in jobs/jobs-<version>.js; config.js picks one with JOBS_VERSION.
  const JOB_SET = (window.SURVEY_JOB_VERSIONS || {})[C.JOBS_VERSION];
  if (!JOB_SET) {
    app.innerHTML = '<section class="card"><h1>Setup error</h1><p>JOBS_VERSION in config.js does not match any job file loaded by index.html (see the jobs/ folder).</p></section>';
    return;
  }
  if (JOB_SET.deprecated) console.warn(`Job set "${C.JOBS_VERSION}" is deprecated.`);
  const SETS = JOB_SET.sets;
  // Saved with every response and used to discard stale in-progress attempts, e.g. "v2/jobs-v2".
  const VERSION_TAG = `${C.SURVEY_VERSION}/jobs-${C.JOBS_VERSION}`;

  const DONE_KEY = C.STORAGE_KEY + '_done';
  const LADDER = C.SALARY_LADDER.slice().sort((a, b) => a - b);
  const JOBS = new Map();
  SETS.forEach((set) => set.jobs.forEach((job) => JOBS.set(job.id, { job, set })));
  const N_JOBS = JOBS.size;

  const PHASES = {
    rate: { title: 'Moral assessment', summary: 'Rate how morally objectionable you find each job, from 1 to 10.' },
    price: { title: 'Compensation', summary: 'Choose the lowest annual pay at which you would accept each job.' },
  };

  let state = null;
  let flow = [];
  let submitting = false;

  // ------------------------------------------------------------------ helpers

  const esc = (v) =>
    String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const usd = (n) => '$' + Number(n).toLocaleString('en-US');
  const $ = (sel) => app.querySelector(sel);

  function randomInt(n) {
    // Unbiased integer in [0, n) using rejection sampling.
    const limit = Math.floor(0x100000000 / n) * n;
    const buf = new Uint32Array(1);
    do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
    return buf[0] % n;
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }

  // ------------------------------------------------------------------ storage

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode: progress just isn't saved */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
  };

  const cookieSuffix = () => `; path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  const hasDoneCookie = () => document.cookie.split(';').some((c) => c.trim() === C.COOKIE_NAME + '=1');
  const alreadyCompleted = () => store.get(DONE_KEY) === '1' || hasDoneCookie();

  function markCompleted() {
    store.set(DONE_KEY, '1');
    document.cookie = `${C.COOKIE_NAME}=1; max-age=${60 * 60 * 24 * 365 * 2}${cookieSuffix()}`;
    store.del(C.STORAGE_KEY); // don't leave answers (or a name/email) behind on shared computers
  }

  function saveState() { store.set(C.STORAGE_KEY, JSON.stringify(state)); }

  function loadState() {
    try {
      const s = JSON.parse(store.get(C.STORAGE_KEY));
      if (!s || s.version !== VERSION_TAG) return null;
      if (!Array.isArray(s.sequence) || s.sequence.length !== N_JOBS || !s.sequence.every((id) => JOBS.has(id))) return null;
      return s;
    } catch (e) {
      return null;
    }
  }

  // Researcher testing: ?reset=1[&condition=anonymous|identified][&order=rating_first|salary_first]
  function readTestParams() {
    const params = new URLSearchParams(location.search);
    if (!params.has('reset')) return {};
    store.del(C.STORAGE_KEY);
    store.del(DONE_KEY);
    document.cookie = `${C.COOKIE_NAME}=; max-age=0${cookieSuffix()}`;
    const forced = {};
    const cond = params.get('condition');
    const order = params.get('order');
    if (cond === 'anonymous' || cond === 'identified') forced.condition = cond;
    if (order === 'rating_first' || order === 'salary_first') forced.phase_order = order;
    history.replaceState(null, '', location.pathname);
    return forced;
  }

  function newState(forced) {
    const categoryOrder = shuffle(SETS.map((s) => s.id));
    const sequence = [];
    categoryOrder.forEach((cid) => {
      const set = SETS.find((s) => s.id === cid);
      shuffle(set.jobs.map((j) => j.id)).forEach((jid) => sequence.push(jid));
    });
    return {
      version: VERSION_TAG,
      respondent_id: uuid(),
      condition: forced.condition || (randomInt(2) ? 'identified' : 'anonymous'),
      phase_order: forced.phase_order || (randomInt(2) ? 'salary_first' : 'rating_first'),
      category_order: categoryOrder,
      sequence,
      step: 0,
      consent: false,
      name: '',
      email: '',
      class_year: '',
      major: '',
      major_other: '',
      ratings: {},   // job_id -> 1..10
      salaries: {},  // job_id -> USD amount (number) | 'priceless'
      started_at: null,
      completed_at: null,
    };
  }

  // ------------------------------------------------------------------ flow

  function buildFlow(s) {
    const f = [{ type: 'welcome', group: 'pre' }];
    if (s.condition === 'identified') f.push({ type: 'identity', group: 'pre' });
    f.push({ type: 'instructions', group: 'pre' });
    phaseKinds(s).forEach((kind, i) => {
      const part = i + 1;
      const group = 'p' + part;
      f.push({ type: 'phase', kind, part, group });
      s.sequence.forEach((jid, index) => f.push({ type: kind, jid, part, index, group }));
    });
    f.push({ type: 'demographics', group: 'post' });
    f.push({ type: 'submit', group: 'end' });
    return f;
  }

  const phaseKinds = (s) => (s.phase_order === 'rating_first' ? ['rate', 'price'] : ['price', 'rate']);

  // Back is allowed within a part, but never from Part 2 into Part 1 (that would let
  // respondents revise first-part answers after seeing the second task).
  function canGoBack() {
    const i = state.step;
    if (i === 0) return false;
    const cur = flow[i].group;
    const prev = flow[i - 1].group;
    if (cur === 'end') return false;
    if (cur === prev) return true;
    return (cur === 'p1' && prev === 'pre') || (cur === 'post' && prev === 'p2');
  }

  function go(delta) {
    const stageBefore = stageOf(flow[state.step]);
    state.step = Math.max(0, Math.min(flow.length - 1, state.step + delta));
    saveState();
    render();
    if (stageOf(flow[state.step]) !== stageBefore) track('stage');
  }

  // ------------------------------------------------------------------ drop-off tracking
  //
  // Small fire-and-forget pings to the backend so the Sessions tab can show who left
  // before finishing, by condition. Sent on every page load, at each new stage, and when
  // the tab is hidden or closed. They carry only the random respondent_id, the assigned
  // condition and part order, the stage, and progress. They never include answers,
  // name, or email.

  function stageOf(scr) {
    if (!scr) return 'welcome';
    if (scr.type === 'phase' || scr.type === 'rate' || scr.type === 'price') return scr.group === 'p1' ? 'part1' : 'part2';
    if (scr.type === 'submit') return 'demographics'; // completion is recorded by the submission itself
    return scr.type; // welcome | identity | instructions | demographics
  }

  function progressPct() {
    if (state.step <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((100 * (state.step - 1)) / Math.max(1, flow.length - 2))));
  }

  let lastTrackKey = '';
  function track(event) {
    // On by default; add TRACK_PROGRESS: false to config.js to turn it off.
    if (C.TRACK_PROGRESS === false || !C.APPS_SCRIPT_URL || !state || alreadyCompleted()) return;
    const stage = stageOf(flow[state.step]);
    const pct = progressPct();
    const key = `${stage}|${pct}`;
    if (event !== 'load' && key === lastTrackKey) return; // nothing new since the last ping
    lastTrackKey = key;
    const body = JSON.stringify({
      type: 'track',
      event, // load | stage | hide
      respondent_id: state.respondent_id,
      condition: state.condition,
      phase_order: state.phase_order,
      survey_version: VERSION_TAG,
      stage,
      progress_pct: pct,
      consented: !!state.started_at,
    });
    // sendBeacon survives the page closing; the backend acts on the POST itself, so the
    // response (a redirect) never needs to be read.
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(C.APPS_SCRIPT_URL, new Blob([body], { type: 'text/plain;charset=utf-8' }))) return;
    } catch (e) { /* fall through to fetch */ }
    try {
      fetch(C.APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body }).catch(() => {});
    } catch (e) { /* tracking is best-effort */ }
  }

  // ------------------------------------------------------------------ rendering

  function render() {
    const scr = flow[state.step];
    updateChrome(scr);
    const views = {
      welcome: renderWelcome,
      identity: renderIdentity,
      instructions: renderInstructions,
      phase: renderPhaseIntro,
      rate: renderRate,
      price: renderPrice,
      demographics: renderDemographics,
      submit: renderSubmit,
    };
    views[scr.type](scr);
    window.scrollTo(0, 0);
    // Move focus to the start of the new screen (the job text on item screens) for keyboard
    // and screen-reader users.
    const focusTarget = app.querySelector('.offer') || app.querySelector('h1');
    if (focusTarget) {
      focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({ preventScroll: true });
    }
  }

  function updateChrome(scr) {
    if (!scr) {
      pill.hidden = true;
      progressBar.hidden = true;
      return;
    }
    pill.hidden = false;
    if (state.condition === 'identified') {
      pill.className = 'pill identified';
      pill.textContent = state.name ? `Identified: ${state.name}` : 'Identified response';
    } else {
      pill.className = 'pill';
      pill.textContent = 'Anonymous response';
    }
    // Progress bar: shown from the first screen after the welcome page until submission.
    // 0% on that first screen; it reaches 100% when the respondent submits.
    const showProgress = state.step > 0 && scr.type !== 'submit';
    progressBar.hidden = !showProgress;
    if (showProgress) {
      const pct = Math.round((100 * (state.step - 1)) / Math.max(1, flow.length - 2));
      progressFill.style.width = `${pct}%`;
      progressLabel.textContent = `${pct}% complete`;
      progressTrack.setAttribute('aria-valuenow', String(pct));
    }
  }

  function actionsHtml({ back = canGoBack(), label = 'Next', disabled = false } = {}) {
    return `
      <div class="actions">
        ${back ? '<button type="button" class="btn ghost" id="back">&larr; Back</button>' : '<span></span>'}
        <button type="button" class="btn primary" id="next"${disabled ? ' disabled' : ''}>${esc(label)}</button>
      </div>`;
  }

  function bindActions(onNext) {
    const back = $('#back');
    if (back) back.addEventListener('click', () => go(-1));
    $('#next').addEventListener('click', onNext);
  }

  // --- welcome / consent

  function renderWelcome() {
    const identified = state.condition === 'identified';
    const notice = identified
      ? `<div class="notice identified">
           <h2>Your responses will be linked to your identity</h2>
           <p>On the next page we will ask for your full name and Caltech email. The researchers will see all of your answers together with your name and email.</p>
           <p>Please take this survey on your own, somewhere no one else can see your screen.</p>
         </div>`
      : `<div class="notice">
           <h2>Your responses are anonymous</h2>
           <p>We will not ask for your name, email, or any other identifying information, and we will not try to identify you. We only ask for your class year and major.</p>
           <p>Please take this survey on your own, somewhere no one else can see your screen.</p>
         </div>`;

    const setupWarning = C.APPS_SCRIPT_URL
      ? ''
      : '<div class="notice setup"><strong>Setup incomplete:</strong> APPS_SCRIPT_URL is empty in config.js, so responses cannot be submitted.</div>';

    app.innerHTML = `
      <section class="card">
        ${setupWarning}
        <p class="eyebrow">${esc(C.STUDY_TAGLINE)}</p>
        <h1>${esc(C.STUDY_TITLE)}</h1>
        <p class="lead">You will read ${N_JOBS} short descriptions of hypothetical job offers. For each one, you'll tell us how morally objectionable you find it and the lowest pay at which you would accept it. It takes about ${esc(C.ESTIMATED_MINUTES)} minutes.</p>
        <p>There are no right or wrong answers. Taking part is voluntary, and you can stop at any time. You can also close this page and come back later on the same device and browser to pick up where you left off. Your responses are not sent to the researchers unless you reach the end and submit.</p>
        ${notice}
        <label class="check">
          <input type="checkbox" id="consent" aria-labelledby="consent-text"${state.consent ? ' checked' : ''}>
          <span id="consent-text">I am a current Caltech undergraduate, I am 18 or older, and I agree to take part in this survey.</span>
        </label>
        ${C.CONTACT_EMAIL ? `<p class="small muted" style="margin-top:16px">Questions about this study? Contact <a href="mailto:${esc(C.CONTACT_EMAIL)}">${esc(C.CONTACT_EMAIL)}</a>.</p>` : ''}
        ${actionsHtml({ back: false, label: 'Start survey', disabled: !state.consent })}
      </section>`;

    const box = $('#consent');
    box.addEventListener('change', () => {
      state.consent = box.checked;
      saveState();
      $('#next').disabled = !box.checked;
    });
    bindActions(() => {
      if (!state.consent) return;
      if (!state.started_at) state.started_at = new Date().toISOString();
      go(1);
    });
  }

  // --- identified condition: name + email

  function renderIdentity() {
    const domain = C.REQUIRED_EMAIL_DOMAIN;
    app.innerHTML = `
      <section class="card">
        <p class="eyebrow">Before you begin</p>
        <h1>Your name and Caltech email</h1>
        <p>The researchers will see all of your answers together with this information.</p>
        <form id="identity-form" novalidate>
          <div class="field" id="name-field">
            <label for="name">Full name</label>
            <input id="name" name="name" autocomplete="name" maxlength="100" value="${esc(state.name)}">
            <div class="err" id="name-err" hidden></div>
          </div>
          <div class="field" id="email-field">
            <label for="email">Caltech email</label>
            <input id="email" name="email" type="email" inputmode="email" autocomplete="email" maxlength="100"
                   placeholder="you@${esc(domain)}" value="${esc(state.email)}">
            <div class="err" id="email-err" hidden></div>
          </div>
        </form>
        ${actionsHtml({ label: 'Continue' })}
      </section>`;

    const setErr = (field, msg) => {
      $(`#${field}-field`).classList.toggle('invalid', !!msg);
      const el = $(`#${field}-err`);
      el.textContent = msg || '';
      el.hidden = !msg;
    };

    const submit = () => {
      const name = $('#name').value.trim().replace(/\s+/g, ' ');
      const email = $('#email').value.trim().toLowerCase();
      const domainRe = new RegExp('^[^\\s@]+@' + domain.replace(/\./g, '\\.') + '$', 'i');
      const nameErr = name.length < 2 ? 'Please enter your full name.' : '';
      const emailErr = !domainRe.test(email) ? `Please enter an email address ending in @${domain}.` : '';
      setErr('name', nameErr);
      setErr('email', emailErr);
      if (nameErr || emailErr) {
        $(nameErr ? '#name' : '#email').focus();
        return;
      }
      state.name = name;
      state.email = email;
      go(1);
    };

    $('#identity-form').addEventListener('submit', (e) => { e.preventDefault(); submit(); });
    bindActions(submit);
  }

  // --- instructions

  function renderInstructions() {
    const [k1, k2] = phaseKinds(state);
    app.innerHTML = `
      <section class="card">
        <p class="eyebrow">How this works</p>
        <h1>Imagine your first job offer</h1>
        <p>Imagine you have finished your education, either your bachelor's degree or a graduate degree (whichever you prefer), and are choosing your first full-time job.</p>
        <p>You will see ${N_JOBS} job offers. For every offer, assume that:</p>
        <ul>
          <li>Unless an offer names a specific role, you would do research and development in your own field, on problems as interesting to you as at any job you would consider.</li>
          <li>Don't judge an offer by whether its industry sounds interesting. The work itself would be equally interesting to you in every offer.</li>
          <li>Real companies are named only as examples. Treat each offer as a hypothetical job at a company like the one described.</li>
          <li>Location, hours, colleagues, job security, and career prospects are the same as at your other options.</li>
          <li>You are not locked in: you could leave the job at any time after working there for a few months. For example, you could take a job you don't like for a very high salary, work there briefly, and then leave.</li>
          <li>You would face no personal legal risk from taking the job.</li>
          <li>Pay means total annual compensation (salary, bonus, and stock) in today's dollars.</li>
        </ul>
        <p>The offers differ only in what the organization does and how much it pays.</p>
        <h2 style="margin-top:24px">Two parts</h2>
        <ol>
          <li><strong>Part 1: ${PHASES[k1].title}.</strong> ${PHASES[k1].summary}</li>
          <li><strong>Part 2: ${PHASES[k2].title}.</strong> ${PHASES[k2].summary}</li>
        </ol>
        ${actionsHtml({ label: 'Continue' })}
      </section>`;
    bindActions(() => go(1));
  }

  // --- part intro

  function renderPhaseIntro(scr) {
    const body =
      scr.kind === 'rate'
        ? `<p>For each of the ${N_JOBS} jobs, rate how morally objectionable you find it on a scale from <strong>1 (not at all objectionable)</strong> to <strong>10 (extremely objectionable)</strong>.</p>
           <p>Answer based on your own views. There are no right or wrong answers.</p>
           <p class="small muted">Tip: you can use the number keys (1&ndash;9, and 0 for 10), then Enter.</p>`
        : `<p>For each of the ${N_JOBS} jobs, imagine you have received the offer. You'll see a list of annual pay levels from ${usd(LADDER[0])} to ${usd(LADDER[LADDER.length - 1])}.</p>
           <p><strong>Click the lowest amount at which you would accept the job.</strong> You'll be marked as accepting at that amount and at every higher amount.</p>
           <p>Remember that you don't have to stay. You could take a job for a large salary, work there for just a few months, and then leave whenever you want.</p>
           <p>If you would not take the job at any of the listed amounts, choose &ldquo;I would not accept at any of these amounts.&rdquo;</p>`;
    app.innerHTML = `
      <section class="card">
        <p class="eyebrow">Part ${scr.part} of 2</p>
        <h1>${PHASES[scr.kind].title}</h1>
        ${body}
        ${scr.part === 2 ? `<p class="small muted">You'll see the same ${N_JOBS} job offers again.</p>` : ''}
        ${actionsHtml({ label: `Begin part ${scr.part}` })}
      </section>`;
    bindActions(() => go(1));
  }

  // --- shared job card

  function jobHeaderHtml(scr) {
    const { job } = JOBS.get(scr.jid);
    // A "\n" in a job's text starts a new paragraph. Job sets use it to put the part that
    // changes between levels on its own line, so it stands out when respondents press Next.
    const paragraphs = String(job.text)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${esc(line)}</p>`)
      .join('');
    return `
      <div class="meta">
        <span>Part ${scr.part} of 2 &middot; ${PHASES[scr.kind || scr.type].title}</span>
        <span>Job ${scr.index + 1} of ${N_JOBS}</span>
      </div>
      <div class="offer">
        <p class="eyebrow">Job offer</p>
        ${paragraphs}
      </div>
      <p class="assume">Assume the work is as interesting to you as any other job, everything else matches your other options, you could leave after a few months, and you face no legal risk.</p>`;
  }

  // --- moral rating (1-10)

  function renderRate(scr) {
    const current = state.ratings[scr.jid];
    const buttons = Array.from({ length: 10 }, (_, i) => i + 1)
      .map((n) => `<button type="button" data-v="${n}" aria-pressed="${current === n}" class="${current === n ? 'selected' : ''}" aria-label="${n} out of 10">${n}</button>`)
      .join('');
    app.innerHTML = `
      <section class="card">
        ${jobHeaderHtml(scr)}
        <h1 class="q">How morally objectionable do you find this job?</h1>
        <div class="scale" role="group" aria-label="Rating from 1 (not at all objectionable) to 10 (extremely objectionable)">${buttons}</div>
        <div class="anchors"><span>1 = Not at all objectionable</span><span>10 = Extremely objectionable</span></div>
        ${actionsHtml({ disabled: current == null })}
      </section>`;

    app.querySelectorAll('.scale button').forEach((btn) => {
      btn.addEventListener('click', () => setRating(scr.jid, Number(btn.dataset.v)));
    });
    bindActions(() => { if (state.ratings[scr.jid] != null) go(1); });
  }

  function setRating(jid, v) {
    state.ratings[jid] = v;
    saveState();
    app.querySelectorAll('.scale button').forEach((b) => {
      const on = Number(b.dataset.v) === v;
      b.classList.toggle('selected', on);
      b.setAttribute('aria-pressed', String(on));
    });
    $('#next').disabled = false;
  }

  // --- multiple price list

  function renderPrice(scr) {
    const rows = LADDER.map(
      (amt) => `<button type="button" class="mpl-row" data-amt="${amt}"><span class="amt">${usd(amt)}</span><span class="dec"></span></button>`
    ).join('');
    app.innerHTML = `
      <section class="card">
        ${jobHeaderHtml(scr)}
        <h1 class="q">What is the lowest annual pay at which you would accept this job?</h1>
        <p class="q-help">Click the lowest amount you would accept. You'll be marked as accepting at that amount and above.</p>
        <div class="mpl" role="group" aria-label="Annual pay levels">
          <div class="mpl-head" aria-hidden="true"><span>Total annual pay</span><span>Your decision</span></div>
          ${rows}
          <button type="button" class="mpl-row mpl-none" data-amt="priceless">I would not accept at any of these amounts</button>
        </div>
        <p class="mpl-summary" aria-live="polite"></p>
        ${actionsHtml({ disabled: state.salaries[scr.jid] == null })}
      </section>`;

    app.querySelectorAll('.mpl-row').forEach((row) => {
      row.addEventListener('click', () => {
        const raw = row.dataset.amt;
        state.salaries[scr.jid] = raw === 'priceless' ? 'priceless' : Number(raw);
        saveState();
        paintMPL(state.salaries[scr.jid]);
        $('#next').disabled = false;
      });
    });
    paintMPL(state.salaries[scr.jid]);
    bindActions(() => { if (state.salaries[scr.jid] != null) go(1); });
  }

  function paintMPL(sel) {
    app.querySelectorAll('.mpl-row:not(.mpl-none)').forEach((row) => {
      const amt = Number(row.dataset.amt);
      const dec = row.querySelector('.dec');
      row.classList.remove('accept', 'decline', 'switch');
      if (sel == null) {
        dec.textContent = '';
      } else if (sel !== 'priceless' && amt >= sel) {
        row.classList.add('accept');
        if (amt === sel) row.classList.add('switch');
        dec.textContent = 'Accept';
      } else {
        row.classList.add('decline');
        dec.textContent = 'Decline';
      }
      row.setAttribute('aria-pressed', String(amt === sel));
      row.setAttribute('aria-label', `${usd(amt)} per year${dec.textContent ? ': ' + dec.textContent : ''}`);
    });
    const none = $('.mpl-none');
    none.classList.toggle('selected', sel === 'priceless');
    none.setAttribute('aria-pressed', String(sel === 'priceless'));

    const summary = $('.mpl-summary');
    if (sel == null) summary.textContent = '';
    else if (sel === 'priceless') summary.innerHTML = `You would <strong>not accept</strong> this job at any pay up to ${usd(LADDER[LADDER.length - 1])} per year.`;
    else summary.innerHTML = `You would accept this job for <strong>${usd(sel)}</strong> per year or more.`;
  }

  // --- class year + major

  function renderDemographics() {
    const opt = (list, cur) =>
      ['<option value="">Select&hellip;</option>']
        .concat(list.map((v) => `<option value="${esc(v)}"${v === cur ? ' selected' : ''}>${esc(v)}</option>`))
        .join('');
    app.innerHTML = `
      <section class="card">
        <p class="eyebrow">Last step</p>
        <h1>About you</h1>
        <form id="demo-form" novalidate>
          <div class="field" id="year-field">
            <label for="class-year">Class year</label>
            <select id="class-year">${opt(C.CLASS_YEARS, state.class_year)}</select>
            <div class="err" hidden>Please select your class year.</div>
          </div>
          <div class="field" id="major-field">
            <label for="major">Major (option)</label>
            <select id="major">${opt(C.MAJORS, state.major)}</select>
            <div class="err" hidden>Please select your major.</div>
          </div>
          <div class="field" id="other-field"${state.major === 'Other' ? '' : ' hidden'}>
            <label for="major-other">Your major</label>
            <input id="major-other" maxlength="100" value="${esc(state.major_other)}">
            <div class="err" hidden>Please enter your major.</div>
          </div>
        </form>
        ${actionsHtml({ label: 'Submit responses' })}
      </section>`;

    const year = $('#class-year');
    const major = $('#major');
    const other = $('#major-other');
    const persist = () => {
      state.class_year = year.value;
      state.major = major.value;
      state.major_other = other.value.trim();
      saveState();
    };
    year.addEventListener('change', persist);
    other.addEventListener('input', persist);
    major.addEventListener('change', () => {
      persist();
      $('#other-field').hidden = major.value !== 'Other';
    });

    const flag = (id, bad) => {
      const f = $(id);
      f.classList.toggle('invalid', bad);
      f.querySelector('.err').hidden = !bad;
      return bad;
    };

    const submit = () => {
      persist();
      const bad = [
        flag('#year-field', !state.class_year),
        flag('#major-field', !state.major),
        flag('#other-field', state.major === 'Other' && !state.major_other),
      ];
      if (bad.some(Boolean)) return;
      state.completed_at = new Date().toISOString();
      go(1);
    };
    $('#demo-form').addEventListener('submit', (e) => { e.preventDefault(); submit(); });
    bindActions(submit);
  }

  // ------------------------------------------------------------------ submission

  function buildPayload() {
    const posInSet = {};
    const responses = state.sequence.map((jid) => {
      const { job, set } = JOBS.get(jid);
      posInSet[set.id] = (posInSet[set.id] || 0) + 1;
      const sal = state.salaries[jid];
      return {
        category_id: set.id,
        category_name: set.name,
        category_position: state.category_order.indexOf(set.id) + 1,
        job_id: job.id,
        job_title: job.title,
        job_position: posInSet[set.id],
        moral_rating: state.ratings[jid],
        min_salary_usd: sal === 'priceless' ? null : sal,
        priceless: sal === 'priceless',
      };
    });
    const identified = state.condition === 'identified';
    const started = Date.parse(state.started_at);
    const completed = Date.parse(state.completed_at);
    return {
      survey_version: VERSION_TAG,
      respondent_id: state.respondent_id,
      condition: state.condition,
      phase_order: state.phase_order,
      category_order: state.category_order.join(','),
      class_year: state.class_year,
      major: state.major === 'Other' ? `Other: ${state.major_other}` : state.major,
      name: identified ? state.name : '',
      email: identified ? state.email : '',
      started_at: state.started_at,
      completed_at: state.completed_at,
      duration_sec: Number.isFinite(started) && Number.isFinite(completed) ? Math.round((completed - started) / 1000) : null,
      responses,
    };
  }

  function missingAnswers() {
    return state.sequence.filter((jid) => state.ratings[jid] == null || state.salaries[jid] == null);
  }

  async function postPayload(payload) {
    // text/plain avoids a CORS preflight, which Apps Script web apps cannot answer.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const res = await fetch(C.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow',
        signal: controller.signal,
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { throw new Error(`Unexpected response from the server (HTTP ${res.status}).`); }
      if (!data.ok) throw new Error(data.error || 'The server rejected the submission.');
      return data;
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('The server took too long to respond.');
      if (err instanceof TypeError) throw new Error('Could not reach the server. Check your internet connection.');
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  function renderSubmit() {
    app.innerHTML = `
      <section class="card">
        <div class="spinner" role="status" aria-label="Submitting"></div>
        <h1>Submitting your responses&hellip;</h1>
        <p class="muted">This can take a few seconds. Please keep this page open.</p>
      </section>`;
    submit();
  }

  async function submit() {
    if (submitting) return;
    submitting = true;
    try {
      if (!C.APPS_SCRIPT_URL) throw new Error('This survey is not configured yet (missing APPS_SCRIPT_URL).');
      if (missingAnswers().length) throw new Error('Some answers are missing. Please go back and complete every question.');
      if (!state.completed_at) state.completed_at = new Date().toISOString();
      saveState();
      await postPayload(buildPayload());
      markCompleted();
      renderDone();
    } catch (err) {
      renderSubmitError(err);
    } finally {
      submitting = false;
    }
  }

  function renderSubmitError(err) {
    app.innerHTML = `
      <section class="card">
        <p class="eyebrow">Not submitted yet</p>
        <h1>We couldn't submit your responses</h1>
        <p class="error-text">${esc(err && err.message ? err.message : err)}</p>
        <p>Your answers are saved in this browser, so nothing is lost. Please try again in a moment.</p>
        <div class="actions">
          <button type="button" class="btn ghost" id="back">&larr; Back</button>
          <button type="button" class="btn primary" id="retry">Try again</button>
        </div>
      </section>`;
    $('#retry').addEventListener('click', renderSubmit);
    $('#back').addEventListener('click', () => go(-1));
    window.scrollTo(0, 0);
  }

  function renderDone() {
    updateChrome(null);
    app.innerHTML = `
      <section class="card">
        <p class="eyebrow">Complete</p>
        <h1>Thank you!</h1>
        <p>Your responses have been recorded. You can close this page now.</p>
        <p class="muted small">Please don't discuss the details of this survey with classmates who haven't taken it yet.</p>
      </section>`;
    window.scrollTo(0, 0);
  }

  function renderAlreadyDone() {
    updateChrome(null);
    app.innerHTML = `
      <section class="card">
        <p class="eyebrow">Already complete</p>
        <h1>You've already taken this survey</h1>
        <p>Thank you for taking part. Each person can take the survey only once.</p>
      </section>`;
  }

  // ------------------------------------------------------------------ keyboard

  document.addEventListener('keydown', (e) => {
    if (!state || e.altKey || e.ctrlKey || e.metaKey) return;
    const scr = flow[state.step];
    if (!scr) return;
    const tag = e.target && e.target.tagName;
    const typing = tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';

    if (scr.type === 'rate' && !typing && /^[0-9]$/.test(e.key)) {
      setRating(scr.jid, e.key === '0' ? 10 : Number(e.key));
      e.preventDefault();
      return;
    }
    // Enter = Next (except where Enter already means something: buttons, links, dropdowns).
    if (e.key === 'Enter' && !['BUTTON', 'A', 'SELECT', 'TEXTAREA'].includes(tag)) {
      const next = $('#next');
      if (next && !next.disabled) {
        e.preventDefault();
        next.click();
      }
    }
  });

  // ------------------------------------------------------------------ start

  const forced = readTestParams();
  if (alreadyCompleted()) {
    renderAlreadyDone();
    return;
  }
  state = loadState() || newState(forced);
  flow = buildFlow(state);
  if (!(state.step >= 0 && state.step < flow.length)) state.step = 0;
  saveState();
  render();

  track('load'); // one per page load, so the backend can count visits
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') track('hide');
  });
  window.addEventListener('pagehide', () => track('hide'));
})();
