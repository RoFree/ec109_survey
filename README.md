# Career Choices Study (Ec 109)

A static survey website (hosted free on GitHub Pages) that saves each completed response to a
Google Sheet through a Google Apps Script web app. There are no servers to run and no paid services.

```
survey-site/
├── index.html            page shell
├── config.js             ← settings you edit (Apps Script URL, job-set version, salary ladder, majors)
├── jobs/jobs-v9.js       ← current job offers: 16 jobs (4 sets × 4 levels), two-line descriptions
├── jobs/jobs-v8.js       deprecated (older quant C/D: Jane Street/SEBI, Alameda), kept for reference
├── jobs/jobs-v7.js       deprecated (3B too close to 3A), kept for reference
├── jobs/jobs-v6.js       deprecated (uneven startup steps, no real quant examples), kept for reference
├── jobs/jobs-v5.js       deprecated (health and consumer set, sports betting), kept for reference
├── jobs/jobs-v4.js       deprecated (research-institute / single-client framing), kept for reference
├── jobs/jobs-v3.js       deprecated (same ladders as v4, employers named by product), kept for reference
├── jobs/jobs-v2.js       deprecated (5 sets × 5 levels), kept for reference
├── jobs/jobs-v1.js       deprecated first draft (6 sets × 4 levels), kept for reference
├── assets/app.js         survey logic (randomization, screens, submission)
├── assets/styles.css     styling (light and dark mode, mobile friendly)
├── apps-script/Code.gs   backend: paste into Apps Script (not run by the website itself)
└── .nojekyll             tells GitHub Pages to serve the files as they are
```

---

## What a respondent sees

1. **Welcome and consent.** Shows the disclosure notice for their randomly assigned condition:
   - *Anonymous*: name and email are never asked for. They are told the researchers won't try to identify them.
   - *Identified*: they are told the researchers will see their answers together with their name and email.

   Both versions ask them to take the survey privately. A small badge in the top bar keeps showing
   "Anonymous response" or "Identified: *Name*" for the whole survey.
2. **Name + Caltech email.** Identified condition only. The email must end in `@caltech.edu`.
3. **Instructions.** Imagine your first job after a bachelor's or a graduate degree (your choice). Assume that
   unless an offer names a specific role, you would do R&D in your own field. The work is equally interesting in
   every offer, so don't judge an offer by its industry. Real companies are only examples of the kind of employer.
   Everything else is equal, there is no personal legal risk, and pay means total annual compensation.
   Respondents are also told they could leave at any time after a few months, for example by taking a job they
   dislike for a very high salary, working briefly, and leaving. The Compensation intro repeats this, and a one-line
   version of all the assumptions appears under every job.
4. **Part 1 and Part 2.** The order is randomized: moral rating first or salary first.
   - *Moral assessment*: "How morally objectionable do you find this job?" on a 1–10 scale.
   - *Compensation*: a multiple price list of 22 pay levels from $25k to $10M, spaced roughly
     exponentially. The respondent clicks the lowest amount they would accept, which marks every higher
     amount as Accept and every lower one as Decline, so each answer has exactly one switch point. There is
     also an option to refuse at every amount ("priceless").
   - Back navigation works within a part, but there is no way to go back from Part 2 into Part 1.
5. **Class year and major**, then submit.

A progress bar labeled "N% complete" sits in the top bar from the first screen after the welcome page until submission.

**Randomized per respondent:** condition (50/50), part order (50/50), the order of the job sets, and
the order of jobs within each set. Both parts use the same order. The assignment is saved in the
browser, so reloading the page doesn't re-randomize it, and progress is restored after a reload.

**Repeat attempts:** after submitting, a cookie and a localStorage flag show "You've already taken this
survey". In the identified condition, the backend also flags a repeat Caltech email with `prior_attempt = TRUE`.

### Job sets (v9, current)

16 jobs: 4 sets × 4 levels. Respondents work for each company directly, and real companies are named
as examples ("a company like X") to make the offers concrete. Each description also says why the
company might be controversial, so respondents who don't know it still see the moral content.
- **Two-line layout:** each description has a fixed first line for the set (the role and employer type) and a
  second line with the part that changes. In `jobs/*.js`, a `\n` in `text` starts a new paragraph on screen.
- **Even steps:** within a set, the average person's objection should rise roughly linearly from A to D
  (about 1 → 4 → 7 → 10 on the 1–10 scale). Check this in the pilot by looking at the mean rating per level.
- Outside the quant set, the role is always *"research and development, in your own field"*. The Startup set
  describes the employer as *"a fast-growing startup building new technology in your field"*, so it fits any major.
- **Wording respondents can't dispute:** descriptions stick to plain facts about the companies, and contested
  claims are attributed ("critics say", "reportedly"). For example, Apple is described only as designing consumer devices and software.
- The **quant** set names the role (quantitative researcher or trader) on purpose. It measures what it takes
  for people to do quant work at increasingly questionable firms.

Every set has 4 levels, defined by how people would react ("minor fraction" = roughly 25–40%):

| Level | Who objects | Would they tell friends? |
|---|---|---|
| **A** | almost nobody | yes, everyone |
| **B** | a minor fraction | most are fine and would say so openly |
| **C** | a major fraction | the minor fraction who are fine would say so openly |
| **D** | almost everyone is uncomfortable saying they work there | — but a minor fraction would take it for good money |

| Set | A → B → C → D |
|---|---|
| 1 Defense Contractor (like Lockheed Martin or Raytheon) | civilian space projects only (NASA spacecraft, weather satellites) → dual-use fundamental research, partly classified → defensive systems (radar, missile interception) → offensive weapons (anti-personnel missiles, bombs, munitions) |
| 2 Quantitative Finance (quant researcher or trader) | public pension fund like CalPERS → trading firm like Jane Street or Citadel Securities ("trades its own money") → at a firm like Optiver, on a team trading the way U.S. regulators charged Optiver with in 2007 (pushing oil and gasoline futures prices; settled for $14M) → hedge fund whose traders trade on illegal insider tips (as SAC Capital's did) and bribe politicians; you work closely with them |
| 3 Technology and Data | Apple (consumer devices and software) → Meta (ad revenue from user data; its own research reportedly found Instagram can harm some teens) → Palantir (customers include militaries, police, immigration enforcement) → NSO Group (spyware reportedly used on journalists) |
| 4 Startup Conduct (startup building technology in your field) | well regarded, no controversies → often exaggerates its technology to customers and investors (critics call it misleading) → fined for false claims, sued by customers, still making similar claims → like Theranos, leaders hiding that the core technology doesn't work |

**Real-world claims, checked in November 2026:**
- **Optiver (2C):** the CFTC charged it in 2008 with manipulating NYMEX crude oil, heating oil, and gasoline
  futures in March 2007. It paid $14 million under an April 2012 court order (CFTC release 6239-12). The text says "charged" and "paid $14 million to settle".
- **SAC Capital (2D):** it pleaded guilty to insider trading in 2013. It is cited only for insider trading; the
  political bribery in 2D is hypothetical and is not attributed to SAC.
- The deprecated v7/v8 quant items cited SEBI's 2025 accusation against Jane Street (still unresolved as of Oct 2026) and Alameda Research.

Level D is meant to be "really sus", not cartoon evil. The target fractions are design guesses.
**Check them in a pilot**: for each level, look at the share of respondents who rate it 6 or higher, and the share who mark it priceless.
Respondents only see `text`; `title` goes to the Sheet.

**Named companies:** respondents bring their own opinions of each brand, such as liking Apple or distrusting Meta.
So a level difference measures the moral step *plus* any difference in brand appeal. Keep this in mind when
comparing levels within a set.

**Versions.** `config.js` → `JOBS_VERSION` chooses the job file, and the version is saved with every
response (`survey_version`, e.g. `v9/jobs-v9`). Older versions are deprecated and kept as they were:
- `jobs/jobs-v1.js`: 6 sets × 4 levels, the first draft.
- `jobs/jobs-v2.js`: 5 sets × 5 levels (A–E), with a more extreme top level.
- `jobs/jobs-v3.js`: 6 sets × 4 levels, with each employer named by its products.
- `jobs/jobs-v4.js`: the same ladders as v3, framed as research at an institute working for one client.
- `jobs/jobs-v5.js`: like v6, but with a health and consumer-products set (Medtronic → Coca-Cola → Juul → Theranos) and sports betting in the quant set.
- `jobs/jobs-v6.js`: like v7, but with one-line descriptions, a less even Startup ladder, and quant C/D without real-world examples.
- `jobs/jobs-v8.js`: identical to v9 except quant C/D (Jane Street / SEBI accusation; Alameda Research).
- `jobs/jobs-v7.js`: identical to v8 except 3B ("like Meta or Google", ad revenue only), which was likely too close to 3A.

To revise the jobs after launch, copy `jobs-v9.js` to `jobs-v10.js` and register it as `v10` inside the file.
Then add a `<script>` tag for it in `index.html` and set `JOBS_VERSION: "v10"`. Never edit a version that has already collected data.

---

## Setup (about 15 minutes)

### 1. Create the Google Sheet and backend

> Use a **personal Gmail account**. University Google Workspace accounts (Caltech, Harvard, etc.) often
> block the "Anyone" access setting that step 1.5 requires.

1. Create a new blank Google Sheet, e.g. "Ec109 Survey Data".
2. Open **Extensions → Apps Script**. Delete the starter code in `Code.gs`, paste in the whole contents of
   `apps-script/Code.gs`, and click **Save**.
3. In the function dropdown at the top, select **`setup`** and click **Run**. Google will ask for authorization:
   choose your account, then **Advanced → Go to (project name) (unsafe)** (this is your own script), then **Allow**.
   Two tabs, **Respondents** and **Responses**, appear in the Sheet with header rows.
4. Optional check: select **`testSubmission`** and click **Run**. 1 row should appear in Respondents and 2 in Responses.
   Delete those test rows afterwards (keep row 1, the headers).
5. Click **Deploy → New deployment**, click the gear icon, and choose **Web app**. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click **Deploy** and copy the **Web app URL**. It ends in `/exec`.
6. Paste that URL into a browser tab. You should see `{"ok":true,"message":"Survey endpoint is running."}`.

### 2. Configure the website

Edit `config.js`:

```js
APPS_SCRIPT_URL: "https://script.google.com/macros/s/XXXXXXXX/exec",
CONTACT_EMAIL: "your-team-address@example.com",   // optional, shown on the welcome page
```

### 3. Test locally before publishing

From inside the `survey-site` folder:

```bash
python -m http.server 8000
```

Open <http://localhost:8000/?reset=1> and complete the survey. 1 row should appear in **Respondents** and
16 in **Responses**. To test a specific arm:

```
http://localhost:8000/?reset=1&condition=identified&order=salary_first
http://localhost:8000/?reset=1&condition=anonymous&order=rating_first
```

`?reset=1` clears this browser's "already completed" flag and saved progress. **Delete all test rows before launch.**

### 4. Publish on GitHub Pages

1. Create a new **public** repository on GitHub, e.g. `career-survey`.
2. Upload the **contents** of `survey-site/` to it, so that `index.html` sits at the top level of the repo.
   You can use **Add file → Upload files**, or git:
   ```bash
   git init && git add . && git commit -m "Survey site" && git branch -M main
   git remote add origin https://github.com/<you>/career-survey.git && git push -u origin main
   ```
3. In the repo, go to **Settings → Pages → Build and deployment**, set Source to **Deploy from a branch**,
   choose branch **main** and folder **/ (root)**, then **Save**.
4. After a minute the site is live at `https://<you>.github.io/career-survey/`.
   (Optional: add a custom domain under Settings → Pages → Custom domain.)

Nothing in the repo is secret. The data stays in your private Google Sheet.

### 5. Pre-launch checklist

- [ ] `APPS_SCRIPT_URL` is set and the live site submits successfully (test once, then delete the rows).
- [ ] Every test row is deleted from both tabs.
- [ ] The Sheet is shared only with the research team, because it contains names and emails from the identified condition.
- [ ] You have checked with the course staff whether the study needs human-subjects (IRB) review or an
      exemption. This matters most for the identified condition.
- [ ] You have tried it on a phone.
- [ ] `JOBS_VERSION` is `"v9"` (or your final version) and the salary ladder is final. If you change wording
      or the ladder after launch, bump `SURVEY_VERSION`. If you change jobs, add a new job version file (see "Versions" above).

### Updating the backend later

If you edit `Code.gs`, go to **Deploy → Manage deployments → ✏️ (edit)**, set Version to **New version**, and click **Deploy**.
The URL stays the same. If you create a *new* deployment instead, you get a new URL and must update `config.js`.

---

## Data dictionary

Columns are matched by header name, so you can reorder them or add your own analysis columns to the
right. **Don't rename the headers.**

### Tab `Respondents`: one row per completed survey

| Column | Description |
|---|---|
| `submitted_at` | Server time the submission was saved |
| `respondent_id` | Random ID that joins to `Responses` (not identifying) |
| `condition` | `anonymous` or `identified` |
| `phase_order` | `rating_first` or `salary_first` |
| `category_order` | Order the sets were shown in, e.g. `3,1,4,2` |
| `class_year` | 2027 / 2028 / 2029 / 2030 / Other |
| `major` | Option from the list, or `Other: <text>` |
| `name`, `email` | Identified condition only; always blank for anonymous respondents |
| `started_at`, `completed_at` | When they clicked Start, and when they clicked Submit (respondent's clock) |
| `duration_sec` | `completed_at − started_at` in seconds |
| `prior_attempt` | `TRUE` if this Caltech email had already submitted (identified condition only) |
| `survey_version` | `SURVEY_VERSION/jobs-JOBS_VERSION` from `config.js`, e.g. `v9/jobs-v9` |

### Tab `Responses`: one row per respondent × job (16 per respondent with jobs v9)

| Column | Description |
|---|---|
| `submitted_at`, `respondent_id`, `condition`, `phase_order` | Copied from the respondent's row for easy filtering |
| `category_id`, `category_name` | Set number (1–4 in v9) and its name |
| `category_position` | Position of the set in this respondent's order (1–4) |
| `job_id` | e.g. `2C`: the number is the set and the letter is the level (A–D in v9) |
| `job_title` | Short internal label (respondents never see it) |
| `job_position` | Position of the job within its set for this respondent (1–4) |
| `moral_rating` | 1–10 (1 = not at all objectionable, 10 = extremely objectionable) |
| `min_salary_usd` | Lowest pay level they would accept; blank if `priceless` |
| `priceless` | `TRUE` if they would not accept at any level up to $10M |

### Analysis notes

- `min_salary_usd` is the **switch point** on the price list. The true reservation wage lies between the
  previous level and this one. A value of $25,000 means "≤ $25k" (left-censored), and `priceless` means
  "> $10M" (right-censored). Because the levels are spaced roughly exponentially, it may be easier to work in log dollars.
- Respondents are told they could leave after a few months, so w\* is the pay needed to *take the job and
  stay at least a few months*, not to commit to it as a career. Interpret premiums as the price of a
  short stint, which is likely smaller than the price of a long-term commitment.
- **Moral premium:** Δw for job *j* = w\*(*j*) − w\*(level A of the same set). The A job in each set is the
  "otherwise comparable baseline job".
- **Scale differences between respondents:** as in the design doc, standardize within respondent,
  e.g. (w\*ᵢⱼ − medianᵢ) / sdᵢ (or the same on log salary) before regressing on the rating Rᵢⱼ.
- **Social image:** compare across `condition`. `phase_order`, `category_position`, and `job_position` let you check for anchoring and order effects.
- A Responses row with no matching Respondents row means a write was interrupted. Drop it.

---

## Known limitations

- The repeat-attempt block works per browser. Someone using incognito mode or another device can retake the survey.
  Repeat identified submissions are flagged with `prior_attempt`; anonymous repeats can't be detected.
- Emails in the identified condition are not verified. Anyone can type an address ending in @caltech.edu.
- The Apps Script endpoint is public. It validates every field, rejects malformed data, blocks spreadsheet formulas,
  ignores duplicate retries, and caps submissions at 120 per minute. Someone who reads the source could still post fabricated
  responses. Watch for implausible `duration_sec` values.
- The backend never receives respondents' IP addresses (Apps Script doesn't expose them). GitHub hosts the
  page and keeps its own standard server logs.
