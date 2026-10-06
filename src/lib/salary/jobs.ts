// Jobs the Salary Estimator covers. Every code is an official US Standard
// Occupational Classification (SOC) code used by the BLS wage survey.
// scripts/build-salary-data.py reads the codes from this file, so adding a job
// here and rerunning the script is all it takes to include it.

export type JobGroup =
  | "Software and web"
  | "IT and security"
  | "Data and research"
  | "Design and writing"
  | "Marketing and sales"
  | "Management and business";

export interface Job {
  code: string;
  name: string;
  group: JobGroup;
  blurb: string;
  aliases: string[];
}

export const JOB_GROUPS: JobGroup[] = [
  "Software and web",
  "IT and security",
  "Data and research",
  "Design and writing",
  "Marketing and sales",
  "Management and business",
];

export const JOBS: Job[] = [
  // Software and web
  { code: "15-1252", name: "Software developers", group: "Software and web", blurb: "Design and build applications, systems and software products.", aliases: ["software engineer", "software developer", "full stack developer", "backend developer", "back end developer", "mobile developer", "app developer", "ios developer", "android developer", "game developer", "application developer", "senior software engineer", "staff engineer", "principal engineer", "tech lead", "embedded software engineer"] },
  { code: "15-1254", name: "Web developers", group: "Software and web", blurb: "Build and maintain websites and web applications.", aliases: ["web developer", "frontend developer", "front end developer", "wordpress developer", "shopify developer", "website developer", "webmaster"] },
  { code: "15-1255", name: "Web and digital interface designers", group: "Software and web", blurb: "Design the look, layout and usability of websites and apps.", aliases: ["ui designer", "ux designer", "ui/ux designer", "product designer", "web designer", "interaction designer"] },
  { code: "15-1253", name: "Software QA analysts and testers", group: "Software and web", blurb: "Test software, find bugs and check quality before release.", aliases: ["qa engineer", "qa analyst", "software tester", "test engineer", "test automation engineer", "sdet", "quality assurance"] },
  { code: "15-1251", name: "Computer programmers", group: "Software and web", blurb: "Write and test code from designs made by developers and engineers.", aliases: ["programmer", "coder"] },
  { code: "15-1221", name: "Computer and information research scientists", group: "Software and web", blurb: "Research new ways to use computers, such as new algorithms.", aliases: ["research scientist", "computer scientist", "ai researcher"] },
  { code: "17-2061", name: "Computer hardware engineers", group: "Software and web", blurb: "Design and test computer chips, boards and devices.", aliases: ["hardware engineer"] },

  // IT and security
  { code: "15-1212", name: "Information security analysts", group: "IT and security", blurb: "Protect an organization's networks and systems from attacks.", aliases: ["security engineer", "cybersecurity analyst", "cyber security analyst", "security analyst", "penetration tester", "pentester", "soc analyst", "ethical hacker"] },
  { code: "15-1241", name: "Computer network architects", group: "IT and security", blurb: "Design and build data networks such as LANs, WANs and intranets.", aliases: ["network architect", "network engineer"] },
  { code: "15-1244", name: "Network and computer systems administrators", group: "IT and security", blurb: "Run and maintain an organization's servers and networks day to day.", aliases: ["system administrator", "systems administrator", "sysadmin", "network administrator", "it administrator"] },
  { code: "15-1211", name: "Computer systems analysts", group: "IT and security", blurb: "Study an organization's systems and design better ways to use technology.", aliases: ["systems analyst", "it analyst", "business systems analyst"] },
  { code: "15-1242", name: "Database administrators", group: "IT and security", blurb: "Run, secure and back up databases.", aliases: ["database administrator", "dba"] },
  { code: "15-1243", name: "Database architects", group: "IT and security", blurb: "Design database systems and how data is stored and modeled.", aliases: ["database architect", "data architect"] },
  { code: "15-1231", name: "Computer network support specialists", group: "IT and security", blurb: "Test, troubleshoot and maintain computer networks.", aliases: ["network support", "network technician"] },
  { code: "15-1232", name: "Computer user support specialists", group: "IT and security", blurb: "Help people with computer problems, often at a help desk.", aliases: ["it support", "help desk", "helpdesk", "technical support", "tech support", "desktop support", "support technician"] },
  { code: "15-1299", name: "Computer occupations, all other", group: "IT and security", blurb: "Computer jobs that BLS does not list in any other category.", aliases: [] },

  // Data and research
  { code: "15-2051", name: "Data scientists", group: "Data and research", blurb: "Use statistics and code to analyze data and build models.", aliases: ["data scientist", "data mining analyst"] },
  { code: "15-2041", name: "Statisticians", group: "Data and research", blurb: "Collect and analyze data using statistical methods.", aliases: ["statistician", "biostatistician"] },
  { code: "15-2031", name: "Operations research analysts", group: "Data and research", blurb: "Use math and data to help organizations solve problems and make decisions.", aliases: ["operations research analyst", "operations analyst"] },

  // Design and writing
  { code: "27-1024", name: "Graphic designers", group: "Design and writing", blurb: "Create visual designs for print, web and brands.", aliases: ["graphic designer", "visual designer", "logo designer", "brand designer"] },
  { code: "27-3042", name: "Technical writers", group: "Design and writing", blurb: "Write manuals, guides and documentation.", aliases: ["technical writer", "documentation writer", "api writer"] },
  { code: "27-3043", name: "Writers and authors", group: "Design and writing", blurb: "Write content such as articles, copy, scripts and books.", aliases: ["writer", "copywriter", "content writer", "blogger", "author"] },
  { code: "27-3031", name: "Public relations specialists", group: "Design and writing", blurb: "Manage how an organization talks to the public and the media.", aliases: ["pr specialist", "public relations", "communications specialist", "publicist"] },

  // Marketing and sales
  { code: "13-1161", name: "Market research analysts and marketing specialists", group: "Marketing and sales", blurb: "Study markets and customers, and plan or run marketing such as search and online campaigns.", aliases: ["marketing specialist", "digital marketer", "digital marketing", "seo specialist", "seo", "ppc specialist", "marketing analyst", "market research analyst", "content marketer", "email marketer", "growth marketer", "social media specialist"] },
  { code: "11-2021", name: "Marketing managers", group: "Marketing and sales", blurb: "Plan marketing strategy and lead marketing teams.", aliases: ["marketing manager", "head of marketing", "marketing director", "brand manager"] },
  { code: "11-2022", name: "Sales managers", group: "Marketing and sales", blurb: "Lead sales teams and set sales targets.", aliases: ["sales manager", "head of sales", "sales director"] },
  { code: "41-3091", name: "Sales representatives (services)", group: "Marketing and sales", blurb: "Sell services, such as software and business services, to companies and people.", aliases: ["sales representative", "sales rep", "account executive", "business development representative", "saas sales"] },
  { code: "43-4051", name: "Customer service representatives", group: "Marketing and sales", blurb: "Answer customer questions and solve their problems.", aliases: ["customer service", "customer support", "call center agent", "support agent"] },

  // Management and business
  { code: "11-3021", name: "Computer and information systems managers", group: "Management and business", blurb: "Plan and direct an organization's computer and IT work.", aliases: ["it manager", "it director", "head of engineering", "cto", "chief technology officer", "technology manager"] },
  { code: "11-9041", name: "Architectural and engineering managers", group: "Management and business", blurb: "Lead engineering teams, projects and research.", aliases: ["engineering director"] },
  { code: "11-1021", name: "General and operations managers", group: "Management and business", blurb: "Run the day to day operations of a company or department.", aliases: ["operations manager", "general manager", "ops manager"] },
  { code: "13-1082", name: "Project management specialists", group: "Management and business", blurb: "Plan projects and keep budgets, schedules and teams on track.", aliases: ["project manager", "scrum master", "program manager", "delivery manager"] },
  { code: "13-1111", name: "Management analysts", group: "Management and business", blurb: "Advise organizations on how to work better and cost less.", aliases: ["management consultant", "consultant", "process analyst"] },
  { code: "13-2011", name: "Accountants and auditors", group: "Management and business", blurb: "Prepare and check financial records.", aliases: ["accountant", "auditor"] },
  { code: "13-1071", name: "Human resources specialists", group: "Management and business", blurb: "Recruit, screen and hire staff, and handle HR tasks.", aliases: ["hr specialist", "recruiter", "technical recruiter", "talent acquisition", "hr"] },
];

// Job titles BLS does not count as their own job. Searching one of these shows
// the closest official categories instead of pretending there is an exact match.
export interface TitleHint {
  title: string;
  match: string[];
  codes: string[];
  note?: string;
}

export const TITLE_HINTS: TitleHint[] = [
  { title: "DevOps engineer", match: ["devops"], codes: ["15-1252", "15-1244", "15-1299"] },
  { title: "Site reliability engineer", match: ["site reliability", "sre"], codes: ["15-1252", "15-1244", "15-1299"] },
  { title: "Cloud engineer or cloud architect", match: ["cloud"], codes: ["15-1241", "15-1244", "15-1299"] },
  { title: "Machine learning or AI engineer", match: ["machine learning", "ml engineer", "ai engineer", "mlops"], codes: ["15-1252", "15-2051", "15-1221"] },
  { title: "Data engineer", match: ["data engineer"], codes: ["15-1243", "15-1252"] },
  { title: "Data analyst or BI analyst", match: ["data analyst", "bi analyst", "business intelligence"], codes: ["15-2051", "15-2031", "13-1111"] },
  { title: "Product manager", match: ["product manager", "product owner", "head of product"], codes: ["11-3021", "13-1082", "11-2021"] },
  { title: "Business analyst", match: ["business analyst"], codes: ["13-1111", "15-1211"] },
  { title: "Engineering manager", match: ["engineering manager", "software manager"], codes: ["11-3021", "11-9041"] },
  { title: "Solutions architect", match: ["solutions architect", "solution architect", "software architect", "enterprise architect"], codes: ["15-1241", "15-1211", "15-1252"] },
  { title: "Blockchain developer", match: ["blockchain", "web3", "smart contract"], codes: ["15-1252", "15-1299"] },
  { title: "Social media manager", match: ["social media manager", "community manager"], codes: ["13-1161", "27-3031", "11-2021"] },
  { title: "Freelancer or self employed", match: ["freelance", "self employed", "contractor"], codes: ["15-1252", "15-1254", "13-1161"], note: "The BLS survey only counts people on an employer's payroll, so freelancers are not in these numbers. Employee pay in the same field is still a useful reference point when you set your rates." },
];

export const JOB_BY_CODE: Record<string, Job> = Object.fromEntries(JOBS.map((j) => [j.code, j]));

export const DEFAULT_JOB = "15-1252";
export const US_AREA = "99";
