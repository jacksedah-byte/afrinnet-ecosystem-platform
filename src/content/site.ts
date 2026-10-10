/**
 * Site-wide navigation, footer and institutional content.
 *
 * Everything here is structured so authorised staff can update labels, links and
 * announcements without touching components. Content avoids unverified claims:
 * no fabricated deadlines, partnerships, statistics or contact channels.
 */

export interface NavLink {
  label: string;
  href: string;
  blurb?: string;
}

export interface NavColumn {
  title?: string;
  links: NavLink[];
}

export interface NavGroup {
  label: string;
  href: string;
  columns: NavColumn[];
}

/** Slim strip above the header. Set `enabled: false` to hide it entirely. */
export const announcement = {
  enabled: true,
  text: "AFRINNET Foundation is establishing innovation discovery, IP support and institutional networks across Africa.",
  linkLabel: "Partner with us",
  href: "/partnerships",
};

export const navGroups: NavGroup[] = [
  {
    label: "About AFRINNET",
    href: "/about",
    columns: [
      {
        links: [
          { label: "Who we are", href: "/about", blurb: "Purpose, mandate and operating principles" },
          { label: "Mission, Vision & Strategy", href: "/about/mission-vision", blurb: "Where AFRINNET is heading" },
          { label: "Frequently asked questions", href: "/about#faq", blurb: "Straight answers about what we do" },
        ],
      },
    ],
  },
  {
    label: "Innovation Ecosystem",
    href: "/ecosystem",
    columns: [
      {
        title: "Services",
        links: [
          { label: "Ecosystem overview", href: "/ecosystem", blurb: "How the network fits together" },
          { label: "Discovery & Registration", href: "/ecosystem/discovery", blurb: "Identify and document emerging ideas" },
          { label: "Innovation Verification", href: "/ecosystem/verification", blurb: "Structured review and verification" },
          { label: "Institutional Networks", href: "/ecosystem/networks", blurb: "Schools, universities, TVETs and research" },
        ],
      },
      {
        title: "Development",
        links: [
          { label: "Incubation & Readiness", href: "/ecosystem/incubation", blurb: "Assessment and pathways to scale" },
          { label: "The innovation journey", href: "/#journey", blurb: "Discover → Submit → Review → Connect → Advance" },
        ],
      },
    ],
  },
  {
    label: "IP Support",
    href: "/ip",
    columns: [
      {
        title: "Protection types",
        links: [
          { label: "IP services overview", href: "/ip", blurb: "Information, support and referrals" },
          { label: "Patents & Inventions", href: "/ip/patents", blurb: "Protection for new technical solutions" },
          { label: "Trademarks", href: "/ip/trademarks", blurb: "Names, logos and brand identity" },
          { label: "Copyright", href: "/ip/copyright", blurb: "Eligible creative and written works" },
          { label: "Industrial Designs", href: "/ip/industrial-designs", blurb: "The appearance of products" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "IP Readiness & Support", href: "/ip/readiness", blurb: "Assess, plan and get referred" },
          { label: "Request IP Support", href: "/request-ip-support", blurb: "Ask for guidance or a referral" },
        ],
      },
    ],
  },
  {
    label: "Leadership & Governance",
    href: "/leadership",
    columns: [
      {
        links: [
          { label: "Leadership & Governance", href: "/leadership", blurb: "How AFRINNET is led and overseen" },
          { label: "Our Founder", href: "/leadership/founder", blurb: "Samson Ngengi Njuguna" },
          { label: "Executive Leadership", href: "/leadership/executive", blurb: "Jack Sedah, Executive Lead" },
        ],
      },
      {
        title: "Governance",
        links: [
          { label: "Board of Directors", href: "/leadership/board", blurb: "Governance portfolios — appointments pending" },
          { label: "Management Committee", href: "/leadership/management", blurb: "Functional leadership team" },
          { label: "Governance & Structure", href: "/leadership/governance", blurb: "Institutional structure diagram" },
        ],
      },
    ],
  },
  {
    label: "Knowledge Centre",
    href: "/knowledge",
    columns: [
      {
        links: [
          { label: "Knowledge Centre", href: "/knowledge", blurb: "Search publications, guides and toolkits" },
          { label: "Publications & Policy Briefs", href: "/knowledge/publications", blurb: "Research and policy output" },
          { label: "News & Events", href: "/news", blurb: "Announcements and programme updates" },
        ],
      },
    ],
  },
  {
    label: "Get Involved",
    href: "/submit",
    columns: [
      {
        title: "Take action",
        links: [
          { label: "Submit an Innovation", href: "/submit", blurb: "Guided, confidential-first submission" },
          { label: "Register an Institution", href: "/contact?type=institution", blurb: "Add your school, TVET, university or agency to the network" },
          { label: "Become an Institutional Partner", href: "/partnerships", blurb: "Partner with AFRINNET" },
          { label: "Request IP Support", href: "/request-ip-support", blurb: "Guidance, clinics and referrals" },
        ],
      },
      {
        title: "By institution type",
        links: [
          { label: "Government & Public Institutions", href: "/engage/government" },
          { label: "Universities & Research", href: "/engage/universities" },
          { label: "TVET Institutions", href: "/engage/tvet" },
          { label: "Schools & Student Innovators", href: "/engage/schools" },
          { label: "Startups & Industry", href: "/engage/startups" },
          { label: "Development Partners", href: "/engage/partners" },
        ],
      },
    ],
  },
];

export const navPlainLinks: NavLink[] = [
  { label: "News & Events", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export const primaryCta = { label: "Submit an Innovation", href: "/submit" };

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "About",
    links: [
      { label: "Who we are", href: "/about" },
      { label: "Mission, Vision & Strategy", href: "/about/mission-vision" },
      { label: "Leadership & Governance", href: "/leadership" },
      { label: "Innovation Ecosystem", href: "/ecosystem" },
      { label: "News & Events", href: "/news" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Discovery & Registration", href: "/ecosystem/discovery" },
      { label: "Innovation Verification", href: "/ecosystem/verification" },
      { label: "IP Support", href: "/ip" },
      { label: "Incubation & Readiness", href: "/ecosystem/incubation" },
      { label: "Institutional Networks", href: "/ecosystem/networks" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { label: "Submit an Innovation", href: "/submit" },
      { label: "Become an Institutional Partner", href: "/partnerships" },
      { label: "Request IP Support", href: "/request-ip-support" },
      { label: "Government & Institutional Engagement", href: "/engage/government" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Knowledge Centre", href: "/knowledge" },
      { label: "Publications & Policy Briefs", href: "/knowledge/publications" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Accessibility Statement", href: "/accessibility" },
    ],
  },
];

export const footerNotes = {
  social:
    "Official social media accounts will be linked here once verified. AFRINNET does not publish unconfirmed channels.",
  contact:
    "Verified postal and email contact details will be published here once confirmed. Until then, please use the enquiry form.",
  portal:
    "A secure member portal, innovation registry and institutional dashboard are planned for a later phase.",
};

/**
 * Recommended development phases — planning information, not a claim that
 * these systems already exist.
 */
export const roadmapPhases: { phase: string; title: string; deliverables: string[] }[] = [
  {
    phase: "Phase 1",
    title: "Public launch",
    deliverables: [
      "Responsive website, service pages and knowledge centre",
      "Contact and enquiry routing",
      "Innovation submission intake",
    ],
  },
  {
    phase: "Phase 2",
    title: "Innovation services",
    deliverables: [
      "Innovation submission workflow and secure records",
      "Review queues and applicant notifications",
    ],
  },
  {
    phase: "Phase 3",
    title: "Institutional network",
    deliverables: ["Institutional registration and profiles", "Partnership workflows and dashboards"],
  },
  {
    phase: "Phase 4",
    title: "Advanced ecosystem",
    deliverables: ["IP support tracking", "Incubation workflows", "Readiness assessment and programme management"],
  },
  {
    phase: "Phase 5",
    title: "Ecosystem intelligence",
    deliverables: [
      "Aggregated reporting",
      "Verified ecosystem mapping",
      "Carefully governed analytics",
    ],
  },
];

export const siteMeta = {
  name: "AFRINNET Foundation",
  fullName: "AFRINNET Foundation (African Foundation for Innovation Network)",
  tagline: "Connecting African Innovation to Protection, Opportunity and Impact.",
  principle:
    "Discover innovation. Protect intellectual property. Build innovation ecosystems. Enable African solutions to scale.",
  description:
    "AFRINNET Foundation works to strengthen Africa's innovation ecosystem by connecting innovators and institutions with the knowledge, intellectual property support, partnerships and pathways they need to develop and advance their ideas.",
};
