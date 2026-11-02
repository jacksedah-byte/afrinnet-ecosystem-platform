import { CmsPageContent, type CmsBlock, type CmsPageData } from "@/components/site/CmsPageContent";
import { defaultCmsFormFields, type CmsFormField, type CmsFormKind } from "@/components/site/cms-form-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, ImagePlus, Plus, Trash2 } from "lucide-react";

type CmsMediaAsset = { title: string; url: string; storageId: string; mediaType: "image" | "video" };

function parsePage(value: string): CmsPageData {
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as CmsPageData
      : {};
  } catch {
    return {};
  }
}

function createBlock(type: NonNullable<CmsBlock["type"]>): CmsBlock {
  const id = crypto.randomUUID();
  if (type === "heading") return { id, type, heading: "Section heading" };
  if (type === "list") return { id, type, heading: "Key points", items: ["First point"] };
  if (type === "image") return { id, type, imageUrl: "", alt: "" };
  if (type === "video") return { id, type, videoUrl: "", posterUrl: "", alt: "" };
  if (type === "feature") return { id, type, heading: "Featured service", body: "Describe this service or initiative.", imageUrl: "", alt: "", label: "Learn more", href: "/contact" };
  if (type === "cards") return { id, type, heading: "Explore our work", cards: [{ heading: "Card title", body: "Describe this item.", label: "Learn more", href: "/contact" }] };
  if (type === "stats") return { id, type, heading: "Our impact", stats: [{ value: "01", label: "Add a measurable highlight" }] };
  if (type === "quote") return { id, type, body: "Add a quotation or highlighted statement.", attribution: "Attribution" };
  if (type === "cta") return { id, type, label: "Learn more", href: "/contact" };
  if (type === "buttons") return { id, type, heading: "Take the next step", links: [{ label: "Contact us", href: "/contact" }] };
  if (type === "accordion") return { id, type, heading: "Frequently asked questions", entries: [{ title: "Question", body: "Add the answer here." }] };
  if (type === "gallery") return { id, type, heading: "Photo gallery", columns: 3, entries: [{ imageUrl: "", alt: "", body: "Image caption" }] };
  if (type === "testimonials") return { id, type, heading: "What our partners say", entries: [{ title: "Name and designation", body: "Add a testimonial.", date: "Organisation" }] };
  if (type === "logos") return { id, type, heading: "Our partners", columns: 4, entries: [{ title: "Partner name", imageUrl: "", alt: "" }] };
  if (type === "timeline") return { id, type, heading: "Our journey", entries: [{ date: "2026", title: "Milestone", body: "Describe this milestone." }] };
  if (type === "embed") return { id, type, heading: "Featured video", href: "", label: "Embedded video" };
  if (type === "form") return {
    id,
    type,
    heading: "Get in touch",
    body: "Send us a message and our team will respond.",
    enquiryType: "general",
    formKind: "enquiry",
    submitLabel: "Send enquiry",
    successMessage: "Thank you. Your message has been received.",
    fields: defaultCmsFormFields("enquiry"),
  };
  if (type === "spacer") return { id, type, spacing: "standard" };
  if (type === "divider") return { id, type };
  return { id, type: "text", heading: "Section heading", body: "Section text." };
}

export function CmsPageEditor({
  title,
  value,
  onChange,
  onUploadMedia,
  mediaLibrary,
  onSelectMedia,
  isUploading,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  onUploadMedia: (file: File | undefined, blockIndex: number, mediaType: "image" | "video", cardIndex?: number, entryIndex?: number) => void;
  mediaLibrary: CmsMediaAsset[];
  onSelectMedia: (asset: CmsMediaAsset, blockIndex: number, mediaType: "image" | "video", cardIndex?: number, entryIndex?: number) => void;
  isUploading: boolean;
}) {
  const page = parsePage(value);
  const updatePage = (update: Partial<CmsPageData>) =>
    onChange(JSON.stringify({ ...page, ...update }, null, 2));
  const updateBlock = (index: number, update: Partial<CmsBlock>) => {
    const blocks = [...(page.blocks ?? [])];
    blocks[index] = { ...blocks[index], ...update };
    updatePage({ blocks });
  };
  const moveBlock = (index: number, direction: -1 | 1) => {
    const blocks = [...(page.blocks ?? [])];
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    updatePage({ blocks });
  };
  const removeBlock = (index: number) =>
    updatePage({ blocks: (page.blocks ?? []).filter((_, itemIndex) => itemIndex !== index) });
  const duplicateBlock = (index: number) => {
    const blocks = [...(page.blocks ?? [])];
    blocks.splice(index + 1, 0, { ...structuredClone(blocks[index]), id: crypto.randomUUID() });
    updatePage({ blocks });
  };
  const updateEntry = (blockIndex: number, entryIndex: number, patch: Partial<NonNullable<CmsBlock["entries"]>[number]>) => {
    const block = page.blocks?.[blockIndex];
    if (!block) return;
    const entries = [...(block.entries ?? [])];
    entries[entryIndex] = { ...entries[entryIndex], ...patch };
    updateBlock(blockIndex, { entries });
  };

  return (
    <Tabs defaultValue="visual" className="w-full">
      <TabsList aria-label="Page editing mode">
        <TabsTrigger value="visual">Visual editor</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>

      <TabsContent value="visual" className="mt-5">
        <div className="grid gap-8 xl:grid-cols-2">
          <div className="min-w-0 space-y-5">
            <section className="space-y-4 border-b pb-5">
              <div>
                <h3 className="text-sm font-semibold">Page header and design</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Control the visual frame of this page without touching code.</p>
              </div>
              <label className="block space-y-1.5 text-sm font-medium">
                Eyebrow
                <Input value={page.eyebrow ?? ""} onChange={(event) => updatePage({ eyebrow: event.target.value })} />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                Headline
                <Input value={page.title ?? title} onChange={(event) => updatePage({ title: event.target.value })} />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                Introduction
                <Textarea value={page.introduction ?? ""} onChange={(event) => updatePage({ introduction: event.target.value })} className="min-h-24" />
              </label>
              <label className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                <input type="checkbox" checked={page.showHero !== false} onChange={(event) => updatePage({ showHero: event.target.checked })} className="mt-0.5 size-4 accent-green-700" />
                <span><span className="font-medium">Show page hero</span><span className="mt-1 block text-xs text-muted-foreground">Hide the title, introduction and hero image while keeping the page sections.</span></span>
              </label>
              {page.preserveExistingPage !== undefined && (
                <label className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                  <input type="checkbox" checked={page.preserveExistingPage} onChange={(event) => updatePage({ preserveExistingPage: event.target.checked })} className="mt-0.5 size-4 accent-green-700" />
                  <span><span className="font-medium">Keep the existing page and its working features</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">When enabled, this CMS design appears above the current page. Turn it off only if you intend to replace the route’s existing design and interactions.</span></span>
                </label>
              )}
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="space-y-1.5 text-sm font-medium">Content width
                  <select value={page.design?.layoutWidth ?? "standard"} onChange={(event) => updatePage({ design: { ...page.design, layoutWidth: event.target.value as NonNullable<CmsPageData["design"]>["layoutWidth"] } })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="compact">Compact</option><option value="standard">Standard</option><option value="wide">Wide</option>
                  </select>
                </label>
                <label className="space-y-1.5 text-sm font-medium">Hero alignment
                  <select value={page.design?.heroAlignment ?? "left"} onChange={(event) => updatePage({ design: { ...page.design, heroAlignment: event.target.value as NonNullable<CmsPageData["design"]>["heroAlignment"] } })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="left">Left aligned</option><option value="center">Centered</option>
                  </select>
                </label>
                <label className="space-y-1.5 text-sm font-medium">Page theme
                  <select value={page.design?.theme ?? "default"} onChange={(event) => updatePage({ design: { ...page.design, theme: event.target.value as NonNullable<CmsPageData["design"]>["theme"] } })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="default">AFRINNET default</option><option value="light">Light editorial</option><option value="brand">Brand dark</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm font-medium">Page background
                  <input type="color" aria-label="Page background color" value={page.design?.backgroundColor ?? "#080b0a"} onChange={(event) => updatePage({ design: { ...page.design, backgroundColor: event.target.value } })} className="size-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                  {page.design?.backgroundColor && <button type="button" className="text-xs underline" onClick={() => updatePage({ design: { ...page.design, backgroundColor: undefined } })}>Reset</button>}
                </label>
                <label className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm font-medium">Page text color
                  <input type="color" aria-label="Page text color" value={page.design?.textColor ?? "#f8fafc"} onChange={(event) => updatePage({ design: { ...page.design, textColor: event.target.value } })} className="size-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                  {page.design?.textColor && <button type="button" className="text-xs underline" onClick={() => updatePage({ design: { ...page.design, textColor: undefined } })}>Reset</button>}
                </label>
              </div>
              <div className="space-y-2">
                <label className="block space-y-1.5 text-sm font-medium">Hero image URL
                  <Input value={page.heroImageUrl ?? ""} onChange={(event) => updatePage({ heroImageUrl: event.target.value })} placeholder="Upload an image or paste a URL" />
                </label>
                <label className="block space-y-1.5 text-sm font-medium">Hero image alternative text
                  <Input value={page.heroImageAlt ?? ""} onChange={(event) => updatePage({ heroImageAlt: event.target.value })} />
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
                  <ImagePlus className="size-4" />{isUploading ? "Uploading…" : "Upload hero image"}
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={isUploading} className="sr-only" onChange={(event) => { onUploadMedia(event.target.files?.[0], -1, "image"); event.target.value = ""; }} />
                </label>
                {mediaLibrary.some((asset) => asset.mediaType === "image") && (
                  <select aria-label="Select an image from the media library" value="" onChange={(event) => { const asset = mediaLibrary.find((item) => item.storageId === event.target.value); if (asset) onSelectMedia(asset, -1, "image"); }} className="ml-2 h-10 max-w-xs rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">Choose from media library…</option>
                    {mediaLibrary.filter((asset) => asset.mediaType === "image").map((asset) => <option key={asset.storageId} value={asset.storageId}>{asset.title}</option>)}
                  </select>
                )}
              </div>
              {(page.summary !== undefined || page.category !== undefined || page.topic !== undefined || page.dateLabel !== undefined) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {page.category !== undefined && <label className="space-y-1.5 text-sm font-medium">Category<Input value={page.category} onChange={(event) => updatePage({ category: event.target.value })} /></label>}
                  {page.topic !== undefined && <label className="space-y-1.5 text-sm font-medium">Topic<Input value={page.topic} onChange={(event) => updatePage({ topic: event.target.value })} /></label>}
                  {page.dateLabel !== undefined && <label className="space-y-1.5 text-sm font-medium">Date label<Input value={page.dateLabel} onChange={(event) => updatePage({ dateLabel: event.target.value })} /></label>}
                  {page.summary !== undefined && <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Listing summary<Textarea value={page.summary} onChange={(event) => updatePage({ summary: event.target.value })} className="min-h-20" /></label>}
                </div>
              )}
              <details className="rounded-lg border p-4">
                <summary className="cursor-pointer text-sm font-semibold">Search and sharing (SEO)</summary>
                <div className="mt-4 grid gap-3">
                  <label className="space-y-1.5 text-sm font-medium">Browser and search title
                    <Input value={page.seoTitle ?? ""} onChange={(event) => updatePage({ seoTitle: event.target.value })} placeholder={page.title ?? title} maxLength={70} />
                    <span className="block text-xs font-normal text-muted-foreground">Recommended: up to 60 characters. Leave blank to use the page title.</span>
                  </label>
                  <label className="space-y-1.5 text-sm font-medium">Search and social description
                    <Textarea value={page.seoDescription ?? ""} onChange={(event) => updatePage({ seoDescription: event.target.value })} maxLength={320} />
                    <span className="block text-xs font-normal text-muted-foreground">A concise description helps search engines and link previews understand the page.</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={page.noIndex === true} onChange={(event) => updatePage({ noIndex: event.target.checked })} className="size-4 accent-green-700" />Ask search engines not to index this page</label>
                </div>
              </details>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">Page sections ({page.blocks?.length ?? 0})</h3>
              <label className="inline-flex items-center gap-2">
                <span className="sr-only">Add section type</span>
                <select
                  value=""
                  onChange={(event) => {
                    if (!event.target.value) return;
                    updatePage({ blocks: [...(page.blocks ?? []), createBlock(event.target.value as NonNullable<CmsBlock["type"]>)] });
                    event.target.value = "";
                  }}
                  className="h-9 rounded-md border bg-background px-2 text-sm"
                >
                  <option value="">Add section…</option>
                  <option value="text">Text section</option>
                  <option value="heading">Heading</option>
                  <option value="list">List</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="feature">Image and feature card</option>
                  <option value="cards">Card grid</option>
                  <option value="stats">Statistics</option>
                  <option value="quote">Quote / highlight</option>
                  <option value="cta">Link / call to action</option>
                  <option value="buttons">Button group</option>
                  <option value="accordion">FAQ / accordion</option>
                  <option value="gallery">Image gallery</option>
                  <option value="testimonials">Testimonials</option>
                  <option value="logos">Partner logos</option>
                  <option value="timeline">Timeline / milestones</option>
                  <option value="embed">YouTube / Vimeo embed</option>
                  <option value="form">Enquiry form (connected to CMS inbox)</option>
                  <option value="spacer">Spacing</option>
                  <option value="divider">Divider</option>
                </select>
                <Plus className="size-4" aria-hidden="true" />
              </label>
            </div>

            {(page.blocks ?? []).length === 0 && (
              <p className="border-y py-6 text-sm text-muted-foreground">Add a section to begin building this page.</p>
            )}

            {(page.blocks ?? []).map((block, index) => (
              <section key={block.id ?? `${block.type}-${index}`} className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{block.type || "Text"} section {index + 1}{block.visible === false ? " · hidden" : ""}</p>
                  <div className="flex gap-1">
                    <Button type="button" size="icon" variant="ghost" aria-label={block.visible === false ? `Show section ${index + 1}` : `Hide section ${index + 1}`} title={block.visible === false ? "Show section" : "Hide section"} onClick={() => updateBlock(index, { visible: block.visible === false })}>{block.visible === false ? <Eye className="size-4" /> : <EyeOff className="size-4" />}</Button>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Duplicate section ${index + 1}`} title="Duplicate section" onClick={() => duplicateBlock(index)}><Copy className="size-4" /></Button>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Move section ${index + 1} up`} title="Move up" disabled={index === 0} onClick={() => moveBlock(index, -1)}><ArrowUp className="size-4" /></Button>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Move section ${index + 1} down`} title="Move down" disabled={index === (page.blocks?.length ?? 0) - 1} onClick={() => moveBlock(index, 1)}><ArrowDown className="size-4" /></Button>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Remove section ${index + 1}`} title="Remove section" onClick={() => removeBlock(index)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>

                {block.type !== "divider" && (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <label className="space-y-1.5 text-sm font-medium">Appearance
                      <select value={block.variant ?? "plain"} onChange={(event) => updateBlock(index, { variant: event.target.value as CmsBlock["variant"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        <option value="plain">Open section</option><option value="card">Bordered card</option><option value="muted">Soft background</option><option value="brand">Brand highlight</option>
                      </select>
                    </label>
                    <label className="space-y-1.5 text-sm font-medium">Text alignment
                      <select value={block.align ?? "left"} onChange={(event) => updateBlock(index, { align: event.target.value as CmsBlock["align"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                      </select>
                    </label>
                    <label className="space-y-1.5 text-sm font-medium">Section spacing
                      <select value={block.spacing ?? "standard"} onChange={(event) => updateBlock(index, { spacing: event.target.value as CmsBlock["spacing"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        <option value="compact">Compact</option><option value="standard">Standard</option><option value="spacious">Spacious</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm font-medium">Custom background
                      <input type="color" aria-label="Custom section background color" value={block.backgroundColor ?? "#ffffff"} onChange={(event) => updateBlock(index, { backgroundColor: event.target.value })} className="size-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                      {block.backgroundColor && <button type="button" className="text-xs underline" onClick={() => updateBlock(index, { backgroundColor: undefined })}>Reset</button>}
                    </label>
                    <label className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm font-medium">Custom text
                      <input type="color" aria-label="Custom section text color" value={block.textColor ?? "#111827"} onChange={(event) => updateBlock(index, { textColor: event.target.value })} className="size-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                      {block.textColor && <button type="button" className="text-xs underline" onClick={() => updateBlock(index, { textColor: undefined })}>Reset</button>}
                    </label>
                  </div>
                )}

                {block.type === "divider" && <hr className="border-border" />}
                {block.type !== "image" && block.type !== "cta" && block.type !== "quote" && (
                  block.type !== "video" && block.type !== "divider" && block.type !== "spacer" &&
                  <label className="block space-y-1.5 text-sm font-medium">
                    Heading
                    <Input value={block.heading ?? ""} onChange={(event) => updateBlock(index, { heading: event.target.value })} />
                  </label>
                )}
                {(block.type === "text" || !block.type) && (
                  <label className="block space-y-1.5 text-sm font-medium">
                    Text
                    <Textarea value={block.body ?? ""} onChange={(event) => updateBlock(index, { body: event.target.value })} className="min-h-28" />
                  </label>
                )}
                {block.type === "list" && (
                  <label className="block space-y-1.5 text-sm font-medium">
                    List items (one per line)
                    <Textarea value={(block.items ?? []).join("\n")} onChange={(event) => updateBlock(index, { items: event.target.value.split("\n") })} className="min-h-28" />
                  </label>
                )}
                {block.type === "image" && (
                  <div className="space-y-3">
                    <label className="block space-y-1.5 text-sm font-medium">
                      Image URL
                      <Input value={block.imageUrl ?? ""} onChange={(event) => updateBlock(index, { imageUrl: event.target.value })} />
                    </label>
                    <label className="block space-y-1.5 text-sm font-medium">
                      Alternative text
                      <Input value={block.alt ?? ""} onChange={(event) => updateBlock(index, { alt: event.target.value })} />
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
                      <ImagePlus className="size-4" />
                      {isUploading ? "Uploading…" : "Upload image"}
                      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={isUploading} className="sr-only" onChange={(event) => { onUploadMedia(event.target.files?.[0], index, "image"); event.target.value = ""; }} />
                    </label>
                    {mediaLibrary.some((asset) => asset.mediaType === "image") && <select aria-label="Choose image from media library" value="" onChange={(event) => { const asset = mediaLibrary.find((item) => item.storageId === event.target.value); if (asset) onSelectMedia(asset, index, "image"); }} className="ml-2 h-10 max-w-xs rounded-md border border-input bg-background px-3 text-sm"><option value="">Choose from media library…</option>{mediaLibrary.filter((asset) => asset.mediaType === "image").map((asset) => <option key={asset.storageId} value={asset.storageId}>{asset.title}</option>)}</select>}
                  </div>
                )}
                {block.type === "video" && (
                  <div className="space-y-3">
                    <label className="block space-y-1.5 text-sm font-medium">Video URL
                      <Input value={block.videoUrl ?? ""} onChange={(event) => updateBlock(index, { videoUrl: event.target.value })} placeholder="Upload MP4/WebM or paste an HTTPS URL" />
                    </label>
                    <label className="block space-y-1.5 text-sm font-medium">Poster image URL
                      <Input value={block.posterUrl ?? ""} onChange={(event) => updateBlock(index, { posterUrl: event.target.value })} />
                    </label>
                    <label className="block space-y-1.5 text-sm font-medium">Video description
                      <Input value={block.alt ?? ""} onChange={(event) => updateBlock(index, { alt: event.target.value })} />
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
                      <ImagePlus className="size-4" />{isUploading ? "Uploading…" : "Upload video"}
                      <input type="file" accept="video/mp4,video/webm,video/quicktime" disabled={isUploading} className="sr-only" onChange={(event) => { onUploadMedia(event.target.files?.[0], index, "video"); event.target.value = ""; }} />
                    </label>
                    {mediaLibrary.some((asset) => asset.mediaType === "video") && <select aria-label="Choose video from media library" value="" onChange={(event) => { const asset = mediaLibrary.find((item) => item.storageId === event.target.value); if (asset) onSelectMedia(asset, index, "video"); }} className="ml-2 h-10 max-w-xs rounded-md border border-input bg-background px-3 text-sm"><option value="">Choose from media library…</option>{mediaLibrary.filter((asset) => asset.mediaType === "video").map((asset) => <option key={asset.storageId} value={asset.storageId}>{asset.title}</option>)}</select>}
                  </div>
                )}
                {block.type === "feature" && (
                  <div className="space-y-3">
                    <label className="block space-y-1.5 text-sm font-medium">Description<Textarea value={block.body ?? ""} onChange={(event) => updateBlock(index, { body: event.target.value })} className="min-h-24" /></label>
                    <label className="block space-y-1.5 text-sm font-medium">Image URL<Input value={block.imageUrl ?? ""} onChange={(event) => updateBlock(index, { imageUrl: event.target.value })} /></label>
                    <label className="block space-y-1.5 text-sm font-medium">Image alternative text<Input value={block.alt ?? ""} onChange={(event) => updateBlock(index, { alt: event.target.value })} /></label>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
                      <ImagePlus className="size-4" />
                      {isUploading ? "Uploading…" : "Upload feature image"}
                      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={isUploading} className="sr-only" onChange={(event) => { onUploadMedia(event.target.files?.[0], index, "image"); event.target.value = ""; }} />
                    </label>
                    {mediaLibrary.some((asset) => asset.mediaType === "image") && <select aria-label="Choose feature image from media library" value="" onChange={(event) => { const asset = mediaLibrary.find((item) => item.storageId === event.target.value); if (asset) onSelectMedia(asset, index, "image"); }} className="ml-2 h-10 max-w-xs rounded-md border border-input bg-background px-3 text-sm"><option value="">Choose from media library…</option>{mediaLibrary.filter((asset) => asset.mediaType === "image").map((asset) => <option key={asset.storageId} value={asset.storageId}>{asset.title}</option>)}</select>}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1.5 text-sm font-medium">Link label<Input value={block.label ?? ""} onChange={(event) => updateBlock(index, { label: event.target.value })} /></label>
                      <label className="space-y-1.5 text-sm font-medium">Destination<Input value={block.href ?? ""} onChange={(event) => updateBlock(index, { href: event.target.value })} placeholder="/contact" /></label>
                    </div>
                  </div>
                )}
                {block.type === "cards" && (
                  <div className="space-y-4">
                    <label className="block max-w-xs space-y-1.5 text-sm font-medium">Cards per row
                      <select value={block.columns ?? 3} onChange={(event) => updateBlock(index, { columns: Number(event.target.value) as CmsBlock["columns"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        <option value={2}>2 columns</option><option value={3}>3 columns</option><option value={4}>4 columns</option>
                      </select>
                    </label>
                    {(block.cards ?? []).map((card, cardIndex) => (
                      <div key={`${block.id ?? index}-card-${cardIndex}`} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
                        <div className="flex items-center justify-between sm:col-span-2">
                          <h4 className="text-sm font-semibold">Card {cardIndex + 1}</h4>
                          <Button type="button" size="icon" variant="ghost" aria-label={`Remove card ${cardIndex + 1}`} onClick={() => updateBlock(index, { cards: (block.cards ?? []).filter((_, itemIndex) => itemIndex !== cardIndex) })}><Trash2 className="size-4" /></Button>
                        </div>
                        <label className="space-y-1.5 text-sm font-medium">Card title<Input value={card.heading ?? ""} onChange={(event) => { const cards = [...(block.cards ?? [])]; cards[cardIndex] = { ...card, heading: event.target.value }; updateBlock(index, { cards }); }} /></label>
                        <label className="space-y-1.5 text-sm font-medium">Card link label<Input value={card.label ?? ""} onChange={(event) => { const cards = [...(block.cards ?? [])]; cards[cardIndex] = { ...card, label: event.target.value }; updateBlock(index, { cards }); }} /></label>
                        <label className="space-y-1.5 text-sm font-medium">Card icon
                          <select value={card.icon ?? ""} onChange={(event) => { const cards = [...(block.cards ?? [])]; cards[cardIndex] = { ...card, icon: (event.target.value || undefined) as typeof card.icon }; updateBlock(index, { cards }); }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                            <option value="">No icon</option><option value="book">Knowledge / book</option><option value="building">Institution</option><option value="globe">Pan-African</option><option value="lightbulb">Innovation</option><option value="shield">Protection</option><option value="people">People / network</option>
                          </select>
                        </label>
                        <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Description<Textarea value={card.body ?? ""} onChange={(event) => { const cards = [...(block.cards ?? [])]; cards[cardIndex] = { ...card, body: event.target.value }; updateBlock(index, { cards }); }} /></label>
                        <label className="space-y-1.5 text-sm font-medium">Image URL<Input value={card.imageUrl ?? ""} onChange={(event) => { const cards = [...(block.cards ?? [])]; cards[cardIndex] = { ...card, imageUrl: event.target.value }; updateBlock(index, { cards }); }} /></label>
                        <label className="space-y-1.5 text-sm font-medium">Destination<Input value={card.href ?? ""} onChange={(event) => { const cards = [...(block.cards ?? [])]; cards[cardIndex] = { ...card, href: event.target.value }; updateBlock(index, { cards }); }} /></label>
                        <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Image alternative text<Input value={card.alt ?? ""} onChange={(event) => { const cards = [...(block.cards ?? [])]; cards[cardIndex] = { ...card, alt: event.target.value }; updateBlock(index, { cards }); }} /></label>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted sm:col-span-2">
                          <ImagePlus className="size-4" />{isUploading ? "Uploading…" : "Upload card image"}
                          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={isUploading} className="sr-only" onChange={(event) => { onUploadMedia(event.target.files?.[0], index, "image", cardIndex); event.target.value = ""; }} />
                        </label>
                        {mediaLibrary.some((asset) => asset.mediaType === "image") && <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Use image from media library<select value="" onChange={(event) => { const asset = mediaLibrary.find((item) => item.storageId === event.target.value); if (asset) onSelectMedia(asset, index, "image", cardIndex); }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Select an image…</option>{mediaLibrary.filter((asset) => asset.mediaType === "image").map((asset) => <option key={asset.storageId} value={asset.storageId}>{asset.title}</option>)}</select></label>}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => updateBlock(index, { cards: [...(block.cards ?? []), { heading: "Card title", body: "Describe this item." }] })}><Plus className="size-4" />Add card</Button>
                  </div>
                )}
                {block.type === "stats" && (
                  <div className="space-y-3">
                    {(block.stats ?? []).map((stat, statIndex) => (
                      <div key={`${block.id ?? index}-stat-${statIndex}`} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_2fr_auto]">
                        <label className="space-y-1.5 text-sm font-medium">Value<Input value={stat.value ?? ""} onChange={(event) => { const stats = [...(block.stats ?? [])]; stats[statIndex] = { ...stat, value: event.target.value }; updateBlock(index, { stats }); }} /></label>
                        <label className="space-y-1.5 text-sm font-medium">Label<Input value={stat.label ?? ""} onChange={(event) => { const stats = [...(block.stats ?? [])]; stats[statIndex] = { ...stat, label: event.target.value }; updateBlock(index, { stats }); }} /></label>
                        <Button type="button" size="icon" variant="ghost" aria-label={`Remove statistic ${statIndex + 1}`} onClick={() => updateBlock(index, { stats: (block.stats ?? []).filter((_, itemIndex) => itemIndex !== statIndex) })}><Trash2 className="size-4" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => updateBlock(index, { stats: [...(block.stats ?? []), { value: "01", label: "New highlight" }] })}><Plus className="size-4" />Add statistic</Button>
                  </div>
                )}
                {block.type === "quote" && (
                  <div className="space-y-3">
                    <label className="block space-y-1.5 text-sm font-medium">Quote or highlighted text<Textarea value={block.body ?? ""} onChange={(event) => updateBlock(index, { body: event.target.value })} /></label>
                    <label className="block space-y-1.5 text-sm font-medium">Attribution<Input value={block.attribution ?? ""} onChange={(event) => updateBlock(index, { attribution: event.target.value })} /></label>
                  </div>
                )}
                {block.type === "cta" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1.5 text-sm font-medium">Link label<Input value={block.label ?? ""} onChange={(event) => updateBlock(index, { label: event.target.value })} /></label>
                    <label className="space-y-1.5 text-sm font-medium">Destination<Input value={block.href ?? ""} onChange={(event) => updateBlock(index, { href: event.target.value })} placeholder="/contact" /></label>
                  </div>
                )}
                {block.type === "buttons" && (
                  <div className="space-y-3">
                    {(block.links ?? []).map((link, linkIndex) => (
                      <div key={`${block.id ?? index}-link-${linkIndex}`} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_2fr_auto]">
                        <label className="space-y-1.5 text-sm font-medium">Button label<Input value={link.label ?? ""} onChange={(event) => { const links = [...(block.links ?? [])]; links[linkIndex] = { ...link, label: event.target.value }; updateBlock(index, { links }); }} /></label>
                        <label className="space-y-1.5 text-sm font-medium">Destination<Input value={link.href ?? ""} onChange={(event) => { const links = [...(block.links ?? [])]; links[linkIndex] = { ...link, href: event.target.value }; updateBlock(index, { links }); }} placeholder="/contact" /></label>
                        <Button type="button" size="icon" variant="ghost" aria-label={`Remove button ${linkIndex + 1}`} onClick={() => updateBlock(index, { links: (block.links ?? []).filter((_, itemIndex) => itemIndex !== linkIndex) })}><Trash2 className="size-4" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => updateBlock(index, { links: [...(block.links ?? []), { label: "Learn more", href: "/contact" }] })}><Plus className="size-4" />Add button</Button>
                  </div>
                )}
                {["accordion", "gallery", "testimonials", "logos", "timeline"].includes(block.type ?? "") && (
                  <div className="space-y-3">
                    {(block.type === "gallery" || block.type === "logos") && (
                      <label className="block max-w-xs space-y-1.5 text-sm font-medium">Grid columns
                        <select value={block.columns ?? (block.type === "logos" ? 4 : 3)} onChange={(event) => updateBlock(index, { columns: Number(event.target.value) as CmsBlock["columns"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                          <option value={2}>2 columns</option><option value={3}>3 columns</option><option value={4}>4 columns</option>
                        </select>
                      </label>
                    )}
                    {(block.entries ?? []).map((entry, entryIndex) => (
                      <div key={`${block.id ?? index}-entry-${entryIndex}`} className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-center justify-between"><h4 className="text-sm font-semibold">Item {entryIndex + 1}</h4><Button type="button" size="icon" variant="ghost" aria-label={`Remove item ${entryIndex + 1}`} onClick={() => updateBlock(index, { entries: (block.entries ?? []).filter((_, itemIndex) => itemIndex !== entryIndex) })}><Trash2 className="size-4" /></Button></div>
                        {block.type === "accordion" && <>
                          <label className="block space-y-1.5 text-sm font-medium">Question<Input value={entry.title ?? ""} onChange={(event) => updateEntry(index, entryIndex, { title: event.target.value })} /></label>
                          <label className="block space-y-1.5 text-sm font-medium">Answer<Textarea value={entry.body ?? ""} onChange={(event) => updateEntry(index, entryIndex, { body: event.target.value })} /></label>
                        </>}
                        {block.type === "gallery" && <>
                          <label className="block space-y-1.5 text-sm font-medium">Image URL<Input value={entry.imageUrl ?? ""} onChange={(event) => updateEntry(index, entryIndex, { imageUrl: event.target.value })} /></label>
                          <label className="block space-y-1.5 text-sm font-medium">Alternative text<Input value={entry.alt ?? ""} onChange={(event) => updateEntry(index, entryIndex, { alt: event.target.value })} /></label>
                          <label className="block space-y-1.5 text-sm font-medium">Caption<Input value={entry.body ?? ""} onChange={(event) => updateEntry(index, entryIndex, { body: event.target.value })} /></label>
                        </>}
                        {block.type === "testimonials" && <>
                          <label className="block space-y-1.5 text-sm font-medium">Testimonial<Textarea value={entry.body ?? ""} onChange={(event) => updateEntry(index, entryIndex, { body: event.target.value })} /></label>
                          <label className="block space-y-1.5 text-sm font-medium">Name and designation<Input value={entry.title ?? ""} onChange={(event) => updateEntry(index, entryIndex, { title: event.target.value })} /></label>
                          <label className="block space-y-1.5 text-sm font-medium">Organisation<Input value={entry.date ?? ""} onChange={(event) => updateEntry(index, entryIndex, { date: event.target.value })} /></label>
                        </>}
                        {block.type === "logos" && <>
                          <label className="block space-y-1.5 text-sm font-medium">Partner name<Input value={entry.title ?? ""} onChange={(event) => updateEntry(index, entryIndex, { title: event.target.value })} /></label>
                          <label className="block space-y-1.5 text-sm font-medium">Logo image URL<Input value={entry.imageUrl ?? ""} onChange={(event) => updateEntry(index, entryIndex, { imageUrl: event.target.value })} /></label>
                          <label className="block space-y-1.5 text-sm font-medium">Alternative text<Input value={entry.alt ?? ""} onChange={(event) => updateEntry(index, entryIndex, { alt: event.target.value })} /></label>
                          <label className="block space-y-1.5 text-sm font-medium">Partner website URL<Input value={entry.href ?? ""} onChange={(event) => updateEntry(index, entryIndex, { href: event.target.value })} /></label>
                        </>}
                        {block.type === "timeline" && <>
                          <div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Date / year<Input value={entry.date ?? ""} onChange={(event) => updateEntry(index, entryIndex, { date: event.target.value })} /></label><label className="space-y-1.5 text-sm font-medium">Milestone title<Input value={entry.title ?? ""} onChange={(event) => updateEntry(index, entryIndex, { title: event.target.value })} /></label></div>
                          <label className="block space-y-1.5 text-sm font-medium">Description<Textarea value={entry.body ?? ""} onChange={(event) => updateEntry(index, entryIndex, { body: event.target.value })} /></label>
                        </>}
                        {(block.type === "gallery" || block.type === "logos") && <>
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"><ImagePlus className="size-4" />{isUploading ? "Uploading…" : "Upload image"}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={isUploading} className="sr-only" onChange={(event) => { onUploadMedia(event.target.files?.[0], index, "image", undefined, entryIndex); event.target.value = ""; }} /></label>
                          {mediaLibrary.some((asset) => asset.mediaType === "image") && <select aria-label={`Select image for item ${entryIndex + 1}`} value="" onChange={(event) => { const asset = mediaLibrary.find((item) => item.storageId === event.target.value); if (asset) onSelectMedia(asset, index, "image", undefined, entryIndex); }} className="ml-2 h-10 max-w-xs rounded-md border border-input bg-background px-3 text-sm"><option value="">Choose from media library…</option>{mediaLibrary.filter((asset) => asset.mediaType === "image").map((asset) => <option key={asset.storageId} value={asset.storageId}>{asset.title}</option>)}</select>}
                        </>}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => updateBlock(index, { entries: [...(block.entries ?? []), block.type === "accordion" ? { title: "Question", body: "Answer" } : block.type === "gallery" ? { imageUrl: "", alt: "", body: "Image caption" } : block.type === "testimonials" ? { title: "Name and designation", body: "Testimonial", date: "Organisation" } : block.type === "logos" ? { title: "Partner name", imageUrl: "", alt: "" } : { date: "Year", title: "Milestone", body: "Description" }] })}><Plus className="size-4" />Add {block.type === "accordion" ? "question" : block.type === "gallery" ? "image" : block.type === "testimonials" ? "testimonial" : block.type === "logos" ? "partner" : "milestone"}</Button>
                  </div>
                )}
                {block.type === "embed" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1.5 text-sm font-medium sm:col-span-2">YouTube or Vimeo embed URL<Input value={block.href ?? ""} onChange={(event) => updateBlock(index, { href: event.target.value })} placeholder="https://www.youtube.com/embed/…" /></label>
                    <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Accessible media title<Input value={block.label ?? ""} onChange={(event) => updateBlock(index, { label: event.target.value })} /></label>
                  </div>
                )}
                {block.type === "form" && (
                  <div className="space-y-4 rounded-lg border p-4">
                    <p className="text-sm leading-6 text-muted-foreground">Forms connect to the existing Convex intake system. Enquiries appear in the CMS inbox; innovation submissions appear in the submissions inbox; newsletter entries appear in sign-ups.</p>
                    <label className="block space-y-1.5 text-sm font-medium">Form connection
                      <select value={block.formKind ?? "enquiry"} onChange={(event) => {
                        const formKind = event.target.value as CmsFormKind;
                        updateBlock(index, {
                          formKind,
                          fields: defaultCmsFormFields(formKind),
                          heading: formKind === "newsletter" ? "Stay informed" : formKind === "innovation" ? "Submit an innovation" : "Get in touch",
                          submitLabel: formKind === "newsletter" ? "Subscribe" : formKind === "innovation" ? "Submit innovation" : "Send enquiry",
                        });
                      }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        <option value="enquiry">Contact / enquiry</option><option value="innovation">Innovation intake</option><option value="newsletter">Newsletter signup</option>
                      </select>
                    </label>
                    {block.formKind !== "newsletter" && (
                    <label className="block space-y-1.5 text-sm font-medium">Enquiry category
                      <Input value={block.enquiryType ?? "general"} onChange={(event) => updateBlock(index, { enquiryType: event.target.value })} placeholder="general, partnership, support…" />
                    </label>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1.5 text-sm font-medium">Submit button label<Input value={block.submitLabel ?? ""} onChange={(event) => updateBlock(index, { submitLabel: event.target.value })} /></label>
                      <label className="space-y-1.5 text-sm font-medium">Success message<Input value={block.successMessage ?? ""} onChange={(event) => updateBlock(index, { successMessage: event.target.value })} /></label>
                    </div>
                    <h4 className="text-sm font-semibold">Form fields</h4>
                    {(block.fields ?? []).map((field, fieldIndex) => {
                      const updateField = (patch: Partial<CmsFormField>) => {
                        const fields = [...(block.fields ?? [])];
                        fields[fieldIndex] = { ...field, ...patch };
                        updateBlock(index, { fields });
                      };
                      const lockedKeys: Record<CmsFormKind, string[]> = {
                        enquiry: ["name", "email", "message"],
                        innovation: ["applicantName", "applicantEmail", "title", "description", "category", "stage"],
                        newsletter: ["email"],
                      };
                      const requiredKey = lockedKeys[block.formKind ?? "enquiry"].includes(field.id);
                      return (
                        <div key={field.id} className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1.4fr_1fr_auto_auto]">
                          <label className="space-y-1.5 text-sm font-medium">Field label<Input value={field.label} onChange={(event) => updateField({ label: event.target.value })} /></label>
                          <label className="space-y-1.5 text-sm font-medium">Field type
                            <select value={field.type} onChange={(event) => updateField({ type: event.target.value as CmsFormField["type"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                              <option value="text">Short text</option><option value="email">Email</option><option value="tel">Phone</option><option value="textarea">Long text</option><option value="select">Dropdown</option>
                            </select>
                          </label>
                          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={field.required} disabled={requiredKey} onChange={(event) => updateField({ required: event.target.checked })} />Required</label>
                          <Button type="button" size="icon" variant="ghost" disabled={requiredKey} aria-label={`Remove ${field.label} field`} onClick={() => updateBlock(index, { fields: (block.fields ?? []).filter((_, itemIndex) => itemIndex !== fieldIndex) })}><Trash2 className="size-4" /></Button>
                          <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Placeholder<Input value={field.placeholder ?? ""} onChange={(event) => updateField({ placeholder: event.target.value })} /></label>
                          {field.type === "select" && <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Dropdown choices (one per line)<Textarea value={(field.options ?? []).join("\n")} onChange={(event) => updateField({ options: event.target.value.split("\n").map((option) => option.trim()).filter(Boolean).slice(0, 100) })} className="min-h-20" /></label>}
                          <span className="self-end pb-2 text-xs text-muted-foreground sm:col-span-2">Field key: {field.id}</span>
                        </div>
                      );
                    })}
                    {block.formKind === "enquiry" && (block.fields?.length ?? 0) < 20 && <Button type="button" variant="outline" onClick={() => updateBlock(index, { fields: [...(block.fields ?? []), { id: `field-${crypto.randomUUID()}`, label: "New question", type: "text", required: false }] })}><Plus className="size-4" />Add form field</Button>}
                  </div>
                )}
              </section>
            ))}
          </div>

          <aside className="min-w-0 border-t pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
            <h3 className="mb-4 text-sm font-semibold">Live preview</h3>
            <div className="max-h-[75vh] overflow-auto border bg-background">
              <CmsPageContent title={title} content={page} />
            </div>
          </aside>
        </div>
      </TabsContent>

      <TabsContent value="json" className="mt-5">
        <Textarea
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[480px] font-mono text-xs leading-5"
          spellCheck={false}
          aria-label="Page content JSON"
        />
      </TabsContent>
    </Tabs>
  );
}