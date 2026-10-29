import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  announcement,
  footerColumns,
  footerNotes,
  navGroups,
  navPlainLinks,
  primaryCta,
  siteMeta,
} from "@/content/site";

export const defaultSiteConfiguration = {
  announcement,
  navGroups,
  navPlainLinks,
  primaryCta,
  footerColumns,
  footerNotes,
  siteMeta,
  design: {
    primary: "#16a34a",
    secondary: "#18365b",
    background: "#080b0a",
    surface: "#101a16",
    text: "#f5f7f5",
    displayFont: "Montserrat",
    bodyFont: "Open Sans",
    radius: 0.625,
  },
};

export type SiteConfiguration = typeof defaultSiteConfiguration;

export function useSiteConfiguration(): SiteConfiguration {
  const record = useQuery(api.cms.publishedSettings);
  if (!record) return defaultSiteConfiguration;

  try {
    const parsed: unknown = JSON.parse(record.body);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "announcement" in parsed &&
      "navGroups" in parsed &&
      "footerColumns" in parsed &&
      "siteMeta" in parsed
    ) {
      return {
        ...defaultSiteConfiguration,
        ...(parsed as Partial<SiteConfiguration>),
        design: {
          ...defaultSiteConfiguration.design,
          ...((parsed as Partial<SiteConfiguration>).design ?? {}),
        },
      };
    }
    console.error("Published site configuration is missing required sections.");
  } catch (error) {
    console.error("Could not parse published site configuration:", error);
  }
  return defaultSiteConfiguration;
}
