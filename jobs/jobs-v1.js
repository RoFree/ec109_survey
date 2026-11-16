/*
 * DEPRECATED: job set v1 (6 sets x 4 levels = 24 jobs). Superseded by jobs-v2.js.
 * Kept unchanged for reference and so that any v1 data stays interpretable.
 * To use it again, set JOBS_VERSION: "v1" in config.js.
 *
 * Why it was replaced: some steps between levels were too large (e.g. 2B -> 2C, 3C -> 3D),
 * some descriptions suited only certain majors (e.g. "data systems", financial models),
 * and the defense set did not separate DoE labs, DoD basic research, and weapons work.
 *
 * Original notes follow.
 *
 * Job offers shown in the survey.
 *
 * Design rules used to write these:
 *  - Every set holds the ROLE fixed ("a scientist or engineer", technical work in the
 *    respondent's own field) so that interest in the field does not drive the salary answer.
 *  - Within a set, only the moral content changes (what the organization does), and the
 *    rest of the wording is kept as parallel as possible.
 *  - Every set follows the same 4-step severity ladder:
 *      A = clearly benign / prosocial
 *      B = common, legal industry practice (gray area)
 *      C = knowingly harmful, but legal or tolerated
 *      D = egregious (illegal, deadly, or abusive)
 *  - Avoid topics where people disagree mainly along political lines (e.g. AI, fossil fuels).
 *
 * Respondents see only `text`. `title` and the set `name` are written to the Google Sheet
 * for analysis. If you edit anything here, bump SURVEY_VERSION in config.js.
 */
window.SURVEY_JOB_VERSIONS = window.SURVEY_JOB_VERSIONS || {};
window.SURVEY_JOB_VERSIONS.v1 = {
  deprecated: true,
  sets: [
  {
    id: 1,
    name: "Defense and Weapons",
    jobs: [
      {
        id: "1A",
        title: "Basic research at a national laboratory",
        text: "You would work as a scientist or engineer at a government-funded national laboratory. Your work is basic scientific research that is published openly and is not connected to any weapons program."
      },
      {
        id: "1B",
        title: "Defensive military systems",
        text: "You would work as a scientist or engineer at a defense contractor. Your work improves defensive systems, such as equipment that detects incoming attacks and protects soldiers and civilians from them."
      },
      {
        id: "1C",
        title: "Conventional offensive weapons",
        text: "You would work as a scientist or engineer at a defense contractor. Your work improves conventional offensive weapons, such as missiles and munitions, used by your country's military."
      },
      {
        id: "1D",
        title: "Banned weapons sold to regimes that target civilians",
        text: "You would work as a scientist or engineer at a weapons manufacturer. Your work improves weapons banned under international law, such as chemical weapons, which the company sells to governments known to use them against civilians."
      }
    ]
  },
  {
    id: 2,
    name: "Product Safety",
    jobs: [
      {
        id: "2A",
        title: "Independently safety-tested products",
        text: "You would work as a scientist or engineer at a consumer products company. Its products have passed extensive independent safety testing. Your work improves its products and helps grow their sales."
      },
      {
        id: "2B",
        title: "Products with small, disclosed risks",
        text: "You would work as a scientist or engineer at a consumer products company. Its products carry small, well-understood risks that are clearly disclosed on their labels. Your work improves its products and helps grow their sales."
      },
      {
        id: "2C",
        title: "Known health harms, no warning given",
        text: "You would work as a scientist or engineer at a consumer products company. Its own research shows that one of its products causes serious health problems in some users, but it keeps selling the product without warning anyone. Your work improves its products and helps grow their sales."
      },
      {
        id: "2D",
        title: "Hiding product-caused deaths from regulators",
        text: "You would work as a scientist or engineer at a consumer products company. It knows that one of its products has caused deaths and is hiding this evidence from regulators and the public. Your work includes producing analyses used to dispute that evidence."
      }
    ]
  },
  {
    id: 3,
    name: "Personal Data",
    jobs: [
      {
        id: "3A",
        title: "Consent-based data use",
        text: "You would work as a scientist or engineer at a technology company that handles personal data. It collects data only with users' explicit, informed consent and uses it only to provide the service they signed up for. Your work builds and improves its data systems."
      },
      {
        id: "3B",
        title: "Targeted advertising under standard terms",
        text: "You would work as a scientist or engineer at a technology company that handles personal data. It collects data under standard terms of service and uses it for targeted advertising, as is common in the industry. Your work builds and improves its data systems."
      },
      {
        id: "3C",
        title: "Secret data collection sold to brokers",
        text: "You would work as a scientist or engineer at a technology company that handles personal data. It secretly collects users' locations and personal information without their knowledge and sells it to data brokers. Your work builds and improves its data systems."
      },
      {
        id: "3D",
        title: "Tracking systems for authoritarian governments",
        text: "You would work as a scientist or engineer at a technology company that handles personal data. It sells tracking systems to authoritarian governments, which use them to identify, detain, and persecute journalists and political dissidents. Your work builds and improves its data systems."
      }
    ]
  },
  {
    id: 4,
    name: "Environmental Practices",
    jobs: [
      {
        id: "4A",
        title: "Pollution well below legal limits",
        text: "You would work as a scientist or engineer at an industrial company. It keeps its pollution well below legal limits and invests in cleaner processes. Your work improves its production processes."
      },
      {
        id: "4B",
        title: "Pollution up to legal limits",
        text: "You would work as a scientist or engineer at an industrial company. It releases pollution up to, but not beyond, the limits allowed by environmental regulations. Your work improves its production processes."
      },
      {
        id: "4C",
        title: "Loophole pollution harming nearby towns",
        text: "You would work as a scientist or engineer at an industrial company. It uses legal loopholes to discharge waste into a river that nearby towns rely on for drinking water, causing documented health problems. Your work improves its production processes."
      },
      {
        id: "4D",
        title: "Illegal toxic dumping with falsified reports",
        text: "You would work as a scientist or engineer at an industrial company. It illegally dumps toxic waste near low-income neighborhoods and falsifies its environmental reports to hide this. Your work improves its production processes."
      }
    ]
  },
  {
    id: 5,
    name: "Financial Services",
    jobs: [
      {
        id: "5A",
        title: "Low-fee retirement savings management",
        text: "You would work as a scientist or engineer at a financial services firm. It manages retirement savings for teachers and nurses at low fees and acts in its clients' best interests. Your work builds the models and software behind its products."
      },
      {
        id: "5B",
        title: "High-fee products customers don't understand",
        text: "You would work as a scientist or engineer at a financial services firm. It sells complex investment products with high fees that are fully disclosed but that most customers do not fully understand. Your work builds the models and software behind its products."
      },
      {
        id: "5C",
        title: "High-interest loans to people in distress",
        text: "You would work as a scientist or engineer at a financial services firm. It offers very high-interest loans marketed to people in financial distress. This is legal, but it leaves many borrowers trapped in debt. Your work builds the models and software behind its products."
      },
      {
        id: "5D",
        title: "Deceptive products that wipe out retirees' savings",
        text: "You would work as a scientist or engineer at a financial services firm. It sells investment products to retirees that are deliberately designed to hide their risks and fees, and many customers have lost their life savings. Your work builds the models and software behind its products."
      }
    ]
  },
  {
    id: 6,
    name: "Labor Practices",
    jobs: [
      {
        id: "6A",
        title: "Audited fair-labor supply chain",
        text: "You would work as a scientist or engineer at a manufacturing company. Its factories and suppliers are independently audited and provide fair wages and safe working conditions. Your work improves the design of its products."
      },
      {
        id: "6B",
        title: "Minimum-wage overseas suppliers",
        text: "You would work as a scientist or engineer at a manufacturing company. Its suppliers are in low-income countries and pay workers the legal minimum wage for long hours, as is standard in the industry. Your work improves the design of its products."
      },
      {
        id: "6C",
        title: "Unsafe factories, knowingly ignored",
        text: "You would work as a scientist or engineer at a manufacturing company. Its suppliers' factories have unsafe conditions that frequently cause serious injuries, and the company knows this but chooses not to act to keep costs low. Your work improves the design of its products."
      },
      {
        id: "6D",
        title: "Forced and child labor, concealed",
        text: "You would work as a scientist or engineer at a manufacturing company. It knowingly relies on suppliers that use forced labor and child labor, and hides this from customers and auditors. Your work improves the design of its products."
      }
    ]
  }
  ]
};
