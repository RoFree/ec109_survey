/*
 * DEPRECATED: job set v4. Superseded by jobs-v5.js. Kept unchanged for reference.
 * To use it again, set JOBS_VERSION: "v4" in config.js.
 * Why it was replaced: the research-institute / single-client framing felt too indirect.
 * v5 has respondents work for each company directly and cuts the survey to 16 jobs.
 *
 * Job set v4: 6 sets x 4 levels = 24 jobs.
 *
 * Same moral ladders as v3, reframed so that no offer sounds like it belongs to a particular
 * field. The goal is that a student who wants to do physics or AI research never thinks
 * "this sounds boring, I don't want to make toothpaste / clothes".
 *  - Defense: government labs, which already hire every field. The work is described as
 *    "research in your own field", with no field-specific examples.
 *  - All other sets: the employer is the same large research institute that hires every
 *    discipline. All of your work is paid for and used by ONE client, and only that client
 *    changes between levels. The client's industry never determines your field.
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
 * The level is the letter in `id` (e.g. "3C" = set 3, level C). Titles match v3 where the
 * moral content is the same, so v3 and v4 can be compared directly.
 * Don't edit this file after launch; copy it to jobs-v5.js instead and switch JOBS_VERSION.
 */
(() => {
  const INSTITUTE =
    "You would do research in your own field at a large research institute that hires scientists and engineers in every discipline. All of your work would be paid for and used by one client: ";

  window.SURVEY_JOB_VERSIONS = window.SURVEY_JOB_VERSIONS || {};
  window.SURVEY_JOB_VERSIONS.v4 = {
    deprecated: true,
    sets: [
      {
        id: 1,
        name: "Defense and Weapons",
        jobs: [
          {
            id: "1A",
            title: "DoE national lab: open civilian research",
            text: "You would do research in your own field at a Department of Energy national laboratory. Your work is open, unclassified research for civilian purposes and has no connection to weapons."
          },
          {
            id: "1B",
            title: "DoD lab: dual-use fundamental research, partly classified",
            text: "You would do research in your own field at a Department of Defense research laboratory. Your work is fundamental research that could have both civilian and military uses. Some of it is classified, so you can't always tell people what you are working on."
          },
          {
            id: "1C",
            title: "DoD lab: defensive systems (radar, missile interception)",
            text: "You would do research in your own field at a Department of Defense research laboratory. Your work is applied directly to defensive military systems, such as radar or technology that intercepts incoming missiles."
          },
          {
            id: "1D",
            title: "DoD lab: offensive weapons (anti-personnel missiles, bombs, munitions)",
            text: "You would do research in your own field at a Department of Defense research laboratory. Your work is applied directly to offensive weapons systems, such as anti-personnel missiles, bombs, or munitions."
          }
        ]
      },
      {
        id: 2,
        name: "Consumer Products",
        jobs: [
          {
            id: "2A",
            title: "Household and personal-care products",
            text: INSTITUTE + "a company that makes everyday household and personal-care products, such as soap, toothpaste, and cleaning supplies."
          },
          {
            id: "2B",
            title: "Sugary drinks and snack foods",
            text: INSTITUTE + "a company that makes sugary soft drinks, candy, and snack foods."
          },
          {
            id: "2C",
            title: "E-cigarettes and vaping products",
            text: INSTITUTE + "a company that makes e-cigarettes and vaping products. It markets them to adult smokers as a less harmful alternative, but they have also become popular with teenagers."
          },
          {
            id: "2D",
            title: "Cigarettes and tobacco",
            text: INSTITUTE + "a company that makes cigarettes and other tobacco products."
          }
        ]
      },
      {
        id: 3,
        name: "Personal Data",
        jobs: [
          {
            id: "3A",
            title: "Opt-in data only",
            text: INSTITUTE + "a technology company that collects personal data only when users explicitly opt in, and uses it only to provide the features they asked for."
          },
          {
            id: "3B",
            title: "Targeted advertising, industry standard",
            text: INSTITUTE + "a technology company that collects data about how people use its products and uses it to show them targeted ads, as is standard in the industry."
          },
          {
            id: "3C",
            title: "Sells location and personal data to brokers",
            text: INSTITUTE + "a technology company that collects users' locations and personal information and sells them to data brokers. This is disclosed only in the fine print of its terms of service."
          },
          {
            id: "3D",
            title: "Surveillance software for governments, used on journalists",
            text: INSTITUTE + "a technology company that sells surveillance software to governments around the world, including some that have used it to spy on journalists and activists."
          }
        ]
      },
      {
        id: 4,
        name: "Environmental Practices",
        jobs: [
          {
            id: "4A",
            title: "Pollution far below legal limits",
            text: INSTITUTE + "an industrial company that keeps its pollution far below legal limits and invests heavily in cleaner processes."
          },
          {
            id: "4B",
            title: "Meets regulations, nothing more",
            text: INSTITUTE + "an industrial company that meets environmental regulations but does nothing beyond them. Its plants release pollution up to the legal limits."
          },
          {
            id: "4C",
            title: "Repeated fines, linked to local illness",
            text: INSTITUTE + "an industrial company that has been repeatedly fined for environmental violations. Its plants have been linked to higher rates of illness in nearby communities, which it disputes."
          },
          {
            id: "4D",
            title: "Knowingly contaminated a town's water, hid studies",
            text: INSTITUTE + "an industrial company that for years knowingly released toxic chemicals into a town's water supply and hid its own studies of the health risks. It is now paying large settlements but still runs the same plants."
          }
        ]
      },
      {
        id: 5,
        name: "Labor Practices",
        jobs: [
          {
            id: "5A",
            title: "Audited fair wages and safe conditions",
            text: INSTITUTE + "a multinational company whose factories and suppliers are independently audited and provide fair wages and safe working conditions."
          },
          {
            id: "5B",
            title: "Low-wage overseas suppliers, industry standard",
            text: INSTITUTE + "a multinational company that, like most in its industry, relies on suppliers in low-income countries that pay workers the local minimum wage."
          },
          {
            id: "5C",
            title: "Criticized for overtime and injuries, minimal changes",
            text: INSTITUTE + "a multinational company whose suppliers' factories have been publicly criticized for long mandatory overtime and frequent injuries. The company has made only minimal changes."
          },
          {
            id: "5D",
            title: "Supply chain credibly linked to forced labor",
            text: INSTITUTE + "a multinational company whose supply chain has been credibly linked to forced labor. The company denies this and has not cut ties with those suppliers."
          }
        ]
      },
      {
        id: 6,
        name: "Pharmaceuticals",
        jobs: [
          {
            id: "6A",
            title: "Vaccines and treatments at affordable prices",
            text: INSTITUTE + "a pharmaceutical company that develops vaccines and treatments for common diseases and sells them at prices most patients can afford."
          },
          {
            id: "6B",
            title: "High U.S.-market drug prices",
            text: INSTITUTE + "a pharmaceutical company that sells its drugs at the high prices typical of the U.S. market, which some patients struggle to afford."
          },
          {
            id: "6C",
            title: "Blocks cheaper generics to keep prices high",
            text: INSTITUTE + "a pharmaceutical company that uses legal tactics, such as small reformulations and patent extensions, to block cheaper generic versions of its drugs and keep prices high."
          },
          {
            id: "6D",
            title: "Downplayed opioid addiction risks",
            text: INSTITUTE + "a pharmaceutical company that aggressively marketed an addictive painkiller while downplaying its addiction risks, contributing to the opioid crisis. It has paid billions in legal settlements and still sells the drug."
          }
        ]
      }
    ]
  };
})();
