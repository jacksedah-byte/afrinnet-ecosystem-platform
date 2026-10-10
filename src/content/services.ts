/**
 * Core services and the detail content behind each service page.
 *
 * `status` distinguishes services that are open now from workflows still being
 * established, so the site never presents a planned system as operational.
 */
import {
  Handshake,
  Lightbulb,
  Network,
  Search,
  ShieldCheck,
  Sprout,
  type LucideIcon,
} from "lucide-react";

export type ServiceStatus = "available" | "developing";

export interface ServiceCardData {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export const coreServices: ServiceCardData[] = [
  {
    title: "Innovation Discovery",
    description: "Identify and document emerging ideas, inventions and solutions.",
    href: "/ecosystem/discovery",
    icon: Search,
  },
  {
    title: "IP Support",
    description: "Help innovators understand protection options and access appropriate support.",
    href: "/ip",
    icon: ShieldCheck,
  },
  {
    title: "Registration & Verification",
    description: "Structured submission, review and verification workflows for the network.",
    href: "/ecosystem/verification",
    icon: Lightbulb,
  },
  {
    title: "Institutional Networks",
    description: "Connect schools, universities, TVETs and research institutions.",
    href: "/ecosystem/networks",
    icon: Network,
  },
  {
    title: "Incubation & Readiness",
    description: "Support innovation assessment, development and pathways to scale.",
    href: "/ecosystem/incubation",
    icon: Sprout,
  },
  {
    title: "Partnerships & Opportunities",
    description: "Build connections across public, academic, research and private sectors.",
    href: "/partnerships",
    icon: Handshake,
  },
];

/** The five-step innovation journey used on the homepage and ecosystem pages. */
export const journeySteps: { number: string; title: string; text: string }[] = [
  {
    number: "01",
    title: "Discover",
    text: "An innovation or institutional need is identified.",
  },
  {
    number: "02",
    title: "Submit",
    text: "Relevant information is provided through the appropriate channel.",
  },
  {
    number: "03",
    title: "Review",
    text: "Submissions undergo the relevant eligibility, completeness or verification process.",
  },
  {
    number: "04",
    title: "Connect",
    text: "Suitable IP support, institutional expertise or development pathways are identified.",
  },
  {
    number: "05",
    title: "Advance",
    text: "The innovation can progress towards protection, development, collaboration or commercialisation where appropriate.",
  },
];

export interface ServicePageData {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  status: ServiceStatus;
  statusNote: string;
  intro: string[];
  offerings: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  suitableFor: string[];
  expectations: string[];
  faqs: { q: string; a: string }[];
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export const servicePages: Record<string, ServicePageData> = {
  discovery: {
    slug: "discovery",
    eyebrow: "Innovation Ecosystem",
    title: "Innovation Discovery & Registration",
    summary:
      "Making emerging African ideas visible, documented and ready to be connected with support.",
    status: "available",
    statusNote:
      "Open now: innovation submissions are accepted through this website. Verification workflows are being developed alongside them.",
    intro: [
      "Innovation rarely announces itself. Ideas sit in university laboratories, TVET workshops, startup garages and school science projects without being documented, connected or considered by the institutions that could support them.",
      "AFRINNET's discovery work gives innovators and institutions a structured way to present an innovation, describe its development stage and indicate the support it needs — so that promising work can be identified early and connected to the right expertise.",
    ],
    offerings: [
      {
        title: "Structured submission",
        text: "A guided form that captures a non-confidential description, development stage, institutional affiliation and support needs.",
      },
      {
        title: "Eligibility and completeness review",
        text: "Submissions are checked for completeness and routed to the appropriate review pathway before any next step is discussed.",
      },
      {
        title: "Documentation and records",
        text: "Accepted records are maintained with controlled access. Public disclosure only happens with the innovator's explicit consent.",
      },
      {
        title: "Connection to support",
        text: "Where appropriate, innovations are connected to IP support, institutional expertise or development pathways.",
      },
    ],
    steps: [
      { title: "Prepare a non-confidential summary", text: "Describe what the innovation does, not how it works in detail." },
      { title: "Submit through the guided form", text: "Provide contact details, stage, affiliation and support needs." },
      { title: "Completeness review", text: "AFRINNET checks the submission and may request clarification." },
      { title: "Routing decision", text: "Suitable submissions are routed to IP, institutional or incubation pathways." },
    ],
    suitableFor: [
      "Individual innovators and research teams",
      "Universities and research organisations documenting output",
      "TVET institutions and schools with student innovations",
      "Startups and enterprises with new solutions",
    ],
    expectations: [
      "Submission does not automatically qualify an innovation for registration, funding or commercialisation.",
      "Submission to AFRINNET does not create or establish intellectual property rights.",
      "Do not include confidential technical detail that is not necessary to describe the innovation.",
    ],
    faqs: [
      {
        q: "Does submitting an innovation protect my intellectual property?",
        a: "No. Submission is a way to describe your innovation and request support. It does not grant rights, establish priority or substitute for registration with the relevant authorities. Consult a qualified IP professional for advice on protection.",
      },
      {
        q: "Will my innovation be published?",
        a: "No. Records are kept with controlled access. Any public listing or disclosure requires your explicit consent.",
      },
      {
        q: "Who can submit?",
        a: "Innovators, research teams, institutions and enterprises can submit. Submissions from students should be made with the knowledge of their school or institution where appropriate.",
      },
    ],
    cta: { label: "Submit an innovation", href: "/submit" },
    secondaryCta: { label: "Explore IP support", href: "/ip" },
  },

  verification: {
    slug: "verification",
    eyebrow: "Innovation Ecosystem",
    title: "Innovation Verification",
    summary:
      "Structured review processes that give network records credibility without over-claiming what they mean.",
    status: "developing",
    statusNote:
      "In development: verification workflows are being established. Submissions are currently acknowledged and reviewed for completeness only.",
    intro: [
      "A registry is only useful if the records inside it mean something. AFRINNET is developing a verification process that reviews submissions for completeness, consistency and stated affiliation — so that partners reading a record understand exactly what has and has not been checked.",
      "Verification status is always described precisely. A verified record confirms what AFRINNET reviewed; it is not an endorsement, an award, a certification of technical merit or a legal determination of ownership.",
    ],
    offerings: [
      {
        title: "Completeness checks",
        text: "Confirming that required fields, declarations and non-confidential descriptions are present and coherent.",
      },
      {
        title: "Affiliation confirmation",
        text: "Where an institution is stated, checking that the affiliation is genuine before the record reflects it.",
      },
      {
        title: "Clear verification labels",
        text: "Records display exactly what was reviewed and when, with no implied endorsement beyond that review.",
      },
      {
        title: "Controlled disclosure",
        text: "Only fields approved for public display are visible externally; the remainder stay internal.",
      },
    ],
    steps: [
      { title: "Submission received", text: "The record enters the review queue with its consent settings." },
      { title: "Completeness review", text: "AFRINNET checks fields, declarations and supporting references." },
      { title: "Clarification where needed", text: "The submitter may be asked to confirm or complete information." },
      { title: "Verification status applied", text: "The record is labelled with exactly what was reviewed." },
    ],
    suitableFor: [
      "Innovators who want their submission reviewed before sharing it with partners",
      "Institutions documenting innovation activity within their network",
      "Programmes that need consistent record standards across submissions",
    ],
    expectations: [
      "Verification is not an endorsement, certification of merit or legal determination.",
      "Verification does not grant intellectual property rights.",
      "The process and its labels will evolve as the workflow is formalised.",
    ],
    faqs: [
      {
        q: "Is a verified record an official certification?",
        a: "No. It confirms that AFRINNET reviewed specific fields of the record. It does not certify technical merit, commercial viability or ownership rights.",
      },
      {
        q: "How long does verification take?",
        a: "Timelines are being finalised as the workflow is established. Applicants receive an acknowledgement with expectations at submission.",
      },
    ],
    cta: { label: "Submit an innovation", href: "/submit" },
    secondaryCta: { label: "See how the journey works", href: "/#journey" },
  },

  networks: {
    slug: "networks",
    eyebrow: "Innovation Ecosystem",
    title: "Institutional Networks",
    summary:
      "Connecting schools, universities, TVET institutions and research organisations into a working innovation network.",
    status: "available",
    statusNote: "Open now: institutional partnership enquiries are accepted through the website.",
    intro: [
      "Institutions are where most African innovation begins — in teaching laboratories, research groups, technical workshops and student projects. AFRINNET's institutional network work connects these settings so that good practice, opportunities and emerging solutions can travel between them.",
      "The network is being built relationship by relationship. AFRINNET does not claim a continental footprint that has not been established; participating institutions are listed only once their involvement is confirmed.",
    ],
    offerings: [
      {
        title: "Institutional mapping",
        text: "Understanding where innovation activity, capability and support needs sit within an institution or region.",
      },
      {
        title: "Shared standards",
        text: "Common submission, documentation and record practices that make collaboration between institutions easier.",
      },
      {
        title: "Opportunity channels",
        text: "Announcements of programmes, challenges, events and partnerships routed to the institutions they concern.",
      },
      {
        title: "Referral pathways",
        text: "Connecting institutions to IP support, research collaboration and development partners where relevant.",
      },
    ],
    steps: [
      { title: "Institutional enquiry", text: "An institution describes its context and objectives." },
      { title: "Discussion", text: "AFRINNET and the institution identify where interests overlap." },
      { title: "Engagement agreement", text: "Scope, responsibilities and expectations are set out clearly." },
      { title: "Ongoing connection", text: "The institution participates in network activity and opportunities." },
    ],
    suitableFor: [
      "Universities and research organisations",
      "TVET institutions and technical training centres",
      "Secondary schools with innovation or science programmes",
      "Government bodies responsible for innovation and skills",
    ],
    expectations: [
      "Participation is agreed case by case and does not imply endorsement by any body.",
      "Institution listings are published only with confirmed consent.",
    ],
    faqs: [
      {
        q: "Is there a membership fee?",
        a: "Engagement terms vary by partnership type and are discussed directly. No fee structure is published at this stage.",
      },
      {
        q: "Can a school join the network?",
        a: "Yes. Schools and student innovators are a core part of the ecosystem. Start through the schools engagement page or the contact form.",
      },
    ],
    cta: { label: "Become an institutional partner", href: "/partnerships" },
    secondaryCta: { label: "Contact AFRINNET", href: "/contact" },
  },

  incubation: {
    slug: "incubation",
    eyebrow: "Innovation Ecosystem",
    title: "Incubation & Innovation Readiness",
    summary:
      "Assessing where an innovation actually stands, and what it needs before it can progress responsibly.",
    status: "developing",
    statusNote:
      "In development: readiness assessment tools and incubation pathways are being designed. Requests for guidance are accepted now.",
    intro: [
      "Ideas rarely fail for lack of ambition. They stall because nobody assessed what stage they were at, what evidence existed, or what support was genuinely needed next.",
      "AFRINNET is developing a readiness assessment that looks at an innovation's development stage, documentation, protection awareness and pathway options — and produces an honest picture of the next sensible step, rather than a promise of funding or scale.",
    ],
    offerings: [
      {
        title: "Readiness assessment",
        text: "A structured review of development stage, evidence, documentation and protection awareness.",
      },
      {
        title: "Development planning",
        text: "Identifying the practical next steps: prototyping, testing, documentation, protection or partnership.",
      },
      {
        title: "Pathway connections",
        text: "Introductions to incubators, research partners, technical expertise or funding channels where appropriate.",
      },
      {
        title: "Programme participation",
        text: "Challenges, clinics and capacity-development sessions as they are announced.",
      },
    ],
    steps: [
      { title: "Describe the innovation", text: "A non-confidential summary and current stage." },
      { title: "Readiness review", text: "AFRINNET examines stage, documentation and support needs." },
      { title: "Next-step plan", text: "A short set of realistic, prioritised actions." },
      { title: "Connection", text: "Referral to suitable support, expertise or programmes." },
    ],
    suitableFor: [
      "Innovators with a working concept, prototype or early solution",
      "Research teams considering translation of their work",
      "Enterprises developing new products or processes",
    ],
    expectations: [
      "Assessment output is guidance, not a guarantee of funding, incubation placement or commercial success.",
      "Programme availability depends on confirmed partnerships and funding.",
    ],
    faqs: [
      {
        q: "Does AFRINNET fund innovations?",
        a: "AFRINNET is not a funding body at this stage. Where funding channels exist, AFRINNET may connect suitable innovators to them; no funding outcome is promised.",
      },
      {
        q: "Is every submitted innovation accepted into incubation?",
        a: "No. Admission depends on stage, fit and available capacity. Submission is the start of a review, not an acceptance.",
      },
    ],
    cta: { label: "Request guidance", href: "/contact?type=support" },
    secondaryCta: { label: "Submit an innovation", href: "/submit" },
  },
};
