/*
 * DEPRECATED: job set v5. Superseded by jobs-v6.js. Kept unchanged for reference.
 * To use it again, set JOBS_VERSION: "v5" in config.js.
 * Why it was replaced: the health / consumer-products set (Medtronic, Coca-Cola, Juul) sounded
 * field-specific; the user didn't want sports betting in the quant set; and some company
 * descriptions (e.g. Apple "known for protecting privacy") could be disputed by respondents.
 *
 * Job set v5: 4 sets x 4 levels = 16 jobs.
 *
 * Changes from v4:
 *  - Shorter survey: 16 jobs instead of 24.
 *  - Respondents work for the company directly (no research-institute / client framing).
 *  - Real companies are named as examples ("a company like X") to make the offers concrete.
 *  - Sets: Defense contractor; Quantitative finance (role-specific on purpose, to learn what
 *    it takes for people to do quant work at increasingly questionable firms); and two
 *    "increasingly controversial commercial company" sets: Technology and Data, and Health
 *    and Consumer Products.
 *  - Outside of quant, the role is always "research and development, in your own field", at
 *    companies that hire across STEM fields.
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
 * Each description spells out why the company might be controversial, so respondents who
 * don't know a company still get the moral content.
 *
 * Respondents see only `text`. `title` and the set `name` are written to the Google Sheet.
 * The level is the letter in `id` (e.g. "3C" = set 3, level C).
 * Don't edit this file after launch; copy it to jobs-v6.js instead and switch JOBS_VERSION.
 */
(() => {
  const RND = "You would work in research and development, in your own field, at ";
  const QUANT = "You would work as a quantitative researcher or trader at ";

  window.SURVEY_JOB_VERSIONS = window.SURVEY_JOB_VERSIONS || {};
  window.SURVEY_JOB_VERSIONS.v5 = {
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
            text: QUANT + "a trading firm like Jane Street or Citadel Securities. The firm makes its profits by trading against other investors in financial markets, which is legal and standard in the industry."
          },
          {
            id: "2C",
            title: "Quant at a sports-betting company (e.g. DraftKings, FanDuel)",
            text: QUANT + "a sports-betting company like DraftKings or FanDuel. You would set betting odds and design promotions that get users to bet more. Most of its users lose money."
          },
          {
            id: "2D",
            title: "Quant at a payday lender targeting people in financial distress",
            text: QUANT + "a payday lender. You would build models that find people in financial distress and offer them loans at interest rates above 300% a year, which leave many borrowers trapped in debt."
          }
        ]
      },
      {
        id: 3,
        name: "Technology and Data",
        jobs: [
          {
            id: "3A",
            title: "Consumer tech known for privacy (e.g. Apple)",
            text: RND + "a technology company like Apple. It designs consumer devices and software and is known for protecting its users' privacy."
          },
          {
            id: "3B",
            title: "Ad-funded tech (e.g. Meta, Google)",
            text: RND + "a technology company like Meta or Google. Most of its revenue comes from targeted advertising based on data about its users."
          },
          {
            id: "3C",
            title: "Government data analytics (e.g. Palantir)",
            text: RND + "a data-analytics company like Palantir. Its software is used by militaries, police, and immigration enforcement agencies to analyze surveillance data and track people."
          },
          {
            id: "3D",
            title: "Spyware sold to governments (e.g. NSO Group)",
            text: RND + "a spyware company like NSO Group. It sells phone-hacking software to governments, some of which have used it to spy on journalists, activists, and political opponents."
          }
        ]
      },
      {
        id: 4,
        name: "Health and Consumer Products",
        jobs: [
          {
            id: "4A",
            title: "Medical devices (e.g. Medtronic)",
            text: RND + "a medical-technology company like Medtronic. It makes medical devices such as pacemakers and insulin pumps."
          },
          {
            id: "4B",
            title: "Sugary drinks and snacks (e.g. Coca-Cola, PepsiCo)",
            text: RND + "a food and beverage company like Coca-Cola or PepsiCo. Much of its revenue comes from sugary drinks and snack foods."
          },
          {
            id: "4C",
            title: "E-cigarettes (e.g. Juul)",
            text: RND + "an e-cigarette company like Juul. Its vaping products are marketed to adult smokers, but the company has been criticized for marketing that appealed to teenagers."
          },
          {
            id: "4D",
            title: "Misleading blood-testing startup (e.g. Theranos)",
            text: RND + "a blood-testing startup like Theranos. It tells patients, doctors, and investors that its tests are more accurate than they really are."
          }
        ]
      }
    ]
  };
})();
