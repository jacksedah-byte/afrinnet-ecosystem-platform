import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { homepageContent } from "@/content/homepage";

type EditableHomepageSection = {
  id: string;
  title: string;
  introduction: string;
  body: string;
};

const sectionLabels: Record<string, string> = {
  hero: "Hero",
  mandate: "Our mandate",
  services: "Core services",
  journey: "Innovation journey",
  ecosystem: "Institutional ecosystem",
  leadership: "Leadership",
  panAfrica: "Pan-African vision",
  ip: "Intellectual property",
  knowledge: "Knowledge centre",
  partnership: "Partnership call to action",
};

function readContent(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

export function CmsHomepageSectionsEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const content = readContent(value);
  const customSections = Array.isArray(content.customSections)
    ? content.customSections.filter((section): section is EditableHomepageSection =>
        section !== null &&
        typeof section === "object" &&
        typeof (section as EditableHomepageSection).id === "string" &&
        typeof (section as EditableHomepageSection).title === "string",
      )
    : [];
  const customIds = new Set(customSections.map((section) => `custom:${section.id}`));
  const availableOrder = Array.isArray(content.sectionOrder)
    ? content.sectionOrder.filter((id): id is string => typeof id === "string" && (id in sectionLabels || customIds.has(id)))
    : [...homepageContent.sectionOrder];
  const order = availableOrder;
  const hidden = Array.isArray(content.hiddenSections)
    ? content.hiddenSections.filter((id): id is string => typeof id === "string")
    : [];
  const update = (
    sectionOrder: string[],
    hiddenSections: string[],
    nextCustomSections = customSections,
  ) => onChange(JSON.stringify({ ...content, sectionOrder, hiddenSections, customSections: nextCustomSections }, null, 2));
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const move = (index: number, direction: -1 | 1) => {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update(next, hidden);
  };
  const addSection = (id: string) => {
    if (!id || order.includes(id) || !(id in sectionLabels)) return;
    update([...order, id], hidden.filter((item) => item !== id));
  };
  const removeSection = (id: string) => update(
    order.filter((item) => item !== id),
    hidden.filter((item) => item !== id),
    id.startsWith("custom:")
      ? customSections.filter((section) => `custom:${section.id}` !== id)
      : customSections,
  );
  const toggleSection = (id: string) =>
    update(order, hidden.includes(id) ? hidden.filter((item) => item !== id) : [...hidden, id]);
  const addCustomSection = () => {
    const title = newSectionTitle.trim();
    if (!title) return;
    const section: EditableHomepageSection = {
      id: crypto.randomUUID(),
      title,
      introduction: "",
      body: "",
    };
    update([...order, `custom:${section.id}`], hidden, [...customSections, section]);
    setNewSectionTitle("");
  };
  const updateCustomSection = (id: string, patch: Partial<EditableHomepageSection>) =>
    update(order, hidden, customSections.map((section) => section.id === id ? { ...section, ...patch } : section));

  return (
    <section className="space-y-4 rounded-lg border p-4">
      <div>
        <h3 className="font-semibold">Homepage sections</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Reorder, hide, restore, or add the existing homepage sections. Their copy and images can be edited in the content fields below.
        </p>
      </div>
      <ol className="space-y-2">
        {order.map((id, index) => {
          const isHidden = hidden.includes(id);
          const label = sectionLabels[id] ?? customSections.find((section) => `custom:${section.id}` === id)?.title ?? "Custom section";
          return (
            <li key={id} className={`flex items-center gap-2 rounded-md border p-3 ${isHidden ? "opacity-60" : ""}`}>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{isHidden ? "Hidden on the website" : "Visible on the website"}</span>
              </span>
              <Button type="button" size="icon" variant="ghost" aria-label={`Move ${label} up`} title="Move up" disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp className="size-4" /></Button>
              <Button type="button" size="icon" variant="ghost" aria-label={`Move ${label} down`} title="Move down" disabled={index === order.length - 1} onClick={() => move(index, 1)}><ArrowDown className="size-4" /></Button>
              <Button type="button" size="icon" variant="ghost" aria-label={isHidden ? "Show section" : "Hide section"} title={isHidden ? "Show section" : "Hide section"} onClick={() => toggleSection(id)}>
                {isHidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </Button>
              <Button type="button" size="icon" variant="ghost" aria-label={`Remove ${label} from homepage`} title="Remove section" onClick={() => removeSection(id)}><Trash2 className="size-4" /></Button>
            </li>
          );
        })}
      </ol>
      {customSections.length > 0 && (
        <div className="space-y-4 border-t pt-4">
          <div><h4 className="text-sm font-semibold">Custom homepage sections</h4><p className="mt-1 text-xs text-muted-foreground">Edit these new sections visually here.</p></div>
          {customSections.map((section, index) => (
            <div key={section.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3"><h5 className="text-sm font-semibold">Custom section {index + 1}</h5><Button type="button" size="icon" variant="ghost" aria-label={`Delete ${section.title}`} onClick={() => removeSection(`custom:${section.id}`)}><Trash2 className="size-4" /></Button></div>
              <label className="block space-y-1.5 text-sm font-medium">Section heading<Input value={section.title} onChange={(event) => updateCustomSection(section.id, { title: event.target.value })} /></label>
              <label className="block space-y-1.5 text-sm font-medium">Introduction<Input value={section.introduction} onChange={(event) => updateCustomSection(section.id, { introduction: event.target.value })} /></label>
              <label className="block space-y-1.5 text-sm font-medium">Section text<Textarea value={section.body} onChange={(event) => updateCustomSection(section.id, { body: event.target.value })} className="min-h-24" /></label>
            </div>
          ))}
        </div>
      )}
      <label className="flex flex-wrap items-center gap-2">
        <span className="sr-only">Add homepage section</span>
        <select
          value=""
          onChange={(event) => {
            addSection(event.target.value);
            event.target.value = "";
          }}
          className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Add an existing section…</option>
          {Object.entries(sectionLabels).filter(([id]) => !order.includes(id)).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </label>
      <div className="flex flex-wrap gap-2">
        <Input value={newSectionTitle} onChange={(event) => setNewSectionTitle(event.target.value)} placeholder="Name your new homepage section" aria-label="New homepage section name" className="min-w-0 flex-1" />
        <Button type="button" variant="outline" onClick={addCustomSection}><Plus className="size-4" />Add custom section</Button>
      </div>
    </section>
  );
}
