export const profile = {
  name: "Vinith Reddy Banda",
  role: "Software developer",
  location: "India",
  email: "vinithreddyb@gmail.com",
  github: "https://github.com/vinithreddybanda",
  linkedin: "https://www.linkedin.com/in/vinithreddybanda/",
  intro:
    "I build software across the stack, from thoughtful interfaces and backend systems to native Android integrations and cloud delivery.",
  summary:
    "An Information Technology graduate with a systems-first approach to product engineering. I enjoy turning complex requirements into software that feels clear, reliable, and useful.",
};

export const projects = [
  {
    number: "01",
    name: "JournalAI",
    type: "AI · Full-stack · Cloud",
    description:
      "An AI-powered journaling platform that turns personal entries into structured mood insights, combining an intuitive writing experience with secure data handling and an automated delivery pipeline.",
    details: [
      "Built with Next.js, TypeScript, Supabase, and Groq AI.",
      "Designed authentication and PostgreSQL-backed persistence.",
      "Containerized services and automated delivery with GitHub Actions, Jenkins, Docker, Kubernetes, and Azure.",
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Groq AI", "Docker", "Kubernetes", "Azure"],
    visual: "journal",
    link: null,
    linkLabel: "Product overview",
  },
  {
    number: "02",
    name: "Activities for Discord",
    type: "Android · Native systems",
    description:
      "An Android application that gives users mobile control over Discord Rich Presence, extending capabilities beyond the official mobile client.",
    details: [
      "Connected Android and the Discord Partner SDK through a native JNI layer.",
      "Implemented persistent SDK sessions and real-time communication.",
      "Added secure authentication, encrypted credential storage, image caching, and foreground/background services.",
    ],
    stack: ["Android", "Java", "C++", "JNI", "Discord Partner SDK"],
    visual: "discord",
    link: "https://github.com/vinithreddybanda/activities",
    linkLabel: "View source",
  },
  {
    number: "03",
    name: "Whatsap Status",
    type: "Android · Open source",
    description:
      "A privacy-conscious Android utility for viewing, saving, and sharing WhatsApp image and video statuses. Published on the official F-Droid repository.",
    details: [
      "Works locally on the device instead of uploading media to a remote service.",
      "Supports saving and sharing status media with a dark-mode interface.",
      "Published under the Apache License 2.0.",
    ],
    stack: ["Android", "Java", "F-Droid", "Apache 2.0"],
    visual: "status",
    link: "https://f-droid.org/en/packages/com.vinithreddybanda.whatsapstatus/",
    linkLabel: "View on F-Droid",
  },
];

export const experience = [
  {
    period: "FEB 2026 — MAY 2026",
    role: ".NET Full Stack Intern",
    company: "Cognizant Technology Solutions",
    location: "India",
    summary:
      "Contributed to CareSchedule, a healthcare management platform for clinics and hospitals, using ASP.NET Core, React, Entity Framework Core, SQL Server, and REST APIs.",
    highlights: [
      "Developed across a platform comprising 148 REST APIs, 32 controllers, 33 domain entities, and 6 role-based workflows.",
      "Implemented an appointment-slot generation engine that resolves provider availability, holidays, leave, blackout periods, and resource constraints to prevent double-booking.",
      "Worked with a 6-layer Clean Architecture spanning .NET, EF Core, SQL Server, and React.",
    ],
    stack: [".NET", "ASP.NET Core", "React", "EF Core", "SQL Server"],
  },
];

export const skills = [
  {
    title: "Languages",
    items: ["C#", "Java", "Kotlin", "TypeScript", "JavaScript", "SQL"],
  },
  {
    title: "Frameworks",
    items: ["ASP.NET Core", ".NET", "Entity Framework Core", "React", "Next.js", "Node.js"],
  },
  {
    title: "Data",
    items: ["SQL Server", "PostgreSQL", "MongoDB", "Supabase"],
  },
  {
    title: "Cloud & delivery",
    items: ["Docker", "Kubernetes", "GitHub Actions", "Jenkins", "Microsoft Azure"],
  },
  {
    title: "Android & native",
    items: ["Android", "JNI", "C++", "Discord Partner SDK"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Visual Studio", "Visual Studio Code"],
  },
];

export const education = [
  {
    period: "2023 — 2026",
    institution: "Chaitanya Bharathi Institute of Technology",
    qualification: "B.E. in Information Technology · Hyderabad",
    result: "8.43 CGPA",
  },
  {
    period: "2023",
    institution: "Government Polytechnic, Warangal",
    qualification: "Diploma in Computer Engineering",
    result: "9.74 CGPA",
  },
];

export const recognition = [
  {
    title: "IEEE research publication",
    description:
      "Published “Multi-Task Graph Attention Network for Kinematic Rehabilitation Exercise Analysis” at the 2026 IEEE International Conference for Convergence in Computing Technology (I3CTCON), indexed in IEEE Xplore.",
    link: "https://doi.org/10.1109/I3CTCON68242.2026.11507447",
  },
  {
    title: "COSC HackWeek Challenge",
    description:
      "Secured 6th place in a week-long competitive coding event organized by CBIT Open Source Community in collaboration with GeeksforGeeks.",
  },
  {
    title: "MongoDB Node.js Certification",
    description: "Completed the MongoDB Node.js Developer Path through MongoDB University.",
  },
  {
    title: "Web Development 101",
    description: "Completed the Pupilfirst web development certification.",
  },
  {
    title: "Community volunteering",
    description:
      "Coordinated a college Idea Presentation event, managing and assisting more than 20 participants.",
  },
];