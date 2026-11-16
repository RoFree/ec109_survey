/*
 * DEPRECATED: job set v2. Superseded by jobs-v3.js. Kept unchanged for reference.
 * To use it again, set JOBS_VERSION: "v2" in config.js.
 * Why it was replaced: v3 uses 4 levels per set, each defined by what share of people would
 * find the job objectionable and would be comfortable telling friends about it. v2's top level
 * (e.g. chemical weapons, hiding deaths, forced child labor) was more extreme than intended.
 *
 * Job set v2: 5 sets x 5 levels = 25 jobs.
 *
 * Design rules:
 *  - Open to every STEM major. Every description starts with the same role,
 *    "research and development, in your own field", and every employer is a large organization
 *    that plausibly hires biologists, chemists, physicists, computer scientists, and mechanical,
 *    electrical, and materials engineers alike. Interest in the field should therefore not drive
 *    the salary answer.
 *  - Within a set, only the moral content changes. The rest of the wording stays parallel.
 *  - Gradual steps: every set uses the same 5-level ladder, so each step up is roughly the
 *    same size:
 *      A = clearly good / prosocial
 *      B = neutral: meets the legal minimum, nothing more
 *      C = mildly questionable: legal but cuts corners at others' expense
 *      D = seriously harmful: knowingly causes real harm, but legal or tolerated
 *      E = egregious: illegal, deadly, or abusive
 *  - Defense keeps a government employer at every level, as specified:
 *      DoE lab -> DoD basic research -> DoD defensive systems -> DoD offensive weapons
 *      -> classified work on internationally condemned weapons (no prosecution).
 *  - Avoid topics where people disagree mainly along political lines (e.g. AI, fossil fuels).
 *
 * Respondents see only `text`. `title` and the set `name` are written to the Google Sheet.
 * The level is the letter in `id` (e.g. "3D" = set 3, level D).
 * Don't edit this file after launch; copy it to jobs-v3.js instead and switch JOBS_VERSION.
 */
window.SURVEY_JOB_VERSIONS = window.SURVEY_JOB_VERSIONS || {};
window.SURVEY_JOB_VERSIONS.v2 = {
  deprecated: true,
  sets: [
    {
      id: 1,
      name: "Defense and Weapons",
      jobs: [
        {
          id: "1A",
          title: "DoE national lab: open civilian research",
          text: "You would work in research and development, in your own field, at a Department of Energy national laboratory. Your work is open scientific research, for example in energy, materials, or basic science, and is not connected to any weapons program."
        },
        {
          id: "1B",
          title: "DoD lab: fundamental research",
          text: "You would work in research and development, in your own field, at a Department of Defense research laboratory. Your work is fundamental scientific research that is published openly. It is funded by the military but is not tied to any specific weapon or military system."
        },
        {
          id: "1C",
          title: "DoD lab: defensive military systems",
          text: "You would work in research and development, in your own field, at a Department of Defense research laboratory. Your work directly develops defensive military systems, such as systems that detect and intercept incoming missiles or protect soldiers from attack."
        },
        {
          id: "1D",
          title: "DoD lab: conventional offensive weapons",
          text: "You would work in research and development, in your own field, at a Department of Defense research laboratory. Your work directly develops conventional offensive weapons, such as missiles, bombs, and other munitions."
        },
        {
          id: "1E",
          title: "Classified DoD program: internationally condemned weapons",
          text: "You would work in research and development, in your own field, at a classified Department of Defense program. Your work directly develops weapons condemned under international law, such as chemical or biological weapons. You would face no legal prosecution for this work."
        }
      ]
    },
    {
      id: 2,
      name: "Product Safety",
      jobs: [
        {
          id: "2A",
          title: "Safety beyond legal requirements",
          text: "You would work in research and development, in your own field, at a large company that makes household, personal-care, and health products. Its products are independently safety tested, and it goes beyond what the law requires to protect customers. Your work helps develop and improve its products."
        },
        {
          id: "2B",
          title: "Meets legal safety minimum only",
          text: "You would work in research and development, in your own field, at a large company that makes household, personal-care, and health products. Its products meet all legal safety standards, but it does nothing beyond what the law requires. Your work helps develop and improve its products."
        },
        {
          id: "2C",
          title: "Known mild side effects left off the label",
          text: "You would work in research and development, in your own field, at a large company that makes household, personal-care, and health products. One of its products causes mild side effects, such as rashes or headaches, in some users. The company knows this but leaves it off the label to protect sales. Your work helps develop and improve its products."
        },
        {
          id: "2D",
          title: "Known serious health harms, no warning",
          text: "You would work in research and development, in your own field, at a large company that makes household, personal-care, and health products. Its own research shows that one of its products causes serious health problems in some users, but it keeps selling the product without warning anyone. Your work helps develop and improve its products."
        },
        {
          id: "2E",
          title: "Hiding product-caused deaths from regulators",
          text: "You would work in research and development, in your own field, at a large company that makes household, personal-care, and health products. It knows that one of its products has caused deaths and is hiding this evidence from regulators so it can keep selling the product. Your work helps develop and improve its products."
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
          text: "You would work in research and development, in your own field, at a large company that makes consumer devices, such as phones, wearables, and health monitors, and the apps that run on them. It collects personal data only when users explicitly opt in, and uses it only to provide the features they asked for. Your work helps develop and improve its products."
        },
        {
          id: "3B",
          title: "Targeted ads under standard terms",
          text: "You would work in research and development, in your own field, at a large company that makes consumer devices, such as phones, wearables, and health monitors, and the apps that run on them. It collects data about how people use its products under standard terms of service and uses it to show them targeted ads, as is common in the industry. Your work helps develop and improve its products."
        },
        {
          id: "3C",
          title: "Excess data collection sold to brokers",
          text: "You would work in research and development, in your own field, at a large company that makes consumer devices, such as phones, wearables, and health monitors, and the apps that run on them. It collects far more personal data than most users realize, including their locations and contacts, and sells it to data brokers. This is disclosed only deep in its terms of service. Your work helps develop and improve its products."
        },
        {
          id: "3D",
          title: "Secret location tracking used by stalkers",
          text: "You would work in research and development, in your own field, at a large company that makes consumer devices, such as phones, wearables, and health monitors, and the apps that run on them. It secretly tracks users' locations without their knowledge and sells this data to anyone who pays. The data has been used by stalkers to track down and harass people. Your work helps develop and improve its products."
        },
        {
          id: "3E",
          title: "Tracking systems for authoritarian governments",
          text: "You would work in research and development, in your own field, at a large company that makes consumer devices, such as phones, wearables, and health monitors, and the apps that run on them. It builds tracking systems for authoritarian governments, which use them to identify, detain, and persecute journalists and political dissidents. Your work helps develop and improve its products."
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
          title: "Pollution up to legal limits",
          text: "You would work in research and development, in your own field, at a large industrial company that makes chemicals, materials, and parts used across many industries. It releases pollution up to, but not beyond, the limits allowed by environmental regulations. Your work helps develop and improve its products."
        },
        {
          id: "4C",
          title: "Loophole pollution worsening local air",
          text: "You would work in research and development, in your own field, at a large industrial company that makes chemicals, materials, and parts used across many industries. It uses legal loopholes to release more pollution than regulations intend, which worsens air quality in nearby towns. Your work helps develop and improve its products."
        },
        {
          id: "4D",
          title: "Loophole river dumping with documented illness",
          text: "You would work in research and development, in your own field, at a large industrial company that makes chemicals, materials, and parts used across many industries. It uses legal loopholes to discharge toxic waste into a river that nearby towns rely on for drinking water, causing documented health problems. Your work helps develop and improve its products."
        },
        {
          id: "4E",
          title: "Illegal toxic dumping with falsified reports",
          text: "You would work in research and development, in your own field, at a large industrial company that makes chemicals, materials, and parts used across many industries. It illegally dumps toxic waste near low-income neighborhoods, causing serious illnesses, and falsifies its environmental reports to hide this. Your work helps develop and improve its products."
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
          text: "You would work in research and development, in your own field, at a large manufacturing company that makes a wide range of consumer goods, from electronics to food and household products. Its factories and suppliers are independently audited and provide fair wages and safe working conditions. Your work helps develop and improve its products."
        },
        {
          id: "5B",
          title: "Follows local labor law, no further checks",
          text: "You would work in research and development, in your own field, at a large manufacturing company that makes a wide range of consumer goods, from electronics to food and household products. Its suppliers follow local labor laws, but the company does not check working conditions beyond that. Your work helps develop and improve its products."
        },
        {
          id: "5C",
          title: "Minimum wage with forced overtime",
          text: "You would work in research and development, in your own field, at a large manufacturing company that makes a wide range of consumer goods, from electronics to food and household products. Its suppliers pay workers the legal minimum wage for very long hours with mandatory overtime, as is common in the industry. Your work helps develop and improve its products."
        },
        {
          id: "5D",
          title: "Unsafe factories, knowingly ignored",
          text: "You would work in research and development, in your own field, at a large manufacturing company that makes a wide range of consumer goods, from electronics to food and household products. Its suppliers' factories have unsafe conditions that frequently cause serious injuries, and the company knows this but chooses not to act to keep costs low. Your work helps develop and improve its products."
        },
        {
          id: "5E",
          title: "Forced and child labor, concealed",
          text: "You would work in research and development, in your own field, at a large manufacturing company that makes a wide range of consumer goods, from electronics to food and household products. It knowingly relies on suppliers that use forced labor and child labor, and hides this from customers and auditors. Your work helps develop and improve its products."
        }
      ]
    }
  ]
};
