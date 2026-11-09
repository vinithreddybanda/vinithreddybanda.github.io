export const profile = {
  name: "Vinith Reddy Banda",
  role: "Software developer",
  location: "India",
  email: "vinithreddyb@gmail.com",
  github: "https://github.com/vinithreddybanda",
  linkedin: "https://www.linkedin.com/in/vinithreddybanda/",
  intro: "I build software across backend systems, Android, and AI, with a focus on thoughtful engineering and useful products.",
  summary: "An Information Technology graduate and developer drawn to the details behind dependable products.",
};

export const projects = [
  {
    number: "01", name: "JournalAI", type: "AI / FULL-STACK / CLOUD",
    hook: "A little more clarity, one entry at a time.",
    description: "An AI journaling platform that turns personal writing into structured mood insights, with privacy-conscious storage and an automated cloud pipeline.",
    details: ["Built the product with Next.js, TypeScript, Supabase, and Groq AI.", "Containerized and automated delivery across Docker, Kubernetes, Jenkins, and Azure."],
    stack: ["Next.js", "TypeScript", "Supabase", "Groq AI", "Docker", "Kubernetes", "Azure"],
    visual: "journal", link: "https://github.com/vinithreddybanda/journalai", linkLabel: "Explore the build",
  },
  {
    number: "02", name: "Activities for Discord", type: "ANDROID / NATIVE SYSTEMS",
    hook: "Taking desktop presence into your pocket.",
    description: "An Android app that brings mobile control to Discord Rich Presence, connecting native Android services with Discord’s SDK.",
    details: ["Bridged Android and the Discord Partner SDK through JNI.", "Built persistent sessions, real-time communication, and encrypted credential storage."],
    stack: ["Android", "Java", "C++", "JNI", "Discord SDK"],
    visual: "discord", link: "https://github.com/vinithreddybanda/activities", linkLabel: "Explore the source",
  },
  {
    number: "03", name: "Whatsap Status", type: "ANDROID / OPEN SOURCE",
    hook: "Your media stays yours. On your device.",
    description: "A privacy-minded Android utility to view, save, and share WhatsApp status media, published through F-Droid.",
    details: ["Processes media locally instead of uploading it to a remote service.", "Released under the Apache License 2.0."],
    stack: ["Android", "Java", "F-Droid", "Apache 2.0"],
    visual: "status", link: "https://f-droid.org/en/packages/com.vinithreddybanda.whatsapstatus/", linkLabel: "Get it on F-Droid",
  },
];

export const experience = [
  {
    period: "FEB — MAY 2026", role: ".NET Full Stack Intern", company: "Cognizant Technology Solutions", location: "India",
    summary: "Worked on CareSchedule, a healthcare platform for clinics and hospitals, across ASP.NET Core, React, Entity Framework Core, and SQL Server.",
    highlights: ["Built within a platform spanning 148 REST APIs and six role-based workflows.", "Developed appointment-slot logic that accounts for provider availability, leave, holidays, and blackout periods.", "Worked across a six-layer Clean Architecture."],
    stack: [".NET", "ASP.NET Core", "React", "EF Core", "SQL Server"],
  },
];

export const skills = [
  { title: "Languages", items: ["C#", "Java", "Kotlin", "TypeScript", "JavaScript", "SQL"] },
  { title: "Frameworks", items: ["ASP.NET Core", ".NET", "EF Core", "React", "Next.js", "Node.js"] },
  { title: "Data", items: ["SQL Server", "PostgreSQL", "MongoDB", "Supabase"] },
  { title: "Cloud & delivery", items: ["Docker", "Kubernetes", "GitHub Actions", "Jenkins", "Azure"] },
  { title: "Android & native", items: ["Android", "JNI", "C++", "Discord Partner SDK"] },
  { title: "Tools", items: ["Git", "GitHub", "Visual Studio", "VS Code"] },
];

export const education = [
  { period: "2023 — 2026", institution: "Chaitanya Bharathi Institute of Technology", qualification: "B.E. Information Technology · Hyderabad", result: "8.43 CGPA" },
  { period: "2023", institution: "Government Polytechnic, Warangal", qualification: "Diploma in Computer Engineering", result: "9.74 CGPA" },
];

export const recognition = [
  { title: "IEEE research publication", description: "Multi-Task Graph Attention Network for Kinematic Rehabilitation Exercise Analysis, published at I3CTCON 2026.", link: "https://doi.org/10.1109/I3CTCON68242.2026.11507447" },
  { title: "COSC HackWeek", description: "Placed 6th in a competitive coding challenge by CBIT Open Source Community and GeeksforGeeks." },
  { title: "MongoDB Node.js certification", description: "Completed the MongoDB Node.js Developer Path." },
  { title: "Community volunteering", description: "Helped coordinate a college Idea Presentation event with 20+ participants." },
];
