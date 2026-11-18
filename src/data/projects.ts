export type Project = {
  slug: string;
  number: string;
  name: string;
  category: string;
  year: string;
  summary: string;
  description: string;
  role: string;
  stack: string[];
  highlights: string[];
  href?: string;
  status: "Shipped" | "In progress" | "Case study";
};

export const projects: Project[] = [
  {
    slug: "careschedule",
    number: "01",
    name: "CareSchedule",
    category: "Healthcare · Full stack",
    year: "2026",
    summary: "Clinic operations shaped around the realities of scheduling care.",
    description: "A healthcare operations platform developed during .NET training. Its appointment engine considers provider availability, leave, holidays and resource constraints before offering a slot. The system is structured around six-layer Clean Architecture and role-based workflows.",
    role: "Full-stack engineering",
    stack: [".NET", "ASP.NET Core", "React", "Entity Framework Core", "SQL Server"],
    highlights: ["Six-layer Clean Architecture", "148 REST API endpoints", "Constraint-aware appointment scheduling", "Role-based workflows"],
    status: "Case study"
  },
  {
    slug: "journalai",
    number: "02",
    name: "JournalAI",
    category: "AI · Full stack · DevOps",
    year: "2025",
    summary: "A private journaling space that turns reflection into useful patterns.",
    description: "A full-stack journaling application with AI-assisted insights. The project explores persistent user data, containerized services, automated delivery and cloud deployment.",
    role: "Product engineering",
    stack: ["Next.js", "TypeScript", "Supabase", "Groq", "Docker", "Kubernetes", "Azure"],
    highlights: ["AI-assisted reflection", "Supabase-backed persistence", "Containerized deployment", "CI/CD and Kubernetes experiments"],
    href: "https://github.com/vinithreddybanda/journalai",
    status: "Shipped"
  },
  {
    slug: "whatsapp-status-saver",
    number: "03",
    name: "WhatsApp Status Saver",
    category: "Android · Kotlin",
    year: "2026",
    summary: "A native Android gallery for viewing, saving and sharing status media.",
    description: "A privacy-focused Android application that works locally on-device. The interface uses progressive media loading and a responsive, masonry-inspired gallery rather than a manual scanning workflow.",
    role: "Android development",
    stack: ["Kotlin", "Jetpack Compose", "Android", "MediaStore"],
    highlights: ["On-device media access", "Progressive gallery loading", "Responsive masonry layout", "Native share and save actions"],
    href: "https://github.com/vinithreddybanda/WhatsapStatusSaver",
    status: "In progress"
  },
  {
    slug: "livevoicex",
    number: "04",
    name: "LiveVoiceX",
    category: "Applied AI · Voice",
    year: "2025",
    summary: "Real-time voice transcription designed for multilingual conversations.",
    description: "An in-progress voice transcription experience built around live speech recognition and multilingual support, with a browser-first interface.",
    role: "Frontend and integrations",
    stack: ["React", "TypeScript", "Deepgram"],
    highlights: ["Live speech transcription", "Multilingual workflow", "Browser-based interface"],
    href: "https://github.com/vinithreddybanda/livevoicex",
    status: "In progress"
  }
];
