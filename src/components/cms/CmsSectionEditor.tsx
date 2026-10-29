import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CmsContentSections } from "@/components/site/CmsContentSections";
import type { Id } from "@/convex/_generated/dataModel";
import { createCmsSection, type CmsSection, type CmsSectionType } from "@/lib/cms-content";

type MediaAsset = {
  _id: Id<"cmsMedia">;
  url: string | null;
  fileName: string;
  altText: string;
};

function MediaSelect({
  value,
  media,
  onChange,
}: {
  value: string;
  media: MediaAsset[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5 text-sm text-ash">
      Image from media library
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-white/15 bg-obsidian px-3 text-chalk"
      >
        <option value="">Choose an uploaded image</option>
        {media.filter((item) => item.url).map((item) => (
          <option key={item._id} value={item.url ?? ""}>{item.fileName}</option>
        ))}
      </select>
      {media.length === 0 && (
        <span className="block text-xs">Upload an image in the Media library first.</span>
      )}
    </label>
  );
}

export function CmsSectionEditor({
  sections,
  media,
  title,
  summary,
  onChange,
}: {
  sections: CmsSection[];
  media: MediaAsset[];
  title: string;
  summary: string;
  onChange: (sections: CmsSection[]) => void;
}) {
  const replace = (updated: CmsSection) => {
    onChange(sections.map((section) => section.id === updated.id ? updated : section));
  };
  const move = (index: number, offset: number) => {
    const target = index + offset;
    if (target < 0 || target >= sections.length) return;
    const ordered = [...sections];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    onChange(ordered);
  };
  const add = (type: CmsSectionType) => onChange([...sections, createCmsSection(type)]);

  return (
    <section className="space-y-4 rounded-lg border border-white/10 p-4">
      <div>
        <h3 className="font-semibold text-chalk">Page sections</h3>
        <p className="mt-1 text-xs leading-5 text-ash">
          Build the published page from editable blocks. When sections are added,
          they replace the plain-text body on the public page.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {([
          ["hero", "Hero"],
          ["text", "Text"],
          ["image", "Image"],
          ["features", "Feature cards"],
          ["cta", "Call to action"],
        ] as const).map(([type, label]) => (
          <Button key={type} type="button" variant="outline" size="sm" onClick={() => add(type)}>
            <Plus className="size-4" /> {label}
          </Button>
        ))}
      </div>

      {sections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/15 px-4 py-8 text-center text-sm text-ash">
          <ImagePlus className="mx-auto mb-2 size-5" />
          Add sections to visually build this page. Until then, the main content
          below is shown as plain text.
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <article key={section.id} className="space-y-4 rounded-lg border border-white/10 p-4">
              <header className="flex items-center justify-between gap-3">
                <h4 className="font-medium capitalize text-chalk">
                  {section.type === "features" ? "Feature cards" : section.type.replace("-", " ")} section
                </h4>
                <div className="flex gap-1">
                  <Button type="button" variant="outline" size="icon-sm" aria-label="Move section up" disabled={index === 0} onClick={() => move(index, -1)}>
                    <ArrowUp />
                  </Button>
                  <Button type="button" variant="outline" size="icon-sm" aria-label="Move section down" disabled={index === sections.length - 1} onClick={() => move(index, 1)}>
                    <ArrowDown />
                  </Button>
                  <Button type="button" variant="outline" size="icon-sm" aria-label="Delete section" onClick={() => onChange(sections.filter((item) => item.id !== section.id))}>
                    <Trash2 />
                  </Button>
                </div>
              </header>

              {section.type === "hero" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm text-ash">
                    Eyebrow
                    <Input value={section.eyebrow ?? ""} onChange={(event) => replace({ ...section, eyebrow: event.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm text-ash">
                    Heading
                    <Input required value={section.heading} onChange={(event) => replace({ ...section, heading: event.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm text-ash sm:col-span-2">
                    Text
                    <Textarea rows={3} value={section.body ?? ""} onChange={(event) => replace({ ...section, body: event.target.value })} />
                  </label>
                  <MediaSelect value={section.imageUrl ?? ""} media={media} onChange={(imageUrl) => replace({ ...section, imageUrl })} />
                  <label className="space-y-1.5 text-sm text-ash">
                    Image description
                    <Input value={section.imageAlt ?? ""} onChange={(event) => replace({ ...section, imageAlt: event.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm text-ash">
                    Main button label
                    <Input value={section.primaryLabel ?? ""} onChange={(event) => replace({ ...section, primaryLabel: event.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm text-ash">
                    Main button link
                    <Input placeholder="/contact" value={section.primaryHref ?? ""} onChange={(event) => replace({ ...section, primaryHref: event.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm text-ash">
                    Secondary button label
                    <Input value={section.secondaryLabel ?? ""} onChange={(event) => replace({ ...section, secondaryLabel: event.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm text-ash">
                    Secondary button link
                    <Input placeholder="/about" value={section.secondaryHref ?? ""} onChange={(event) => replace({ ...section, secondaryHref: event.target.value })} />
                  </label>
                </div>
              )}

              {section.type === "text" && (
                <div className="space-y-3">
                  <label className="block space-y-1.5 text-sm text-ash">
                    Heading
                    <Input value={section.heading ?? ""} onChange={(event) => replace({ ...section, heading: event.target.value })} />
                  </label>
                  <label className="block space-y-1.5 text-sm text-ash">
                    Text
                    <Textarea rows={6} required value={section.body} onChange={(event) => replace({ ...section, body: event.target.value })} />
                  </label>
                </div>
              )}

              {section.type === "image" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <MediaSelect value={section.imageUrl} media={media} onChange={(imageUrl) => replace({ ...section, imageUrl })} />
                  <label className="space-y-1.5 text-sm text-ash">
                    Image description (required for accessibility)
                    <Input required value={section.imageAlt} onChange={(event) => replace({ ...section, imageAlt: event.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm text-ash sm:col-span-2">
                    Caption
                    <Input value={section.caption ?? ""} onChange={(event) => replace({ ...section, caption: event.target.value })} />
                  </label>
                </div>
              )}

              {section.type === "features" && (
                <div className="space-y-3">
                  <label className="block space-y-1.5 text-sm text-ash">
                    Section heading
                    <Input value={section.heading ?? ""} onChange={(event) => replace({ ...section, heading: event.target.value })} />
                  </label>
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="grid gap-3 rounded-md border border-white/10 p-3 sm:grid-cols-[1fr_2fr_auto]">
                      <Input aria-label={`Feature ${itemIndex + 1} title`} required value={item.title} onChange={(event) => replace({ ...section, items: section.items.map((current, index) => index === itemIndex ? { ...current, title: event.target.value } : current) })} />
                      <Textarea aria-label={`Feature ${itemIndex + 1} description`} required rows={2} value={item.body} onChange={(event) => replace({ ...section, items: section.items.map((current, index) => index === itemIndex ? { ...current, body: event.target.value } : current) })} />
                      <Button type="button" variant="outline" size="icon-sm" aria-label={`Remove feature ${itemIndex + 1}`} disabled={section.items.length === 1} onClick={() => replace({ ...section, items: section.items.filter((_, index) => index !== itemIndex) })}>
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => replace({ ...section, items: [...section.items, { title: "", body: "" }] })}>
                    <Plus className="size-4" /> Add feature
                  </Button>
                </div>
              )}

              {section.type === "cta" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm text-ash">
                    Heading
                    <Input required value={section.heading} onChange={(event) => replace({ ...section, heading: event.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm text-ash">
                    Button label
                    <Input required value={section.buttonLabel} onChange={(event) => replace({ ...section, buttonLabel: event.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm text-ash">
                    Button link
                    <Input required placeholder="/contact" value={section.buttonHref} onChange={(event) => replace({ ...section, buttonHref: event.target.value })} />
                  </label>
                  <label className="space-y-1.5 text-sm text-ash">
                    Supporting text
                    <Textarea rows={2} value={section.body ?? ""} onChange={(event) => replace({ ...section, body: event.target.value })} />
                  </label>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      {sections.length > 0 && (
        <details className="rounded-lg border border-white/10">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-chalk">
            Preview published sections
          </summary>
          <article className="space-y-8 border-t border-white/10 bg-obsidian px-5 py-8">
            <header className="mx-auto max-w-4xl">
              <p className="afr-eyebrow text-innovation">AFRINNET Foundation</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-chalk">{title || "Page title"}</h2>
              {summary && <p className="mt-3 text-ash">{summary}</p>}
            </header>
            <div className="mx-auto max-w-5xl">
              <CmsContentSections sections={sections} />
            </div>
          </article>
        </details>
      )}
    </section>
  );
}
