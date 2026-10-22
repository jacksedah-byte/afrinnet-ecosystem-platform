import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonPath = Array<string | number>;

function setAtPath(root: JsonValue, path: JsonPath, update: (value: JsonValue) => JsonValue): JsonValue {
  if (path.length === 0) return update(root);
  const [head, ...tail] = path;
  if (Array.isArray(root) && typeof head === "number") {
    return root.map((item, index) => index === head ? setAtPath(item, tail, update) : item);
  }
  if (root && typeof root === "object" && !Array.isArray(root) && typeof head === "string") {
    return {
      ...root,
      [head]: head in root
        ? setAtPath(root[head], tail, update)
        : setAtPath(null, tail, update),
    };
  }
  throw new Error("This content field cannot be updated at the selected path.");
}

function initialArrayValue(items: JsonValue[]): JsonValue {
  const example = items[0];
  if (example === undefined) return "";
  if (Array.isArray(example)) return [];
  if (example && typeof example === "object") {
    return Object.fromEntries(Object.entries(example).map(([key, value]) => [key, initialArrayValue([value])]));
  }
  return typeof example === "string" ? "" : example;
}

function imageContext(label: string, path: JsonPath) {
  return /(image|photo|portrait|avatar|logo|favicon)/i.test([label, ...path].join(" "));
}

function parseJson(value: string): JsonValue {
  return JSON.parse(value) as JsonValue;
}

export function CmsJsonEditor({
  value,
  onChange,
  onUploadImage,
  isUploading,
}: {
  value: string;
  onChange: (value: string) => void;
  onUploadImage: (file: File | undefined, path: JsonPath) => void;
  isUploading: boolean;
}) {
  const [jsonError, setJsonError] = useState<string | null>(null);
  let data: JsonValue;
  try {
    data = parseJson(value);
  } catch {
    return (
      <div className="space-y-2">
        <p role="alert" className="text-sm text-destructive">Content is not valid JSON. Correct it in the editor below.</p>
        <Textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-[480px] font-mono text-xs leading-5" spellCheck={false} />
      </div>
    );
  }

  const commit = (next: JsonValue) => {
    setJsonError(null);
    onChange(JSON.stringify(next, null, 2));
  };

  const render = (node: JsonValue, path: JsonPath, label: string): ReactNode => {
    if (Array.isArray(node)) {
      return (
        <section key={path.join(".")} className="space-y-3 border-l-2 pl-4">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold">{label} <span className="font-normal text-muted-foreground">({node.length})</span></h4>
            <Button type="button" size="sm" variant="outline" onClick={() => commit(setAtPath(data, path, (current) => [...(current as JsonValue[]), initialArrayValue(current as JsonValue[])]))}>
              <Plus className="size-4" />Add item
            </Button>
          </div>
          {node.map((item, index) => (
            <div key={`${path.join(".")}-${index}`} className="relative space-y-3 border-t pt-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">Item {index + 1}</span>
                <Button type="button" size="icon" variant="ghost" aria-label={`Remove ${label} item ${index + 1}`} onClick={() => commit(setAtPath(data, path, (current) => (current as JsonValue[]).filter((_, itemIndex) => itemIndex !== index)))}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {render(item, [...path, index], `Item ${index + 1}`)}
            </div>
          ))}
        </section>
      );
    }

    if (node && typeof node === "object") {
      const entries = Object.entries(node);
      const canUpload = imageContext(label, path);
      return (
        <section key={path.join(".")} className="space-y-4 border-l-2 pl-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold">{label}</h4>
            {canUpload && (
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                <ImagePlus className="size-4" />{isUploading ? "Uploading…" : "Upload image"}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/x-icon" disabled={isUploading} className="sr-only" onChange={(event) => { onUploadImage(event.target.files?.[0], path); event.target.value = ""; }} />
              </label>
            )}
          </div>
          {entries.map(([key, child]) => (
            <div key={`${path.join(".")}-${key}`} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">{key}</span>
                <Button type="button" size="icon" variant="ghost" aria-label={`Remove ${key}`} onClick={() => commit(setAtPath(data, path, (current) => {
                  const copy = { ...(current as Record<string, JsonValue>) };
                  delete copy[key];
                  return copy;
                }))}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {render(child, [...path, key], key)}
            </div>
          ))}
          <AddField onAdd={(key) => commit(setAtPath(data, path, (current) => ({ ...(current as Record<string, JsonValue>), [key]: "" })))} />
        </section>
      );
    }

    if (typeof node === "boolean") {
      return (
        <label key={path.join(".")} className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={node} onChange={(event) => commit(setAtPath(data, path, () => event.target.checked))} />
          {label}
        </label>
      );
    }

    if (typeof node === "number") {
      return <label key={path.join(".")} className="block space-y-1.5 text-sm font-medium">{label}<Input type="number" value={node} onChange={(event) => commit(setAtPath(data, path, () => Number(event.target.value)))} /></label>;
    }

    const text = node ?? "";
    const uploadable = imageContext(label, path);
    return (
      <div key={path.join(".")} className="space-y-2">
        <label className="block space-y-1.5 text-sm font-medium">
          {label}
          {String(text).length > 120 ? (
            <Textarea value={String(text)} onChange={(event) => commit(setAtPath(data, path, () => event.target.value))} className="min-h-20" />
          ) : (
            <Input value={String(text)} onChange={(event) => commit(setAtPath(data, path, () => event.target.value))} />
          )}
        </label>
        {uploadable && (
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">
            <ImagePlus className="size-4" />{isUploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/x-icon" disabled={isUploading} className="sr-only" onChange={(event) => { onUploadImage(event.target.files?.[0], path); event.target.value = ""; }} />
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {jsonError && <p role="alert" className="text-sm text-destructive">{jsonError}</p>}
      {render(data, [], "Content")}
      <details className="border-t pt-4">
        <summary className="cursor-pointer text-sm font-semibold">Advanced JSON</summary>
        <Textarea
          value={value}
          onChange={(event) => {
            try {
              parseJson(event.target.value);
              setJsonError(null);
            } catch {
              setJsonError("The JSON text is incomplete or invalid.");
            }
            onChange(event.target.value);
          }}
          className="mt-3 min-h-[400px] font-mono text-xs leading-5"
          spellCheck={false}
        />
      </details>
    </div>
  );
}

function AddField({ onAdd }: { onAdd: (key: string) => void }) {
  const [name, setName] = useState("");
  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const key = name.trim();
        if (!key) return;
        onAdd(key);
        setName("");
      }}
    >
      <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="New field name" aria-label="New content field name" />
      <Button type="submit" variant="outline" disabled={!name.trim()}><Plus className="size-4" />Add field</Button>
    </form>
  );
}
