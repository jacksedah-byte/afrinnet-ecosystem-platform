/** Stakeholder / audience engagement pages — one dedicated landing page per group. */

export interface AudienceData {
  slug: string;
  eyebrow: string;
  title: string;
  lede: string;
  value: { title: string; text: string }[];
  engagement: string[];
  nextSteps: string[];
  note?: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export const audiences: Record<string, AudienceData> = {
  government: {
    slug: "government",
    eyebrow: "Institutions & Partnerships",
    title: "Government & Public Institutions",
    lede:
      "A formal, policy-ready interface for ministries, agencies and public bodies working on innovation, skills and industrial development.",
    value: [
      {
        title: "Innovation ecosystem development",
        text: "Support for the practical work of connecting institutions, programmes and innovators within a national or regional system.",
      },
      {
        title: "Institutional innovation mapping",
        text: "Structured approaches to understanding where innovation activity sits, what capability exists and where the gaps are.",
      },
      {
        title: "Evidence for policy",
        text: "Access to AFRINNET's knowledge work on discovery, IP readiness and institutional networks as it is published.",
      },
      {
        title: "Partnership frameworks",
        text: "Defined engagement routes for joint programmes, capacity development and institutional cooperation.",
      },
    ],
    engagement: [
      "Institutional innovation mapping and assessment",
      "Ecosystem development programmes with universities, TVETs and research bodies",
      "Joint policy notes, concept notes and briefing material (once approved for circulation)",
      "Capacity development sessions on innovation management and IP awareness",
    ],
    nextSteps: [
      "Send an institutional enquiry through the contact form, selecting “Government & institutional partnership”",
      "Include the institution, the policy or programme context and the outcome you are working toward",
      "AFRINNET will respond with the appropriate contact and any relevant material",
    ],
    note:
      "AFRINNET does not represent government endorsement, and publishes policy documents only once approved for public circulation.",
    cta: { label: "Make an institutional enquiry", href: "/contact?type=government" },
    secondaryCta: { label: "Read about AFRINNET", href: "/about" },
  },

  universities: {
    slug: "universities",
    eyebrow: "Institutions & Partnerships",
    title: "Universities & Research Organisations",
    lede:
      "Turning research output into visible, documented and — where appropriate — protected and connected innovation.",
    value: [
      {
        title: "Discovery of emerging work",
        text: "A structured route for research teams to document innovations and indicate the support they need.",
      },
      {
        title: "IP awareness for researchers",
        text: "Guidance on disclosure, ownership and protection options before publication or partnership discussions.",
      },
      {
        title: "Technology transfer connections",
        text: "Pathways that link research groups with industry, incubators and development partners where relevant.",
      },
      {
        title: "Student and institutional visibility",
        text: "Recognition of innovation activity across faculties and institutions within the AFRINNET network.",
      },
    ],
    engagement: [
      "Faculty or institution-level submission channels for research innovations",
      "IP clinics and readiness sessions for research teams",
      "Joint documentation of institutional innovation activity",
      "Collaboration on challenges, programmes and ecosystem events",
    ],
    nextSteps: [
      "Contact AFRINNET with the institution and the unit you represent",
      "Identify a focal point for innovation or technology transfer",
      "Agree a first activity: an IP clinic, a submission drive or a mapping exercise",
    ],
    cta: { label: "Partner as an institution", href: "/partnerships" },
    secondaryCta: { label: "Explore IP services", href: "/ip" },
  },

  tvet: {
    slug: "tvet",
    eyebrow: "Institutions & Partnerships",
    title: "TVET Institutions",
    lede:
      "Technical and vocational training is where applied innovation happens — AFRINNET helps that work be seen, documented and developed.",
    value: [
      {
        title: "Practical IP awareness",
        text: "Plain-language guidance for trainers and learners on ownership, disclosure and protection of practical inventions.",
      },
      {
        title: "Documentation standards",
        text: "Simple structures for recording projects, prototypes and competitions so good work is not lost.",
      },
      {
        title: "Pathways for learner projects",
        text: "Connections to further development, incubation or institutional partners where a project warrants it.",
      },
      {
        title: "Network participation",
        text: "Opportunities to join challenges, showcases and institutional programmes as they are announced.",
      },
    ],
    engagement: [
      "Innovation documentation workshops for staff and learners",
      "IP readiness sessions attached to competitions or capstone projects",
      "Submission support for qualifying technical innovations",
      "Representation of TVET perspectives in ecosystem programmes",
    ],
    nextSteps: [
      "Reach out through the contact form selecting support for TVET institutions",
      "Describe your institution and the programmes where innovation appears",
      "Propose a first session or submission window",
    ],
    cta: { label: "Talk to AFRINNET", href: "/contact?type=institution" },
    secondaryCta: { label: "See the innovation journey", href: "/#journey" },
  },

  schools: {
    slug: "schools",
    eyebrow: "Institutions & Partnerships",
    title: "Schools & Student Innovators",
    lede:
      "Young innovators deserve to understand early that their ideas have value — and how to think about protecting them.",
    value: [
      {
        title: "Early IP awareness",
        text: "Age-appropriate guidance on what intellectual property means and why disclosure matters.",
      },
      {
        title: "Project documentation",
        text: "Help presenting science, technology and design projects in a structured, non-confidential way.",
      },
      {
        title: "Recognition pathways",
        text: "Routes for student innovations to be documented and, where relevant, connected to mentors or institutions.",
      },
      {
        title: "Institutional support",
        text: "Frameworks that schools and school networks can use to run innovation programmes responsibly.",
      },
    ],
    engagement: [
      "School-level innovation days with an IP awareness component",
      "Guidance for teachers supporting competition entries",
      "Documentation support for student projects selected for recognition",
      "Connections to universities, TVETs and mentors where appropriate",
    ],
    nextSteps: [
      "A teacher, guardian or institution should make contact on the student's behalf",
      "Describe the school, programme or competition involved",
      "Agree what support is appropriate and what permissions are needed",
    ],
    note:
      "Students under 18 should participate through their school or a responsible adult. AFRINNET does not collect personal data from children directly.",
    cta: { label: "Request support for a school", href: "/contact?type=support" },
    secondaryCta: { label: "Explore the Knowledge Centre", href: "/knowledge" },
  },

  startups: {
    slug: "startups",
    eyebrow: "Institutions & Partnerships",
    title: "Startups & Industry",
    lede:
      "For enterprises building new products and processes: understand your protection position before the market does it for you.",
    value: [
      {
        title: "IP readiness before scale",
        text: "A structured review of ownership, disclosure and protection options as you move toward market.",
      },
      {
        title: "Connection to institutions",
        text: "Access to university, research and TVET capability where collaboration makes sense.",
      },
      {
        title: "Ecosystem opportunities",
        text: "Visibility into programmes, challenges and partnership channels as they are confirmed.",
      },
      {
        title: "Documented innovation record",
        text: "A structured, non-confidential record of your innovation for partnership discussions — with your consent.",
      },
    ],
    engagement: [
      "IP readiness reviews for early-stage teams",
      "Introductions to research expertise and institutional partners",
      "Participation in ecosystem challenges and showcase programmes",
      "Industry perspectives in AFRINNET's ecosystem mapping work",
    ],
    nextSteps: [
      "Send an enquiry describing your sector, stage and what you need",
      "Indicate whether the priority is protection, partnerships or capability",
      "AFRINNET will respond with the most relevant route",
    ],
    cta: { label: "Request IP support", href: "/request-ip-support" },
    secondaryCta: { label: "Submit an innovation", href: "/submit" },
  },

  partners: {
    slug: "partners",
    eyebrow: "Institutions & Partnerships",
    title: "Development Partners, Funders & Intermediaries",
    lede:
      "Organisations investing in African innovation systems need credible local connections and honest reporting on what is being built.",
    value: [
      {
        title: "Ground-level ecosystem access",
        text: "Connections to universities, TVETs, schools, research bodies and innovators across the networks AFRINNET is building.",
      },
      {
        title: "Implementation partnership",
        text: "A collaborative partner for programmes spanning discovery, IP awareness, readiness and institutional capacity.",
      },
      {
        title: "Evidence and learning",
        text: "Afrinnet's published research, policy work and ecosystem insight as it becomes available.",
      },
      {
        title: "Transparent development",
        text: "Clear communication about which systems are operational and which are still being built.",
      },
    ],
    engagement: [
      "Programme design and co-implementation across the innovation journey",
      "Grant-funded IP support schemes — with eligibility and availability published openly",
      "Institutional capacity development and network building",
      "Research collaboration on ecosystem intelligence and mapping",
    ],
    nextSteps: [
      "Open a partnership conversation through the contact form",
      "Share your focus areas, geography and timeline",
      "Explore a scoping discussion with AFRINNET's leadership",
    ],
    note:
      "AFRINNET does not claim endorsements, funding awards or partnerships that have not been publicly confirmed.",
    cta: { label: "Discuss collaboration", href: "/contact?type=partnership" },
    secondaryCta: { label: "Read our strategy", href: "/about/mission-vision" },
  },
};

/** Six stakeholder categories shown in the ecosystem diagram (homepage). */
export const stakeholders: { label: string; href: string; short: string }[] = [
  { label: "Government and public institutions", href: "/engage/government", short: "Government" },
  { label: "Universities and research organisations", href: "/engage/universities", short: "Universities" },
  { label: "TVET institutions and technical training centres", href: "/engage/tvet", short: "TVETs" },
  { label: "Schools and student innovators", href: "/engage/schools", short: "Schools" },
  { label: "Startups, enterprises and industry", href: "/engage/startups", short: "Industry" },
  { label: "Development partners, funders and innovation intermediaries", href: "/engage/partners", short: "Partners" },
];

/** Regions used by the interactive continental map — geography only, no coverage claims. */
export const mapRegions: {
  id: string;
  label: string;
  x: number;
  y: number;
  blurb: string;
}[] = [
  {
    id: "north",
    label: "North Africa",
    x: 200.4,
    y: 102.5,
    blurb:
      "Regional connections are being explored with universities, research bodies and innovation support organisations.",
  },
  {
    id: "west",
    label: "West Africa",
    x: 95.7,
    y: 193.6,
    blurb:
      "Regional connections are being explored with universities, TVET institutions and public innovation agencies.",
  },
  {
    id: "central",
    label: "Central Africa",
    x: 223.5,
    y: 248.7,
    blurb:
      "Regional connections are being explored with technical institutions and research organisations.",
  },
  {
    id: "east",
    label: "East Africa",
    x: 322.2,
    y: 231.4,
    blurb:
      "Regional connections are being explored with universities, hubs and technology transfer networks.",
  },
  {
    id: "southern",
    label: "Southern Africa",
    x: 244.9,
    y: 386.9,
    blurb:
      "Regional connections are being explored with TVET institutions, universities and industry partners.",
  },
];
