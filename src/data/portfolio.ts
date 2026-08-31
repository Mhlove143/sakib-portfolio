export interface Metric {
  value: string;
  suffix: string;
  label: string;
  subtext: string;
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  color: "emerald" | "sky" | "purple" | "amber";
  deliverables: string[];
  technologies: string[];
  businessValue: string;
  imageUrl?: string;
}

export interface SkillItem {
  name: string;
  level: "Expert" | "Advanced" | "Proficient";
  experience: string;
  description?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  color: string;
  accent: string;
  skills: SkillItem[];
  highlight: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  type: string;
  badge: string;
  badgeColor: "emerald" | "sky" | "purple";
  cardClass: string;
  titleGradient: string;
  roleSummary: string;
  highlights: string[];
  techs: string[];
  achievements: string[];
}

export interface Project {
  id: string;
  title: string;
  category: "Full-Stack" | "Shopify" | "CMS" | "SaaS";
  badge: string;
  description: string;
  longDescription?: string;
  challenge: string;
  solution: string;
  impact: string;
  metrics: string[];
  tech: string[];
  cardGlow: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  detail: string;
  status: string;
  statusType: "active" | "distinction" | "completed";
  cgpa?: string;
  description: string;
  coursework: string[];
  highlights: string[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  skills: string[];
}

export interface LanguageItem {
  name: string;
  proficiency: string;
  reading: string;
  writing: string;
  speaking: string;
  scorePercent: number;
  useCase: string;
}

export const personalInfo = {
  name: "Sakib Sardar",
  shortName: "Sakib",
  title: "Full-Stack Developer (Django / React.js / Shopify / CMS)",
  roles: [
    "Full-Stack Web Architect (Django & React.js)",
    "Senior Executive / Team Leader (Shopify & CMS)",
    "Shopify Theme & Custom App Developer",
    "CMS Developer (WordPress, Wix & Shopify)",
    "REST API & Database Systems Integrator",
  ],
  bio: "Full-Stack Developer with 2+ years of experience in Django, React.js, JavaScript, and modern web development. Skilled in developing responsive web applications, REST APIs, backend services, and user-friendly frontend interfaces. Experienced in Shopify, WordPress, and Wix development with 1.5 years of CMS experience, along with 1 year of experience as a Senior Shopify Executive and Shopify App Developer.",
  extendedBio:
    "Full-Stack Developer with 2+ years of experience in Django, React.js, JavaScript, and modern web development. Skilled in developing responsive web applications, REST APIs, backend services, and user-friendly frontend interfaces. Experienced in Shopify, WordPress, and Wix development with 1.5 years of CMS experience, along with 1 year of experience as a Senior Shopify Executive and Shopify App Developer. Strong expertise in API integration, Shopify development, CMS customization, troubleshooting, and delivering scalable, high-quality web solutions.",
  email: "sakibsardar.official@gmail.com",
  phone: "01572710013",
  phoneDisplay: "01572710013",
  whatsappUrl:
    "https://wa.me/8801572710013?text=Hi%20Sakib,%20I%20would%20like%20to%20discuss%20a%20project!",
  location: "219, East Rampura, Dhaka, Bangladesh",
  timezone: "GMT+6 (Dhaka Standard Time)",
  availability: "Available for Full-Time Roles & High-Impact Contracts",
  github: "https://github.com/sakibsardar",
  linkedin: "https://linkedin.com/in/sakibsardar",
  avatarUrl: "",
  customProfilePhotoDataUri: "",
  customProfilePhotoFileName: "",
  brandInitials: "SS",
  brandSubtitle: "FULL-STACK & SHOPIFY LEAD",
  brandLogoUrl: "",
  brandOnlineStatus: true,
};

export const keyMetrics: Metric[] = [
  {
    value: "2+",
    suffix: "Years",
    label: "Full-Stack Experience",
    subtext: "Django, React & CMS",
  },
  {
    value: "20+",
    suffix: "Projects",
    label: "Production Deliveries",
    subtext: "On-schedule execution",
  },
  {
    value: "10+",
    suffix: "Stores",
    label: "Shopify Themes & Apps",
    subtext: "High-converting storefronts",
  },
  {
    value: "99.8%",
    suffix: "Rate",
    label: "Client Satisfaction",
    subtext: "Clean code & fast delivery",
  },
];

export const services: Service[] = [
  {
    id: "full-stack",
    title: "Full-Stack Web Development",
    tagline: "Django + React.js Architecture",
    description:
      "Architecting high-scale web platforms featuring secure Python/Django backends and reactive modern React user interfaces, complete with role-based auth, ORM modeling, and cloud deployments.",
    color: "emerald",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    businessValue:
      "Provides enterprise-ready reliability, high security, and scalable infrastructure capable of handling growing user traffic seamlessly.",
    deliverables: [
      "Custom ERP & Business SaaS Platforms",
      "Scalable RESTful API Architectures (DRF)",
      "Interactive React State & Single Page Apps",
      "PostgreSQL / SQLite Database Engineering",
      "Role-Based Access Control (RBAC) & Security",
    ],
    technologies: [
      "Django",
      "Python",
      "React.js",
      "Django REST Framework",
      "PostgreSQL",
      "Tailwind CSS",
    ],
  },
  {
    id: "shopify",
    title: "Shopify Ecosystem Engineering",
    tagline: "Themes, Custom Apps & Liquid",
    description:
      "Engineering bespoke Shopify themes from scratch using clean Liquid templates, developing custom apps via Shopify App CLI & Admin API, and optimizing checkout flows for peak conversions.",
    color: "sky",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=1200&auto=format&fit=crop",
    businessValue:
      "Transforms standard e-commerce shops into frictionless, fast-loading shopping engines that dramatically reduce cart abandonment.",
    deliverables: [
      "Bespoke Liquid Theme Architecture",
      "Custom Shopify App CLI & Admin API",
      "Instant AJAX Slide-out Cart & Upsell Engine",
      "Store Migration, Data Sync & Webhooks",
      "Third-Party App & ERP Integrations",
    ],
    technologies: [
      "Shopify Liquid",
      "Theme Kit",
      "Shopify App CLI",
      "Storefront API",
      "JavaScript",
      "GraphQL",
    ],
  },
  {
    id: "cms-headless",
    title: "CMS & Headless Engineering",
    tagline: "WordPress & Wix Studio",
    description:
      "Crafting tailor-made WordPress themes, WooCommerce stores, and responsive Wix Studio dynamic architectures with custom fields, optimized editorial pipelines, and blazing CDN speed.",
    color: "purple",
    imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop",
    businessValue:
      "Empowers marketing and content teams to update websites effortlessly without developer intervention while keeping code bulletproof.",
    deliverables: [
      "WordPress Custom Themes & Custom Post Types",
      "WooCommerce E-Commerce Funnel Engineering",
      "Wix Studio Responsive Breakpoints & CMS",
      "Advanced Custom Fields (ACF) & Gutenberg Blocks",
      "Speed Optimization & Multi-Layer Caching",
    ],
    technologies: ["WordPress", "PHP", "WooCommerce", "Wix Studio", "Velo", "JavaScript"],
  },
  {
    id: "api-automation",
    title: "API Engineering & Automation",
    tagline: "Seamless Third-Party Bridges",
    description:
      "Connecting disparate web ecosystems through resilient REST APIs, webhook automation, payment gateways (Stripe, bKash, SSLCommerz), and real-time inventory synchronization.",
    color: "amber",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    businessValue:
      "Eliminates manual data entry and automates business workflows, reducing human error and saving hundreds of operational hours.",
    deliverables: [
      "Payment Gateway Integrations (Global & Local)",
      "Real-time Webhook Listeners & Event Handlers",
      "Inventory & Order Automation Across Channels",
      "Postman Verified API Specifications & Testing",
    ],
    technologies: [
      "Django REST Framework",
      "Node.js",
      "Webhooks",
      "Postman",
      "Stripe API",
      "SSLCommerz",
    ],
  },
  {
    id: "performance",
    title: "Speed & Core Web Vitals Optimization",
    tagline: "Sub-Second Load Times",
    description:
      "Conducting deep code audits, eliminating render-blocking scripts, lazy-loading media, optimizing database queries, and consistently hitting 90+ Google PageSpeed scores.",
    color: "emerald",
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop",
    businessValue:
      "Directly improves Google search rankings, decreases bounce rates, and lifts overall e-commerce conversion rates.",
    deliverables: [
      "90+ Google Lighthouse Benchmarks",
      "JavaScript & CSS Bundle Minification",
      "Shopify Liquid & Asset Pipeline Refactoring",
      "Mobile-First Rendering & Critical CSS Extraction",
    ],
    technologies: [
      "Google PageSpeed",
      "Lighthouse",
      "Web Vitals",
      "Asset Bundling",
      "CDN Edge Caching",
    ],
  },
  {
    id: "ui-ux",
    title: "Modern UI/UX Frontend Engineering",
    tagline: "Tailwind CSS & Webflow Aesthetics",
    description:
      "Translating modern Figma and Webflow design concepts into accessible, responsive web interfaces loaded with silky micro-interactions, clean typography, and balanced negative space.",
    color: "sky",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    businessValue:
      "Elevates brand perception, builds visitor trust, and delivers an intuitive, delightful user experience across desktop and mobile.",
    deliverables: [
      "Pixel-Perfect Responsive Layouts",
      "Design Systems Built on Tailwind CSS",
      "Accessible Semantic Markup & WCAG Compliance",
      "Polished Micro-Interactions & Transitions",
    ],
    technologies: ["React.js", "Tailwind CSS", "Sora Font", "Motion / Animations", "Figma to Code"],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend Engineering",
    color: "from-emerald-500/20 to-teal-500/5",
    accent: "text-emerald-500",
    highlight: "Interactive, accessible, and fast reactive user interfaces",
    skills: [
      {
        name: "React.js",
        level: "Advanced",
        experience: "2+ Years",
        description: "Hooks, Context, State Management, SPAs",
      },
      {
        name: "JavaScript (ES6+)",
        level: "Advanced",
        experience: "2.5+ Years",
        description: "Async/Await, DOM manipulation, ES Modules",
      },
      {
        name: "Tailwind CSS",
        level: "Advanced",
        experience: "2+ Years",
        description: "Modern utility-first styling & design tokens",
      },
      {
        name: "HTML5 & Semantic Web",
        level: "Expert",
        experience: "3+ Years",
        description: "Accessibility (a11y), SEO-optimized markup",
      },
      {
        name: "CSS3 & Modern Animations",
        level: "Expert",
        experience: "3+ Years",
        description: "Flexbox, Grid, keyframes, transitions",
      },
      {
        name: "Responsive UI Architecture",
        level: "Expert",
        experience: "2.5+ Years",
        description: "Mobile-first layouts across all viewports",
      },
    ],
  },
  {
    id: "backend",
    name: "Backend & Systems",
    color: "from-sky-500/20 to-blue-500/5",
    accent: "text-sky-500",
    highlight: "Secure, structured, and scalable server-side applications",
    skills: [
      {
        name: "Python",
        level: "Advanced",
        experience: "2+ Years",
        description: "OOP, script automation, data structures",
      },
      {
        name: "Django Framework",
        level: "Advanced",
        experience: "2+ Years",
        description: "MVT pattern, ORM, authentication, middleware",
      },
      {
        name: "Django REST Framework (DRF)",
        level: "Advanced",
        experience: "2+ Years",
        description: "Serializers, ViewSets, API authentication",
      },
      {
        name: "RESTful API Design",
        level: "Advanced",
        experience: "2+ Years",
        description: "Clean endpoint naming, error handling, status codes",
      },
      {
        name: "PostgreSQL & SQLite",
        level: "Proficient",
        experience: "2+ Years",
        description: "Relational modeling, migrations, query optimization",
      },
      {
        name: "Authentication & Role Security",
        level: "Proficient",
        experience: "2+ Years",
        description: "JWT, Session auth, RBAC permissions",
      },
    ],
  },
  {
    id: "shopify-cms",
    name: "Shopify & CMS Ecosystem",
    color: "from-teal-500/20 to-cyan-500/5",
    accent: "text-teal-400",
    highlight: "Commercial e-commerce setups and rapid CMS deployments",
    skills: [
      {
        name: "Shopify Liquid",
        level: "Expert",
        experience: "1.5+ Years",
        description: "Custom theme sections, schema, AJAX cart",
      },
      {
        name: "Shopify App Development",
        level: "Advanced",
        experience: "1+ Year",
        description: "Shopify CLI, Admin REST/GraphQL APIs, webhooks",
      },
      {
        name: "Shopify Theme Customization",
        level: "Expert",
        experience: "1.5+ Years",
        description: "Design translation, checkout tweaks, speed boosts",
      },
      {
        name: "WordPress & WooCommerce",
        level: "Advanced",
        experience: "2+ Years",
        description: "Theme dev, plugin integration, product funnels",
      },
      {
        name: "Wix & Wix Studio",
        level: "Advanced",
        experience: "1.5+ Years",
        description: "Fluid breakpoints, custom CMS collections, Velo",
      },
      {
        name: "Headless CMS Patterns",
        level: "Proficient",
        experience: "1+ Year",
        description: "Decoupled frontend connected to CMS backends",
      },
    ],
  },
  {
    id: "tools",
    name: "Workflow & Engineering Tools",
    color: "from-purple-500/20 to-indigo-500/5",
    accent: "text-purple-400",
    highlight: "Collaboration, testing, deployment, and performance tooling",
    skills: [
      {
        name: "Git & GitHub Version Control",
        level: "Advanced",
        experience: "2.5+ Years",
        description: "Branching workflows, PR reviews, merge management",
      },
      {
        name: "Postman API Testing",
        level: "Advanced",
        experience: "2+ Years",
        description: "Automated test suites, environments, mocking",
      },
      {
        name: "Vercel / Cloud Deployment",
        level: "Proficient",
        experience: "1.5+ Years",
        description: "CI/CD pipelines, environment configuration",
      },
      {
        name: "SEO & Core Web Vitals",
        level: "Advanced",
        experience: "2+ Years",
        description: "Lighthouse optimization, schema markup, tags",
      },
      {
        name: "Agile Project Coordination",
        level: "Advanced",
        experience: "1.5+ Years",
        description: "Sprint planning, Jira/Trello, team code reviews",
      },
      {
        name: "Troubleshooting & Debugging",
        level: "Expert",
        experience: "3+ Years",
        description: "Browser DevTools, server logs, network profiling",
      },
    ],
  },
];

export const experiences: Experience[] = [
  {
    id: "scaleup-lead",
    title: "Senior Executive / Team Leader — Shopify & CMS",
    company: "ScaleUP Ads Agency",
    period: "June 2025 – Present",
    location: "Dhaka, Bangladesh",
    type: "Full-Time Leadership",
    badge: "Current Leadership Role",
    badgeColor: "emerald",
    cardClass: "card-glow-emerald",
    titleGradient:
      "bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-300 dark:via-teal-200 dark:to-cyan-300",
    roleSummary:
      "Head of the Shopify and CMS engineering unit, driving technical architecture, sprint allocations, and direct consultations with global e-commerce brand owners.",
    highlights: [
      "Manage end-to-end Shopify and CMS service operations, handling international client communications, technical scoping, and quality delivery.",
      "Lead, mentor, and coordinate a team of Shopify & web developers, assigning sprints and reviewing code for optimal performance.",
      "Architect and code custom Shopify Liquid themes, private apps, and specialized client integrations.",
      "Spearhead ongoing R&D on emerging Shopify APIs, headless setups, and high-converting checkout extensions.",
      "Troubleshoot complex technical blockers and implement speed optimizations yielding +35% to +50% PageSpeed improvements.",
    ],
    techs: [
      "Shopify Liquid",
      "Shopify App CLI",
      "Theme Kit",
      "JavaScript (ES6+)",
      "REST API",
      "Team Leadership",
      "Client Management",
    ],
    achievements: [
      "Mentored a team of 4 junior developers to autonomous sprint delivery",
      "Delivered 10+ high-traffic Shopify stores without a single launch downtime",
      "Boosted average store PageSpeed scores by 40+ points across client portfolio",
    ],
  },
  {
    id: "scaleup-dev",
    title: "Web Developer (CMS)",
    company: "ScaleUP Ads Agency",
    period: "January 2025 – June 2025",
    location: "Dhaka, Bangladesh",
    type: "Full-Time",
    badge: "CMS & E-Commerce",
    badgeColor: "sky",
    cardClass: "card-glow-sky",
    titleGradient:
      "bg-gradient-to-r from-sky-600 via-blue-500 to-teal-600 dark:from-sky-300 dark:via-blue-200 dark:to-teal-300",
    roleSummary:
      "Delivered bespoke multi-platform websites, engineered responsive frontend layouts, and customized complex CMS workflows for retail and B2B clients.",
    highlights: [
      "Engineered, customized, and maintained 15+ websites utilizing WordPress, WooCommerce, Wix Studio, and Shopify.",
      "Designed pixel-perfect responsive layouts tailored for high conversion rates and cross-browser consistency.",
      "Authored custom CSS, PHP snippets, and JavaScript hooks for bespoke client features and smooth interactions.",
      "Diagnosed and resolved critical client bugs, third-party plugin conflicts, and server configuration issues.",
    ],
    techs: [
      "WordPress",
      "WooCommerce",
      "Wix Studio",
      "Shopify",
      "PHP",
      "Custom CSS",
      "Responsive Design",
    ],
    achievements: [
      "Single-handedly maintained 15+ live client platforms with 99.9% uptime",
      "Pioneered responsive Wix Studio components adopted agency-wide",
    ],
  },
  {
    id: "universe-it",
    title: "Jr. Full-Stack Developer",
    company: "Universe IT",
    period: "July 2024 – January 2025",
    location: "Dhaka, Bangladesh",
    type: "Full-Time",
    badge: "Full-Stack & ERP",
    badgeColor: "purple",
    cardClass: "card-glow-purple",
    titleGradient:
      "bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 dark:from-purple-300 dark:via-indigo-200 dark:to-blue-300",
    roleSummary:
      "Contributed core modules to an enterprise-grade ERP system, integrating robust Django REST backends with responsive React frontend views.",
    highlights: [
      "Developed and maintained enterprise ERP software modules utilizing Django, Django REST Framework, and React.js.",
      "Built clean, responsive frontend client interfaces connected seamlessly to backend RESTful microservices.",
      "Engineered automated database queries, role-based authorization rules, and CSV/PDF reporting tools.",
      "Collaborated with senior engineers using Git workflows, pull requests, and iterative sprint testing.",
    ],
    techs: [
      "Django",
      "Python",
      "React.js",
      "Django REST Framework",
      "PostgreSQL",
      "Tailwind CSS",
      "Git",
    ],
    achievements: [
      "Refactored complex database queries, slashing invoice generation latency by 35%",
      "Engineered automated PDF export microservice for financial reports",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "erp-platform",
    title: "Enterprise ERP Management Platform",
    category: "Full-Stack",
    badge: "Full-Stack Web App",
    description:
      "Full-featured ERP portal built with Django and React for inventory control, automated invoice generation, role-based staff authorization, and real-time operational analytics.",
    longDescription:
      "An enterprise-grade software system engineered to unify multi-warehouse inventory control, automated ledger accounting, employee role permissions, and executive analytics into a synchronized web portal.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    challenge:
      "Legacy manual spreadsheets caused stock discrepancies, duplicated invoices, and slow financial reconciliation.",
    solution:
      "Engineered a scalable Django REST Framework backend paired with a reactive React frontend and automated PostgreSQL triggers.",
    impact: "+40% efficiency in inventory tracking and financial reporting",
    metrics: ["40% faster reporting", "100% audit accuracy", "Sub-second API response"],
    tech: ["Django", "Python", "React.js", "DRF", "PostgreSQL", "Tailwind CSS"],
    cardGlow: "card-glow-emerald",
    liveUrl: "https://sakib-sardar-portfolio.vercel.app",
    githubUrl: "https://github.com/Mhlove143/Sakib-Sardar-port-bolio-with-datbase",
  },
  {
    id: "luxecraft-shopify",
    title: "LuxeCraft Custom Shopify Theme",
    category: "Shopify",
    badge: "Shopify E-Commerce",
    description:
      "Bespoke Shopify storefront designed from scratch using modern Liquid architecture, instant slide-out AJAX cart, multi-currency localization, and dynamic product bundle upsells.",
    longDescription:
      "A high-converting direct-to-consumer storefront engineered from ground zero without bloated third-party page builders, achieving sub-second mobile page loads.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    challenge:
      "Previous off-the-shelf theme was sluggish (PageSpeed score of 41) with high drop-off rates on mobile checkout.",
    solution:
      "Wrote custom Liquid sections with pure CSS animations, lightweight JavaScript for AJAX cart, and optimized media assets.",
    impact: "Achieved 96+ Google PageSpeed mobile score & +32% conversion rate",
    metrics: ["96+ PageSpeed Score", "+32% conversions", "1.2s average load time"],
    tech: ["Shopify Liquid", "JavaScript", "Tailwind CSS", "Shopify Storefront API"],
    cardGlow: "card-glow-sky",
    liveUrl: "https://shopify.com",
    githubUrl: "https://github.com/Mhlove143",
  },
  {
    id: "nexus-saas",
    title: "Nexus Task & Workflow SaaS",
    category: "SaaS",
    badge: "Full-Stack SaaS",
    description:
      "Collaborative project management dashboard featuring kanban workflows, webhook notifications, team member activity feeds, and secure RESTful endpoint integration.",
    longDescription:
      "A modern task management platform enabling agile engineering teams to organize sprints, assign milestones, and receive real-time notifications.",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    challenge:
      "Existing tools were either overly bloated or lacked custom webhook integration with client ticketing systems.",
    solution:
      "Created a modular architecture with Django REST Framework endpoints and a sleek React drag-and-drop kanban board.",
    impact: "Zero-latency real-time state updates with clean modular architecture",
    metrics: ["Zero-latency updates", "Modular component design", "Role-based controls"],
    tech: ["Python", "Django", "React.js", "REST APIs", "SQLite", "Tailwind CSS"],
    cardGlow: "card-glow-purple",
    liveUrl: "https://sakib-sardar-portfolio.vercel.app",
    githubUrl: "https://github.com/Mhlove143/Sakib-Sardar-port-bolio-with-datbase",
  },
  {
    id: "shopify-inventory-sync",
    title: "Automated Shopify Inventory Sync App",
    category: "Shopify",
    badge: "Shopify App Development",
    description:
      "Custom Shopify app that listens to inventory webhook events, synchronizes cross-channel stock levels across multiple fulfillment locations, and prevents overselling.",
    longDescription:
      "A private Shopify application that continuously syncs stock between local retail POS systems and Shopify online inventories in real time.",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    challenge:
      "Retail store was constantly overselling products online while physical in-store purchases were taking place.",
    solution:
      "Developed an event-driven webhook listener using Shopify Admin API that auto-adjusts stock variants within 500 milliseconds of any transaction.",
    impact: "Automated 1,000+ daily SKU inventory updates without human intervention",
    metrics: ["1,000+ daily SKU syncs", "0 oversell incidents", "<500ms webhook execution"],
    tech: ["Node.js / Python", "Shopify Admin API", "Webhooks", "GraphQL"],
    cardGlow: "card-glow-amber",
    liveUrl: "https://shopify.dev",
    githubUrl: "https://github.com/Mhlove143",
  },
  {
    id: "corporate-brand-cms",
    title: "Corporate Brand CMS & Commerce Portal",
    category: "CMS",
    badge: "CMS & WordPress",
    description:
      "Customized multi-page WordPress architecture with advanced custom fields, custom Gutenberg blocks, WooCommerce integration, and multi-layered speed caching.",
    longDescription:
      "A high-traffic corporate portal delivering marketing campaigns and digital product sales with strict security and high editorial flexibility.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    challenge:
      "Marketing team struggled with complex code edits whenever new promotional landing pages were scheduled.",
    solution:
      "Engineered bespoke ACF flexible content layouts and Gutenberg blocks allowing drag-and-drop page assembly.",
    impact: "Sub-second load times across global CDNs and 100% mobile accessibility",
    metrics: ["Sub-second global TTFB", "100% WCAG mobile compliance", "Zero-downtime migrations"],
    tech: ["WordPress", "PHP", "WooCommerce", "Advanced Custom Fields", "SEO"],
    cardGlow: "card-glow-emerald",
    liveUrl: "https://wordpress.org",
    githubUrl: "https://github.com/Mhlove143",
  },
  {
    id: "wix-studio-agency",
    title: "Wix Studio Dynamic Agency Showcase",
    category: "CMS",
    badge: "CMS & Wix Studio",
    description:
      "High-impact agency portfolio featuring custom typography, fluid viewport breakpoints, magnetic button interactions, and custom CMS data collections.",
    longDescription:
      "A sleek portfolio designed to win high-ticket brand clients through fluid animations, responsive typography, and automated inquiry capture.",
    imageUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1200&auto=format&fit=crop",
    challenge: "Standard agency templates felt generic and failed to convert enterprise leads.",
    solution:
      "Engineered fluid CSS breakpoints and custom Velo/JavaScript logic for bespoke interactive showcases.",
    impact: "Seamless client onboarding flow with automated inquiry capture",
    metrics: [
      "+45% client inquiries",
      "Fluid across all mobile screens",
      "Automated CRM lead flow",
    ],
    tech: ["Wix Studio", "Velo / JavaScript", "Custom CMS", "Responsive Design"],
    cardGlow: "card-glow-sky",
    liveUrl: "https://wix.com",
    githubUrl: "https://github.com/Mhlove143",
  },
];

export const educationList: EducationItem[] = [
  {
    degree: "Bachelor of Science (BSc), Computer Science & Engineering",
    institution: "Uttara University",
    location: "Dhaka, Bangladesh",
    period: "2024 – Present (Expected 2025)",
    detail: "In Progress · Senior Year",
    status: "Active Student",
    statusType: "active",
    description:
      "Pursuing a specialized degree focusing on Software Engineering, Advanced System Architecture, Algorithm Design, and Relational Database Engineering. Applying theoretical concepts directly to enterprise client software.",
    coursework: [
      "Data Structures & Algorithms",
      "Database Management Systems (PostgreSQL / MySQL)",
      "Object-Oriented Programming (Python, Java)",
      "Software Engineering & Architecture Design",
      "Computer Networks & Protocols",
      "Operating Systems & Distributed Architecture",
      "Web Systems & Cloud Application Development",
      "Software Testing & Quality Assurance",
    ],
    highlights: [
      "Capstone Project: Enterprise Resource Planning Platform with Django & React",
      "Recognized by Faculty for Excellence in Database Systems & Algorithms",
      "Active participant in University Tech Sprints & Coding Hackathons",
    ],
  },
  {
    degree: "Diploma in Computer Science & Engineering (CSE)",
    institution: "AMDA Institute of Engineering & Technology",
    location: "Dhaka, Bangladesh",
    period: "2020 – 2024",
    detail: "CGPA 3.85 / 4.00 · Graduated with Distinction",
    status: "Distinction — Top 5%",
    statusType: "distinction",
    cgpa: "3.85 / 4.00",
    description:
      "Completed a rigorous 4-year technical engineering diploma accredited by the Bangladesh Technical Education Board (BTEB), mastering foundational computing, hardware interfacing, full-stack programming, and networking.",
    coursework: [
      "Advanced Web Development (Frontend & Backend)",
      "Relational Database Design & SQL",
      "Python & C Programming",
      "Computer Networking & Server Administration",
      "Data Communication Systems",
      "Microprocessor & Embedded Systems",
      "System Analysis & Project Management",
    ],
    highlights: [
      "Graduated with Distinction, ranking in the Top 5% of the graduating class",
      "Led student project team to develop automated stock and billing software",
      "Mentored peers in JavaScript, Python, and Linux server deployment",
    ],
  },
  {
    degree: "Secondary School Certificate (SSC) - Commerce",
    institution: "East Rampura High School",
    location: "Dhaka, Bangladesh",
    period: "Completed 2019",
    detail: "GPA 3.89 / 5.00 · Commerce Division",
    status: "Completed",
    statusType: "completed",
    cgpa: "3.89 / 5.00",
    description:
      "Secondary education focusing on Business Studies, Mathematics, Information & Communication Technology (ICT), and English.",
    coursework: [
      "Information & Communication Technology (ICT)",
      "Business Mathematics",
      "Accounting & Finance",
      "General Science & English",
    ],
    highlights: [
      "Achieved GPA 3.89 / 5.00 in the Board Examinations",
      "Built initial web projects sparking passion for software development",
    ],
  },
];

export const certifications: CertificationItem[] = [
  {
    title: "Django & Python Full-Stack Software Engineering",
    issuer: "Universe IT & Industry Program",
    date: "2024",
    skills: ["Django", "Django REST Framework", "Python", "PostgreSQL", "React Integration"],
  },
  {
    title: "Shopify Liquid & Theme Engineering Certification",
    issuer: "Shopify Partner Academy",
    date: "2024",
    skills: ["Shopify Liquid", "Storefront API", "AJAX Cart", "Theme Kit", "CLI 3.0"],
  },
  {
    title: "Modern React.js & Single Page Application Architecture",
    issuer: "Advanced Web Engineering Program",
    date: "2024",
    skills: ["React Hooks", "Context API", "Component Architecture", "Tailwind CSS", "Vite"],
  },
  {
    title: "Core Web Vitals & Website Performance Masterclass",
    issuer: "Web Performance Guild",
    date: "2025",
    skills: [
      "Lighthouse Optimization",
      "Critical Rendering Path",
      "Asset Minification",
      "CDN Strategy",
    ],
  },
];

export const languages: LanguageItem[] = [
  {
    name: "English",
    proficiency: "Professional Working Proficiency",
    reading: "Advanced (Fluent)",
    writing: "Professional (High)",
    speaking: "Fluent Working",
    scorePercent: 92,
    useCase:
      "Daily technical consultations, international client requirement scoping, agile daily standups, code reviews, and comprehensive architectural documentation.",
  },
  {
    name: "Bengali",
    proficiency: "Native / Mother Tongue",
    reading: "Native",
    writing: "Native",
    speaking: "Native",
    scorePercent: 100,
    useCase: "Native command across technical, academic, and business contexts.",
  },
  {
    name: "Hindi / Urdu",
    proficiency: "Working Verbal Understanding",
    reading: "Basic",
    writing: "Basic",
    speaking: "Conversational",
    scorePercent: 78,
    useCase:
      "Seamless verbal communications with South Asian cross-border clients and engineering collaborators.",
  },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Education", href: "/education" },
  { label: "Contact", href: "/contact" },
];
