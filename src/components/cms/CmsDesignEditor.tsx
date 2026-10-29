import { useState } from "react";
import { defaultSiteConfiguration } from "@/hooks/use-site-configuration";

type Design = typeof defaultSiteConfiguration.design;

const COLOR_FIELDS: { key: "primary" | "secondary" | "background" | "surface" | "text"; label: string }[] = [
  { key: "primary", label: "Primary brand color" },
  { key: "secondary", label: "Secondary brand color" },
  { key: "background", label: "Page background" },
  { key: "surface", label: "Cards and panels" },
  { key: "text", label: "Main text" },
];

export function CmsDesignEditor({
  body,
  onChange,
}: {
  body: string;
  onChange: (body: string) => void;
}) {
  const [error, setError] = useState("");
  let configuration: Record<string, unknown> | null = null;
  let design: Design = defaultSiteConfiguration.design;
  try {
    const parsed: unknown = JSON.parse(body);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      configuration = parsed as Record<string, unknown>;
      const current = configuration.design;
      if (typeof current === "object" && current !== null && !Array.isArray(current)) {
        design = { ...defaultSiteConfiguration.design, ...(current as Partial<Design>) };
      }
    }
  } catch {
    configuration = null;
  }

  const update = (patch: Partial<Design>) => {
    if (!configuration) {
      setError("Fix the JSON below before changing visual design settings.");
      return;
    }
    onChange(JSON.stringify({
      ...configuration,
      design: { ...design, ...patch },
    }, null, 2));
    setError("");
  };

  return (
    <section className="space-y-4 rounded-lg border border-white/10 p-4">
      <div>
        <h3 className="font-semibold text-chalk">Visual design</h3>
        <p className="mt-1 text-xs leading-5 text-ash">
          Update the public site color palette, typography and corner rounding.
          Changes appear when the settings are published.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COLOR_FIELDS.map(({ key, label }) => {
          const value = typeof design[key] === "string" && /^#[\da-f]{6}$/i.test(design[key])
            ? design[key]
            : defaultSiteConfiguration.design[key];
          return (
            <label key={key} className="space-y-1.5 text-sm text-ash">
              {label}
              <span className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label={label}
                  value={value}
                  onChange={(event) => update({ [key]: event.target.value })}
                  className="size-10 rounded border border-white/15 bg-transparent p-1"
                />
                <code className="font-mono text-xs">{value}</code>
              </span>
            </label>
          );
        })}
        <label className="space-y-1.5 text-sm text-ash">
          Display font
          <select
            value={typeof design.displayFont === "string" ? design.displayFont : "Montserrat"}
            onChange={(event) => update({ displayFont: event.target.value })}
            className="h-10 w-full rounded-md border border-white/15 bg-obsidian px-3 text-chalk"
          >
            {["Montserrat", "Open Sans", "Arial", "Georgia", "system-ui"].map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm text-ash">
          Body font
          <select
            value={typeof design.bodyFont === "string" ? design.bodyFont : "Open Sans"}
            onChange={(event) => update({ bodyFont: event.target.value })}
            className="h-10 w-full rounded-md border border-white/15 bg-obsidian px-3 text-chalk"
          >
            {["Open Sans", "Montserrat", "Arial", "Georgia", "system-ui"].map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm text-ash">
          Corner rounding
          <span className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="2"
              step="0.125"
              value={Number.isFinite(design.radius) ? design.radius : 0.625}
              onChange={(event) => update({ radius: Number(event.target.value) })}
              className="w-full accent-innovation"
            />
            <span className="min-w-12 text-xs">{Number(design.radius).toFixed(2)}rem</span>
          </span>
        </label>
      </div>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </section>
  );
}
