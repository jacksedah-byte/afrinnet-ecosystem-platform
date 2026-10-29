import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { Copy, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/cms/Panel";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export type CmsMediaAsset = {
  _id: Id<"cmsMedia">;
  url: string | null;
  fileName: string;
  contentType: string;
  size: number;
  altText: string;
  createdAt: number;
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CmsMediaLibrary() {
  const media = useQuery(api.cms.listMedia);
  const generateUploadUrl = useMutation(api.cms.generateMediaUploadUrl);
  const registerMedia = useMutation(api.cms.registerMedia);
  const deleteMedia = useMutation(api.cms.deleteMedia);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setError("");
    setMessage("");
  };

  const upload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Choose an image to upload.");
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG, WebP or GIF image.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Images must be 8 MB or smaller.");
      return;
    }
    if (!altText.trim()) {
      setError("Add a short image description for accessibility.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) {
        throw new Error(`Image upload failed (${response.status}). Please try again.`);
      }
      const result: unknown = await response.json();
      if (
        typeof result !== "object" ||
        result === null ||
        !("storageId" in result) ||
        typeof result.storageId !== "string"
      ) {
        throw new Error("The image upload response was invalid.");
      }
      await registerMedia({
        storageId: result.storageId as Id<"_storage">,
        fileName: file.name,
        altText: altText.trim(),
      });
      setFile(null);
      setAltText("");
      const input = document.getElementById("cms-media-file");
      if (input instanceof HTMLInputElement) input.value = "";
      setMessage("Image uploaded and added to the library.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not upload this image.");
    } finally {
      setBusy(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Image URL copied.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not copy image URL.");
    }
  };

  const remove = async (item: CmsMediaAsset) => {
    if (!window.confirm(`Delete ${item.fileName}? Pages using this image will no longer display it.`)) return;
    setBusy(true);
    setError("");
    try {
      await deleteMedia({ id: item._id });
      setMessage("Image deleted.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete this image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel title="Media library">
      <p className="mb-5 text-sm leading-6 text-ash">
        Upload images for page sections. JPG, PNG, WebP and GIF are supported,
        up to 8 MB each. Add descriptive alt text so images are accessible.
      </p>
      <form onSubmit={upload} className="mb-6 grid gap-3 rounded-lg border border-white/10 p-4 md:grid-cols-[1fr_1fr_auto]">
        <label className="space-y-1.5 text-sm text-ash">
          Image file
          <Input id="cms-media-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFileChange} />
          {file && <span className="block text-xs">{file.name} · {formatBytes(file.size)}</span>}
        </label>
        <label className="space-y-1.5 text-sm text-ash">
          Image description
          <Input required maxLength={300} value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Describe what the image shows" />
        </label>
        <div className="flex items-end">
          <Button type="submit" disabled={busy || !file}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Upload image
          </Button>
        </div>
      </form>
      {error && <p role="alert" className="mb-4 text-sm text-red-400">{error}</p>}
      {message && <p role="status" className="mb-4 text-sm text-innovation">{message}</p>}
      {media === undefined ? (
        <Loader2 className="mx-auto size-5 animate-spin" />
      ) : media.length === 0 ? (
        <div className="py-8 text-center text-sm text-ash">
          <ImagePlus className="mx-auto mb-2 size-5" />
          No images uploaded yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {media.map((item) => (
            <article key={item._id} className="overflow-hidden rounded-lg border border-white/10">
              {item.url ? (
                <img src={item.url} alt={item.altText} className="aspect-video w-full bg-ink object-cover" loading="lazy" />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-ink text-sm text-ash">Image URL unavailable</div>
              )}
              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium" title={item.fileName}>{item.fileName}</p>
                <p className="text-xs text-ash">{item.contentType} · {formatBytes(item.size)}</p>
                <p className="line-clamp-2 text-xs text-ash">{item.altText}</p>
                <div className="flex gap-2 pt-1">
                  {item.url && (
                    <Button type="button" variant="outline" size="sm" onClick={() => void copyUrl(item.url!)}>
                      <Copy className="size-4" /> Copy URL
                    </Button>
                  )}
                  <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => void remove(item)}>
                    <Trash2 className="size-4" /> Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Panel>
  );
}
