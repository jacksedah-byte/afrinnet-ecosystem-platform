export type CmsSection =
  | {
      id: string;
      type: "hero";
      eyebrow?: string;
      heading: string;
      body?: string;
      imageUrl?: string;
      imageAlt?: string;
      primaryLabel?: string;
      primaryHref?: string;
      secondaryLabel?: string;
      secondaryHref?: string;
    }
  | { id: string; type: "text"; heading?: string; body: string }
  | {
      id: string;
      type: "image";
      imageUrl: string;
      imageAlt: string;
      caption?: string;
    }
  | {
      id: string;
      type: "features";
      heading?: string;
      items: { title: string; body: string }[];
    }
  | {
      id: string;
      type: "cta";
      heading: string;
      body?: string;
      buttonLabel: string;
      buttonHref: string;
    };

export type CmsSectionType = CmsSection["type"];

export function createCmsSection(type: CmsSectionType): CmsSection {
  const id = crypto.randomUUID();
  switch (type) {
    case "hero":
      return { id, type, heading: "Section heading" };
    case "text":
      return { id, type, body: "" };
    case "image":
      return { id, type, imageUrl: "", imageAlt: "" };
    case "features":
      return { id, type, items: [{ title: "Feature", body: "" }] };
    case "cta":
      return { id, type, heading: "Ready to get started?", buttonLabel: "Learn more", buttonHref: "/" };
  }
}

export function isSafeCmsHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//") || /^https:\/\//i.test(href);
}

export function isSafeCmsImageUrl(url: string) {
  return url.startsWith("/") && !url.startsWith("//") || /^https:\/\//i.test(url);
}
