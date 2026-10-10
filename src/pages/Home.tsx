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

/**
 * AFRINNET Foundation homepage — eleven sections:
 * hero · mandate · services · journey · ecosystem · leadership ·
 * pan-African vision · IP · knowledge · partnership CTA · newsletter/footer
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Mandate />
      <CoreServices />
      <Journey />
      <EcosystemSection />
      <LeadershipSection />
      <PanAfrica />
      <IPSection />
      <KnowledgePreview />
      <PartnershipCTA />
    </>
  );
}
