import { CmsPageContent, type CmsBlock, type CmsPageData } from "@/components/site/CmsPageContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";

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
  onUploadMedia: (file: File | undefined, blockIndex: number, mediaType: "image" | "video", cardIndex?: number) => void;
  mediaLibrary: CmsMediaAsset[];
  onSelectMedia: (asset: CmsMediaAsset, blockIndex: number, mediaType: "image" | "video", cardIndex?: number) => void;
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
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{block.type || "Text"} section {index + 1}</p>
                  <div className="flex gap-1">
                    <Button type="button" size="icon" variant="ghost" aria-label={`Move section ${index + 1} up`} title="Move up" disabled={index === 0} onClick={() => moveBlock(index, -1)}><ArrowUp className="size-4" /></Button>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Move section ${index + 1} down`} title="Move down" disabled={index === (page.blocks?.length ?? 0) - 1} onClick={() => moveBlock(index, 1)}><ArrowDown className="size-4" /></Button>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Remove section ${index + 1}`} title="Remove section" onClick={() => removeBlock(index)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>

                {block.type !== "divider" && (
                  <label className="block max-w-xs space-y-1.5 text-sm font-medium">Section appearance
                    <select value={block.variant ?? "plain"} onChange={(event) => updateBlock(index, { variant: event.target.value as CmsBlock["variant"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option value="plain">Open section</option><option value="card">Bordered card</option><option value="muted">Soft background</option><option value="brand">Brand highlight</option>
                    </select>
                  </label>
                )}

                {block.type === "divider" && <hr className="border-border" />}
                {block.type !== "image" && block.type !== "cta" && block.type !== "quote" && (
                  block.type !== "video" && block.type !== "divider" &&
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