/**
 * "Why AFRINNET Exists" — long-form founder narrative.
 *
 * Derived strictly from the supplied Founder's Statement summary. It preserves
 * the founder's framing and key themes without inventing dialogue, dates,
 * events, quotations or biographical detail. Pull quotes are taken only from
 * text already approved for drafting. Requires the Founder's approval before
 * publication, particularly the personal and legal-history details.
 */

export const founderStoryMeta = {
  eyebrow: "Our Founder",
  title: "Why AFRINNET Exists",
  intro:
    "The story behind AFRINNET Foundation — a practitioner's experience of building systems for other people's information, and of what happens when recognition and ownership are lost.",
  editorialNote:
    "This narrative is based on the supplied Founder's Statement. It is presented as draft website copy: the Founder should approve the final text before publication, particularly the personal and legal-history details.",
};

export const founderStoryChapters: {
  number: string;
  title: string;
  paragraphs: string[];
  quote?: { text: string; attribution: string };
}[] = [
  {
    number: "01",
    title: "Working with complex information",
    paragraphs: [
      "Across two decades in geospatial intelligence, Samson Ngengi Njuguna focused on a single kind of problem: taking complex spatial information and fragmented records and turning them into systems people could rely on when making decisions.",
      "It is unglamorous, exacting work. Records have to be trustworthy before anyone will build on them. Over time, that professional concern — whether information can be depended on, and whether the people connected to it are recognised — stopped being only a technical question and became a personal one.",
    ],
  },
  {
    number: "02",
    title: "A concept in planetary propulsion",
    paragraphs: [
      "His younger brother developed a scientific concept concerning planetary propulsion and orbital efficiency — original work, worked out with care.",
      "Recognition and ownership of that work were lost. The consequences that followed were profound and personal, and they shaped the family's understanding of what is at stake when a creator has no system to stand on: not only an idea, but the person behind it.",
    ],
  },
  {
    number: "03",
    title: "GEOCRIS and the struggle over ownership",
    paragraphs: [
      "Samson went on to develop GEOCRIS, an innovation built on satellite data and geospatial intelligence — the kind of system that only works when its records and authorship are clear.",
      "What followed was a prolonged legal struggle over the ownership of that innovation. The details belong to the courts and to the record; what matters here is what it confirmed. Building the thing is only half the work. Without systems that recognise who created it, even a well-documented innovation can be contested away from its creator.",
    ],
  },
  {
    number: "04",
    title: "Why AFRINNET exists",
    paragraphs: [
      "AFRINNET emerged from these experiences, and from a deeply personal commitment: African innovators should have pathways to identify, protect and develop their ideas without losing ownership of what they create.",
      "Not a promise that the world is fair — a set of systems that make it harder for good work to go undocumented, unprotected and unrecognised. Discovery first, so the idea is visible. Protection next, so it cannot simply be taken. Then support to help it grow.",
    ],
    quote: {
      text: "African innovators need systems that help them discover, protect and advance their ideas.",
      attribution: "From the approved Founder's biography",
    },
  },
  {
    number: "05",
    title: "The Human Blueprint",
    paragraphs: [
      "AFRINNET's founding philosophy is the Human Blueprint: technology must serve humanity, and creators must be protected alongside their creations.",
      "It places three things at the centre of every system the foundation designs — human dignity, creator ownership, and the responsible use of technology. A registry that serves only itself, an AI system that erases authorship, a programme that extracts ideas without consent: each fails the test.",
      "The Human Blueprint is not decoration. It is the standard AFRINNET holds itself to when building the infrastructure it believes African innovation needs.",
    ],
    quote: {
      text: "Technology must serve humanity and creators must be protected alongside their creations.",
      attribution: "The Human Blueprint — founding philosophy",
    },
  },
  {
    number: "06",
    title: "Discover. Protect. Grow.",
    paragraphs: [
      "The sequence that follows from the founding experience is deliberately simple: discover the idea, protect it, and then help it grow.",
      "Everything AFRINNET does sits somewhere on that line — making innovation visible and documented, helping creators understand protection options and reach the right professionals, and connecting promising work to institutions, expertise and opportunity.",
      "It is a long-term undertaking. It begins with the systems being built today: a public platform, structured submissions, honest service descriptions, and institutional relationships formed one at a time.",
    ],
  },
];

export const founderClosing = {
  statement:
    "The work is to build the systems that were missing when they were needed most — so that the next creator does not have to fight for recognition alone.",
  attribution: "Closing statement — Founder, AFRINNET Foundation",
};

export const founderStoryLinks = [
  { label: "AFRINNET's mission & strategy", href: "/about/mission-vision" },
  { label: "Intellectual property services", href: "/ip" },
  { label: "The innovation ecosystem", href: "/ecosystem" },
];
