export type HomepageCustomSection = {
  id: string;
  title: string;
  introduction: string;
  body: string;
};

export const homepageContent = {
  sectionOrder: [
    "hero",
    "mandate",
    "services",
    "journey",
    "ecosystem",
    "leadership",
    "panAfrica",
    "ip",
    "knowledge",
    "partnership",
  ],
  hiddenSections: [] as string[],
  customSections: [] as HomepageCustomSection[],
  hero: {
    eyebrow: "African Innovation Network",
    titleLead: "Connecting African Innovation to",
    titleHighlight: "Protection",
    titleTail: ", Opportunity and Impact.",
    description:
      "AFRINNET Foundation works to strengthen Africa's innovation ecosystem by connecting innovators and institutions with the knowledge, intellectual property support, partnerships and pathways they need to develop and advance their ideas.",
    heroImageUrl: "",
    actions: [
      { label: "Explore Our Services", href: "/ecosystem" },
      { label: "Register an Innovation", href: "/submit" },
      { label: "Partner with AFRINNET", href: "/partnerships" },
    ],
    assurances: [
      "Non-confidential by design",
      "Consent before any disclosure",
      "Individuals and institutions",
    ],
    principles: [
      "Discover innovation",
      "Protect intellectual property",
      "Build innovation ecosystems",
      "Enable African solutions to scale",
    ],
  },
  journey: {
    eyebrow: "How AFRINNET works",
    title: "A clear journey from discovery to advancement",
    description:
      "Every innovation moves at its own pace. The journey describes the steps involved — not a promise of outcomes.",
    calloutTitle: "What submission means",
    callout:
      "Submission starts a review — it does not automatically qualify an innovation for registration, funding or commercialisation, and it does not itself establish intellectual property rights. Where an innovation progresses, it does so because the relevant review and connections support it.",
  },
  ecosystem: {
    eyebrow: "The institutional ecosystem",
    title: "One network, six constituencies",
    description:
      "AFRINNET connects the institutions and actors that make innovation ecosystems function — each with its own engagement route.",
    note:
      "Each category links to a dedicated page describing the value, engagement opportunities and next steps for that audience. Connections shown are illustrative of how the network is designed — not a statement of established coverage.",
  },
  panAfrica: {
    eyebrow: "Our pan-African vision",
    title: "Building Connections Across Africa",
    description:
      "AFRINNET's ambition is to connect innovation ecosystems across the continent — region by region, institution by institution.",
    calloutTitle: "On data and coverage",
    callout:
      "We do not publish institutional locations, coverage figures or a pan-African footprint that has not been established. This map shows the regions AFRINNET is working to connect; verified institutions, programmes and innovation stories will appear as they are confirmed.",
  },
  partnership: {
    eyebrow: "Partnership",
    titleLead: "Stronger innovation ecosystems are built",
    titleHighlight: "together",
    titleTail: ".",
    routes: [
      {
        label: "For Institutions",
        text: "Universities, TVETs, schools, research bodies and public institutions — explore institutional engagement.",
        cta: "Explore institutional engagement",
        href: "/partnerships",
      },
      {
        label: "For Innovators",
        text: "Submit an innovation or ask for guidance on intellectual property and readiness.",
        cta: "Submit an innovation",
        href: "/submit",
      },
      {
        label: "For Partners",
        text: "Development partners, funders and intermediaries — discuss collaboration with AFRINNET.",
        cta: "Discuss collaboration",
        href: "/contact?type=partnership",
      },
    ],
  },
};
