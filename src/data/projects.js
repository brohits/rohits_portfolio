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
 */

const assets = "https://rohitportfolio-khaki.vercel.app/assets";

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
  },
];

export const allProjects = [...projects, ...moreProjects];
