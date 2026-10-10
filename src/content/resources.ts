/**
 * Knowledge Centre records and news.
 *
 * No report, policy brief or event is presented as published unless it exists.
 * Live web resources link to real pages on this site; everything else carries
 * an explicit "Forthcoming" status with no invented publication date.
 */

export type ResourceType =
  | "Learning resource"
  | "IP guide"
  | "Toolkit"
  | "Policy brief"
  | "Report"
  | "Case study"
  | "Event proceedings";

export type ResourceStatus = "live" | "forthcoming";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  topic: string;
  status: ResourceStatus;
  /** Display label — never a fabricated publication date. */
  dateLabel: string;
  summary: string;
  href?: string;
  featured?: boolean;
}

export const resourceTopics = [
  "Intellectual property",
  "Innovation policy",
  "Ecosystem development",
  "Institutional practice",
  "Student innovation",
];

export const resources: Resource[] = [
  {
    id: "ip-primer",
    title: "Patents, trademarks, copyright and industrial designs — a plain-language guide",
    type: "IP guide",
    topic: "Intellectual property",
    status: "live",
    dateLabel: "Web guide · living resource",
    summary:
      "What each form of protection actually covers, the considerations that shape eligibility, and the practical next steps before you speak to a professional.",
    href: "/ip",
    featured: true,
  },
  {
    id: "readiness-guide",
    title: "IP readiness: what to establish before you file anything",
    type: "Learning resource",
    topic: "Intellectual property",
    status: "live",
    dateLabel: "Web guide · living resource",
    summary:
      "Disclosure history, ownership, evidence and market priorities — the four questions that determine whether a protection plan is realistic.",
    href: "/ip/readiness",
  },
  {
    id: "journey-guide",
    title: "The innovation journey: discover, submit, review, connect, advance",
    type: "Learning resource",
    topic: "Ecosystem development",
    status: "live",
    dateLabel: "Web guide · living resource",
    summary:
      "How AFRINNET's five-step journey works, what each stage involves, and what submission does — and does not — lead to.",
    href: "/ecosystem",
  },
  {
    id: "submission-checklist",
    title: "Preparing an innovation submission: a non-confidential checklist",
    type: "Toolkit",
    topic: "Institutional practice",
    status: "live",
    dateLabel: "Web toolkit · living resource",
    summary:
      "The information a submission needs, the detail that should stay out of it, and how to describe your innovation without disclosing it.",
    href: "/submit",
  },
  {
    id: "policy-brief-1",
    title: "Connecting national innovation systems to institutional networks",
    type: "Policy brief",
    topic: "Innovation policy",
    status: "forthcoming",
    dateLabel: "Publication date to be confirmed",
    summary:
      "A policy brief on how universities, TVET institutions and public agencies can be connected into functioning innovation networks.",
  },
  {
    id: "readiness-framework",
    title: "An innovation readiness assessment framework for African ecosystems",
    type: "Report",
    topic: "Ecosystem development",
    status: "forthcoming",
    dateLabel: "Publication date to be confirmed",
    summary:
      "The methodology behind AFRINNET's readiness assessment work, including stage definitions, evidence expectations and referral criteria.",
  },
  {
    id: "ecosystem-mapping",
    title: "Mapping innovation ecosystems: approach, ethics and governance",
    type: "Report",
    topic: "Ecosystem development",
    status: "forthcoming",
    dateLabel: "Publication date to be confirmed",
    summary:
      "How institutional and innovation data should be collected, verified, governed and published without overstating coverage.",
  },
  {
    id: "tvet-case-study",
    title: "TVET institutions as entry points for applied innovation",
    type: "Case study",
    topic: "Institutional practice",
    status: "forthcoming",
    dateLabel: "Publication date to be confirmed",
    summary:
      "An examination of how technical and vocational institutions document, support and advance learner-led applied innovation.",
  },
  {
    id: "student-protection",
    title: "Teaching young innovators what intellectual property means",
    type: "Toolkit",
    topic: "Student innovation",
    status: "forthcoming",
    dateLabel: "Publication date to be confirmed",
    summary:
      "Classroom-ready material for teachers introducing ownership, disclosure and protection to school-age innovators.",
  },
];

export const knowledgeNotice =
  "Published records below are live pages on this site. All other entries show the resources AFRINNET is preparing — no report or policy brief is listed as published before it has been approved for public circulation.";

/** News & Events — intentionally empty until real announcements exist. */
export const newsEmptyState = {
  title: "No announcements published yet",
  body: "News, programme updates, application windows and event details will appear here as they are confirmed. AFRINNET does not publish placeholder deadlines or programme launches.",
  cta: { label: "Subscribe for updates", href: "/#newsletter" },
};
