/*
 * DEPRECATED: job set v3. Superseded by jobs-v4.js. Kept unchanged for reference.
 * To use it again, set JOBS_VERSION: "v3" in config.js.
 * Why it was replaced: naming the employer's product (toothpaste, clothing, chemicals...)
 * made some offers sound like they belong to a particular field, so students could turn them
 * down for lack of interest rather than for moral reasons. v4 keeps the same moral ladders
 * but frames non-defense jobs as research in your own field for a single client.
 *
 * Job set v3: 6 sets x 4 levels = 24 jobs.
 *
 * Levels are defined by how the population would react, where "minor fraction" means
 * roughly 25-40%:
 *   A = commonly accepted. Nearly everyone finds it morally fine.
 *   B = a minor fraction would find it objectionable, but most are fine with it and
 *       would be comfortable telling friends they work there.
 *   C = a major fraction would find it objectionable, but a minor fraction are fine with it
 *       and would be comfortable telling friends they work there.
 *   D = almost everyone would be uncomfortable telling friends they work there, but a minor
 *       fraction would still take the offer for good money. "Really sus", not cartoon evil.
 *
 * Reference ladder (Defense): DoE lab -> DoD lab doing dual-use fundamental research, partly
 * classified -> defensive applied development (radar, missile interception) -> offensive
 * weapons such as missiles.
 *
 * Other design rules (same as v2):
 *  - The role is always "research and development, in your own field", at a large employer
 *    that plausibly hires every STEM major (bio, chem, physics, CS, ME, EE, materials).
 *  - Within a set, only what the organization does changes. The wording stays parallel.
 *
 * The fractions above are design targets, not measured values. Check them in a pilot,
 * e.g. the share of respondents who rate each level 6 or higher.
 *
 * Respondents see only `text`. `title` and the set `name` are written to the Google Sheet.
 * The level is the letter in `id` (e.g. "3C" = set 3, level C).
 * Don't edit this file after launch; copy it to jobs-v4.js instead and switch JOBS_VERSION.
 */
window.SURVEY_JOB_VERSIONS = window.SURVEY_JOB_VERSIONS || {};
window.SURVEY_JOB_VERSIONS.v3 = {
  deprecated: true,
  sets: [
    {
      id: 1,
      name: "Defense and Weapons",
      jobs: [
        {
          id: "1A",
          title: "DoE national lab: open civilian research",
          text: "You would work in research and development, in your own field, at a Department of Energy national laboratory. Your work is open scientific research, for example in energy, materials, or basic science, and has no connection to weapons."
        },
        {
          id: "1B",
          title: "DoD lab: dual-use fundamental research, partly classified",
          text: "You would work in research and development, in your own field, at a Department of Defense research laboratory. Your work is fundamental research, for example in quantum computing or advanced materials, that could have both civilian and military uses. Some of it is classified, so you can't always tell people what you are working on."
        },
        {
          id: "1C",
          title: "DoD lab: defensive systems (radar, missile interception)",
          text: "You would work in research and development, in your own field, at a Department of Defense research laboratory. Your work develops defensive military systems, such as radar or technology that intercepts incoming missiles."
        },
        {
          id: "1D",
          title: "DoD lab: offensive weapons (missiles)",
          text: "You would work in research and development, in your own field, at a Department of Defense research laboratory. Your work directly develops offensive weapons systems, such as anti-personnel missiles, bombs, or munitions."
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
          text: "You would work in research and development, in your own field, at a large consumer products company. It makes everyday household and personal-care products, such as soap, toothpaste, and cleaning supplies. Your work helps develop and improve its products."
        },
        {
          id: "2B",
          title: "Sugary drinks and snack foods",
          text: "You would work in research and development, in your own field, at a large consumer products company. It makes sugary soft drinks, candy, and snack foods. Your work helps develop and improve its products."
        },
        {
          id: "2C",
          title: "E-cigarettes and vaping products",
          text: "You would work in research and development, in your own field, at a large consumer products company. It makes e-cigarettes and vaping products. It markets them to adult smokers as a less harmful alternative, but they have also become popular with teenagers. Your work helps develop and improve its products."
        },
        {
          id: "2D",
          title: "Cigarettes and tobacco",
          text: "You would work in research and development, in your own field, at a large consumer products company. It makes cigarettes and other tobacco products. Your work helps develop and improve its products."
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
          text: "You would work in research and development, in your own field, at a large technology company that makes devices and software. It collects personal data only when users explicitly opt in, and uses it only to provide the features they asked for. Your work helps develop and improve its products."
        },
        {
          id: "3B",
          title: "Targeted advertising, industry standard",
          text: "You would work in research and development, in your own field, at a large technology company that makes devices and software. It collects data about how people use its products and uses it to show them targeted ads, as is standard in the industry. Your work helps develop and improve its products."
        },
        {
          id: "3C",
          title: "Sells location and personal data to brokers",
          text: "You would work in research and development, in your own field, at a large technology company that makes devices and software. It collects users' locations and personal information and sells them to data brokers. This is disclosed only in the fine print of its terms of service. Your work helps develop and improve its products."
        },
        {
          id: "3D",
          title: "Surveillance software for governments, used on journalists",
          text: "You would work in research and development, in your own field, at a large technology company that makes devices and software. It sells surveillance software to governments around the world, including some that have used it to spy on journalists and activists. Your work helps develop and improve its products."
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
          text: "You would work in research and development, in your own field, at a large industrial company that makes chemicals, materials, and parts used across many industries. It keeps its pollution far below legal limits and invests heavily in cleaner processes. Your work helps develop and improve its products."
        },
        {
          id: "4B",
          title: "Meets regulations, nothing more",
          text: "You would work in research and development, in your own field, at a large industrial company that makes chemicals, materials, and parts used across many industries. It meets environmental regulations but does nothing beyond them, and its plants release pollution up to the legal limits. Your work helps develop and improve its products."
        },
        {
          id: "4C",
          title: "Repeated fines, linked to local illness",
          text: "You would work in research and development, in your own field, at a large industrial company that makes chemicals, materials, and parts used across many industries. It has been repeatedly fined for environmental violations, and its plants have been linked to higher rates of illness in nearby communities, which it disputes. Your work helps develop and improve its products."
        },
        {
          id: "4D",
          title: "Knowingly contaminated a town's water, hid studies",
          text: "You would work in research and development, in your own field, at a large industrial company that makes chemicals, materials, and parts used across many industries. For years it knowingly released toxic chemicals into a town's water supply and hid its own studies of the health risks. It is now paying large settlements but still runs the same plants. Your work helps develop and improve its products."
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
          text: "You would work in research and development, in your own field, at a large manufacturing company that makes a wide range of consumer goods, from electronics to clothing and household products. Its factories and suppliers are independently audited and provide fair wages and safe working conditions. Your work helps develop and improve its products."
        },
        {
          id: "5B",
          title: "Low-wage overseas suppliers, industry standard",
          text: "You would work in research and development, in your own field, at a large manufacturing company that makes a wide range of consumer goods, from electronics to clothing and household products. Like most companies in its industry, it relies on suppliers in low-income countries that pay workers the local minimum wage. Your work helps develop and improve its products."
        },
        {
          id: "5C",
          title: "Criticized for overtime and injuries, minimal changes",
          text: "You would work in research and development, in your own field, at a large manufacturing company that makes a wide range of consumer goods, from electronics to clothing and household products. Its suppliers' factories have been publicly criticized for long mandatory overtime and frequent injuries, and the company has made only minimal changes. Your work helps develop and improve its products."
        },
        {
          id: "5D",
          title: "Supply chain credibly linked to forced labor",
          text: "You would work in research and development, in your own field, at a large manufacturing company that makes a wide range of consumer goods, from electronics to clothing and household products. Its supply chain has been credibly linked to forced labor. The company denies this and has not cut ties with those suppliers. Your work helps develop and improve its products."
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
          text: "You would work in research and development, in your own field, at a large pharmaceutical company. It develops vaccines and treatments for common diseases and sells them at prices most patients can afford. Your work helps develop and improve its products."
        },
        {
          id: "6B",
          title: "High U.S.-market drug prices",
          text: "You would work in research and development, in your own field, at a large pharmaceutical company. It sells its drugs at the high prices typical of the U.S. market, which some patients struggle to afford. Your work helps develop and improve its products."
        },
        {
          id: "6C",
          title: "Blocks cheaper generics to keep prices high",
          text: "You would work in research and development, in your own field, at a large pharmaceutical company. It uses legal tactics, such as small reformulations and patent extensions, to block cheaper generic versions of its drugs and keep prices high. Your work helps develop and improve its products."
        },
        {
          id: "6D",
          title: "Downplayed opioid addiction risks",
          text: "You would work in research and development, in your own field, at a large pharmaceutical company. It aggressively marketed an addictive painkiller while downplaying its addiction risks, contributing to the opioid crisis. It has paid billions in legal settlements and still sells the drug. Your work helps develop and improve its products."
        }
      ]
    }
  ]
};
