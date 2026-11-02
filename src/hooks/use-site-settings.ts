import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  announcement as defaultAnnouncement,
  footerColumns as defaultFooterColumns,
  footerNotes as defaultFooterNotes,
  navGroups as defaultNavGroups,
  navPlainLinks as defaultNavPlainLinks,
  primaryCta as defaultPrimaryCta,
  siteMeta as defaultSiteMeta,
  type NavGroup,
  type NavLink,
} from "@/content/site";

type Settings = {
  announcement?: typeof defaultAnnouncement;
  navGroups?: NavGroup[];
  navPlainLinks?: NavLink[];
  primaryCta?: typeof defaultPrimaryCta;
  footerColumns?: typeof defaultFooterColumns;
  footerNotes?: typeof defaultFooterNotes;
  siteMeta?: typeof defaultSiteMeta;
  logoUrl?: string;
  logoStorageId?: string;
  faviconUrl?: string;
  faviconStorageId?: string;
  contactEmail?: string;
  theme?: {
    primary?: string;
    background?: string;
    surface?: string;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function safeColor(value: unknown, fallback: string) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

export function useSiteSettings() {
  const publishedRecord = useQuery(api.cms.getPublishedByKey, {
    key: "site-settings",
  });
  const importedModule = useQuery(api.cms.getPublishedByKey, {
    key: "module:site",
  });
  const moduleSettings = isRecord(importedModule?.content)
    ? (importedModule.content as Settings)
    : {};
  const directSettings = isRecord(publishedRecord?.content)
    ? (publishedRecord.content as Settings)
    : {};
  const settings = { ...moduleSettings, ...directSettings };
  const theme = isRecord(settings.theme) ? settings.theme : {};

  return {
    announcement: isRecord(settings.announcement)
      ? (settings.announcement as typeof defaultAnnouncement)
      : defaultAnnouncement,
    navGroups: Array.isArray(settings.navGroups)
      ? settings.navGroups
      : defaultNavGroups,
    navPlainLinks: Array.isArray(settings.navPlainLinks)
      ? settings.navPlainLinks
      : defaultNavPlainLinks,
    primaryCta: isRecord(settings.primaryCta)
      ? (settings.primaryCta as typeof defaultPrimaryCta)
      : defaultPrimaryCta,
    footerColumns: Array.isArray(settings.footerColumns)
      ? settings.footerColumns
      : defaultFooterColumns,
    footerNotes: isRecord(settings.footerNotes)
      ? (settings.footerNotes as typeof defaultFooterNotes)
      : defaultFooterNotes,
    siteMeta: isRecord(settings.siteMeta)
      ? (settings.siteMeta as typeof defaultSiteMeta)
      : defaultSiteMeta,
    logoUrl: settings.logoUrl ?? "",
    faviconUrl: settings.faviconUrl ?? "",
    contactEmail: settings.contactEmail ?? "",
    theme: {
      primary: safeColor(theme.primary, "#16a34a"),
      background: safeColor(theme.background, "#080b0a"),
      surface: safeColor(theme.surface, "#101a16"),
    },
  };
}