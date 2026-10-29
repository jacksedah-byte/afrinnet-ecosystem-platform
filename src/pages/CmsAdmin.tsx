import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Archive,
  FilePlus2,
  Image,
  LayoutDashboard,
  Loader2,
  Mail,
  Newspaper,
  Pencil,
  Plus,
  Save,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CmsSectionEditor } from "@/components/cms/CmsSectionEditor";
import { CmsDesignEditor } from "@/components/cms/CmsDesignEditor";
import CmsMediaLibrary from "@/components/cms/CmsMediaLibrary";
import type { CmsMediaAsset } from "@/components/cms/CmsMediaLibrary";
import { Panel } from "@/components/cms/Panel";
import { defaultSiteConfiguration } from "@/hooks/use-site-configuration";
import type { CmsSection } from "@/lib/cms-content";

type Section =
  | "overview"
  | "pages"
  | "news"
  | "resources"
  | "settings"
  | "media"
  | "submissions"
  | "enquiries"
  | "subscribers"
  | "admins";

type ContentItem = {
  _id: Id<"cmsContent">;
  type: string;
  slug: string;
  path?: string;
  title: string;
  summary?: string;
  body: string;
  sections?: CmsSection[];
  published: boolean;
  updatedAt: number;
};

const SECTIONS: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "pages", label: "Pages", icon: FilePlus2 },
  { id: "news", label: "News & events", icon: Newspaper },
  { id: "resources", label: "Resources", icon: Archive },
  { id: "settings", label: "Site settings", icon: LayoutDashboard },
  { id: "media", label: "Media library", icon: Image },
  { id: "submissions", label: "Submissions", icon: FilePlus2 },
  { id: "enquiries", label: "Enquiries", icon: Mail },
  { id: "subscribers", label: "Subscribers", icon: Users },
  { id: "admins", label: "Administrators", icon: Shield },
];

const INTAKE_STATUSES = ["received", "reviewing", "approved", "rejected", "archived"];

function Empty({ children }: { children: ReactNode }) {
  return <p className="py-8 text-center text-sm text-ash">{children}</p>;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

function ContentEditor({
  initial,
  defaultType = "page",
  media,
  onSave,
  onCancel,
}: {
  initial?: ContentItem;
  defaultType?: string;
  onSave: (value: {
    id?: Id<"cmsContent">;
    type: string;
    slug: string;
    path?: string;
    title: string;
    summary?: string;
    body: string;
    sections?: CmsSection[];
    published: boolean;
  }) => Promise<void>;
  media: CmsMediaAsset[];
  onCancel: () => void;
}) {
  const [type, setType] = useState(initial?.type ?? defaultType);
  const [slug, setSlug] = useState(
    initial?.slug ?? (defaultType === "settings" ? "global" : ""),
  );
  const [path, setPath] = useState(initial?.path ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [body, setBody] = useState(
    initial?.body ??
      (defaultType === "settings"
        ? JSON.stringify(defaultSiteConfiguration, null, 2)
        : ""),
  );
  const [published, setPublished] = useState(initial?.published ?? false);
  const [sections, setSections] = useState<CmsSection[]>(initial?.sections ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        id: initial?._id,
        type,
        slug,
        path:
          type === "page"
            ? path
            : type === "news"
              ? path || `/news/${slug}`
              : type === "resource"
                ? path || `/knowledge/${slug}`
                : undefined,
        title,
        summary,
        body,
        sections: type === "page" ? sections : undefined,
        published,
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save this item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border border-white/10 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm text-ash">
          Content type
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="h-10 w-full rounded-md border border-white/15 bg-obsidian px-3 text-chalk"
          >
            <option value="page">Website page</option>
            <option value="news">News / event</option>
            <option value="resource">Knowledge resource</option>
            <option value="settings">Global site settings</option>
          </select>
        </label>
        <label className="space-y-1.5 text-sm text-ash">
          Unique slug
          <Input required maxLength={120} value={slug} onChange={(event) => setSlug(event.target.value)} />
        </label>
      </div>
      {(type === "page" || type === "news" || type === "resource") && (
        <label className="block space-y-1.5 text-sm text-ash">
          {type === "page"
            ? "Website path (publishing replaces that page with this content)"
            : "Website path (optional; defaults to a generated article URL)"}
          <Input
            required={type === "page"}
            placeholder={
              type === "page"
                ? "/about"
                : type === "news"
                  ? `/news/${slug || "article-slug"}`
                  : `/knowledge/${slug || "resource-slug"}`
            }
            value={path}
            onChange={(event) => setPath(event.target.value)}
          />
        </label>
      )}
      <label className="block space-y-1.5 text-sm text-ash">
        Title
        <Input required maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="block space-y-1.5 text-sm text-ash">
        Summary
        <Textarea
          rows={2}
          maxLength={1000}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
      </label>
      {type === "settings" && <CmsDesignEditor body={body} onChange={setBody} />}
      {type === "page" && (
        <CmsSectionEditor
          sections={sections}
          media={media}
          title={title}
          summary={summary}
          onChange={setSections}
        />
      )}
      <label className="block space-y-1.5 text-sm text-ash">
        {type === "settings"
          ? "Advanced site configuration JSON"
          : type === "page"
            ? sections.length
              ? "Fallback body (hidden while sections are present)"
              : "Main content"
            : "Main content"}
        <Textarea
          rows={type === "settings" ? 14 : 8}
          maxLength={100000}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={
            type === "settings"
              ? "Edit the complete site configuration as JSON."
              : "Write the page or article content. Separate paragraphs with a blank line."
          }
          className={type === "settings" ? "font-mono text-xs" : undefined}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-chalk">
        <input
          type="checkbox"
          checked={published}
          onChange={(event) => setPublished(event.target.checked)}
          className="size-4 accent-innovation"
        />
        Published and visible on the public website
      </label>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function CmsAdmin() {
  const [section, setSection] = useState<Section>("overview");
  const [editing, setEditing] = useState<ContentItem | "new" | null>(null);
  const [notice, setNotice] = useState("");
  const overview = useQuery(api.cms.overview);
  const contents = useQuery(api.cms.listContent);
  const submissions = useQuery(api.cms.listSubmissions);
  const enquiries = useQuery(api.cms.listEnquiries);
  const subscribers = useQuery(api.cms.listSubscribers);
  const admins = useQuery(api.cms.listAdmins);
  const media = useQuery(api.cms.listMedia);
  const saveContent = useMutation(api.cms.saveContent);
  const deleteContent = useMutation(api.cms.deleteContent);
  const setSubmissionStatus = useMutation(api.cms.setSubmissionStatus);
  const setEnquiryStatus = useMutation(api.cms.setEnquiryStatus);
  const addAdmin = useMutation(api.cms.addAdmin);
  const removeAdmin = useMutation(api.cms.removeAdmin);

  const visibleContents = useMemo(() => {
    const type =
      section === "pages"
        ? "page"
        : section === "news"
          ? "news"
          : section === "resources"
            ? "resource"
            : "settings";
    return (contents ?? []).filter((item) => item.type === type);
  }, [contents, section]);

  const saveItem = async (item: {
    id?: Id<"cmsContent">;
    type: string;
    slug: string;
    path?: string;
    title: string;
    summary?: string;
    body: string;
    sections?: CmsSection[];
    published: boolean;
  }) => {
    await saveContent(item);
    setEditing(null);
    setNotice("Content saved.");
  };

  const removeItem = async (id: Id<"cmsContent">) => {
    if (!window.confirm("Delete this content item? This cannot be undone.")) return;
    try {
      await deleteContent({ id });
      setNotice("Content deleted.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete content.");
    }
  };

  const updateStatus = async (
    kind: "submission" | "enquiry",
    id: string,
    status: string,
  ) => {
    try {
      if (kind === "submission") {
        await setSubmissionStatus({ id: id as Id<"innovationSubmissions">, status });
      } else {
        await setEnquiryStatus({ id: id as Id<"enquiries">, status });
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update status.");
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-chalk">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="afr-eyebrow text-innovation">AFRINNET administration</p>
            <h1 className="mt-1 font-display text-2xl font-bold">Website CMS</h1>
          </div>
          <p className="text-sm text-ash">Manage content, enquiries and access</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 lg:grid-cols-[220px_1fr]">
        <nav aria-label="CMS sections" className="flex gap-2 overflow-x-auto lg:flex-col">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSection(id);
                setEditing(null);
                setNotice("");
              }}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
                section === id
                  ? "bg-innovation text-obsidian"
                  : "text-ash hover:bg-white/5 hover:text-chalk"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        <main className="min-w-0 space-y-5">
          {notice && (
            <p role="status" className="rounded-md border border-innovation/30 bg-innovation/10 px-4 py-3 text-sm text-chalk">
              {notice}
            </p>
          )}

          {section === "overview" && (
            <Panel title="Website overview">
              {!overview ? (
                <Loader2 className="mx-auto size-5 animate-spin" />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {[
                    ["Submissions", overview.submissions, `${overview.newSubmissions} new`],
                    ["Enquiries", overview.enquiries, `${overview.newEnquiries} new`],
                    ["Newsletter subscribers", overview.subscribers, "consented signups"],
                    ["Managed content", overview.content, `${overview.publishedContent} published`],
                    ["Media assets", overview.media, "uploaded images"],
                  ].map(([label, count, detail]) => (
                    <div key={label} className="rounded-lg border border-white/10 p-4">
                      <p className="text-sm text-ash">{label}</p>
                      <p className="mt-2 font-display text-3xl font-bold">{count}</p>
                      <p className="mt-1 text-xs text-ash">{detail}</p>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-5 text-sm leading-6 text-ash">
                Use Pages to publish replacements for existing routes, or create
                news and knowledge items that appear publicly after publication.
                Form submissions and contact enquiries can be reviewed and
                status-tracked here.
              </p>
            </Panel>
          )}

          {["pages", "news", "resources", "settings"].includes(section) && (
            <Panel
              title={
                section === "pages"
                  ? "Website pages"
                  : section === "news"
                    ? "News and events"
                    : section === "resources"
                      ? "Knowledge resources"
                      : "Global site settings"
              }
              action={
                <Button onClick={() => setEditing("new")}>
                  <Plus className="size-4" /> New item
                </Button>
              }
            >
              {editing && (
                <div className="mb-5">
                  <ContentEditor
                    key={editing === "new" ? `new-${section}` : editing._id}
                    initial={editing === "new" ? undefined : editing}
                    defaultType={
                      section === "pages"
                        ? "page"
                        : section === "news"
                          ? "news"
                          : section === "resources"
                            ? "resource"
                            : "settings"
                    }
                    media={media ?? []}
                    onSave={saveItem}
                    onCancel={() => setEditing(null)}
                  />
                </div>
              )}
              {section === "settings" && !editing && (
                <p className="mb-4 text-sm leading-6 text-ash">
                  Use the visual design controls to update site-wide colors,
                  fonts, and corner rounding. The advanced JSON editor also
                  controls announcement text, menus, calls to action, footer
                  links, and institutional descriptions.
                </p>
              )}
              {contents === undefined ? (
                <Loader2 className="mx-auto size-5 animate-spin" />
              ) : visibleContents.length === 0 ? (
                <Empty>No content in this section yet. Use “New item” to add it.</Empty>
              ) : (
                <div className="space-y-3">
                  {visibleContents.map((item) => (
                    <article key={item._id} className="rounded-lg border border-white/10 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="mt-1 text-xs text-ash">
                            {item.slug}{item.path ? ` · ${item.path}` : ""} ·{" "}
                            {item.published ? "Published" : "Draft"} · Updated{" "}
                            {formatDate(item.updatedAt)}
                          </p>
                          {item.summary && <p className="mt-2 text-sm text-ash">{item.summary}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditing(item)}
                          >
                            <Pencil className="size-4" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void removeItem(item._id)}
                            aria-label={`Delete ${item.title}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Panel>
          )}

          {section === "media" && <CmsMediaLibrary />}

          {(section === "submissions" || section === "enquiries") && (
            <Panel title={section === "submissions" ? "Innovation submissions" : "Contact enquiries"}>
              {(section === "submissions" ? submissions : enquiries) === undefined ? (
                <Loader2 className="mx-auto size-5 animate-spin" />
              ) : (section === "submissions" ? submissions : enquiries)?.length === 0 ? (
                <Empty>No records received yet.</Empty>
              ) : (
                <div className="space-y-3">
                  {section === "submissions"
                    ? submissions?.map((item) => (
                        <article key={item._id} className="rounded-lg border border-white/10 p-4">
                          <div className="flex flex-wrap justify-between gap-3">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="mt-1 text-xs text-ash">
                                {item.reference} · {item.applicantName} · {item.applicantEmail} · {formatDate(item.createdAt)}
                              </p>
                              <p className="mt-3 whitespace-pre-wrap text-sm text-ash">{item.description}</p>
                              <p className="mt-2 text-xs text-ash">{item.category} · {item.stage}</p>
                            </div>
                            <select
                              value={item.status}
                              onChange={(event) => void updateStatus("submission", item._id, event.target.value)}
                              aria-label={`Status for ${item.reference}`}
                              className="h-9 rounded-md border border-white/15 bg-obsidian px-2 text-sm"
                            >
                              {INTAKE_STATUSES.map((status) => <option key={status}>{status}</option>)}
                            </select>
                          </div>
                        </article>
                      ))
                    : enquiries?.map((item) => (
                        <article key={item._id} className="rounded-lg border border-white/10 p-4">
                          <div className="flex flex-wrap justify-between gap-3">
                            <div>
                              <h3 className="font-semibold">{item.subject || item.type}</h3>
                              <p className="mt-1 text-xs text-ash">
                                {item.name} · {item.email} · {formatDate(item.createdAt)}
                              </p>
                              {item.organisation && <p className="mt-1 text-xs text-ash">{item.organisation}</p>}
                              <p className="mt-3 whitespace-pre-wrap text-sm text-ash">{item.message}</p>
                            </div>
                            <select
                              value={item.status}
                              onChange={(event) => void updateStatus("enquiry", item._id, event.target.value)}
                              aria-label={`Status for enquiry from ${item.name}`}
                              className="h-9 rounded-md border border-white/15 bg-obsidian px-2 text-sm"
                            >
                              {INTAKE_STATUSES.map((status) => <option key={status}>{status}</option>)}
                            </select>
                          </div>
                        </article>
                      ))}
                </div>
              )}
            </Panel>
          )}

          {section === "subscribers" && (
            <Panel title="Newsletter subscribers">
              {!subscribers ? (
                <Loader2 className="mx-auto size-5 animate-spin" />
              ) : subscribers.length === 0 ? (
                <Empty>No newsletter subscribers yet.</Empty>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-ash">
                      <tr><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Consent</th><th className="py-2">Date</th></tr>
                    </thead>
                    <tbody>
                      {subscribers.map((item) => (
                        <tr key={item._id} className="border-t border-white/10">
                          <td className="py-3 pr-4">{item.email}</td>
                          <td className="py-3 pr-4">{item.consent ? "Yes" : "No"}</td>
                          <td className="py-3">{formatDate(item.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          )}

          {section === "admins" && (
            <AdminManager
              admins={admins}
              onAdd={async (subject, email) => {
                await addAdmin({ subject, email: email || undefined });
                setNotice("Administrator added.");
              }}
              onRemove={async (id) => {
                await removeAdmin({ id });
                setNotice("Administrator removed.");
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function AdminManager({
  admins,
  onAdd,
  onRemove,
}: {
  admins:
    | { _id: Id<"cmsAdmins">; subject: string; email?: string; createdAt: number }[]
    | undefined;
  onAdd: (subject: string, email: string) => Promise<void>;
  onRemove: (id: Id<"cmsAdmins">) => Promise<void>;
}) {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  return (
    <Panel title="CMS administrators">
      <p className="mb-4 text-sm leading-6 text-ash">
        Add a Clerk user ID to grant CMS access. The person must have signed into
        this site with Clerk at least once so you can obtain their user ID.
      </p>
      <form
        className="mb-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          setError("");
          try {
            await onAdd(subject, email);
            setSubject("");
            setEmail("");
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not add administrator.");
          } finally {
            setSaving(false);
          }
        }}
      >
        <Input required placeholder="Clerk user ID" value={subject} onChange={(event) => setSubject(event.target.value)} />
        <Input type="email" placeholder="Email (optional)" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add admin
        </Button>
      </form>
      {error && <p role="alert" className="mb-4 text-sm text-red-400">{error}</p>}
      {!admins ? (
        <Loader2 className="mx-auto size-5 animate-spin" />
      ) : admins.length === 0 ? (
        <Empty>No additional administrators have been added.</Empty>
      ) : (
        <div className="space-y-2">
          {admins.map((admin) => (
            <div key={admin._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 p-3">
              <div>
                <p className="text-sm font-medium">{admin.email || admin.subject}</p>
                {admin.email && <p className="text-xs text-ash">{admin.subject}</p>}
              </div>
              <Button variant="outline" size="sm" onClick={() => void onRemove(admin._id)}>
                <Trash2 className="size-4" /> Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
