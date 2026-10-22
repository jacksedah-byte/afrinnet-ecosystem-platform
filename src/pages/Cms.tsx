import { useConvex, useMutation, useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CmsPageEditor } from "@/components/site/CmsPageEditor";
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
import * as ipContent from "@/content/ip";
import * as leadershipContent from "@/content/leadership";
import * as resourcesContent from "@/content/resources";
import { coreServices, journeySteps, servicePages } from "@/content/services";
import { roadmapPhases } from "@/content/site";
import { Home, ImagePlus, Loader2, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
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
  { path: "/", title: "Home" },
  { path: "/about", title: "About AFRINNET" },
  { path: "/about/mission-vision", title: "Mission, Vision & Strategy" },
  { path: "/leadership", title: "Leadership" },
  { path: "/leadership/founder", title: "Founder Profile" },
  { path: "/leadership/founder/story", title: "Founder Story" },
  { path: "/leadership/executive", title: "Executive Profile" },
  { path: "/leadership/board", title: "Board" },
  { path: "/leadership/management", title: "Management" },
  { path: "/leadership/governance", title: "Governance" },
  { path: "/ecosystem", title: "Ecosystem" },
  { path: "/ecosystem/discovery", title: "Innovation Discovery" },
  { path: "/ecosystem/verification", title: "Innovation Verification" },
  { path: "/ecosystem/networks", title: "Institutional Networks" },
  { path: "/ecosystem/incubation", title: "Incubation & Readiness" },
  { path: "/ip", title: "IP Services" },
  { path: "/ip/patents", title: "Patents" },
  { path: "/ip/trademarks", title: "Trademarks" },
  { path: "/ip/copyright", title: "Copyright" },
  { path: "/ip/industrial-designs", title: "Industrial Designs" },
  { path: "/ip/readiness", title: "IP Readiness" },
  { path: "/engage/government", title: "Government & Public Institutions" },
  { path: "/engage/universities", title: "Universities & Research" },
  { path: "/engage/tvet", title: "TVET Institutions" },
  { path: "/engage/schools", title: "Schools & Student Innovators" },
  { path: "/engage/startups", title: "Startups & Industry" },
  { path: "/engage/partners", title: "Development Partners" },
  { path: "/knowledge", title: "Knowledge Centre" },
  { path: "/knowledge/publications", title: "Publications" },
  { path: "/news", title: "News & Events" },
  { path: "/submit", title: "Submit an Innovation" },
  { path: "/partnerships", title: "Partnerships" },
  { path: "/request-ip-support", title: "Request IP Support" },
  { path: "/contact", title: "Contact" },
  { path: "/privacy", title: "Privacy Policy" },
  { path: "/terms", title: "Terms of Use" },
  { path: "/accessibility", title: "Accessibility" },
];

const staticModules = [
  { key: "about" as const, title: "About and mission content", content: aboutContent },
  { key: "audiences" as const, title: "Audience and stakeholder content", content: audiencesContent },
  { key: "founderStory" as const, title: "Founder story content", content: founderStoryContent },
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
    roadmapPhases,
  } },
];

function pageTemplate(title: string) {
  return {
    eyebrow: "AFRINNET Foundation",
    title,
    introduction: "Write a concise introduction for this page.",
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
  const isAdmin = useQuery(api.cms.isAdmin, {});
  const recordsResult = useQuery(api.cms.list, isAdmin ? {} : "skip");
  const records = recordsResult as Doc<"siteContent">[] | undefined;
  const inboxResult = useQuery(api.cms.inbox, isAdmin ? {} : "skip");
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
  const [inboxError, setInboxError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [assetUpload, setAssetUpload] = useState<"logo" | "favicon" | null>(null);

  const startNewRecord = () => {
    setSelectedId(null);
    setEditor(emptyEditor);
    setError(null);
  };

  const startSiteSettings = () => {
    const existing = records?.find((record) => record.key === "site-settings");
    if (existing) {
      setSelectedId(existing._id);
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
    setEditor({
      key: "site-settings",
      type: "settings",
      title: "Site-wide settings",
      path: "",
      status: "draft",
      content: JSON.stringify(
        {
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
        },
        null,
        2,
      ),
    });
    setError(null);
  };

  const startPageTemplate = () => {
    setSelectedId(null);
    setEditor({
      ...emptyEditor,
      key: `page-${Date.now().toString(36)}`,
      title: "Page title",
      content: JSON.stringify(pageTemplate("Page title"), null, 2),
    });
    setError(null);
  };

  const startEditorialRecord = (kind: "news" | "resource") => {
    const title = kind === "news" ? "News story title" : "Resource title";
    const slug = `${kind}-${Date.now().toString(36)}`;
    setSelectedId(null);
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

  const selectPage = (path: string) => {
    const preset = pagePresets.find((page) => page.path === path);
    if (!preset) return;
    const existing = records?.find((record) => record.path === path);
    if (existing) {
      setSelectedId(existing._id);
      setEditor({
        key: existing.key,
        type: existing.type,
        title: existing.title,
        path: existing.path ?? "",
        status: existing.status,
        content: JSON.stringify(existing.content, null, 2),
      });
    } else {
      setSelectedId(null);
      setEditor({
        ...emptyEditor,
        key: `page-${path === "/" ? "home" : path.slice(1).replace(/\//g, "-")}`,
        title: preset.title,
        path,
        content: JSON.stringify(pageTemplate(preset.title), null, 2),
      });
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
      startNewRecord();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this record.");
    } finally {
      setIsDeleting(false);
    }
  };

  const uploadImage = async (
    file?: File,
    target?:
      | { kind: "pageBlock"; index: number }
      | { kind: "jsonPath"; path: JsonPath }
      | { kind: "logo" | "favicon" },
  ) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      setError("Choose a raster image file such as PNG, JPEG, or WebP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Images must be smaller than 10 MB.");
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
      const uploadUrl = await createUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("Image upload failed.");
      const { storageId } = (await response.json()) as { storageId: string };
      const imageUrl = await convex.query(api.cms.getStorageUrl, {
        storageId: storageId as GenericId<"_storage">,
      });
      if (!imageUrl) throw new Error("Could not create a public image URL.");

      const page = JSON.parse(editor.content) as Record<string, unknown>;
      if (!page || Array.isArray(page) || typeof page !== "object") {
        throw new Error("Page content must be a JSON object before adding an image.");
      }
      if (target?.kind === "jsonPath") {
        const content = storeUploadedImage(page, target.path, imageUrl, storageId);
        setEditor({ ...editor, content: JSON.stringify(content, null, 2) });
        return;
      }
      if (target?.kind === "logo" || target?.kind === "favicon") {
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
        blocks[target.index] = {
          ...block,
          imageUrl,
          storageId,
          alt: "alt" in block && typeof block.alt === "string" ? block.alt : file.name,
        };
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
      const count = await importModules({ modules: staticModules });
      setImportResult(`${count} content modules imported as drafts. Existing CMS records were left unchanged.`);
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
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">AFRINNET</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Content management</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" asChild>
              <Link to="/"><Home className="size-4" />View website</Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => void handleSignOut()}>
              <LogOut className="size-4" />Sign out
            </Button>
            <Button type="button" variant="outline" disabled={isImporting} onClick={() => void importCurrentContent()}>
              {isImporting && <Loader2 className="size-4 animate-spin" />}
              Import current content
            </Button>
            <Button type="button" variant="outline" onClick={() => startEditorialRecord("news")}>
              News story
            </Button>
            <Button type="button" variant="outline" onClick={() => startEditorialRecord("resource")}>
              Knowledge resource
            </Button>
            <Button type="button" variant="outline" onClick={startSiteSettings}>
              Site settings
            </Button>
            <Button type="button" variant="outline" onClick={startPageTemplate}>
              Page template
            </Button>
            <Button type="button" onClick={startNewRecord}>
              <Plus className="size-4" />
              New record
            </Button>
          </div>
        </header>
        {importResult && <p role="status" className="mt-4 text-sm text-muted-foreground">{importResult}</p>}

        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside aria-label="Content records">
            <h2 className="text-sm font-semibold">Content records <span className="text-muted-foreground">({records.length})</span></h2>
            {records.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No records yet.</p>
            ) : (
              <ul className="mt-3 divide-y border-y">
                {records.map((record) => (
                  <li key={record._id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(record._id);
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
                      className={`w-full px-3 py-3 text-left transition-colors hover:bg-muted/60 ${selectedId === record._id ? "bg-muted" : ""}`}
                    >
                      <span className="block truncate text-sm font-medium">{record.title}</span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">{record.type} · {record.status}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <section className="min-w-0 border-t pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <form onSubmit={save} className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{selectedId ? "Edit content" : "Create content"}</h2>
                <div className="flex gap-2">
                  {selectedId && (
                    <Button type="button" variant="outline" onClick={deleteRecord} disabled={isDeleting} aria-label="Delete record">
                      {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    </Button>
                  )}
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Save
                  </Button>
                </div>
              </div>

              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">
                  Start from an existing website page
                  <select
                    value={editor.path}
                    onChange={(event) => selectPage(event.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Choose a page or create a new one</option>
                    {pagePresets.map((page) => (
                      <option key={page.path} value={page.path}>{page.title} · {page.path}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  Record key
                  <Input required value={editor.key} onChange={(event) => setEditor({ ...editor, key: event.target.value })} placeholder="about-intro" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  Content type
                  <Input required value={editor.type} onChange={(event) => setEditor({ ...editor, type: event.target.value })} placeholder="page, news, profile..." />
                </label>
                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">
                  Title
                  <Input required value={editor.title} onChange={(event) => setEditor({ ...editor, title: event.target.value })} />
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  Website path
                  <Input value={editor.path} onChange={(event) => setEditor({ ...editor, path: event.target.value })} placeholder="/about" />
                </label>
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
                  onUploadImage={(file, index) => void uploadImage(file, { kind: "pageBlock", index })}
                  isUploading={isUploading}
                />
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
                                        void uploadImage(file, { kind }).finally(() => setAssetUpload(null));
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
                          <summary className="cursor-pointer text-sm font-semibold">Advanced settings (JSON)</summary>
                          <Textarea value={editor.content} onChange={(event) => setEditor({ ...editor, content: event.target.value })} className="mt-4 min-h-[360px] font-mono text-xs leading-5" spellCheck={false} />
                        </details>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <CmsJsonEditor
                  value={editor.content}
                  onChange={(content) => setEditor({ ...editor, content })}
                  onUploadImage={(file, path) => void uploadImage(file, { kind: "jsonPath", path })}
                  isUploading={isUploading}
                />
              )}
            </form>
          </section>
        </div>

        <section className="mt-14 border-t pt-8">
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
        </section>
      </div>
    </main>
  );
}