/*
 * DEPRECATED: job set v6. Superseded by jobs-v7.js. Kept unchanged for reference.
 * To use it again, set JOBS_VERSION: "v6" in config.js.
 * Why it was replaced: Startup Conduct didn't step evenly (B and C too mild compared with D);
 * quant C and D lacked real-world examples; and v7 adds the two-line layout that separates
 * the fixed part of each description from the part that changes.
 *
 * Job set v6: 4 sets x 4 levels = 16 jobs.
 *
 * Changes from v5:
 *  - "Health and Consumer Products" is replaced by "Startup Conduct". Every job is at "a fast-growing
 *    startup building new technology in your field", so it fits any major. Only the company's
 *    honesty changes, ending at "like Theranos".
 *  - Quant: sports betting is removed. C is a firm that buys retail investors' orders and trades
 *    against them; D is a firm that recently paid a record fine for market manipulation.
 *  - Wording: no statement a respondent could reasonably dispute. Company descriptions stick to
 *    plain facts, and contested claims are attributed ("critics say", "reportedly"). Apple is
 *    described only as designing consumer devices and software.
 *
 * Levels ("minor fraction" = roughly 25-40%):
 *   A = commonly accepted. Nearly everyone finds it morally fine.
 *   B = a minor fraction would find it objectionable, but most are fine with it and
 *       would be comfortable telling friends they work there.
 *   C = a major fraction would find it objectionable, but a minor fraction are fine with it
 *       and would be comfortable telling friends they work there.
 *   D = almost everyone would be uncomfortable telling friends they work there, but a minor
 *       fraction would still take the offer for good money. "Really sus", not cartoon evil.
 * These fractions are design targets, not measurements. Check them in a pilot.
 *
 * Respondents see only `text`. `title` and the set `name` are written to the Google Sheet.
 * The level is the letter in `id` (e.g. "3C" = set 3, level C).
 * Don't edit this file after launch; copy it to jobs-v7.js instead and switch JOBS_VERSION.
 */
(() => {
  const RND = "You would work in research and development, in your own field, at ";
  const QUANT = "You would work as a quantitative researcher or trader at ";
  const STARTUP = RND + "a fast-growing startup building new technology in your field. ";

  window.SURVEY_JOB_VERSIONS = window.SURVEY_JOB_VERSIONS || {};
  window.SURVEY_JOB_VERSIONS.v6 = {
    deprecated: true,
    sets: [
      {
        id: 1,
        name: "Defense Contractor",
        jobs: [
          {
            id: "1A",
            title: "Defense contractor: civilian space projects only",
            text: RND + "a large defense contractor like Lockheed Martin or Raytheon. You would work only on its civilian projects, such as spacecraft for NASA and weather satellites, with no connection to weapons."
          },
          {
            id: "1B",
            title: "Defense contractor: dual-use fundamental research, partly classified",
            text: RND + "a large defense contractor like Lockheed Martin or Raytheon. Your work is fundamental research that could have both civilian and military uses. Some of it is classified, so you can't always tell people what you are working on."
          },
          {
            id: "1C",
            title: "Defense contractor: defensive systems (radar, missile interception)",
            text: RND + "a large defense contractor like Lockheed Martin or Raytheon. Your work directly develops defensive military systems, such as radar or technology that intercepts incoming missiles."
          },
          {
            id: "1D",
            title: "Defense contractor: offensive weapons (anti-personnel missiles, bombs, munitions)",
            text: RND + "a large defense contractor like Lockheed Martin or Raytheon. Your work directly develops offensive weapons systems, such as anti-personnel missiles, bombs, or munitions."
          }
        ]
      },
      {
        id: 2,
        name: "Quantitative Finance",
        jobs: [
          {
            id: "2A",
            title: "Quant at a public pension fund (e.g. CalPERS)",
            text: QUANT + "a large public pension fund like CalPERS, which invests the retirement savings of teachers, nurses, and other public employees."
          },
          {
            id: "2B",
            title: "Quant at a proprietary trading firm (e.g. Jane Street, Citadel Securities)",
            text: QUANT + "a trading firm like Jane Street or Citadel Securities, which trades its own money in financial markets."
          },
          {
            id: "2C",
            title: "Quant at a firm that buys and trades against retail order flow",
            text: QUANT + "a trading firm whose main business is buying ordinary investors' stock orders from brokerage apps and trading against those orders. This is legal, but critics say it profits at ordinary investors' expense."
          },
          {
            id: "2D",
            title: "Quant at a firm with a record market-manipulation fine",
            text: QUANT + "a trading firm that recently paid a record fine for manipulating markets in ways that cost ordinary investors money. It is still run by the same people and uses similar strategies wherever they remain legal."
          }
        ]
      },
      {
        id: 3,
        name: "Technology and Data",
        jobs: [
          {
            id: "3A",
            title: "Consumer devices and software (e.g. Apple)",
            text: RND + "a technology company like Apple, which designs consumer devices and software."
          },
          {
            id: "3B",
            title: "Ad-funded tech (e.g. Meta, Google)",
            text: RND + "a technology company like Meta or Google. Most of its revenue comes from advertising targeted using data about its users."
          },
          {
            id: "3C",
            title: "Data analytics for militaries, police, immigration enforcement (e.g. Palantir)",
            text: RND + "a data-analytics company like Palantir. Its customers include militaries, police departments, and immigration enforcement agencies, which use its software to analyze data about people."
          },
          {
            id: "3D",
            title: "Spyware sold to governments (e.g. NSO Group)",
            text: RND + "a spyware company like NSO Group. It sells phone-hacking software to governments, some of which have reportedly used it to spy on journalists, activists, and political opponents."
          }
        ]
      },
      {
        id: 4,
        name: "Startup Conduct",
        jobs: [
          {
            id: "4A",
            title: "Well-regarded startup, no controversies",
            text: STARTUP + "It is well regarded and has had no major controversies."
          },
          {
            id: "4B",
            title: "Startup criticized for overstating its products",
            text: STARTUP + "Like many startups, it markets its products aggressively, and critics say it sometimes overstates what they can do."
          },
          {
            id: "4C",
            title: "Startup fined for misleading marketing, cut corners on testing",
            text: STARTUP + "It has been fined by regulators for misleading claims in its marketing, and former employees say it cut corners on testing to ship products faster."
          },
          {
            id: "4D",
            title: "Startup knowingly misleading investors and customers (like Theranos)",
            text: STARTUP + "Like Theranos, its leaders are knowingly misleading investors and customers about what its core technology can actually do."
          }
        ]
      }
    ]
  };
})();
