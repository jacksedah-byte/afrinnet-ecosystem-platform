import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Callout, Container, LinkButton } from "@/components/site/primitives";

type Doc = "privacy" | "terms" | "accessibility";

interface Section {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

const DOCS: Record<
  Doc,
  { title: string; lede: string; updated: string; sections: Section[] }
> = {
  privacy: {
    title: "Privacy Policy",
    lede: "What information AFRINNET Foundation collects through this website, why we collect it, and the choices you have.",
    updated: "Applies to the current release of this website.",
    sections: [
      {
        heading: "Who we are",
        paragraphs: [
          "AFRINNET Foundation (the African Foundation for Innovation Network) operates this website. This policy explains how we handle personal information collected through the site's forms.",
          "Questions about this policy can be sent through the contact form on this website; verified contact details are published on the contact page once confirmed.",
        ],
      },
      {
        heading: "Information we collect",
        paragraphs: [
          "We collect only what is needed to respond to you and to operate the services you use:",
        ],
        list: [
          "Contact enquiries: name, email address, organisation (optional), subject (optional) and your message.",
          "Innovation submissions: applicant name, email, role, organisation, institution type, innovation title, non-confidential description, category, development stage, IP position, support needs and any notes about supporting documents.",
          "Newsletter sign-up: email address and your consent record.",
          "Account sign-in (portal): email address and authentication tokens required to keep you signed in.",
        ],
      },
      {
        heading: "Information we do not collect here",
        paragraphs: [
          "This website does not ask for confidential technical detail, and you should not provide it through these forms. Files are not uploaded at this stage; supporting documents are requested separately through a secure channel if review progresses.",
          "We do not use advertising cookies, third-party tracking pixels or behavioural analytics.",
        ],
      },
      {
        heading: "How we use your information",
        paragraphs: ["Your information is used only for the purpose it was provided:"],
        list: [
          "To respond to your enquiry and route it to the relevant team.",
          "To review your innovation submission for completeness and, where appropriate, to identify suitable support pathways.",
          "To send the updates you subscribed to — you can unsubscribe at any time.",
          "To keep basic security and abuse-prevention records.",
        ],
      },
      {
        heading: "Storage and access",
        paragraphs: [
          "Submissions and enquiries are stored in a managed cloud database with server-side validation. Innovation submissions and enquiries have no public read path — they are not visible to other visitors, and review access will be restricted to authorised staff with the arrival of the registry module.",
          "Newsletter sign-ups record your email address and consent only.",
          "Draft innovation submissions are saved in your own browser's local storage so you can resume later. Clearing your browser data, or using the “Clear draft” control, removes that local copy.",
        ],
      },
      {
        heading: "Retention and your rights",
        paragraphs: [
          "We keep information only as long as it is needed for the purpose it was collected for, or as required by applicable law. You may request access to, correction of, or deletion of your personal information at any time by contacting us through this website.",
          "Public disclosure of an innovation record happens only with your explicit consent. Records are private by default.",
        ],
      },
      {
        heading: "Sharing",
        paragraphs: [
          "We do not sell personal information. Where a referral to an intellectual property professional or registration authority is useful, we will ask before sharing your details with a third party.",
        ],
      },
      {
        heading: "Changes to this policy",
        paragraphs: [
          "This policy will be updated as AFRINNET's systems develop. The current version always appears on this page.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    lede: "The conditions that apply when you use this website and its services.",
    updated: "Applies to the current release of this website.",
    sections: [
      {
        heading: "Acceptance",
        paragraphs: [
          "By using this website you accept these terms. If you do not accept them, please do not use the site.",
        ],
      },
      {
        heading: "Purpose of this site",
        paragraphs: [
          "This site provides general information about AFRINNET Foundation, its services and intellectual property topics. It is published to help innovators and institutions understand what support exists and how to access it.",
        ],
      },
      {
        heading: "Not legal or professional advice",
        paragraphs: [
          "Content on intellectual property is general education. It is not legal advice, does not reflect the circumstances of any particular case, and does not create a professional relationship with AFRINNET Foundation.",
          "Rights such as patents, trademarks, copyright and industrial designs are granted only by the relevant authorities. AFRINNET does not grant rights, guarantee registration outcomes, or certify the merits of any innovation.",
        ],
      },
      {
        heading: "Submissions",
        paragraphs: [
          "When you submit an innovation you confirm that the information is non-confidential and that you have the right to share it. Submission starts a review; it does not establish intellectual property rights, guarantee acceptance into any programme, funding, or commercialisation.",
          "You remain responsible for protecting your own intellectual property. Seek qualified professional advice before disclosing sensitive technical information.",
        ],
      },
      {
        heading: "Acceptable use",
        paragraphs: ["You must not:"],
        list: [
          "Use the site to submit unlawful, infringing or malicious content",
          "Attempt to gain unauthorised access to systems or records",
          "Interfere with the operation of the site or its forms",
          "Impersonate another person or misrepresent an affiliation with an institution",
        ],
      },
      {
        heading: "Intellectual property of this site",
        paragraphs: [
          "Unless stated otherwise, the content of this website is owned by or licensed to AFRINNET Foundation and may not be reproduced commercially without permission. Educational resources may be shared with attribution unless a resource states otherwise.",
        ],
      },
      {
        heading: "Availability and liability",
        paragraphs: [
          "The site is provided as available. To the extent permitted by law, AFRINNET Foundation is not liable for losses arising from reliance on general information published here, or from temporary unavailability of the site.",
          "Links to third-party websites are provided for convenience; AFRINNET does not control or endorse their content.",
        ],
      },
      {
        heading: "Governing terms",
        paragraphs: [
          "The registered particulars and governing law applicable to AFRINNET Foundation will be published on this site once confirmed. Questions about these terms can be sent through the contact form.",
        ],
      },
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    lede: "AFRINNET's commitment to a website that works for everyone, including people who use assistive technology.",
    updated: "Applies to the current release of this website.",
    sections: [
      {
        heading: "Our commitment",
        paragraphs: [
          "We aim to meet WCAG 2.2 Level AA across this website. Accessibility is treated as a requirement of the platform, not a finishing touch.",
        ],
      },
      {
        heading: "What we have done",
        list: [
          "Semantic HTML with a logical heading hierarchy and landmark regions",
          "A skip-to-content link and full keyboard operability, including navigation dropdowns and the mobile menu",
          "Visible focus indicators on every interactive element",
          "Colour contrast checked for text and controls across dark and light sections",
          "Respect for prefers-reduced-motion — animations, parallax and looping effects are disabled for visitors who request it",
          "Form labels, inline validation messages and clear error states",
          "Responsive layouts tested from 320px small phones to large desktop screens",
          "Descriptive alternative text for meaningful images; decorative graphics hidden from assistive technology",
        ],
      },
      {
        heading: "Known limitations",
        list: [
          "The continental map is decorative and orientation-only; region information is also available as text buttons",
          "Leadership portrait slots currently show labelled placeholders awaiting approved photographs",
          "Some resources are marked forthcoming and are not yet readable as published documents",
        ],
      },
      {
        heading: "Feedback",
        paragraphs: [
          "If you encounter a barrier on this site, please tell us through the contact form — include the page address and what you were trying to do. We will respond and prioritise the fix.",
        ],
      },
      {
        heading: "Statement scope",
        paragraphs: [
          "This statement covers the public AFRINNET website. It will be reviewed and updated as new services are released.",
        ],
      },
    ],
  },
};

export default function Legal({ doc }: { doc: Doc }) {
  const content = DOCS[doc];

  return (
    <>
      <PageHeader
        crumbs={[{ label: content.title }]}
        eyebrow="Legal & accessibility"
        title={content.title}
        lede={content.lede}
        actions={
          <>
            <LinkButton href="/contact" variant="outline">
              Ask a question about this page
            </LinkButton>
            <LinkButton href="/" variant="soft">
              Back to home
            </LinkButton>
          </>
        }
      >
        <p className="mt-5 text-xs uppercase tracking-[0.16em] text-ash/70">
          {content.updated}
        </p>
      </PageHeader>

      {/* Light reading surface for long-form documents */}
      <section className="bg-mist py-14 text-obsidian sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            {content.sections.map((section, i) => (
              <Reveal key={section.heading} delay={Math.min(i * 0.04, 0.2)}>
                <article className="border-b border-obsidian/10 py-8 first:pt-0">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-xs font-bold tracking-[0.18em] text-[#12803F]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-xl font-bold tracking-tight text-obsidian sm:text-2xl">
                      {section.heading}
                    </h2>
                  </div>

                  <div className="mt-4 space-y-4 pl-0 sm:pl-10">
                    {section.paragraphs.map((p, pi) => (
                      <p key={pi} className="text-base leading-7 text-obsidian/75">
                        {p}
                      </p>
                    ))}
                    {section.list && (
                      <ul className="space-y-2.5">
                        {section.list.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-base leading-7 text-obsidian/75"
                          >
                            <span
                              className="mt-3 size-1.5 shrink-0 rounded-full bg-[#16A34A]"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}

            <div className="mt-10 flex flex-wrap gap-3">
              <LinkButton href="/contact" variant="primary">
                Contact AFRINNET
              </LinkButton>
              <LinkButton href="/about" variant="light">
                About the foundation
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-obsidian py-10">
        <Container>
          <Callout tone="neutral" className="mx-auto max-w-3xl">
            Related:{" "}
            <a href="/privacy" className="font-semibold text-innovation underline-offset-4 hover:underline">
              privacy policy
            </a>
            ,{" "}
            <a href="/terms" className="font-semibold text-innovation underline-offset-4 hover:underline">
              terms of use
            </a>
            ,{" "}
            <a href="/accessibility" className="font-semibold text-innovation underline-offset-4 hover:underline">
              accessibility statement
            </a>
            .
          </Callout>
        </Container>
      </section>
    </>
  );
}
