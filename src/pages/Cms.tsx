import { useConvex, useMutation, useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CmsPageEditor } from "@/components/site/CmsPageEditor";
import { CmsHomepageSectionsEditor } from "@/components/site/CmsHomepageSectionsEditor";
import { CmsUsersManager } from "@/components/site/CmsUsersManager";
import { CmsJsonEditor } from "@/components/site/CmsJsonEditor";
import { useAuth } from "@/hooks/use-auth";
import { Link, useNavigate } from "react-router";
import {
  announcement,
  footerColumns,
  footerNotes,
  navGroups,
  navPlainLinks,
  primaryCta,
  siteMeta,
} from "@/content/site";
import * as aboutContent from "@/content/about";
import * as audiencesContent from "@/content/audiences";
import * as founderStoryContent from "@/content/founderStory";
import { homepageContent } from "@/content/homepage";
import * as ipContent from "@/content/ip";
import * as leadershipContent from "@/content/leadership";
import * as resourcesContent from "@/content/resources";
import { coreServices, journeySteps, servicePages } from "@/content/services";
import { roadmapPhases } from "@/content/site";
import {
  Files,
  Home,
  ImagePlus,
  Inbox,
  Layers3,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  Save,
  Settings2,
  Trash2,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type EditorState = {
  key: string;
  type: string;
  title: string;
  path: string;
  status: "draft" | "published";
  content: string;
};

type CmsInbox = {
  submissions: Doc<"innovationSubmissions">[];
  enquiries: Doc<"enquiries">[];
  newsletterSignups: Doc<"newsletterSignups">[];
};

type JsonPath = Array<string | number>;
type CmsPanel = "overview" | "pages" | "content" | "media" | "settings" | "inbox" | "team";
type NavigationItem = readonly [CmsPanel, string, LucideIcon];

function setJsonPath(value: unknown, path: JsonPath, replacement: (current: unknown) => unknown): unknown {
  if (path.length === 0) return replacement(value);
  const [head, ...tail] = path;
  if (Array.isArray(value) && typeof head === "number") {
    return value.map((item, index) => index === head ? setJsonPath(item, tail, replacement) : item);
  }
  if (value && typeof value === "object" && !Array.isArray(value) && typeof head === "string") {
    const record = value as Record<string, unknown>;
    return {
      ...record,
      [head]: head in record ? setJsonPath(record[head], tail, replacement) : replacement(null),
    };
  }
  throw new Error("The selected content field is not an object that can hold an image.");
}

function storeUploadedImage(content: unknown, path: JsonPath, imageUrl: string, storageId: string) {
  let updated: unknown;
  const current = path.reduce<unknown>((value, key) => {
    if (Array.isArray(value) && typeof key === "number") return value[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (value as Record<string, unknown>)[String(key)];
    }
    return undefined;
  }, content);
  if (current && typeof current === "object" && !Array.isArray(current)) {
    updated = setJsonPath(content, path, (value) => ({
      ...(value as Record<string, unknown>),
      imageUrl,
      storageId,
    }));
  } else if (typeof current === "string") {
    updated = setJsonPath(content, path, () => imageUrl);
    const parentPath = path.slice(0, -1);
    updated = setJsonPath(updated, parentPath, (parent) => {
      if (!parent || typeof parent !== "object" || Array.isArray(parent)) {
        throw new Error("The selected image URL needs to belong to an object field.");
      }
      return { ...parent, storageId };
    });
  } else {
    throw new Error("Choose an image field or image section before uploading.");
  }
  return updated;
}

const emptyEditor: EditorState = {
  key: "",
  type: "page",
  title: "",
  path: "",
  status: "draft",
  content: "{}",
};

const pagePresets = [
  { path: "/", title: "Home", moduleKey: "homepage" },
  { path: "/about", title: "About AFRINNET", moduleKey: "about" },
  { path: "/about/mission-vision", title: "Mission, Vision & Strategy", moduleKey: "about" },
  { path: "/leadership", title: "Leadership", moduleKey: "leadership" },
  { path: "/leadership/founder", title: "Founder Profile", moduleKey: "leadership" },
  { path: "/leadership/founder/story", title: "Founder Story", moduleKey: "founderStory" },
  { path: "/leadership/executive", title: "Executive Profile", moduleKey: "leadership" },
  { path: "/leadership/board", title: "Board", moduleKey: "leadership" },
  { path: "/leadership/management", title: "Management", moduleKey: "leadership" },
  { path: "/leadership/governance", title: "Governance", moduleKey: "leadership" },
  { path: "/ecosystem", title: "Ecosystem", moduleKey: "services" },
  { path: "/ecosystem/discovery", title: "Innovation Discovery", moduleKey: "services" },
  { path: "/ecosystem/verification", title: "Innovation Verification", moduleKey: "services" },
  { path: "/ecosystem/networks", title: "Institutional Networks", moduleKey: "services" },
  { path: "/ecosystem/incubation", title: "Incubation & Readiness", moduleKey: "services" },
  { path: "/ip", title: "IP Services", moduleKey: "ip" },
  { path: "/ip/patents", title: "Patents", moduleKey: "ip" },
  { path: "/ip/trademarks", title: "Trademarks", moduleKey: "ip" },
  { path: "/ip/copyright", title: "Copyright", moduleKey: "ip" },
  { path: "/ip/industrial-designs", title: "Industrial Designs", moduleKey: "ip" },
  { path: "/ip/readiness", title: "IP Readiness", moduleKey: "ip" },
  { path: "/engage/government", title: "Government & Public Institutions", moduleKey: "audiences" },
  { path: "/engage/universities", title: "Universities & Research", moduleKey: "audiences" },
  { path: "/engage/tvet", title: "TVET Institutions", moduleKey: "audiences" },
  { path: "/engage/schools", title: "Schools & Student Innovators", moduleKey: "audiences" },
  { path: "/engage/startups", title: "Startups & Industry", moduleKey: "audiences" },
  { path: "/engage/partners", title: "Development Partners", moduleKey: "audiences" },
  { path: "/knowledge", title: "Knowledge Centre", moduleKey: "resources" },
  { path: "/knowledge/publications", title: "Publications", moduleKey: "resources" },
  { path: "/news", title: "News & Events", moduleKey: "resources" },
  { path: "/submit", title: "Submit an Innovation" },
  { path: "/partnerships", title: "Partnerships", moduleKey: "audiences" },
  { path: "/request-ip-support", title: "Request IP Support", moduleKey: "ip" },
  { path: "/contact", title: "Contact" },
  { path: "/privacy", title: "Privacy Policy" },
  { path: "/terms", title: "Terms of Use" },
  { path: "/accessibility", title: "Accessibility" },
];

const staticModules = [
  { key: "about" as const, title: "About and mission content", content: aboutContent },
  { key: "audiences" as const, title: "Audience and stakeholder content", content: audiencesContent },
  { key: "founderStory" as const, title: "Founder story content", content: founderStoryContent },
  { key: "homepage" as const, title: "Homepage sections content", content: homepageContent },
  { key: "ip" as const, title: "Intellectual property content", content: ipContent },
  { key: "leadership" as const, title: "Leadership and governance content", content: leadershipContent },
  { key: "resources" as const, title: "Knowledge Centre content", content: resourcesContent },
  { key: "services" as const, title: "Services and journey content", content: {
    coreServices: coreServices.map((service) => ({
      title: service.title,
      description: service.description,
      href: service.href,
    })),
    journeySteps,
    servicePages,
  } },
  { key: "site" as const, title: "Site navigation and roadmap content", content: {
    announcement,
    navGroups,
    navPlainLinks,
    primaryCta,
    footerColumns,
    footerNotes,
    siteMeta,
    logoUrl: "",
    logoStorageId: "",
    faviconUrl: "",
    faviconStorageId: "",
    contactEmail: "",
    roadmapPhases,
  } },
];

const siteSettingsContent = {
  announcement,
  navGroups,
  navPlainLinks,
  primaryCta,
  footerColumns,
  footerNotes,
  siteMeta,
  logoUrl: "",
  logoStorageId: "",
  faviconUrl: "",
  faviconStorageId: "",
  contactEmail: "",
  theme: {
    primary: "#cc2c24",
    background: "#e9eaec",
    surface: "#d4d6d8",
  },
};

function pageTemplate(title: string) {
  return {
    eyebrow: "AFRINNET Foundation",
    title,
    introduction: "Write a concise introduction for this page.",
    preserveExistingPage: false,
    design: { layoutWidth: "standard", heroAlignment: "left", theme: "default" },
    blocks: [
      { type: "text", heading: "Section heading", body: "Add the page content here." },
      {
        type: "feature",
        heading: "Featured programme or service",
        body: "Describe a key programme, service or opportunity.",
        imageUrl: "",
        alt: "",
        label: "Learn more",
        href: "/contact",
      },
      { type: "list", heading: "Key points", items: ["First point", "Second point"] },
      { type: "quote", body: "Add a highlighted statement or quotation.", attribution: "Attribution" },
      { type: "cta", label: "Take the next step", href: "/contact" },
    ],
  };
}

export default function Cms() {
  const { userId, signOut } = useAuth();
  const navigate = useNavigate();
  const cmsAccess = useQuery(api.cms.getAccess, {});
  const isAdmin = cmsAccess === undefined ? undefined : cmsAccess !== null;
  const recordsResult = useQuery(api.cms.list, isAdmin ? {} : "skip");
  const records = recordsResult as Doc<"siteContent">[] | undefined;
  const inboxResult = useQuery(api.cms.inbox, cmsAccess?.permissions.includes("inbox") ? {} : "skip");
  const inbox = inboxResult as CmsInbox | undefined;
  const saveRecord = useMutation(api.cms.save);
  const removeRecord = useMutation(api.cms.remove);
  const createUploadUrl = useMutation(api.cms.generateUploadUrl);
  const setSubmissionStatus = useMutation(api.cms.setSubmissionStatus);
  const setEnquiryStatus = useMutation(api.cms.setEnquiryStatus);
  const removeSubmission = useMutation(api.cms.removeSubmission);
  const removeEnquiry = useMutation(api.cms.removeEnquiry);
  const removeNewsletterSignup = useMutation(api.cms.removeNewsletterSignup);
  const importModules = useMutation(api.cms.importStaticModules);
  const convex = useConvex();
  const [selectedId, setSelectedId] = useState<GenericId<"siteContent"> | null>(null);
  const [editor, setEditor] = useState<EditorState>(emptyEditor);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingUploadFor, setPendingUploadFor] = useState<string | null>(null);
  const [inboxError, setInboxError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [assetUpload, setAssetUpload] = useState<"logo" | "favicon" | null>(null);
  const [activePanel, setActivePanel] = useState<CmsPanel>("overview");
  const autoImportStarted = useRef(false);
  const initialRecordSelected = useRef(false);
  const [selectedPagePath, setSelectedPagePath] = useState("");

  useEffect(() => {
    if (
      isAdmin !== true ||
      !cmsAccess?.permissions.includes("content") ||
      !cmsAccess.permissions.includes("settings") ||
      records === undefined ||
      autoImportStarted.current
    ) return;
    autoImportStarted.current = true;
    setIsImporting(true);
    setImportResult("Loading the website’s current content into your CMS…");
    void importModules({ modules: staticModules, settings: siteSettingsContent })
      .then((count) => {
        setImportResult(
          count > 0
            ? `${count} website content areas are ready to edit. Select one from the content list.`
            : "Your website content is already loaded. Select a content area from the list to edit it.",
        );
      })
      .catch((importError: unknown) => {
        const message = importError instanceof Error ? importError.message : "Could not load the website content.";
        setImportResult(message);
        toast.error(message);
      })
      .finally(() => setIsImporting(false));
  }, [cmsAccess, importModules, isAdmin, records]);

  useEffect(() => {
    if (activePanel !== "content" || initialRecordSelected.current || !records?.length || selectedId || editor.key) return;
    const firstContentRecord =
      records.find((record) => record.key === "module:about") ??
      records.find((record) => record.key.startsWith("module:")) ??
      records[0];
    initialRecordSelected.current = true;
    setSelectedId(firstContentRecord._id);
    setSelectedPagePath("");
    setEditor({
      key: firstContentRecord.key,
      type: firstContentRecord.type,
      title: firstContentRecord.title,
      path: firstContentRecord.path ?? "",
      status: firstContentRecord.status,
      content: JSON.stringify(firstContentRecord.content, null, 2),
    });
  }, [activePanel, editor.key, records, selectedId]);

  const pageRecords = records?.filter((record) =>
    ["page", "news", "resource"].includes(record.type) && Boolean(record.path),
  ) ?? [];
  const moduleRecords = records?.filter((record) => record.type === "site-module") ?? [];
  const mediaRecords = records?.filter((record) => record.type === "media") ?? [];
  const mediaLibrary = mediaRecords.flatMap((record) => {
    if (!record.content || typeof record.content !== "object" || Array.isArray(record.content)) return [];
    const asset = record.content as Record<string, unknown>;
    if (typeof asset.mediaUrl !== "string" || typeof asset.storageId !== "string") return [];
    return [{
      title: record.title,
      url: asset.mediaUrl,
      storageId: asset.storageId,
      mediaType: asset.mediaType === "video" ? "video" as const : "image" as const,
    }];
  });
  const visibleRecords = activePanel === "pages"
    ? pageRecords
    : activePanel === "content"
      ? moduleRecords
      : activePanel === "media"
        ? mediaRecords
        : activePanel === "settings"
          ? records?.filter((record) => record.key === "site-settings") ?? []
          : [];
  const canEdit = Boolean(cmsAccess && cmsAccess.role !== "viewer");
  const canAccessPanel = (panel: CmsPanel) =>
    panel === "overview" ||
    (panel === "team"
      ? Boolean(cmsAccess?.canManageUsers)
      : Boolean(cmsAccess?.permissions.includes(panel)));
  const allNavigationItems: NavigationItem[] = [
    ["overview", "Overview", LayoutDashboard],
    ["pages", "Pages", Files],
    ["content", "Website content", Layers3],
    ["media", "Media library", ImagePlus],
    ["settings", "Site settings", Settings2],
    ["inbox", "Submissions & inbox", Inbox],
    ...(cmsAccess?.canManageUsers ? [["team", "CMS staff", UsersRound] as const] : []),
  ];
  const navigationItems = allNavigationItems.filter(([panel]) => canAccessPanel(panel));

  const startNewRecord = () => {
    setActivePanel("content");
    setSelectedId(null);
    setSelectedPagePath("");
    setEditor({
      key: `content-${Date.now().toString(36)}`,
      type: "site-module",
      title: "New content area",
      path: "",
      status: "draft",
      content: "{}",
    });
    setError(null);
  };

  const startSiteSettings = () => {
    setActivePanel("settings");
    const existing = records?.find((record) => record.key === "site-settings");
    if (existing) {
      setSelectedId(existing._id);
      setSelectedPagePath("");
      setEditor({
        key: existing.key,
        type: existing.type,
        title: existing.title,
        path: existing.path ?? "",
        status: existing.status,
        content: JSON.stringify(existing.content, null, 2),
      });
      setError(null);
      return;
    }
    setSelectedId(null);
    setSelectedPagePath("");
    setEditor({
      key: "site-settings",
      type: "settings",
      title: "Site-wide settings",
      path: "",
      status: "draft",
      content: JSON.stringify(
        siteSettingsContent,
        null,
        2,
      ),
    });
    setError(null);
  };

  const startPageTemplate = () => {
    const slug = Date.now().toString(36);
    setActivePanel("pages");
    setSelectedId(null);
    setSelectedPagePath("");
    setEditor({
      ...emptyEditor,
      key: `page-${slug}`,
      type: "page",
      title: "New page",
      path: `/new-page-${slug}`,
      content: JSON.stringify(pageTemplate("New page"), null, 2),
    });
    setError(null);
  };

  const startVisualPageOverride = (path: string) => {
    const preset = pagePresets.find((page) => page.path === path);
    if (!preset) return;
    const existing = records?.find((record) => record.path === path && ["page", "news", "resource"].includes(record.type));
    if (existing) {
      setSelectedId(existing._id);
      setSelectedPagePath(path);
      setEditor({
        key: existing.key,
        type: existing.type,
        title: existing.title,
        path: existing.path ?? "",
        status: existing.status,
        content: JSON.stringify(existing.content, null, 2),
      });
      setError(null);
      return;
    }
    const slug = path.split("/").filter(Boolean).join("-");
    setActivePanel("pages");
    setSelectedId(null);
    setSelectedPagePath(path);
    setEditor({
      key: `visual-page-${slug}`,
      type: "page",
      title: preset.title,
      path,
      status: "draft",
      content: JSON.stringify({
        eyebrow: "AFRINNET Foundation",
        title: preset.title,
        introduction: "",
        preserveExistingPage: true,
        design: { layoutWidth: "standard", heroAlignment: "left", theme: "default" },
        blocks: [],
      }, null, 2),
    });
    setError(null);
  };

  const startEditorialRecord = (kind: "news" | "resource") => {
    const title = kind === "news" ? "News story title" : "Resource title";
    const slug = `${kind}-${Date.now().toString(36)}`;
    setActivePanel("pages");
    setSelectedId(null);
    setSelectedPagePath("");
    setEditor({
      key: slug,
      type: kind,
      title,
      path: `${kind === "news" ? "/news" : "/knowledge"}/${slug}`,
      status: "draft",
      content: JSON.stringify(
        kind === "news"
          ? {
              category: "Announcement",
              dateLabel: new Date().toLocaleDateString(),
              summary: "Write a concise summary for this announcement.",
              eyebrow: "News & Events",
              title,
              introduction: "Write the opening paragraph for this story.",
              blocks: [{ type: "text", heading: "Story", body: "Add the story content here." }],
            }
          : {
              type: "Learning resource",
              topic: "Ecosystem development",
              dateLabel: "Published resource",
              summary: "Describe what readers will learn from this resource.",
              eyebrow: "Knowledge Centre",
              title,
              introduction: "Write the resource introduction.",
              blocks: [{ type: "text", heading: "Resource content", body: "Add the resource content here." }],
            },
        null,
        2,
      ),
    });
    setError(null);
  };

  const startNewMedia = () => {
    const slug = Date.now().toString(36);
    setActivePanel("media");
    setSelectedId(null);
    setSelectedPagePath("");
    setEditor({
      key: `media-${slug}`,
      type: "media",
      title: "New media asset",
      path: "",
      status: "draft",
      content: JSON.stringify({ mediaType: "image", mediaUrl: "", storageId: "", alt: "" }, null, 2),
    });
    setError(null);
  };

  const openPanel = (panel: CmsPanel) => {
    if (!canAccessPanel(panel)) return;
    setActivePanel(panel);
    setSelectedId(null);
    setSelectedPagePath("");
    setError(null);
    if (panel === "settings") {
      startSiteSettings();
      return;
    }
    if (panel === "content") initialRecordSelected.current = false;
    if (panel === "overview" || panel === "inbox" || panel === "pages" || panel === "media") {
      setEditor(emptyEditor);
    }
  };

  const selectPage = (path: string) => {
    const preset = pagePresets.find((page) => page.path === path);
    if (!preset) return;
    const existing = records?.find((record) => record.path === path);
    setActivePanel("pages");
    if (existing) {
      setSelectedId(existing._id);
      setSelectedPagePath(path);
      setEditor({
        key: existing.key,
        type: existing.type,
        title: existing.title,
        path: existing.path ?? "",
        status: existing.status,
        content: JSON.stringify(existing.content, null, 2),
      });
    } else if (preset.moduleKey) {
      const moduleRecord = records?.find((record) => record.key === `module:${preset.moduleKey}`);
      if (!moduleRecord) {
        setSelectedPagePath("");
        setError(`The ${preset.title} content is still loading. Please wait for website content setup to finish.`);
        return;
      }
      setSelectedId(moduleRecord._id);
      setSelectedPagePath(path);
      setEditor({
        key: moduleRecord.key,
        type: moduleRecord.type,
        title: moduleRecord.title,
        path: moduleRecord.path ?? "",
        status: moduleRecord.status,
        content: JSON.stringify(moduleRecord.content, null, 2),
      });
      setImportResult(`${preset.title} uses the shared “${moduleRecord.title}” content area. Your existing page design will be preserved.`);
    } else {
      startVisualPageOverride(path);
      setImportResult(`${preset.title} is ready for visual design. Its existing page and form behavior will remain visible unless you turn that option off in the editor.`);
      return;
    }
    setError(null);
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    let content: unknown;
    try {
      content = JSON.parse(editor.content);
    } catch {
      setError("Content must be valid JSON.");
      return;
    }

    setIsSaving(true);
    try {
      const id = await saveRecord({
        ...(selectedId ? { id: selectedId } : {}),
        key: editor.key,
        type: editor.type,
        title: editor.title,
        ...(editor.path ? { path: editor.path } : {}),
        status: editor.status,
        content,
      });
      setSelectedId(id);
      setSelectedPagePath(editor.path || selectedPagePath);
      setPendingUploadFor(null);
      toast.success(
        editor.type === "media"
          ? "Media record saved in Convex."
          : editor.status === "published"
          ? "Changes saved and published to the website."
          : "Saved as a draft. Publish it when you are ready for it to appear on the website.",
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this record.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRecord = async () => {
    if (!selectedId || !window.confirm("Delete this content record permanently?")) return;
    setIsDeleting(true);
    setError(null);
    try {
      await removeRecord({ id: selectedId });
      setSelectedId(null);
      setSelectedPagePath("");
      setEditor(emptyEditor);
      if (activePanel === "settings") startSiteSettings();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this record.");
    } finally {
      setIsDeleting(false);
    }
  };

  const uploadMedia = async (
    file?: File,
    target?:
      | { kind: "pageBlock"; index: number }
      | { kind: "pageCard"; index: number; cardIndex: number }
      | { kind: "pageEntry"; index: number; entryIndex: number }
      | { kind: "pageHero" }
      | { kind: "mediaAsset" }
      | { kind: "jsonPath"; path: JsonPath }
      | { kind: "logo" | "favicon" },
    mediaType: "image" | "video" = "image",
  ) => {
    if (!file) return;
    const acceptedType = mediaType === "image"
      ? file.type.startsWith("image/") && file.type !== "image/svg+xml"
      : ["video/mp4", "video/webm", "video/quicktime"].includes(file.type);
    if (!acceptedType) {
      setError(mediaType === "image"
        ? "Choose a raster image file such as PNG, JPEG, or WebP."
        : "Choose an MP4, WebM, or QuickTime video.");
      return;
    }
    const maxSize = mediaType === "image" ? 10 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(mediaType === "image" ? "Images must be smaller than 10 MB." : "Videos must be smaller than 20 MB.");
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
      const purpose = target?.kind === "mediaAsset"
        ? "media"
        : target?.kind === "logo" || target?.kind === "favicon" || editor.type === "settings"
          ? "settings"
          : ["page", "news", "resource"].includes(editor.type)
            ? "pages"
            : "content";
      const uploadUrl = await createUploadUrl({ purpose });
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("File upload failed.");
      const { storageId } = (await response.json()) as { storageId: string };
      setPendingUploadFor(editor.key);
      const imageUrl = await convex.query(api.cms.getStorageUrl, {
        storageId: storageId as GenericId<"_storage">,
      });
      if (!imageUrl) throw new Error("Could not create a public image URL.");
      toast.success(`${file.name} uploaded to Convex. Save this record to keep its reference.`);

      const page = JSON.parse(editor.content) as Record<string, unknown>;
      if (!page || Array.isArray(page) || typeof page !== "object") {
        throw new Error("Page content must be a JSON object before adding an image.");
      }
      if (target?.kind === "mediaAsset") {
        setEditor({
          ...editor,
          title: editor.title === "New media asset" ? file.name : editor.title,
          content: JSON.stringify({
            ...page,
            mediaType,
            mediaUrl: imageUrl,
            storageId,
            fileName: file.name,
            mimeType: file.type,
            alt: typeof page.alt === "string" && page.alt ? page.alt : file.name,
          }, null, 2),
        });
        return;
      }
      if (target?.kind === "pageHero") {
        setEditor({
          ...editor,
          content: JSON.stringify({
            ...page,
            heroImageUrl: imageUrl,
            heroImageStorageId: storageId,
            heroImageAlt: typeof page.heroImageAlt === "string" && page.heroImageAlt ? page.heroImageAlt : file.name,
          }, null, 2),
        });
        return;
      }
      if (target?.kind === "jsonPath") {
        if (mediaType !== "image") throw new Error("Video uploads are available in page video sections and the media library.");
        const content = storeUploadedImage(page, target.path, imageUrl, storageId);
        setEditor({ ...editor, content: JSON.stringify(content, null, 2) });
        return;
      }
      if (target?.kind === "logo" || target?.kind === "favicon") {
        if (mediaType !== "image") throw new Error("Use an image file for the website logo or favicon.");
        setEditor({
          ...editor,
          content: JSON.stringify({
            ...page,
            [`${target.kind}Url`]: imageUrl,
            [`${target.kind}StorageId`]: storageId,
          }, null, 2),
        });
        return;
      }
      if (target?.kind === "pageBlock") {
        const blocks = Array.isArray(page.blocks) ? [...page.blocks] : [];
        const block = blocks[target.index];
        if (!block || typeof block !== "object" || Array.isArray(block)) {
          throw new Error("The selected image section no longer exists.");
        }
        blocks[target.index] = mediaType === "video"
          ? {
              ...block,
              videoUrl: imageUrl,
              storageId,
              alt: "alt" in block && typeof block.alt === "string" ? block.alt : file.name,
            }
          : {
              ...block,
              imageUrl,
              storageId,
              alt: "alt" in block && typeof block.alt === "string" ? block.alt : file.name,
            };
        setEditor({ ...editor, content: JSON.stringify({ ...page, blocks }, null, 2) });
        return;
      }
      if (target?.kind === "pageCard") {
        const blocks = Array.isArray(page.blocks) ? [...page.blocks] : [];
        const block = blocks[target.index];
        if (!block || typeof block !== "object" || Array.isArray(block)) {
          throw new Error("The selected card section no longer exists.");
        }
        const cards = Array.isArray((block as Record<string, unknown>).cards)
          ? [...(block as { cards: Array<Record<string, unknown>> }).cards]
          : [];
        const card = cards[target.cardIndex];
        if (!card) throw new Error("The selected card no longer exists.");
        cards[target.cardIndex] = { ...card, imageUrl, storageId, alt: typeof card.alt === "string" && card.alt ? card.alt : file.name };
        blocks[target.index] = { ...(block as Record<string, unknown>), cards };
        setEditor({ ...editor, content: JSON.stringify({ ...page, blocks }, null, 2) });
        return;
      }
      if (target?.kind === "pageEntry") {
        const blocks = Array.isArray(page.blocks) ? [...page.blocks] : [];
        const block = blocks[target.index];
        if (!block || typeof block !== "object" || Array.isArray(block)) {
          throw new Error("The selected media section no longer exists.");
        }
        const entries = Array.isArray((block as Record<string, unknown>).entries)
          ? [...(block as { entries: Array<Record<string, unknown>> }).entries]
          : [];
        const entry = entries[target.entryIndex];
        if (!entry) throw new Error("The selected media item no longer exists.");
        entries[target.entryIndex] = { ...entry, imageUrl, storageId, alt: typeof entry.alt === "string" && entry.alt ? entry.alt : file.name };
        blocks[target.index] = { ...(block as Record<string, unknown>), entries };
        setEditor({ ...editor, content: JSON.stringify({ ...page, blocks }, null, 2) });
        return;
      }
      const blocks = Array.isArray(page.blocks) ? page.blocks : [];
      setEditor({
        ...editor,
        content: JSON.stringify(
          {
            ...page,
            blocks: [...blocks, { type: "image", imageUrl, storageId, alt: file.name }],
          },
          null,
          2,
        ),
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const updateSetting = (key: string, value: unknown) => {
    try {
      const current: unknown = JSON.parse(editor.content);
      if (!current || typeof current !== "object" || Array.isArray(current)) {
        throw new Error("Site settings must be a JSON object.");
      }
      setEditor({
        ...editor,
        content: JSON.stringify({ ...current, [key]: value }, null, 2),
      });
      setError(null);
    } catch (settingsError) {
      setError(settingsError instanceof Error ? settingsError.message : "Correct the settings JSON before editing.");
    }
  };

  const clearSiteAsset = (kind: "logo" | "favicon") => {
    try {
      const current: unknown = JSON.parse(editor.content);
      if (!current || typeof current !== "object" || Array.isArray(current)) {
        throw new Error("Site settings must be a JSON object.");
      }
      setEditor({
        ...editor,
        content: JSON.stringify({
          ...current,
          [`${kind}Url`]: "",
          [`${kind}StorageId`]: "",
        }, null, 2),
      });
      setError(null);
    } catch (settingsError) {
      setError(settingsError instanceof Error ? settingsError.message : "Could not remove this site asset.");
    }
  };

  const updateEditorField = (key: string, value: unknown) => {
    try {
      const current: unknown = JSON.parse(editor.content);
      if (!current || typeof current !== "object" || Array.isArray(current)) {
        throw new Error("Content must be a JSON object.");
      }
      setEditor({ ...editor, content: JSON.stringify({ ...current, [key]: value }, null, 2) });
      setError(null);
    } catch (contentError) {
      setError(contentError instanceof Error ? contentError.message : "Could not update this content.");
    }
  };

  const selectMediaAsset = (
    asset: { url: string; storageId: string; mediaType: "image" | "video" },
    blockIndex: number,
    mediaType: "image" | "video",
    cardIndex?: number,
    entryIndex?: number,
  ) => {
    try {
      const page: unknown = JSON.parse(editor.content);
      if (!page || typeof page !== "object" || Array.isArray(page)) throw new Error("Page content must be an object.");
      const content = page as Record<string, unknown>;
      if (blockIndex === -1) {
        setEditor({ ...editor, content: JSON.stringify({ ...content, heroImageUrl: asset.url, heroImageStorageId: asset.storageId }, null, 2) });
        return;
      }
      const blocks = Array.isArray(content.blocks) ? [...content.blocks] : [];
      const block = blocks[blockIndex];
      if (!block || typeof block !== "object" || Array.isArray(block)) throw new Error("The selected page section no longer exists.");
      const blockRecord = block as Record<string, unknown>;
      if (entryIndex !== undefined) {
        const entries = Array.isArray(blockRecord.entries) ? [...blockRecord.entries] : [];
        const entry = entries[entryIndex];
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new Error("The selected media item no longer exists.");
        entries[entryIndex] = { ...(entry as Record<string, unknown>), imageUrl: asset.url, storageId: asset.storageId };
        blocks[blockIndex] = { ...blockRecord, entries };
        setEditor({ ...editor, content: JSON.stringify({ ...content, blocks }, null, 2) });
        setError(null);
        return;
      }
      if (cardIndex !== undefined) {
        const cards = Array.isArray(blockRecord.cards) ? [...blockRecord.cards] : [];
        const card = cards[cardIndex];
        if (!card || typeof card !== "object" || Array.isArray(card)) throw new Error("The selected card no longer exists.");
        cards[cardIndex] = { ...(card as Record<string, unknown>), imageUrl: asset.url, storageId: asset.storageId };
        blocks[blockIndex] = { ...blockRecord, cards };
      } else {
        const mediaKey = mediaType === "video" ? "videoUrl" : "imageUrl";
        blocks[blockIndex] = { ...blockRecord, [mediaKey]: asset.url, storageId: asset.storageId };
      }
      setEditor({ ...editor, content: JSON.stringify({ ...content, blocks }, null, 2) });
      setError(null);
    } catch (selectionError) {
      setError(selectionError instanceof Error ? selectionError.message : "Could not add that media asset.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (signOutError) {
      toast.error(signOutError instanceof Error ? signOutError.message : "Could not sign out.");
    }
  };

  const runInboxAction = async (action: () => Promise<unknown>) => {
    setInboxError(null);
    try {
      await action();
    } catch (actionError) {
      setInboxError(actionError instanceof Error ? actionError.message : "Inbox update failed.");
    }
  };

  const importCurrentContent = async () => {
    setIsImporting(true);
    setImportResult(null);
    try {
      const count = await importModules({ modules: staticModules, settings: siteSettingsContent });
      setImportResult(
        count
          ? `${count} website content areas added or activated. Existing customized records were left unchanged.`
          : "All website content areas are already in the CMS. Existing records were left unchanged.",
      );
    } catch (importError) {
      setImportResult(importError instanceof Error ? importError.message : "Content import failed.");
    } finally {
      setIsImporting(false);
    }
  };

  if (isAdmin === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
        <h1 className="text-2xl font-semibold tracking-tight">CMS access not enabled</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Add this Clerk user ID to the Convex <code>CMS_ADMIN_USER_IDS</code> environment variable:
        </p>
        <code className="mt-4 break-all rounded border bg-muted p-3 text-sm">{userId ?? "Unavailable"}</code>
      </main>
    );
  }

  if (records === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="cms-dashboard min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r bg-card lg:flex lg:flex-col" aria-label="CMS navigation">
          <Link to="/cms" className="flex h-16 items-center gap-3 border-b px-5">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">A</span>
            <span><span className="block text-sm font-semibold">AFRINNET</span><span className="block text-xs text-muted-foreground">Content workspace</span></span>
          </Link>
          <nav className="flex-1 space-y-1 px-3 py-5">
            {navigationItems.map(([panel, label, Icon]) => (
              <button
                key={panel}
                type="button"
                onClick={() => openPanel(panel)}
                aria-current={activePanel === panel ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${activePanel === panel ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon className="size-4" />{label}
                {panel === "pages" && <span className="ml-auto text-xs">{pageRecords.length}</span>}
              </button>
            ))}
          </nav>
          <div className="space-y-2 border-t p-3">
            <Button type="button" variant="outline" className="w-full justify-start" asChild>
              <Link to="/"><Home className="size-4" />View website</Link>
            </Button>
            <Button type="button" variant="ghost" className="w-full justify-start" onClick={() => void handleSignOut()}>
              <LogOut className="size-4" />Sign out
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
            <div>
              <p className="text-xs text-muted-foreground">AFRINNET / CMS</p>
              <h1 className="text-lg font-semibold tracking-tight">{{
                overview: "Overview",
                pages: "Pages",
                content: "Website content",
                media: "Media library",
                settings: "Site settings",
                inbox: "Submissions & inbox",
                team: "CMS staff",
              }[activePanel]}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {canEdit && cmsAccess?.permissions.includes("content") && cmsAccess.permissions.includes("settings") && <Button type="button" variant="outline" size="sm" disabled={isImporting} onClick={() => void importCurrentContent()}>
                {isImporting ? <Loader2 className="size-4 animate-spin" /> : <Layers3 className="size-4" />}
                Import website content
              </Button>}
              {activePanel === "pages" && cmsAccess?.permissions.includes("pages") && (
                <>
                  {canEdit && <Button type="button" variant="outline" size="sm" onClick={() => startEditorialRecord("news")}>News story</Button>}
                  {canEdit && <Button type="button" variant="outline" size="sm" onClick={() => startEditorialRecord("resource")}>Resource</Button>}
                  {canEdit && <Button type="button" size="sm" onClick={startPageTemplate}><Plus className="size-4" />Create page</Button>}
                </>
              )}
              {activePanel === "media" && cmsAccess?.permissions.includes("media") && (
                canEdit && <Button type="button" size="sm" onClick={startNewMedia}><Plus className="size-4" />Upload media</Button>
              )}
              {activePanel === "content" && cmsAccess?.permissions.includes("content") && (
                canEdit && <Button type="button" size="sm" onClick={startNewRecord}><Plus className="size-4" />New content</Button>
              )}
              <Button type="button" variant="ghost" size="icon" className="lg:hidden" asChild aria-label="View website">
                <Link to="/"><Home className="size-4" /></Link>
              </Button>
            </div>
          </header>

          <nav aria-label="CMS sections" className="flex gap-1 overflow-x-auto border-b bg-card px-2 py-2 lg:hidden">
          {navigationItems.map(([panel, label, Icon]) => (
            <button key={panel} type="button" onClick={() => openPanel(panel)} aria-current={activePanel === panel ? "page" : undefined} className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-medium ${activePanel === panel ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
              <Icon className="size-4" />{label}
            </button>
          ))}
          </nav>

          <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {importResult && <p role="status" className="rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground">{importResult}</p>}

            {activePanel === "team" && cmsAccess?.canManageUsers && <CmsUsersManager />}

            {activePanel === "overview" && (
              <section className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div><p className="text-sm text-muted-foreground">Manage your website in one place</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Welcome to AFRINNET CMS</h2></div>
                  {canEdit && cmsAccess?.permissions.includes("pages") && <Button type="button" onClick={startPageTemplate}><Plus className="size-4" />Create a page</Button>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Website pages", value: pageRecords.length, icon: Files, panel: "pages" as const },
                    { label: "Content areas", value: moduleRecords.length, icon: Layers3, panel: "content" as const },
                    { label: "Media assets", value: mediaRecords.length, icon: ImagePlus, panel: "media" as const },
                    { label: "Inbox items", value: (inbox?.submissions.length ?? 0) + (inbox?.enquiries.length ?? 0) + (inbox?.newsletterSignups.length ?? 0), icon: Inbox, panel: "inbox" as const },
                  ].filter(({ panel }) => canAccessPanel(panel)).map(({ label, value, icon: Icon, panel }) => (
                    <button key={label} type="button" onClick={() => openPanel(panel)} className="rounded-xl border bg-card p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow">
                      <span className="flex items-center justify-between text-sm text-muted-foreground"><span>{label}</span><Icon className="size-4" /></span>
                      <span className="mt-4 block text-3xl font-semibold tracking-tight">{value}</span>
                    </button>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {canEdit && cmsAccess?.permissions.includes("pages") && <button type="button" onClick={startPageTemplate} className="rounded-xl border bg-card p-5 text-left hover:border-primary/40"><Files className="size-5 text-primary" /><h3 className="mt-4 font-semibold">Build a page</h3><p className="mt-1 text-sm text-muted-foreground">Create a new route and design its sections visually.</p></button>}
                  {cmsAccess?.permissions.includes("media") && <button type="button" onClick={() => openPanel("media")} className="rounded-xl border bg-card p-5 text-left hover:border-primary/40"><ImagePlus className="size-5 text-primary" /><h3 className="mt-4 font-semibold">Manage media</h3><p className="mt-1 text-sm text-muted-foreground">Add image and video assets to your website.</p></button>}
                  {canEdit && cmsAccess?.permissions.includes("settings") && <button type="button" onClick={startSiteSettings} className="rounded-xl border bg-card p-5 text-left hover:border-primary/40"><Settings2 className="size-5 text-primary" /><h3 className="mt-4 font-semibold">Update site identity</h3><p className="mt-1 text-sm text-muted-foreground">Manage the logo, favicon, brand colors and contact details.</p></button>}
                </div>
              </section>
            )}

            {(activePanel === "pages" || activePanel === "content" || activePanel === "media" || activePanel === "settings") && (
              <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
                <aside aria-label={`${activePanel} records`} className="min-w-0 rounded-xl border bg-card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold">{activePanel === "pages" ? "Pages" : activePanel === "content" ? "Content areas" : activePanel === "media" ? "Media assets" : "Settings"} <span className="text-muted-foreground">({visibleRecords.length})</span></h2>
                    {activePanel === "pages" && canEdit && <Button type="button" size="icon" variant="ghost" aria-label="Create page" onClick={startPageTemplate}><Plus className="size-4" /></Button>}
                    {activePanel === "media" && canEdit && <Button type="button" size="icon" variant="ghost" aria-label="Upload media" onClick={startNewMedia}><Plus className="size-4" /></Button>}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {activePanel === "pages" ? "Build new pages or select an existing page route to edit its shared content." : activePanel === "content" ? "Structured content used by the existing AFRINNET site." : activePanel === "media" ? "Uploaded images and videos are stored with their CMS records." : "Global website identity, navigation and branding."}
                  </p>
                  {activePanel === "pages" && (
                    <div className="mt-4 space-y-3">
                      <label className="block space-y-1.5 text-xs font-medium">Edit an existing site page
                        <select value={selectedPagePath} onChange={(event) => selectPage(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-2 text-xs">
                          <option value="">Select a route…</option>
                          {pagePresets.map((page) => <option key={page.path} value={page.path}>{page.title}</option>)}
                        </select>
                      </label>
                      {canEdit && selectedPagePath && (
                        <Button type="button" variant="outline" className="w-full" onClick={() => startVisualPageOverride(selectedPagePath)}>
                          <Plus className="size-4" />Design this page visually
                        </Button>
                      )}
                    </div>
                  )}
                  {visibleRecords.length === 0 ? (
                    <div className="mt-5 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                      {activePanel === "pages" ? "No custom CMS pages yet. Create a page to build a new route." : activePanel === "media" ? "No standalone media assets yet. Upload a file or add media from the page editor." : activePanel === "settings" ? "Site settings have not loaded yet." : "No content areas are available yet."}
                      {activePanel === "pages" && canEdit && <Button type="button" variant="outline" className="mt-3 w-full" onClick={startPageTemplate}><Plus className="size-4" />Create a page</Button>}
                      {activePanel === "media" && canEdit && <Button type="button" variant="outline" className="mt-3 w-full" onClick={startNewMedia}><Plus className="size-4" />Upload media</Button>}
                    </div>
                  ) : (
                    <ul className="mt-4 divide-y border-y">
                      {visibleRecords.map((record) => (
                  <li key={record._id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(record._id);
                        setActivePanel(record.type === "settings" ? "settings" : record.type === "media" ? "media" : record.path ? "pages" : "content");
                        setSelectedPagePath(record.path ?? "");
                        setEditor({
                          key: record.key,
                          type: record.type,
                          title: record.title,
                          path: record.path ?? "",
                          status: record.status,
                          content: JSON.stringify(record.content, null, 2),
                        });
                        setError(null);
                      }}
                      className={`w-full px-3 py-3 text-left transition-colors hover:bg-muted/60 ${selectedId === record._id ? "bg-primary/10" : ""}`}
                    >
                      <span className="block truncate text-sm font-medium">{record.title}</span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">{record.path || record.type} · {record.status}</span>
                    </button>
                  </li>
                      ))}
                    </ul>
                  )}
                </aside>

          <section className="min-w-0 rounded-xl border bg-card p-4 sm:p-6">
            {editor.key || selectedId ? (
            <form onSubmit={save}>
              <fieldset disabled={!canEdit} className="block min-w-0 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{selectedId ? "Edit content" : "Create content"}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{editor.path || editor.type}</p>
                </div>
                <div className="flex gap-2">
                  {editor.status === "published" && editor.path.startsWith("/") && !editor.path.startsWith("//") && (
                    <Button type="button" variant="outline" asChild>
                      <Link to={editor.path} target="_blank" rel="noreferrer">Preview live page</Link>
                    </Button>
                  )}
                  {selectedId && (
                    <Button type="button" variant="outline" onClick={deleteRecord} disabled={isDeleting} aria-label="Delete record">
                      {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    </Button>
                  )}
                  <Button type="submit" disabled={isSaving || isUploading}>
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Save
                  </Button>
                </div>
              </div>

              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              {pendingUploadFor === editor.key && (
                <p role="status" className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
                  The file is in Convex storage, but this record does not reference it yet. Select <strong>Save</strong> to keep the attachment. If this record is a draft, publish it too before expecting the file to appear on the live website.
                </p>
              )}
              {editor.status === "draft" && (
                <p role="status" className="text-xs text-muted-foreground">
                  Drafts save in Convex but are not shown on the public website until you change Status to Published and save again.
                </p>
              )}
              {editor.type === "settings" && editor.status === "draft" && (
                <p role="status" className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm">
                  Site settings saved as a draft are stored in Convex, but the live website ignores draft settings. To activate a logo, favicon, or other setting, change Status to <strong>Published</strong> and save.
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {["page", "news", "resource"].includes(editor.type) && (
                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">
                  Find content for an existing website page
                  <select
                    value={selectedPagePath}
                    onChange={(event) => selectPage(event.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Choose an existing page</option>
                    {pagePresets.map((page) => (
                      <option key={page.path} value={page.path}>{page.title} · {page.path}</option>
                    ))}
                  </select>
                  <span className="block text-xs font-normal leading-5 text-muted-foreground">
                    Existing pages share editable content areas. Choosing a page opens its related content without replacing the page design. To create a brand-new route, use “Create page”.
                  </span>
                </label>
                )}
                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">
                  Title
                  <Input required value={editor.title} onChange={(event) => setEditor({ ...editor, title: event.target.value })} />
                </label>
                {["page", "news", "resource"].includes(editor.type) && <label className="space-y-1.5 text-sm font-medium">
                  Website path
                  <Input value={editor.path} onChange={(event) => setEditor({ ...editor, path: event.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="/our-work" />
                  <span className="block text-xs font-normal text-muted-foreground">Use a route starting with /, for example /our-work. Add it to Site settings → navigation if it should appear in the main menu.</span>
                </label>}
                <label className="space-y-1.5 text-sm font-medium">
                  Status
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editor.status}
                    onChange={(event) => setEditor({ ...editor, status: event.target.value as EditorState["status"] })}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>

              {["page", "news", "resource"].includes(editor.type) ? (
                <CmsPageEditor
                  title={editor.title}
                  value={editor.content}
                  onChange={(content) => setEditor({ ...editor, content })}
                  mediaLibrary={mediaLibrary}
                  onSelectMedia={selectMediaAsset}
                  onUploadMedia={(file, index, mediaType, cardIndex, entryIndex) => {
                    if (index === -1) return void uploadMedia(file, { kind: "pageHero" }, mediaType);
                    if (cardIndex !== undefined) return void uploadMedia(file, { kind: "pageCard", index, cardIndex }, mediaType);
                    if (entryIndex !== undefined) return void uploadMedia(file, { kind: "pageEntry", index, entryIndex }, mediaType);
                    return void uploadMedia(file, { kind: "pageBlock", index }, mediaType);
                  }}
                  isUploading={isUploading}
                />
              ) : editor.type === "media" ? (
                <div className="space-y-6">
                  {(() => {
                    let media: Record<string, unknown> = {};
                    try {
                      const parsed: unknown = JSON.parse(editor.content);
                      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) media = parsed as Record<string, unknown>;
                    } catch {
                      return <p role="alert" className="text-sm text-destructive">Correct the media record before editing.</p>;
                    }
                    const mediaType = media.mediaType === "video" ? "video" : "image";
                    const mediaUrl = typeof media.mediaUrl === "string" ? media.mediaUrl : "";
                    return (
                      <>
                        <section className="space-y-4">
                          <div><h3 className="font-semibold">Add an image or video</h3><p className="mt-1 text-sm text-muted-foreground">Upload an asset to Convex storage, or add an existing HTTPS URL.</p></div>
                          {mediaUrl && (mediaType === "video"
                            ? <video controls playsInline preload="metadata" src={mediaUrl} className="max-h-80 w-full rounded-lg bg-black" />
                            : <img src={mediaUrl} alt={typeof media.alt === "string" ? media.alt : ""} className="max-h-80 rounded-lg object-contain" />)}
                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-1.5 text-sm font-medium">Asset type
                              <select value={mediaType} onChange={(event) => updateEditorField("mediaType", event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                                <option value="image">Image</option><option value="video">Video</option>
                              </select>
                            </label>
                            <label className="space-y-1.5 text-sm font-medium">Alternative text / description
                              <Input value={typeof media.alt === "string" ? media.alt : ""} onChange={(event) => updateEditorField("alt", event.target.value)} />
                            </label>
                            <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Media URL
                              <Input value={mediaUrl} onChange={(event) => updateEditorField("mediaUrl", event.target.value)} placeholder="Paste an HTTPS URL, or upload below" />
                            </label>
                          </div>
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-muted">
                            <ImagePlus className="size-4" />{isUploading ? "Uploading…" : `Upload ${mediaType}`}
                            <input type="file" accept={mediaType === "video" ? "video/mp4,video/webm,video/quicktime" : "image/png,image/jpeg,image/webp,image/gif"} disabled={isUploading} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void uploadMedia(file, { kind: "mediaAsset" }, mediaType); }} />
                          </label>
                          <p className="text-xs text-muted-foreground">Images up to 10 MB; MP4, WebM, or QuickTime video up to 20 MB.</p>
                        </section>
                        <details className="border-t pt-4">
                          <summary className="cursor-pointer text-sm font-medium">Asset details</summary>
                          <div className="mt-3 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
                            <p>File: {typeof media.fileName === "string" ? media.fileName : "Not uploaded"}</p>
                            <p>MIME type: {typeof media.mimeType === "string" ? media.mimeType : "—"}</p>
                          </div>
                        </details>
                      </>
                    );
                  })()}
                </div>
              ) : editor.type === "settings" ? (
                <div className="space-y-8">
                  {(() => {
                    let settings: Record<string, unknown> = {};
                    try {
                      const parsed: unknown = JSON.parse(editor.content);
                      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                        settings = parsed as Record<string, unknown>;
                      }
                    } catch {
                      return <p role="alert" className="text-sm text-destructive">Correct the settings JSON below to continue editing these fields.</p>;
                    }
                    const meta = settings.siteMeta && typeof settings.siteMeta === "object" && !Array.isArray(settings.siteMeta)
                      ? settings.siteMeta as Record<string, unknown>
                      : {};
                    const updateMeta = (key: string, value: string) =>
                      updateSetting("siteMeta", { ...meta, [key]: value });
                    const theme = settings.theme && typeof settings.theme === "object" && !Array.isArray(settings.theme)
                      ? settings.theme as Record<string, unknown>
                      : {};
                    const updateTheme = (key: string, value: string) => updateSetting("theme", { ...theme, [key]: value });
                    return (
                      <>
                        <section className="space-y-4">
                          <h3 className="text-sm font-semibold">Brand identity and contact</h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-1.5 text-sm font-medium">Website name
                              <Input value={typeof meta.name === "string" ? meta.name : ""} onChange={(event) => updateMeta("name", event.target.value)} />
                            </label>
                            <label className="space-y-1.5 text-sm font-medium">Contact email
                              <Input type="email" value={typeof settings.contactEmail === "string" ? settings.contactEmail : ""} onChange={(event) => updateSetting("contactEmail", event.target.value.trim())} placeholder="info@example.org" />
                            </label>
                            <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Website description
                              <Textarea value={typeof meta.description === "string" ? meta.description : ""} onChange={(event) => updateMeta("description", event.target.value)} />
                            </label>
                            <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Tagline
                              <Input value={typeof meta.tagline === "string" ? meta.tagline : ""} onChange={(event) => updateMeta("tagline", event.target.value)} />
                            </label>
                          </div>
                        </section>

                        <section className="grid gap-6 border-t pt-6 md:grid-cols-2">
                          {(["logo", "favicon"] as const).map((kind) => {
                            const url = typeof settings[`${kind}Url`] === "string" ? settings[`${kind}Url`] as string : "";
                            return (
                              <div key={kind} className="space-y-3">
                                <h3 className="text-sm font-semibold">{kind === "logo" ? "Website logo" : "Browser favicon"}</h3>
                                {url && <img src={url} alt={`${kind} preview`} className={kind === "favicon" ? "size-12 object-contain" : "h-16 max-w-56 object-contain"} />}
                                <div className="flex flex-wrap gap-2">
                                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
                                    <ImagePlus className="size-4" />
                                    {assetUpload === kind ? "Uploading…" : `Upload ${kind}`}
                                    <input
                                      type="file"
                                      accept="image/png,image/jpeg,image/webp,image/gif,image/x-icon"
                                      disabled={isUploading}
                                      className="sr-only"
                                      onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        event.target.value = "";
                                        if (!file) return;
                                        setAssetUpload(kind);
                                        void uploadMedia(file, { kind }).finally(() => setAssetUpload(null));
                                      }}
                                    />
                                  </label>
                                  {url && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => clearSiteAsset(kind)}
                                    >
                                      <Trash2 className="size-4" />Remove
                                    </Button>
                                  )}
                                </div>
                                <p className="text-xs leading-5 text-muted-foreground">
                                  {kind === "logo" ? "Used in the website header, footer and portal." : "Used in the browser tab. A square PNG or ICO works best."}
                                </p>
                              </div>
                            );
                          })}
                        </section>

                        <section className="space-y-4 border-t pt-6">
                          <div><h3 className="text-sm font-semibold">Website color palette</h3><p className="mt-1 text-xs text-muted-foreground">These brand colors are applied to the live website.</p></div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {[
                              ["primary", "Primary brand color", "#cc2c24"],
                              ["background", "Website background", "#e9eaec"],
                              ["surface", "Card / surface color", "#d4d6d8"],
                            ].map(([key, label, fallback]) => (
                              <label key={key} className="flex items-center gap-3 rounded-lg border p-3 text-sm font-medium">
                                <input type="color" aria-label={label} value={typeof theme[key] === "string" && /^#[0-9a-fA-F]{6}$/.test(theme[key] as string) ? theme[key] as string : fallback} onChange={(event) => updateTheme(key, event.target.value)} className="size-10 cursor-pointer rounded border-0 bg-transparent p-0" />
                                <span><span className="block">{label}</span><span className="text-xs font-normal text-muted-foreground">{typeof theme[key] === "string" ? theme[key] as string : fallback}</span></span>
                              </label>
                            ))}
                          </div>
                        </section>

                        <section className="space-y-4 border-t pt-6">
                          <h3 className="text-sm font-semibold">Announcement bar</h3>
                          {(() => {
                            const announcementSettings = settings.announcement && typeof settings.announcement === "object" && !Array.isArray(settings.announcement)
                              ? settings.announcement as Record<string, unknown>
                              : {};
                            return (
                              <div className="grid gap-4 sm:grid-cols-2">
                                <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
                                  <input type="checkbox" checked={announcementSettings.enabled === true} onChange={(event) => updateSetting("announcement", { ...announcementSettings, enabled: event.target.checked })} />
                                  Show announcement bar
                                </label>
                                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Announcement text
                                  <Textarea value={typeof announcementSettings.text === "string" ? announcementSettings.text : ""} onChange={(event) => updateSetting("announcement", { ...announcementSettings, text: event.target.value })} />
                                </label>
                                <label className="space-y-1.5 text-sm font-medium">Link label
                                  <Input value={typeof announcementSettings.linkLabel === "string" ? announcementSettings.linkLabel : ""} onChange={(event) => updateSetting("announcement", { ...announcementSettings, linkLabel: event.target.value })} />
                                </label>
                                <label className="space-y-1.5 text-sm font-medium">Link destination
                                  <Input value={typeof announcementSettings.href === "string" ? announcementSettings.href : ""} onChange={(event) => updateSetting("announcement", { ...announcementSettings, href: event.target.value })} />
                                </label>
                              </div>
                            );
                          })()}
                        </section>

                        <details className="border-t pt-5">
                          <summary className="cursor-pointer text-sm font-semibold">Navigation, footer and other site elements</summary>
                          <p className="mt-2 text-xs leading-5 text-muted-foreground">Edit nested menus, footer links, calls to action and site metadata with the structured editor.</p>
                          <CmsJsonEditor
                            value={editor.content}
                            onChange={(content) => setEditor({ ...editor, content })}
                            onUploadImage={(file, path) => void uploadMedia(file, { kind: "jsonPath", path })}
                            isUploading={isUploading}
                          />
                        </details>
                      </>
                    );
                  })()}
                </div>
              ) : editor.key === "module:homepage" ? (
                <div className="space-y-5">
                  <CmsHomepageSectionsEditor
                    value={editor.content}
                    onChange={(content) => setEditor({ ...editor, content })}
                  />
                  <details className="rounded-lg border p-4">
                    <summary className="cursor-pointer text-sm font-semibold">Edit homepage text, links and images</summary>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">These structured fields supply the existing homepage sections. Reorder or hide sections above; edit their copy and links here.</p>
                    <CmsJsonEditor
                      value={editor.content}
                      onChange={(content) => setEditor({ ...editor, content })}
                      onUploadImage={(file, path) => void uploadMedia(file, { kind: "jsonPath", path })}
                      isUploading={isUploading}
                    />
                  </details>
                </div>
              ) : (
                <CmsJsonEditor
                  value={editor.content}
                  onChange={(content) => setEditor({ ...editor, content })}
                  onUploadImage={(file, path) => void uploadMedia(file, { kind: "jsonPath", path })}
                  isUploading={isUploading}
                />
              )}
              <details className="border-t pt-4">
                <summary className="cursor-pointer text-sm font-medium">Advanced record settings</summary>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1.5 text-xs font-medium">Record key
                    <Input required value={editor.key} onChange={(event) => setEditor({ ...editor, key: event.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-xs font-medium">Record type
                    <Input required value={editor.type} onChange={(event) => setEditor({ ...editor, type: event.target.value })} />
                  </label>
                </div>
              </details>
              </fieldset>
            </form>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                  {activePanel === "pages" ? <Files className="size-5" /> : activePanel === "media" ? <ImagePlus className="size-5" /> : <Layers3 className="size-5" />}
                </span>
                <h2 className="mt-4 text-lg font-semibold">
                  {activePanel === "pages" ? "Select a page or start a new one" : activePanel === "media" ? "Your media library is ready" : activePanel === "settings" ? "Site settings are ready" : "Choose a content area to edit"}
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {activePanel === "pages" ? "Create a new page with visual sections, images, video, cards and design controls. Existing routes can be selected from the menu on the left." : activePanel === "media" ? "Upload a reusable image or video, or add media directly from a page section." : activePanel === "settings" ? "Open global settings to update brand identity, favicon, navigation and color palette." : "Select an area from the content list to edit the live website copy and media."}
                </p>
                {activePanel === "pages" && <Button type="button" className="mt-5" onClick={startPageTemplate}><Plus className="size-4" />Create page</Button>}
                {activePanel === "media" && <Button type="button" className="mt-5" onClick={startNewMedia}><Plus className="size-4" />Upload media</Button>}
                {activePanel === "content" && <Button type="button" className="mt-5" onClick={startNewRecord}><Plus className="size-4" />New content area</Button>}
                {activePanel === "settings" && <Button type="button" className="mt-5" onClick={startSiteSettings}><Settings2 className="size-4" />Open settings</Button>}
              </div>
            )}
          </section>
        </div>

            )}

        {activePanel === "inbox" && <section className="rounded-xl border bg-card p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Operations</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">Intake inbox</h2>
            </div>
            <p className="text-sm text-muted-foreground">Manage submitted records and contact requests.</p>
          </div>
          {inboxError && <p role="alert" className="mt-4 text-sm text-destructive">{inboxError}</p>}
          {!inbox ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading inbox</div>
          ) : (
            <div className="mt-6 grid gap-10 xl:grid-cols-3">
              <section>
                <h3 className="border-b pb-2 text-sm font-semibold">Innovation submissions ({inbox.submissions.length})</h3>
                <ul className="divide-y">
                  {inbox.submissions.map((item) => (
                    <li key={item._id} className="space-y-2 py-4">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.applicantName} · {item.applicantEmail}</p>
                      <p className="text-xs text-muted-foreground">{item.reference} · {new Date(item.createdAt).toLocaleDateString()}</p>
                      <div className="flex items-center gap-2">
                        <select aria-label={`Status for ${item.reference}`} value={item.status} onChange={(event) => void runInboxAction(() => setSubmissionStatus({ id: item._id, status: event.target.value as "received" | "reviewing" | "contacted" | "closed" }))} className="h-9 rounded-md border bg-background px-2 text-sm">
                          <option value="received">Received</option><option value="reviewing">Reviewing</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
                        </select>
                        <Button type="button" size="icon" variant="ghost" aria-label={`Delete ${item.reference}`} onClick={() => { if (window.confirm(`Delete submission ${item.reference}?`)) void runInboxAction(() => removeSubmission({ id: item._id })); }}><Trash2 className="size-4" /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="border-b pb-2 text-sm font-semibold">Enquiries ({inbox.enquiries.length})</h3>
                <ul className="divide-y">
                  {inbox.enquiries.map((item) => (
                    <li key={item._id} className="space-y-2 py-4">
                      <p className="font-medium">{item.subject || item.type}</p>
                      <p className="text-sm text-muted-foreground">{item.name} · {item.email}</p>
                      <details className="text-sm leading-6">
                        <summary className="cursor-pointer text-muted-foreground">Read enquiry</summary>
                        <p className="mt-2 whitespace-pre-wrap">{item.message}</p>
                        {(item.customFields ?? []).length > 0 && (
                          <dl className="mt-3 space-y-2 border-t pt-3">
                            {(item.customFields ?? []).map((field, fieldIndex) => (
                              <div key={`${field.label}-${fieldIndex}`}>
                                <dt className="text-xs font-semibold">{field.label}</dt>
                                <dd className="whitespace-pre-wrap text-sm">{field.value || "—"}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                      </details>
                      <div className="flex items-center gap-2">
                        <select aria-label={`Status for ${item.name}`} value={item.status} onChange={(event) => void runInboxAction(() => setEnquiryStatus({ id: item._id, status: event.target.value as "received" | "reviewing" | "contacted" | "closed" }))} className="h-9 rounded-md border bg-background px-2 text-sm">
                          <option value="received">Received</option><option value="reviewing">Reviewing</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
                        </select>
                        <Button type="button" size="icon" variant="ghost" aria-label={`Delete enquiry from ${item.name}`} onClick={() => { if (window.confirm(`Delete enquiry from ${item.name}?`)) void runInboxAction(() => removeEnquiry({ id: item._id })); }}><Trash2 className="size-4" /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="border-b pb-2 text-sm font-semibold">Newsletter signups ({inbox.newsletterSignups.length})</h3>
                <ul className="divide-y">
                  {inbox.newsletterSignups.map((item) => (
                    <li key={item._id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-medium">{item.email}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Button type="button" size="icon" variant="ghost" aria-label={`Remove ${item.email}`} onClick={() => { if (window.confirm(`Remove ${item.email} from the newsletter list?`)) void runInboxAction(() => removeNewsletterSignup({ id: item._id })); }}><Trash2 className="size-4" /></Button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </section>}
          </div>
        </div>
      </div>
    </main>
  );
}