/*
 * DEPRECATED: job set v7. Superseded by jobs-v8.js, which differs only in 3B (too close to 3A).
 * Kept unchanged for reference. To use it again, set JOBS_VERSION: "v7" in config.js.
 *
 * Job set v7: 4 sets x 4 levels = 16 jobs.
 *
 * Changes from v6:
 *  - Two-line layout: each description is "<fixed line for the set>\n<line that changes>".
 *    The app renders them as separate paragraphs, so respondents can see what changed when
 *    they press Next within a set.
 *  - Roughly even steps: within each set, the average person's objection should rise
 *    roughly linearly from A to D (about 1 -> 4 -> 7 -> 10 on the 1-10 scale). Startup
 *    Conduct was rebalanced because its B and C were too mild compared with D.
 *  - Quant C and D cite real cases:
 *      C: the kind of strategy India's market regulator (SEBI) accused Jane Street of using
 *         in 2025 to manipulate the Bank Nifty index. Jane Street denies wrongdoing, and the
 *         case was unresolved as of Oct 2026. The text attributes the accusation and notes the denial.
 *      D: Alameda Research, which used billions of dollars of FTX customer deposits. Its
 *         executives were convicted, so this is stated as fact.
 *  - Same rule as v6: no statement a respondent could reasonably dispute. Contested claims are
 *    attributed ("accused", "reportedly", "critics").
 *
 * Levels ("minor fraction" = roughly 25-40%):
 *   A = commonly accepted. Nearly everyone finds it morally fine.
 *   B = a minor fraction would find it objectionable, but most are fine with it and
 *       would be comfortable telling friends they work there.
 *   C = a major fraction would find it objectionable, but a minor fraction are fine with it
 *       and would be comfortable telling friends they work there.
 *   D = almost everyone would be uncomfortable telling friends they work there, but a minor
 *       fraction would still take the offer for good money.
 * These are design targets, not measurements. Check them in a pilot.
 *
 * Respondents see only `text`. `title` and the set `name` are written to the Google Sheet.
 * The level is the letter in `id` (e.g. "3C" = set 3, level C).
 * Don't edit this file after launch; copy it to jobs-v8.js instead and switch JOBS_VERSION.
 */
(() => {
  // Builds one set: every job shares the set's first line; only the second line changes.
  const set = (id, name, stem, jobs) => ({
    id,
    name,
    jobs: jobs.map(([letter, title, detail]) => ({ id: `${id}${letter}`, title, text: `${stem}\n${detail}` })),
  });

  window.SURVEY_JOB_VERSIONS = window.SURVEY_JOB_VERSIONS || {};
  window.SURVEY_JOB_VERSIONS.v7 = {
    deprecated: true,
    sets: [
      set(1, "Defense Contractor",
        "You would work in research and development, in your own field, at a large defense contractor like Lockheed Martin or Raytheon.",
        [
          ["A", "Defense contractor: civilian space projects only",
            "You would work only on its civilian projects, such as spacecraft for NASA and weather satellites, with no connection to weapons."],
          ["B", "Defense contractor: dual-use fundamental research, partly classified",
            "Your work is fundamental research that could have both civilian and military uses. Some of it is classified, so you can't always tell people what you are working on."],
          ["C", "Defense contractor: defensive systems (radar, missile interception)",
            "Your work directly develops defensive military systems, such as radar or technology that intercepts incoming missiles."],
          ["D", "Defense contractor: offensive weapons (anti-personnel missiles, bombs, munitions)",
            "Your work directly develops offensive weapons systems, such as anti-personnel missiles, bombs, or munitions."],
        ]),

      set(2, "Quantitative Finance",
        "You would work as a quantitative researcher or trader.",
        [
          ["A", "Quant at a public pension fund (e.g. CalPERS)",
            "The employer is a large public pension fund like CalPERS, which invests the retirement savings of teachers, nurses, and other public employees."],
          ["B", "Quant at a proprietary trading firm (e.g. Jane Street, Citadel Securities)",
            "The employer is a trading firm like Jane Street or Citadel Securities, which trades its own money in financial markets."],
          ["C", "Quant on a team running a strategy like the one SEBI accused Jane Street of (index manipulation)",
            "The employer is a trading firm like Jane Street. Your team runs the kind of strategy that India's market regulator accused Jane Street of using in 2025 to manipulate a stock index: trading large amounts of stock to move the index while holding options bets that profit from that move. Jane Street denies wrongdoing."],
          ["D", "Quant at a firm like Alameda Research (traded with customer deposits)",
            "The employer is a crypto trading firm like Alameda Research, which secretly used billions of dollars of customer deposits from its sister exchange, FTX, for its own trading and investments."],
        ]),

      set(3, "Technology and Data",
        "You would work in research and development, in your own field, at a technology company.",
        [
          ["A", "Consumer devices and software (e.g. Apple)",
            "The company is like Apple, which designs consumer devices and software."],
          ["B", "Ad-funded tech (e.g. Meta, Google)",
            "The company is like Meta or Google: most of its revenue comes from advertising targeted using data about its users."],
          ["C", "Data analytics for militaries, police, immigration enforcement (e.g. Palantir)",
            "The company is like Palantir: its customers include militaries, police departments, and immigration enforcement agencies, which use its software to analyze data about people."],
          ["D", "Spyware sold to governments (e.g. NSO Group)",
            "The company is like NSO Group: it sells phone-hacking software to governments, some of which have reportedly used it to spy on journalists, activists, and political opponents."],
        ]),

      set(4, "Startup Conduct",
        "You would work in research and development, in your own field, at a fast-growing startup building new technology in your field.",
        [
          ["A", "Well-regarded startup, no controversies",
            "It is well regarded and has had no major controversies."],
          ["B", "Startup that routinely exaggerates its technology to customers and investors",
            "It often exaggerates what its technology can do when pitching customers and investors. Many startups do this, but critics call it misleading."],
          ["C", "Startup fined for false claims, sued by customers, still making similar claims",
            "Regulators have fined it for false claims about its technology, and customers are suing over products that did not work as promised. It still makes similar claims."],
          ["D", "Startup knowingly hiding that its core technology doesn't work (like Theranos)",
            "Like Theranos, its leaders know its core technology does not work as claimed and are hiding this from investors and customers."],
        ]),
    ],
  };
})();
