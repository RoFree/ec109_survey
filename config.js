/*
 * Survey configuration. Edit this file before publishing (see README.md).
 */
window.SURVEY_CONFIG = {
  // REQUIRED: the Web App URL from your Apps Script deployment. It ends in /exec.
  APPS_SCRIPT_URL: "",

  // Optional: a contact address shown on the welcome page. Leave "" to hide it.
  CONTACT_EMAIL: "",

  // Which job set to show. Each lives in jobs/jobs-<version>.js. v1-v8 are deprecated.
  JOBS_VERSION: "v9",

  // Bump this when you change wording, the salary ladder, or anything else respondents see.
  // The job-set version is appended automatically, so the Sheet records e.g. "v9/jobs-v9".
  // Changing either value discards half-finished attempts saved in respondents' browsers.
  SURVEY_VERSION: "v9",

  STUDY_TITLE: "Career Choices Study",
  STUDY_TAGLINE: "A research survey for an Ec 109 class project",
  ESTIMATED_MINUTES: 8,

  // Identified condition: the email must end in @<this domain>.
  REQUIRED_EMAIL_DOMAIN: "caltech.edu",

  // Multiple price list: total annual compensation in USD, ascending, within [0, 10,000,000].
  // The steps grow roughly exponentially and are densest around typical starting salaries.
  SALARY_LADDER: [
    25000, 35000, 50000, 65000, 80000, 100000, 125000, 150000, 175000, 200000,
    250000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 3000000,
    5000000, 7500000, 10000000
  ],

  CLASS_YEARS: ["2027", "2028", "2029", "2030", "Other"],

  MAJORS: [
    "Applied and Computational Mathematics",
    "Applied Physics",
    "Astrophysics",
    "Bioengineering",
    "Biology",
    "Business, Economics, and Management",
    "Chemical Engineering",
    "Chemistry",
    "Computation and Neural Systems",
    "Computer Science",
    "Economics",
    "Electrical Engineering",
    "Engineering and Applied Science",
    "Environmental Science and Engineering",
    "Geological and Planetary Sciences",
    "Information and Data Sciences",
    "Materials Science",
    "Mathematics",
    "Mechanical Engineering",
    "Physics",
    "Humanities or Social Science",
    "Undeclared",
    "Other"
  ],

  // Browser storage names used to save progress and block repeat attempts.
  STORAGE_KEY: "ec109_career_survey",
  COOKIE_NAME: "ec109_career_survey_done"
};
