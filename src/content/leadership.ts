/**
 * Leadership, governance and institutional structure content.
 *
 * Source of truth: the supplied Founder's Statement and Board & Leadership
 * deck. Profiles marked as drafts or pending must not be presented as
 * confirmed appointments. No names, photographs, credentials or quotations may
 * be invented — placeholders stay placeholders until approved.
 */

export interface PortraitSlot {
  initials: string;
  status: "awaiting-approval";
  note: string;
}

export interface PersonProfile {
  slug: string;
  name: string;
  title: string;
  shortBio: string;
  fullBio: string[];
  responsibilities: string[];
  portrait: PortraitSlot;
  approvalStatus: string;
}

export const founder: PersonProfile = {
  slug: "founder",
  name: "Samson Ngengi Njuguna",
  title: "Founder, AFRINNET Foundation",
  shortBio:
    "Samson Ngengi Njuguna is the Founder of AFRINNET Foundation. His professional experience in geospatial intelligence and innovation, together with deeply personal experiences involving the ownership and recognition of intellectual work, shaped his determination to build stronger systems for African innovators.",
  fullBio: [
    "Samson Ngengi Njuguna is the Founder of AFRINNET Foundation. His professional experience in geospatial intelligence and innovation, together with deeply personal experiences involving the ownership and recognition of intellectual work, shaped his determination to build stronger systems for African innovators.",
    "Over two decades of work in geospatial intelligence, he has focused on transforming complex spatial information and fragmented records into reliable systems. His experience developing GEOCRIS, an innovation using satellite data and geospatial intelligence, and the subsequent legal struggle over its ownership reinforced his commitment to creator recognition and intellectual property protection.",
    "AFRINNET was established around this conviction: African innovators need systems that help them discover, protect and advance their ideas. His founding philosophy, the Human Blueprint, places human dignity, creator ownership and the responsible use of technology at the centre of innovation.",
  ],
  responsibilities: [
    "Founding vision and institutional direction",
    "The Human Blueprint philosophy underpinning AFRINNET's work",
    "Advocacy for creator recognition and intellectual property awareness",
    "Stewardship of AFRINNET's founding principles as the organisation develops",
  ],
  portrait: {
    initials: "SN",
    status: "awaiting-approval",
    note: "Professional portrait slot — replace with the founder's approved photograph.",
  },
  approvalStatus:
    "Editorial status: draft biography derived from the supplied Founder's Statement, pending the Founder's approval before publication.",
};

export const executiveLead: PersonProfile = {
  slug: "executive",
  name: "Jack Sedah",
  title: "Executive Lead, AFRINNET Foundation",
  shortBio:
    "Jack Sedah serves as Executive Lead of AFRINNET Foundation, leading the organisation's day-to-day operations, institutional development and the implementation of its strategic priorities.",
  fullBio: [
    "Jack Sedah serves as Executive Lead of AFRINNET Foundation, leading day-to-day operations, institutional development and the implementation of the foundation's strategic priorities.",
    "His work focuses on translating AFRINNET's vision into practical systems, programmes and institutional processes. Working alongside the Founder and the wider leadership team, he helps advance organisational strategy, digital infrastructure and the operational frameworks needed to connect innovation discovery, intellectual property support and institutional collaboration.",
    "His role centres on turning AFRINNET's institutional roadmap into practical action and helping build the systems required to support African innovators.",
  ],
  responsibilities: [
    "Day-to-day leadership of the foundation",
    "Institutional development and operational frameworks",
    "Strategy execution and programme coordination",
    "Digital infrastructure advancement",
    "Partnership building across institutions and sectors",
  ],
  portrait: {
    initials: "JS",
    status: "awaiting-approval",
    note: "Professional portrait slot — replace with Jack's approved photograph.",
  },
  approvalStatus:
    "Editorial status: draft biography derived from the supplied leadership deck, pending approval before publication.",
};

export interface PortfolioRole {
  code: string;
  title: string;
  status: string;
  note: string;
}

/** Board portfolios identified in the leadership deck. No names until confirmed. */
export const boardPortfolios: PortfolioRole[] = [
  {
    code: "01",
    title: "Board Chair",
    status: "Appointment pending",
    note: "Governance leadership of the Board of Directors. Profile to be confirmed.",
  },
  {
    code: "02",
    title: "Director, Finance & Audit",
    status: "Appointment pending",
    note: "Oversight of financial stewardship, audit and accountability. Profile to be confirmed.",
  },
  {
    code: "03",
    title: "Director, Academic Partnerships",
    status: "Appointment pending",
    note: "Oversight of relationships with universities, research organisations and education institutions. Profile to be confirmed.",
  },
  {
    code: "04",
    title: "Director, Intellectual Property",
    status: "Appointment pending",
    note: "Oversight of intellectual property strategy, ethics and support pathways. Profile to be confirmed.",
  },
];

export interface ManagementRole {
  code: string;
  title: string;
  status: "appointed" | "recruiting";
  name?: string;
  summary: string;
  responsibilities: string[];
  portrait: PortraitSlot;
}

/** Management Committee roles identified in the leadership deck. */
export const managementRoles: ManagementRole[] = [
  {
    code: "01",
    title: "Executive Lead",
    status: "appointed",
    name: "Jack Sedah",
    summary:
      "Leads day-to-day operations, institutional development and implementation of strategic priorities.",
    responsibilities: [
      "Operational leadership and coordination",
      "Strategy execution and reporting",
      "Institutional development",
    ],
    portrait: {
      initials: "JS",
      status: "awaiting-approval",
      note: "Professional portrait slot — replace with Jack's approved photograph.",
    },
  },
  {
    code: "02",
    title: "Monitoring, Evaluation & Learning Lead",
    status: "recruiting",
    summary:
      "Responsible for measurement frameworks, evidence and organisational learning across AFRINNET's programmes.",
    responsibilities: [
      "Monitoring and evaluation frameworks",
      "Reporting and evidence standards",
      "Learning and adaptation",
    ],
    portrait: {
      initials: "—",
      status: "awaiting-approval",
      note: "Role holder to be appointed. Portrait and biography to follow confirmation.",
    },
  },
  {
    code: "03",
    title: "Programmes Lead",
    status: "recruiting",
    summary:
      "Responsible for the design and delivery of AFRINNET's programmes, challenges and capacity development activities.",
    responsibilities: [
      "Programme design and delivery",
      "Participant and institution support",
      "Schedule, quality and risk management",
    ],
    portrait: {
      initials: "—",
      status: "awaiting-approval",
      note: "Role holder to be appointed. Portrait and biography to follow confirmation.",
    },
  },
  {
    code: "04",
    title: "Partnerships Lead",
    status: "recruiting",
    summary:
      "Responsible for institutional relationships across government, academia, industry and development partners.",
    responsibilities: [
      "Institutional partnership development",
      "Agreement and engagement coordination",
      "Opportunity identification",
    ],
    portrait: {
      initials: "—",
      status: "awaiting-approval",
      note: "Role holder to be appointed. Portrait and biography to follow confirmation.",
    },
  },
  {
    code: "05",
    title: "Communications Lead",
    status: "recruiting",
    summary:
      "Responsible for public communication, publications and the accuracy of AFRINNET's public messaging.",
    responsibilities: [
      "Public communications and media",
      "Publications and knowledge products",
      "Brand and message consistency",
    ],
    portrait: {
      initials: "—",
      status: "awaiting-approval",
      note: "Role holder to be appointed. Portrait and biography to follow confirmation.",
    },
  },
];

export const boardIntro = {
  title: "The Board of Directors",
  paragraphs: [
    "AFRINNET's Board is the foundation's governance body. It is being formally constituted, and the governance portfolios below describe the intended composition of the Board.",
    "Profiles shown here are structural placeholders. No appointments have been published, and no names or photographs are displayed for these roles until appointments are confirmed and approved for public release.",
  ],
};

export const managementIntro = {
  title: "The Management Committee",
  paragraphs: [
    "The Management Committee is AFRINNET's functional leadership team, responsible for delivering the foundation's programmes and operations under the Executive Lead.",
    "The Executive Lead's profile is published below. The remaining functional roles are being recruited through 2026, and are shown as appointment-pending until their holders are confirmed.",
  ],
};

export const governance = {
  title: "Governance & Institutional Structure",
  lede:
    "A clear separation between governance and executive management — presented so that partners, funders and institutions can see how AFRINNET is led.",
  levels: [
    {
      label: "Governance",
      nodes: [
        {
          title: "Board of Directors",
          note: "Governance body — being constituted",
          detail:
            "Provides oversight, stewardship and accountability. Intended portfolios: Board Chair, Finance & Audit, Academic Partnerships, Intellectual Property.",
          tone: "navy" as const,
        },
      ],
    },
    {
      label: "Executive management",
      nodes: [
        {
          title: "Founder — Samson Ngengi Njuguna",
          note: "Vision, philosophy and institutional direction",
          detail:
            "Sets the founding philosophy — the Human Blueprint — and stewards AFRINNET's purpose. This diagram does not attribute a statutory board role to the Founder.",
          tone: "green" as const,
        },
        {
          title: "Executive Lead — Jack Sedah",
          note: "Day-to-day management",
          detail:
            "Heads day-to-day management, working with the Founder and the wider leadership team in accordance with AFRINNET's approved governance arrangements.",
          tone: "green" as const,
        },
      ],
    },
    {
      label: "Functional leadership",
      nodes: [
        {
          title: "Monitoring, Evaluation & Learning",
          note: "Recruitment in progress",
          detail: "Functional role within the Management Committee.",
          tone: "muted" as const,
        },
        {
          title: "Programmes",
          note: "Recruitment in progress",
          detail: "Functional role within the Management Committee.",
          tone: "muted" as const,
        },
        {
          title: "Partnerships",
          note: "Recruitment in progress",
          detail: "Functional role within the Management Committee.",
          tone: "muted" as const,
        },
        {
          title: "Communications",
          note: "Recruitment in progress",
          detail: "Functional role within the Management Committee.",
          tone: "muted" as const,
        },
      ],
    },
  ],
  caption:
    "Indicative structure based on the supplied leadership deck. Titles, reporting lines and membership can be updated as appointments are confirmed; the diagram does not imply that illustrative roles have been filled.",
};

export const leadershipOverview = {
  eyebrow: "Leadership & Governance",
  title: "The People and Principles Behind AFRINNET",
  lede:
    "Transparent, accountable leadership structures establish confidence among governments, universities, research institutions, funders, development partners and innovators.",
  purpose: [
    "AFRINNET distinguishes clearly between its Founder, its Executive Lead, the Board of Directors and the Management Committee. These are different roles with different responsibilities, and the website presents them separately for that reason.",
    "The foundation is developing its institutional structures in public: confirmed leadership is presented professionally, and positions still being filled are shown as such — never as fictional people or invented appointments.",
  ],
};
