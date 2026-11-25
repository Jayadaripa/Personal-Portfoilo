export interface SkillGroup {
  title: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  subtitle: string;
  status: string;
  year: string;
  category: string;
  description: string;
  highlights: string[];
  stack: string[];
  image: string;
  github?: string;
  demo?: string;
}

export interface InternshipItem {
  company: string;
  role: string;
  period: string;
  type: string;
  points: string[];
  tags: string[];
  certificateFile?: string;
  certificateTitle?: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  detail?: string;
}

export interface StoryMilestone {
  when: string;
  phase: string;
  title: string;
  text: string;
  recruiterTakeaway: string;
  tags: string[];
}

export interface RecruiterPillar {
  title: string;
  metric: string;
  detail: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  file: string;
  issuer?: string;
  date?: string;
  description?: string;
  skills?: string;
  verifyLink?: string;
}

export const profile = {
  name: 'Jaya Daripa',
  initials: 'JD',
  kicker: 'Jaya Daripa · Computer Science Engineering ',
  role: 'Computer Science Engineering Student & Aspiring Software Developer',
  intro:
    "I'm a Computer Science Engineering student with hands-on internship experience in Python, Java, and SQL. Skilled in React, Tailwind CSS, JavaScript, and Git, I build responsive web applications and compete in hackathons to sharpen real-world problem solving.",
  email: 'jayadaripa04@gmail.com',
  github: 'https://github.com/Jayadaripa',
  linkedin: 'https://www.linkedin.com/in/jaya-daripa-9a3502383/',
  leetcode: 'https://leetcode.com/u/Jaya_Daripa/',
  resume: '/assets/aistudio/Jaya_Daripa_Resume_3c0ed0cd.pdf',
  availability: 'Open to Software & Frontend Developer Internships',
  heroImage: '/assets/aistudio/Jaya_Daripa_Photo_e46c587a.jpeg',
};

export const heroHighlights = [
  { label: 'Academic Track', value: 'B.Tech CSE · 3rd Year' },
  { label: 'Industry Exposure', value: '4 Internships & Simulations' },
  { label: 'Verified Credentials', value: '23 Technical Certificates' },
  { label: 'Shipped & Active Builds', value: '5+ Software Projects' },
];

export const about = {
  quote: 'Curious mind. Creative builder. Continuous learner.',
  paragraphs: [
    "I'm a third-year B.Tech Computer Science Engineering student (following an 85% Diploma in CSE and 93% in Class X) with a strong focus on software development, structured problem-solving, and modern web architecture.",
    'My technical toolkit spans Java, Python, JavaScript, SQL, React.js, Tailwind CSS, and Vite. Alongside frontend interfaces, I have built academic systems such as a Timetable Management System with authentication, scheduling, and SQL database integration.',
    'Through 2026 hackathons, technical competitions, and hands-on internships at AssistFlow Pvt Ltd, RVM CAD, and Imperial Auto Industries Pvt. Ltd., I thrive on translating requirements into clean, reliable software.',
    "I'm actively seeking Software and Frontend Developer internship opportunities where I can contribute to production codebases, collaborate with engineering teams, and deliver measurable value.",
  ],
  facts: [
    { label: 'Degree', value: 'B.Tech, Computer Science & Engineering' },
    { label: 'Diploma Score', value: '85% · Govt. Polytechnic, Faridabad' },
    { label: 'Academic Year', value: '3rd Year (Class of 2028)' },
    { label: 'Primary Focus', value: 'React, Java, Python & SQL' },
    { label: 'Availability', value: 'Open to Internship Opportunities' },
  ],
};

export const skills: SkillGroup[] = [
  {
    title: 'Programming Languages',
    items: ['Java', 'Python', 'JavaScript', 'SQL'],
  },
  {
    title: 'Frontend Development',
    items: ['HTML5', 'CSS3', 'React.js', 'Tailwind CSS', 'Vite'],
  },
  {
    title: 'Backend & Database',
    items: ['Node.js', 'Express.js', 'REST APIs', 'SQL', 'NoSQL'],
  },
  {
    title: 'Developer Tools',
    items: ['Git', 'GitHub', 'VS Code', 'Vite'],
  },
  {
    title: 'Core Computer Science',
    items: ['Data Structures & Algorithms', 'OOP', 'DBMS', 'Responsive Web Design'],
  },
  {
    title: 'Currently Exploring',
    items: ['Backend Architecture', 'LeetCode DSA', 'Full-Stack Systems'],
  },
];

export const projects: ProjectItem[] = [
  // {
  //   id: 'foodie',
  //   name: 'Foodie',
  //   subtitle: 'Responsive Food Ordering & Discovery App',
  //   status: 'React Project',
  //   year: '2026',
  //   category: 'Frontend · React',
  //   description:
  //     'A responsive food ordering landing page and discovery experience built using React, Vite, and Tailwind CSS with dynamic menu browsing and interactive cart flows.',
  //   highlights: [
  //     'Modular React component architecture with Vite bundling and responsive Tailwind CSS styling.',
  //     'Interactive category filtering, menu browsing, and smooth cart state updates.',
  //     'Engineered with clean visual hierarchy and mobile-first responsiveness.',
  //   ],
  //   stack: ['React', 'Vite', 'JavaScript', 'Tailwind CSS'],
  //   image: '/src/assets/images/project_foodie_editorial_1795623282496.jpg',
  //   live: '',
  //   github: 
  // },
  {
    id: 'life-receipt',
    name: 'Life Receipt',
    subtitle: '2026 Hackathon Build — Daily Milestone Receipt Generator',
    status: 'Hackathon Project',
    year: '2026',
    category: 'Hackathon · Creative Web',
    description:
      'Built during a fast-paced 2026 hackathon, Life Receipt turns daily habits, personal wins, and reflections into a custom formatted printable receipt summary.',
    highlights: [
      'Ideated, designed, and shipped a complete working interactive prototype under strict 2026 hackathon deadlines.',
      'Dynamic thermal-receipt layout rendering structured user inputs, timestamps, and reflective summaries.',
      'Demonstrates rapid frontend execution, product creativity, and clean UI craft.',
    ],
    stack: ['React', 'JavaScript', 'Tailwind CSS', 'Rapid Prototyping'],
    image: '/src/assets/images/project_lifereceipt_editorial_1795623282157.jpg',
    live: 'https://life-receipt-rho.vercel.app/',
    github: 'https://github.com/Jayadaripa/LifeReceipt',
  },
  {
    id: 'grantly',
    name: 'GRANTLY',
    subtitle: 'Scholarship Discovery & Application Platform',
    status: 'Completed Concept',
    year: '2026',
    category: 'EdTech · React',
    description:
      'A digital scholarship discovery and application-management experience designed to help students explore financial assistance opportunities and organize deadlines effortlessly.',
    highlights: [
      'Structured eligibility discovery flow tailored for undergraduate and diploma students.',
      'Application checklist and deadline tracking interface built with reusable React components.',
      'Clean responsive layout emphasizing readable typography and friction-free navigation.',
    ],
    stack: ['React', 'JavaScript', 'Tailwind CSS'],
    image: '/src/assets/images/project_grantly_editorial_1795622518966.jpg',
    live: 'https://grantly-scholarship-compass.vercel.app/',
    github: 'https://github.com/Jayadaripa/grantly-scholarship-compass',
  },
  {
    id: 'vestora',
    name: 'VESTORA',
    subtitle: 'Paper Trading & Market Learning Simulator',
    status: 'In Progress',
    year: '2026',
    category: 'FinTech · React',
    description:
      'A fintech learning application focused on helping beginners understand stock-market mechanics and portfolio allocation through a risk-free paper-trading environment.',
    highlights: [
      'Simulated order entry and portfolio allocation tracking without real-capital risk.',
      'Clear tabular presentation of asset positions, cost basis, and simulated returns.',
      'Modular frontend state architecture prepared for real-time market feed integration.',
    ],
    stack: ['React', 'JavaScript', 'Frontend Architecture'],
    image: '/src/assets/images/project_vestora_editorial_1795622519939.jpg',
    github: 'https://github.com/Jayadaripa/Vestora',
  },
  {
    id: 'growmates',
    name: 'GrowMates',
    subtitle: 'Student & Developer Collaboration Network',
    status: 'In Progress',
    year: '2026',
    category: 'Community · UI Systems',
    description:
      'A collaboration platform built to help students and early-career developers discover coding partners, form hackathon teams, and ship technical projects together.',
    highlights: [
      'Skill-based teammate matching centered on shared learning goals and hackathon tracks.',
      'Project board structure for outlining roles, milestones, and tech stacks.',
      'Designed around clean, distraction-free collaboration workflows.',
    ],
    stack: ['React', 'UI/UX Systems', 'JavaScript'],
    image: '/src/assets/images/project_growmates_editorial_1795622519555.jpg',
    github: 'Currently in Progress',
  },
];

export const internships: InternshipItem[] = [
  {
    company: 'AssistFlow Pvt Ltd',
    role: 'Java Developer Intern',
    period: 'Jun 2026 – Aug 2026',
    type: 'Internship',
    points: [
      'Developed, debugged, and maintained Java-based backend modules and application logic.',
      'Gained hands-on experience integrating application workflows with relational databases.',
    ],
    tags: ['Java', 'Backend', 'Database'],
    certificateFile: 'intership completion .pdf',
    certificateTitle: 'AssistFlow Internship Completion',
  },
  {
    company: 'Deloitte (via Forage)',
    role: 'Data Analytics Job Simulation',
    period: 'Jul 2026',
    type: 'Virtual Simulation',
    points: [
      'Completed practical tasks across structured data analysis, interpretation, and forensic technology workflows.',
    ],
    tags: ['Data Analysis', 'Forensic Technology'],
    certificateFile: 'Deloitte certificate.pdf',
    certificateTitle: 'Deloitte Data Analytics Simulation',
  },
  {
    company: 'RVM CAD',
    role: 'Python Intern Trainee',
    period: 'Jul 2024 – Aug 2024',
    type: 'Internship',
    points: [
      'Applied Python concepts, control flow, functions, OOP, and libraries to develop practical scripts.',
      'Solved engineering problems through coding exercises and modular mini projects.',
    ],
    tags: ['Python', 'OOP', 'Scripting'],
  },
  {
    company: 'Imperial Auto Industries Pvt. Ltd.',
    role: 'Database Management Intern Trainee',
    period: 'Aug 2023 – Sep 2023',
    type: 'Industrial Training',
    points: [
      'Applied SQL and database management concepts to assist in creating and maintaining enterprise databases.',
      'Recognised in the company completion letter as a sincere, hardworking, and dedicated intern.',
    ],
    tags: ['SQL', 'Database Management', 'Systems'],
  },
];

export const education: EducationItem[] = [
  {
    school: 'Gurugram University',
    degree: 'B.Tech, Computer Science and Engineering',
    period: '2025 – 2028',
    detail: 'Currently in 3rd Year; focusing on software engineering, DSA, and full-stack systems.',
  },
  {
    school: 'Government Polytechnic for Women, Faridabad',
    degree: 'Diploma, Computer Science Engineering (85%)',
    period: 'Oct 2022 – Jun 2024',
    detail: 'Built core foundations in programming, SQL database management, and academic software systems.',
  },
  {
    school: 'St. Peter Convent School',
    degree: 'Class X Secondary Education (93%)',
    period: '2021 – 2022',
  },
];

export const recruiterPillars: RecruiterPillar[] = [
  {
    title: 'Production-Ready Mindset',
    metric: '4 Internships & Simulations',
    detail:
      'Proven experience writing Java backend logic, Python scripts, and SQL database workflows across real engineering teams.',
  },
  {
    title: 'Rapid Execution Under Pressure',
    metric: '6 Hackathons in 2026',
    detail:
      'Built projects like Life Receipt in strict 6-to-24 hour sprints during 2026—turning ambiguous prompts into live demos.',
  },
  {
    title: 'Strong Academic & CS Rigor',
    metric: '85% Diploma · 93% Class X',
    detail:
      'Grounded in Data Structures & Algorithms (LeetCode + Sigma DSA), OOP, SQL/NoSQL DBMS, and Infosys Springboard certifications.',
  },
];

export const story: StoryMilestone[] = [
  {
    when: '2022 – 2023',
    phase: '01 · Academic Foundation',
    title: 'Class X Excellence (93%) & Early CS Diploma',
    text: 'Completed Class X with 93% at St. Peter Convent School and began my Diploma in Computer Science Engineering at Government Polytechnic for Women, Faridabad.',
    recruiterTakeaway: 'Consistent academic discipline and early CS commitment.',
    tags: ['Computer Science', 'Foundations'],
  },
  {
    when: 'Aug 2023 – Aug 2024',
    phase: '02 · Early Industry Training',
    title: 'SQL Database & Python Internships',
    text: 'Applied SQL to maintain enterprise databases at Imperial Auto Industries Pvt. Ltd. and built Python scripts and OOP modules during my internship at RVM CAD.',
    recruiterTakeaway: 'Hands-on SQL & Python experience before university.',
    tags: ['SQL', 'Python', 'OOP'],
  },
  {
    when: 'Aug 2022 - June 2024',
    phase: '03 · Diploma Graduation & B.Tech Entry',
    title: '85% Diploma, Timetable System & B.Tech CSE',
    text: 'Graduated with 85% in my CSE Diploma, built a full Timetable Management System with authentication and SQL scheduling, earned the Kaggle Python Coder badge, and entered Gurugram University for B.Tech CSE.',
    recruiterTakeaway: 'Full-stack academic execution and strong CS fundamentals.',
    tags: ['DBMS', 'SQL', 'B.Tech CSE'],
  },
  {
    when: 'June 2024 - June 2028',
    phase: '04 · B.Tech CSE, Hackathons, Internships & React Shipping',
    title: '2026 Hackathon Sprints, Java Internship & 5+ Builds',
    text: 'Participated in all my hackathons in 2026 (WebRush 6-Hour, Adobe, Build with Bharat, Aspire for Her, The Outpost, Vivekananda) building Life Receipt, interned as a Java Developer at AssistFlow, completed Infosys Springboard & Deloitte certifications, and shipped  GRANTLY, VESTORA, and GrowMates.',
    recruiterTakeaway: 'Interview-ready for Software & Frontend Developer internships.',
    tags: ['React', 'Java', 'Hackathons 2026', 'LeetCode'],
  },
];

export const certificates: CertificateItem[] = [
  // Hackathons (2026)
  {
  id: 'webrush-6hr',
  name: 'WebRush (6-Hour Hackathon)',
  category: 'Hackathons',
  subcategory: 'Rapid Prototyping · 2026',
  file: '6-Hour-Hackathon.png',
  date: '2026',
  description: 'Participated in an intensive 6-hour web engineering and rapid prototyping hackathon.',
},
  {
    id: 'adobe-hackathon',
    name: 'Adobe Hackathon',
    category: 'Hackathons',
    subcategory: 'National Hackathon · 2026',
    file: 'adobe certificate.pdf',
    issuer: 'Adobe',
    date: '2026',
    description: 'Participated in the 2026 Adobe Hackathon solving creative and technical problem statements.',
  },
  {
    id: 'build-with-bharat',
    name: 'Build with Bharat Hackathon',
    category: 'Hackathons',
    subcategory: 'Innovation Challenge · 2026',
    file: 'Hackathon Certification.png',
    date: '2026',
    description: 'Built and pitched practical digital solutions focused on real-world impact.',
  },
  {
    id: 'aspire-for-her',
    name: 'Aspire for Her Hackathon',
    category: 'Hackathons',
    subcategory: 'LogiTech Track · 2026',
    file: 'LogiTech.pdf',
    issuer: 'Aspire For Her',
    date: '2026',
    description: 'Hackathon participation certificate under the Aspire For Her initiative.',
  },
  {
    id: 'the-outpost',
    name: 'The Outpost — WebRush',
    category: 'Hackathons',
    subcategory: 'Web Engineering · 2026',
    file: 'The outpost.png',
    issuer: 'The Outpost',
    date: '2026',
    description: 'Certificate of participation in The Outpost WebRush hackathon.',
  },
  {
    id: 'vivekananda-hackathon',
    name: 'Vivekananda Hackathon',
    category: 'Hackathons',
    subcategory: 'Innovation Challenge · 2026',
    file: 'vivekanda innovation.pdf',
    date: '2026',
    description: 'Participated in the 2026 Vivekananda Innovation Hackathon.',
  },

  // AI & Emerging Technologies
  {
    id: 'ai-robotics',
    name: 'AI & Robotics',
    category: 'AI & Emerging Tech',
    subcategory: 'Emerging Tech',
 file: 'AI & Robotics.png',
    description: 'Foundational exploration of artificial intelligence concepts and robotics systems.',
  },
  // {
  //   id: 'gen-ai-iit',
  //   name: 'Generative AI (IIT)',
  //   category: 'AI & Emerging Tech',
  //   subcategory: 'Generative AI',
  //   file: 'GEN AI (IIT).pdf',
  //   issuer: 'IIT Workshop / Program',
  //   description: 'Completed Generative AI technical certification program.',
  // },
  {
    id: 'generative-ai',
    name: 'Generative AI',
    category: 'AI & Emerging Tech',
    subcategory: 'Generative AI',
    file: 'gen ai.png',
    description: 'Certificate covering generative models, prompting workflows, and applied AI.',
  },

  // Technical Courses & Certifications
  {
    id: 'programming-java',
    name: 'Programming in Java',
    category: 'Technical Courses',
    subcategory: 'Programming',
    file: 'PROGRAMMING IN JAVA.pdf',
    issuer: 'Infosys Springboard',
    date: '2026',
    skills: 'Java, OOP, Core Libraries',
    description: 'Comprehensive coursework in Java programming and object-oriented software design.',
  },
  {
    id: 'python-coder',
    name: 'Python Coder Badge',
    category: 'Technical Courses',
    subcategory: 'Programming',
    file: 'Python Coder (3).png',
    issuer: 'Kaggle',
    date: 'Nov 2025',
    skills: 'Python, Logic, Scripting',
    description: 'Verified Python programming proficiency badge and course completion.',
  },
  {
    id: 'sigma-dsa',
    name: 'Sigma DSA',
    category: 'Technical Courses',
    subcategory: 'Data Structures & Algorithms',
    file: 'certificate-sigma-dsa-.pdf',
    issuer: 'Apna College',
    skills: 'Arrays, Trees, Graphs, Dynamic Programming',
    description: 'Structured training in Data Structures, Algorithms, and problem-solving patterns.',
  },
  {
    id: 'db-part-1',
    name: 'Database Management System — Part 1',
    category: 'Technical Courses',
    subcategory: 'Database',
    file: 'DB PART 1.pdf',
    issuer: 'Infosys Springboard',
    date: '2026',
    skills: 'Relational Modeling, SQL',
    description: 'Relational database fundamentals, schema design, and SQL querying.',
  },
  {
    id: 'db-part-2',
    name: 'Database Management System — Part 2',
    category: 'Technical Courses',
    subcategory: 'Database',
    file: 'DB PART 2.pdf',
    issuer: 'Infosys Springboard',
    date: '2026',
    skills: 'Joins, Indexing, Transactions',
    description: 'Intermediate relational database concepts, normalization, and query optimization.',
  },
  {
    id: 'nosql-db',
    name: 'NoSQL Database',
    category: 'Technical Courses',
    subcategory: 'Database',
    file: 'NO SQL DATABASE.pdf',
    skills: 'Document Stores, Non-Relational Schemas',
    description: 'Non-relational data modeling and NoSQL database workflows.',
  },
  {
    id: 'software-agile',
    name: 'Software & Agile Engineering',
    category: 'Technical Courses',
    subcategory: 'Software Engineering',
    file: 'software and agile.pdf',
    skills: 'SDLC, Agile, Scrum',
    description: 'Software development lifecycle principles and iterative Agile methodologies.',
  },

  // Competitions & Technical Events
  {
    id: 'nexus',
    name: 'Nexus Technical Event',
    category: 'Competitions',
    subcategory: 'Technical Competition',
    file: 'nexus certificate.pdf',
    description: 'Participation in the Nexus inter-college technical competition.',
  },
  {
    id: 'tech-zen',
    name: 'Tech-Zen',
    category: 'Competitions',
    subcategory: 'Technical Competition',
    file: 'Tech-Zen.pdf',
    description: 'Participation in the Tech-Zen engineering challenge and competition.',
  },
  {
    id: 'upforage-ai',
    name: 'UPforage AI',
    category: 'Competitions',
    subcategory: 'AI Competition',
    file: 'UPforage AI.jpeg',
    description: 'Participation in the UPforage AI technical challenge.',
  },

  // Community & Badges
  {
    id: 'kaggle-member',
    name: 'Kaggle Community Member',
    category: 'Community & Badges',
    subcategory: 'Developer Community',
    file: 'Kaggle Community Member (1).png',
    issuer: 'Kaggle',
    description: 'Active community member badge on Kaggle.',
  },
  {
    id: 'vampire-badge',
    name: 'Vampire Achievement Badge',
    category: 'Community & Badges',
    subcategory: 'Achievement Badge',
    file: 'Vampire.png',
    description: 'Developer community achievement badge.',
  },

  // Internships
  {
    id: 'internship-completion',
    name: 'Internship Completion',
    category: 'Internships',
    subcategory: 'Industry Experience',
    file: 'intership completion .pdf',
    description: 'Official certificate recognizing successful software development internship completion.',
  },
  {
    id: 'deloitte-cert',
    name: 'Deloitte Data Analytics Simulation',
    category: 'Internships',
    subcategory: 'Virtual Program · 2026',
    file: 'Deloitte certificate.pdf',
    issuer: 'Deloitte (via Forage)',
    date: '2026',
    description: 'Completed practical tasks in data analysis and forensic technology.',
  },
];
