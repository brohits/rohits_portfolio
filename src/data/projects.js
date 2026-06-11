/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} title
 * @property {string} mock
 * @property {string} [image]
 * @property {string} [video]
 * @property {string} description
 * @property {string[]} tags
 * @property {string} href
 * @property {{ caseStudy?: string, figma?: string }} [links]
 * @property {{ value: string, label: string, detail: string }[]} [impacts]
 */

/** @type {Project[]} */
export const projects = [
  {
    id: "medoc",
    title: "MeDoc",
    mock: "video",
    video: "/projects/medoc-thumbnail.mp4?v=2",
    description:
      "Unified healthcare mobile app — find doctors, book appointments, order medicines, and schedule lab tests in one place.",
    tags: ["May 2026"],
    links: {
      caseStudy: "https://me-doc-case-study-2yg8.vercel.app/",
      figma:
        "https://www.figma.com/design/hNBzZSUPg8wU9JNl7wxiAZ/Doctor-Appointment-and-Medicine-Order?node-id=0-1",
    },
    href: "https://me-doc-case-study-2yg8.vercel.app/",
    impacts: [
      {
        value: "89%",
        label: "Task success rate",
        detail: "Up from 71% in moderated usability tests",
      },
      {
        value: "50s",
        label: "Booking time",
        detail: "Appointment flow cut from ~2 min across 7 screens",
      },
    ],
  },
  {
    id: "gyanconnect",
    title: "GyanConnect",
    mock: "video",
    video: "/projects/gyanconnect-thumbnail.mp4",
    description:
      "Mobile app connecting students with mentors through personalized matching, messaging, and campus events.",
    tags: ["Mar 2026"],
    links: {
      caseStudy: "https://gyan-sagar-connect.vercel.app/",
      figma:
        "https://www.figma.com/design/UPaCmC5xcEgEV2320cgDoN/Untitled?node-id=0-1",
    },
    href: "https://gyan-sagar-connect.vercel.app/",
    impacts: [
      {
        value: "+24%",
        label: "Profile completion",
        detail: "Onboarding redesigned with progressive disclosure",
      },
      {
        value: "−40%",
        label: "Time to first match",
        detail: "Mentor discovery streamlined from 6 taps to 2",
      },
    ],
  },
  {
    id: "truepay",
    title: "True Pay",
    mock: "video",
    video: "/projects/truepay-thumbnail.mp4",
    description:
      "Landing page for a financial management app — clean layout showcasing multi-currency control across platforms.",
    tags: ["Jan 2026"],
    links: {
      figma:
        "https://www.figma.com/design/je54szR9XnHk8fdn2PmuoK/TruePay-Landing-Page?node-id=0-1",
    },
    href:
      "https://www.figma.com/design/je54szR9XnHk8fdn2PmuoK/TruePay-Landing-Page?node-id=0-1",
    impacts: [
      {
        value: "+18%",
        label: "Signup intent",
        detail: "Clearer hero hierarchy and pricing in prototype tests",
      },
      {
        value: "4.3/5",
        label: "Clarity score",
        detail: "Multi-currency value prop understood faster by users",
      },
    ],
  },
];

/** @type {Project[]} */
export const moreProjects = [
  {
    id: "smart-oms",
    title: "Smart OMS",
    mock: "image",
    image: "/projects/SmartOMS.png",
    description:
      "Mobile order management system for tracking pending orders, processing updates and returns, adding products with barcode scanning, and raising support tickets — a full UI flow across 35+ screens in a clean blue-and-white interface.",
    tags: ["Sep 2025"],
    links: {
      figma:
        "https://www.figma.com/design/JUt72ZheOA1aF7UCpaRRDI/Untitled?node-id=0-1",
    },
    href: "https://www.figma.com/design/JUt72ZheOA1aF7UCpaRRDI/Untitled?node-id=0-1",
    impacts: [
      {
        value: "−38%",
        label: "Processing time",
        detail: "Order updates reduced from 9 screens to 4",
      },
      {
        value: "−42%",
        label: "Manual entry errors",
        detail: "Barcode scan flow for product add and returns",
      },
    ],
  },
  {
    id: "atloc",
    title: "Atloc",
    mock: "image",
    image: "/projects/AtLoc.png",
    description:
      "Atloc — company attendance app for clocking in and out, tracking work hours, and managing employee presence. Designed for simple daily use with clear status views and a cohesive mobile experience.",
    tags: ["Aug 2025"],
    links: {
      figma:
        "https://www.figma.com/design/NeDNC35WmLJpLcw2S2cKXu/Atloc-UX-design?node-id=0-1",
    },
    href: "https://www.figma.com/design/NeDNC35WmLJpLcw2S2cKXu/Atloc-UX-design?node-id=0-1",
    impacts: [
      {
        value: "12s",
        label: "Avg. check-in",
        detail: "Clock-in flow simplified from 5 taps to 2",
      },
      {
        value: "−28%",
        label: "Support queries",
        detail: "Clearer attendance status and history views",
      },
    ],
  },
  {
    id: "ai-email-copilot",
    title: "AI Email Copilot",
    mock: "image",
    image: "/projects/aicopilot%20email.png",
    description:
      "AI email assistant built into the inbox — a listening copilot sidebar suggests replies as you write, generates full email drafts, and extracts action items with due dates and priority from threads so follow-ups never get lost.",
    tags: ["Jun 2025"],
    links: {
      figma:
        "https://www.figma.com/design/rivN0p9As5DRohBSjMLtbt/Untitled?node-id=0-1",
    },
    href: "https://www.figma.com/design/rivN0p9As5DRohBSjMLtbt/Untitled?node-id=0-1",
    impacts: [
      {
        value: "90s",
        label: "Draft time",
        detail: "AI copilot cut average reply drafting from 4 min",
      },
      {
        value: "+34%",
        label: "Follow-up completion",
        detail: "Auto-extracted action items with due dates",
      },
    ],
  },
  {
    id: "lanos",
    title: "Lanos — an edtech platform",
    mock: "image",
    image: "/projects/lanos.png?v=2",
    description:
      "Edtech landing page for live, gamified coding classes — hero and feature sections for live instruction, gamified learning, and career support, plus pricing plans, mentor profiles, student reviews, and FAQ.",
    tags: ["Apr 2025"],
    links: {
      figma:
        "https://www.figma.com/design/mjHeaWcwHzh9dK1sgJ3wxz/Untitled?node-id=0-1",
    },
    href: "https://www.figma.com/design/mjHeaWcwHzh9dK1sgJ3wxz/Untitled?node-id=0-1",
    impacts: [
      {
        value: "+21%",
        label: "Trial signups",
        detail: "Pricing and mentor proof moved above the fold",
      },
      {
        value: "11s",
        label: "Time to pricing",
        detail: "IA rework cut discovery time from 38 seconds",
      },
    ],
  },
];

export const allProjects = [...projects, ...moreProjects];
