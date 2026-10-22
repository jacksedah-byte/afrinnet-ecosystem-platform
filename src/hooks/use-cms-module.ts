import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

function mergeContent<T>(fallback: T, override: unknown): T {
  if (Array.isArray(fallback)) {
    return (Array.isArray(override) ? override : fallback) as T;
  }
  if (
    fallback !== null &&
    typeof fallback === "object" &&
    override !== null &&
    typeof override === "object" &&
    !Array.isArray(override)
  ) {
    const merged = { ...fallback } as Record<string, unknown>;
    for (const [key, value] of Object.entries(override)) {
      merged[key] = key in merged ? mergeContent(merged[key], value) : value;
    }
    return merged as T;
  }
  return (override === undefined ? fallback : override) as T;
}

export function useCmsModule<T>(key: string, fallback: T): T {
  const record = useQuery(api.cms.getPublishedByKey, { key: `module:${key}` });
  return record ? mergeContent(fallback, record.content) : fallback;
}