import { Fragment } from "react";
import { Hero } from "@/sections/Hero";
import { Mandate } from "@/sections/Mandate";
import { CoreServices } from "@/sections/CoreServices";
import { Journey } from "@/sections/Journey";
import { EcosystemSection } from "@/sections/EcosystemSection";
import { LeadershipSection } from "@/sections/LeadershipSection";
import { PanAfrica } from "@/sections/PanAfrica";
import { IPSection } from "@/sections/IPSection";
import { KnowledgePreview } from "@/sections/KnowledgePreview";
import { PartnershipCTA } from "@/sections/PartnershipCTA";
import { homepageContent } from "@/content/homepage";
import { useCmsModule } from "@/hooks/use-cms-module";

/**
 * AFRINNET Foundation homepage — eleven sections:
 * hero · mandate · services · journey · ecosystem · leadership ·
 * pan-African vision · IP · knowledge · partnership CTA · newsletter/footer
 */
export default function Home() {
  const homepage = useCmsModule("homepage", homepageContent);
  const sections = {
    hero: <Hero />,
    mandate: <Mandate />,
    services: <CoreServices />,
    journey: <Journey />,
    ecosystem: <EcosystemSection />,
    leadership: <LeadershipSection />,
    panAfrica: <PanAfrica />,
    ip: <IPSection />,
    knowledge: <KnowledgePreview />,
    partnership: <PartnershipCTA />,
  };
  const hidden = new Set<string>(homepage.hiddenSections ?? []);
  const customSections = Array.isArray(homepage.customSections) ? homepage.customSections : [];

  return (
    <>
      {homepage.sectionOrder
        .filter((id) => (id in sections || id.startsWith("custom:")) && !hidden.has(id))
        .map((id) => {
          if (id in sections) return <Fragment key={id}>{sections[id as keyof typeof sections]}</Fragment>;
          const sectionId = id.slice("custom:".length);
          const section = customSections.find((item) => item.id === sectionId);
          if (!section) return null;
          return (
            <section key={id} className="bg-background px-5 py-16 text-foreground sm:px-8 sm:py-24">
              <div className="mx-auto max-w-5xl">
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{section.title}</h2>
                {section.introduction && <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{section.introduction}</p>}
                {section.body && <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-7 text-muted-foreground">{section.body}</p>}
              </div>
            </section>
          );
        })}
    </>
  );
}
