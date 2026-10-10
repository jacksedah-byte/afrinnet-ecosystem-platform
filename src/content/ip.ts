/**
 * Intellectual property content.
 *
 * AFRINNET facilitates information, support and connections. Nothing here may
 * be read as AFRINNET granting rights, practising law or guaranteeing outcomes.
 */

export interface IpTypeData {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  purpose: string;
  considerations: string[];
  nextSteps: string[];
  faqs: { q: string; a: string }[];
}

export const ipDisclaimer =
  "AFRINNET provides information, educational support and referrals. It does not grant patents, trademarks, copyright or design rights, does not award legal protections and does not guarantee registration outcomes. Rights are granted only by the relevant national and regional authorities, and individual advice should come from a qualified intellectual property professional.";

export const ipOverview = {
  eyebrow: "Intellectual Property",
  title: "Intellectual Property Services",
  summary:
    "Practical guidance on protection options, readiness and referrals to the right professionals and authorities.",
  intro: [
    "Intellectual property systems are designed to help creators benefit from their work — but they are difficult to navigate, especially when the language is legal and the stakes are personal.",
    "AFRINNET helps innovators understand which protection route may be relevant, what readiness looks like, and where to go for professional help. The foundation's role is information, support and connection — not the granting of rights.",
  ],
  coverage: [
    {
      title: "Patents and invention-related protection",
      text: "For new technical solutions — processes, machines, compositions or improvements — subject to novelty and other legal tests.",
      href: "/ip/patents",
    },
    {
      title: "Trademarks and branding",
      text: "For names, logos, slogans and other signs that distinguish goods and services in a market.",
      href: "/ip/trademarks",
    },
    {
      title: "Copyright and eligible creative works",
      text: "For original literary, artistic, musical, software and related works, arising automatically under law.",
      href: "/ip/copyright",
    },
    {
      title: "Industrial designs",
      text: "For the visual appearance of a product — shape, configuration, pattern or ornament.",
      href: "/ip/industrial-designs",
    },
    {
      title: "Innovation readiness and IP awareness",
      text: "A structured look at where an innovation stands, what is exposed, and what should happen first.",
      href: "/ip/readiness",
    },
    {
      title: "Referrals to professionals and authorities",
      text: "Connections to qualified IP attorneys, agents and registration authorities when help is needed.",
      href: "/request-ip-support",
    },
  ],
  pathways: [
    {
      title: "Learn",
      text: "Understand the four main protection types and what each one actually covers.",
    },
    {
      title: "Assess",
      text: "Review the innovation's readiness: disclosure history, documentation and risk.",
    },
    {
      title: "Plan",
      text: "Decide which route, if any, fits — and what must happen before filing.",
    },
    {
      title: "Refer",
      text: "Connect with a qualified professional or the relevant registration authority.",
    },
  ],
};

export const ipTypes: Record<string, IpTypeData> = {
  patents: {
    slug: "patents",
    eyebrow: "IP Protection",
    title: "Patents & Inventions",
    summary:
      "Understanding what patent protection is for, what it generally requires, and where to get formal advice.",
    purpose:
      "A patent can give the owner the right to stop others from making, using or selling an invention for a limited period, in exchange for public disclosure. In most systems the invention must be new (novel), involve an inventive step or be non-obvious, and be capable of industrial application. Patents are territorial: rights apply country by country, or through regional systems that cover a defined set of states.",
    considerations: [
      "Public disclosure before filing can destroy novelty in many jurisdictions — timing matters",
      "Not everything is patentable: methods of doing business, abstract ideas and certain exclusions are common limits",
      "An invention must be new relative to what is publicly available anywhere in the world",
      "Fees, formal requirements and examination processes vary between registration authorities",
      "Ownership must be clear — disputes between collaborators or employers and employees are common",
    ],
    nextSteps: [
      "Document the invention and its development timeline without publishing it",
      "Note who contributed, under what agreement and in what capacity",
      "Request an IP readiness conversation through AFRINNET",
      "Consult a registered patent attorney or agent before any public disclosure or filing",
    ],
    faqs: [
      {
        q: "Can AFRINNET patent my invention?",
        a: "No. AFRINNET does not examine, grant or register patents. We help you understand the route and refer you to registered practitioners and the relevant authorities.",
      },
      {
        q: "I have already shared my idea publicly. Is it too late?",
        a: "It may affect available options, and some jurisdictions have limited grace periods. Take advice quickly rather than assuming the position — a qualified professional can assess your specific circumstances.",
      },
      {
        q: "How long does protection last?",
        a: "Patent terms are typically around 20 years from filing, subject to maintenance fees and national rules. Exact terms depend on the jurisdiction and the type of right.",
      },
    ],
  },
  trademarks: {
    slug: "trademarks",
    eyebrow: "IP Protection",
    title: "Trademarks",
    summary:
      "Protecting the names, logos and signs that carry your innovation's identity to market.",
    purpose:
      "A trademark distinguishes the goods or services of one undertaking from those of another. It can be a word, logo, sound, colour combination or other sign used in trade. Rights usually arise from use, and registration strengthens them — giving a documented basis to object to confusingly similar marks.",
    considerations: [
      "Clear availability searching should come before heavy investment in a name or logo",
      "Registration is territorial and classes of goods or services must be chosen carefully",
      "Marks must be distinctive; purely descriptive terms are harder to protect",
      "Rights can be lost through non-use over time",
      "Brand elements can also involve copyright and design rights, which work alongside trademark protection",
    ],
    nextSteps: [
      "List the signs you use: name, logo, tagline, packaging elements",
      "Run a clearance search in the markets where you trade or plan to trade",
      "Decide the goods and services you actually need to cover",
      "Engage a registered trademark attorney or agent for filing and prosecution",
    ],
    faqs: [
      {
        q: "Does AFRINNET register trademarks?",
        a: "No. AFRINNET explains the system and connects you with qualified professionals and the relevant registries. Registration is handled by those authorities.",
      },
      {
        q: "Should I register before launching?",
        a: "It is generally worth checking availability and considering registration before significant launch spending, because conflicts discovered late are expensive to resolve.",
      },
    ],
  },
  copyright: {
    slug: "copyright",
    eyebrow: "IP Protection",
    title: "Copyright",
    summary:
      "How original creative, written and software works are protected — and where people get it wrong.",
    purpose:
      "Copyright protects original expression in literary, artistic, musical and similar works, including source code, documentation, datasets in some circumstances, photography and audiovisual material. In most jurisdictions protection arises automatically when the work is fixed, without registration — though registration and record-keeping can help prove ownership later.",
    considerations: [
      "Copyright protects expression, not ideas, methods or facts",
      "Ownership and employment rules vary — commissions and collaborations need clear agreements",
      "Licences determine how others may use the work; defaults are not always what people expect",
      "Software and datasets sit in a specialised area of the law with specific exceptions",
      "Infringement remedies depend on the jurisdiction and on proof of ownership and copying",
    ],
    nextSteps: [
      "Keep dated records of creation, drafts and authorship",
      "Clarify ownership in writing with collaborators, employers and commissioning parties",
      "Choose licence terms deliberately when sharing or commercialising works",
      "Seek specialist advice where software, media or publishing revenue is involved",
    ],
    faqs: [
      {
        q: "Do I need to register copyright?",
        a: "In many systems no registration is required for protection to exist, but formal record systems can strengthen enforcement. The position depends on your jurisdiction.",
      },
      {
        q: "Does AFRINNET enforce copyright?",
        a: "No. AFRINNET provides information and referrals; enforcement and legal action are matters for rights holders and their legal representatives.",
      },
    ],
  },
  "industrial-designs": {
    slug: "industrial-designs",
    eyebrow: "IP Protection",
    title: "Industrial Designs",
    summary:
      "Protecting the visual identity of a product — shape, surface, pattern and proportion.",
    purpose:
      "An industrial design right covers the ornamental or aesthetic features of a product: its shape, configuration, pattern, composition of lines or colour. Where a product's commercial appeal depends on how it looks as much as how it works, design protection can sit alongside patents and trademarks.",
    considerations: [
      "Novelty and prior disclosure rules vary and filing deadlines can be short",
      "Design rights are usually territorial and limited to defined product categories",
      "Functional features are generally the domain of patents rather than design rights",
      "Multiple designs can often be filed together, with different rules for each system",
      "Photography and drawings submitted must meet formal requirements of the registry",
    ],
    nextSteps: [
      "Prepare clear views of the product: front, side, top, perspective",
      "Record the date the design was first published or offered for sale",
      "Check whether prior disclosure affects availability in your target markets",
      "Instruct a registered design attorney or agent to file on your behalf",
    ],
    faqs: [
      {
        q: "How is a design right different from a patent?",
        a: "Patents protect how something works; design rights protect how it looks. They can overlap, and some products benefit from both.",
      },
      {
        q: "Does AFRINNET file design applications?",
        a: "No. AFRINNET provides information, readiness support and referrals to qualified professionals and design registries.",
      },
    ],
  },
  readiness: {
    slug: "readiness",
    eyebrow: "IP Support",
    title: "IP Readiness & Support",
    summary:
      "A structured look at your position before you spend money — disclosure history, ownership, evidence and next steps.",
    purpose:
      "Readiness work asks practical questions before any filing decision: what has been disclosed and when, who owns the work, what evidence exists, which markets matter, and what the budget allows. It turns a vague worry about intellectual property into an ordered set of actions.",
    considerations: [
      "Every prior disclosure — pitch decks, papers, social posts, trade fairs — is relevant",
      "Ownership among co-creators, employers and institutions must be documented",
      "Protection strategy should follow the commercialisation strategy, not lead it",
      "Budget and jurisdiction priorities shape what is realistic",
      "Some support may be available through grant-funded schemes; eligibility and availability must be confirmed each cycle",
    ],
    nextSteps: [
      "Request an IP readiness conversation through AFRINNET",
      "Prepare a short non-confidential summary and disclosure history",
      "Gather ownership and collaboration documents",
      "Agree a prioritised action list with a qualified professional where needed",
    ],
    faqs: [
      {
        q: "What happens in an IP readiness conversation?",
        a: "You describe the innovation and its history; AFRINNET helps structure the picture, identifies gaps and — where appropriate — refers you to a qualified professional or authority.",
      },
      {
        q: "Is there funding to pay for registration?",
        a: "Potential grant-funded IP registration support is being explored. Any such scheme will be published with explicit eligibility criteria and availability, and nothing is offered at this stage.",
      },
    ],
  },
};
