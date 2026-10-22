import { CmsPageContent, type CmsBlock, type CmsPageData } from "@/components/site/CmsPageContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";

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
  if (type === "feature") return { id, type, heading: "Featured service", body: "Describe this service or initiative.", imageUrl: "", alt: "", label: "Learn more", href: "/contact" };
  if (type === "quote") return { id, type, body: "Add a quotation or highlighted statement.", attribution: "Attribution" };
  if (type === "cta") return { id, type, label: "Learn more", href: "/contact" };
  return { id, type: "text", heading: "Section heading", body: "Section text." };
}

export function CmsPageEditor({
  title,
  value,
  onChange,
  onUploadImage,
  isUploading,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  onUploadImage: (file: File | undefined, blockIndex: number) => void;
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
              <h3 className="text-sm font-semibold">Page header</h3>
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
                  <option value="feature">Image and feature card</option>
                  <option value="quote">Quote / highlight</option>
                  <option value="cta">Link / call to action</option>
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

                {block.type !== "image" && block.type !== "cta" && block.type !== "quote" && (
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
                      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={isUploading} className="sr-only" onChange={(event) => { onUploadImage(event.target.files?.[0], index); event.target.value = ""; }} />
                    </label>
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
                      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={isUploading} className="sr-only" onChange={(event) => { onUploadImage(event.target.files?.[0], index); event.target.value = ""; }} />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1.5 text-sm font-medium">Link label<Input value={block.label ?? ""} onChange={(event) => updateBlock(index, { label: event.target.value })} /></label>
                      <label className="space-y-1.5 text-sm font-medium">Destination<Input value={block.href ?? ""} onChange={(event) => updateBlock(index, { href: event.target.value })} placeholder="/contact" /></label>
                    </div>
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