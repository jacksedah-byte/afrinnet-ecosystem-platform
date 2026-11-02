import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil, Plus, Shield, Trash2, UserRound } from "lucide-react";

type CmsRole = "admin" | "editor" | "viewer" | "custom";
type CmsPermission = "pages" | "content" | "media" | "settings" | "inbox";
type CmsStaff = Doc<"cmsUsers">;

const permissionLabels: Record<CmsPermission, string> = {
  pages: "Pages and publishing",
  content: "Website content",
  media: "Media library and uploads",
  settings: "Site settings and navigation",
  inbox: "Submissions and enquiries",
};

const defaultPermissions: Record<CmsRole, CmsPermission[]> = {
  admin: ["pages", "content", "media", "settings", "inbox"],
  editor: ["pages", "content", "media"],
  viewer: ["pages", "content", "media"],
  custom: [],
};

const emptyForm = {
  clerkUserId: "",
  email: "",
  name: "",
  designation: "",
  role: "editor" as CmsRole,
  permissions: [...defaultPermissions.editor],
  active: true,
};

export function CmsUsersManager() {
  const users = useQuery(api.cms.listCmsUsers, {});
  const saveUser = useMutation(api.cms.saveCmsUser);
  const removeUser = useMutation(api.cms.removeCmsUser);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setEditingId(null);
    setForm({ ...emptyForm, permissions: [...emptyForm.permissions] });
    setError(null);
  };

  const editUser = (user: CmsStaff) => {
    setEditingId(user._id);
    setForm({
      clerkUserId: user.clerkUserId,
      email: user.email ?? "",
      name: user.name ?? "",
      designation: user.designation,
      role: user.role,
      permissions: [...user.permissions],
      active: user.active,
    });
    setError(null);
  };

  const setRole = (role: CmsRole) => {
    setForm((current) => ({
      ...current,
      role,
      permissions: role === "custom" ? current.permissions : [...defaultPermissions[role]],
    }));
  };

  const setPermission = (permission: CmsPermission, checked: boolean) => {
    setForm((current) => {
      const permissions = checked
        ? [...new Set([...current.permissions, permission])]
        : current.permissions.filter((item) => item !== permission);
      return { ...current, role: current.role === "admin" ? "custom" : current.role, permissions };
    });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await saveUser({
        clerkUserId: form.clerkUserId.trim(),
        email: form.email.trim() || undefined,
        name: form.name.trim() || undefined,
        designation: form.designation.trim(),
        role: form.role,
        permissions: form.permissions,
        active: form.active,
      });
      toast.success(editingId ? "CMS staff access updated." : "CMS staff access added.");
      reset();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Could not save CMS staff access.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const revokeUser = async (user: CmsStaff) => {
    if (!window.confirm(`Remove CMS access for ${user.name || user.email || user.clerkUserId}?`)) return;
    try {
      await removeUser({ id: user._id });
      if (editingId === user._id) reset();
      toast.success("CMS access removed.");
    } catch (removeError) {
      toast.error(removeError instanceof Error ? removeError.message : "Could not remove CMS access.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.8fr)]">
      <section className="rounded-xl border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">CMS staff</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Assign designations and choose which areas each staff member can access.</p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Shield className="size-5" /></span>
        </div>
        {!users ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading staff access…</div>
        ) : users.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed p-6 text-center">
            <UserRound className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Only the CMS owner currently has staff access</p>
            <p className="mt-1 text-xs text-muted-foreground">Add an existing Clerk account using its Clerk user ID.</p>
          </div>
        ) : (
          <ul className="mt-5 divide-y">
            {users.map((user) => (
              <li key={user._id} className="flex flex-wrap items-center gap-3 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold">{(user.name || user.email || user.clerkUserId).slice(0, 1).toUpperCase()}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{user.name || user.email || user.clerkUserId}</span>
                  <span className="block truncate text-xs text-muted-foreground">{user.designation}{user.email ? ` · ${user.email}` : ""}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{user.role} · {user.active ? "Active" : "Disabled"} · {user.permissions.length} areas</span>
                </span>
                <Button type="button" size="icon" variant="ghost" aria-label={`Edit ${user.name || user.clerkUserId}`} onClick={() => editUser(user)}><Pencil className="size-4" /></Button>
                <Button type="button" size="icon" variant="ghost" aria-label={`Revoke access for ${user.name || user.clerkUserId}`} onClick={() => void revokeUser(user)}><Trash2 className="size-4" /></Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form onSubmit={submit} className="space-y-5 rounded-xl border bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="text-lg font-semibold">{editingId ? "Edit staff access" : "Add CMS user"}</h2><p className="mt-1 text-sm text-muted-foreground">Grant access to an existing Clerk account.</p></div>
          {editingId && <Button type="button" variant="outline" size="sm" onClick={reset}>Cancel</Button>}
        </div>
        {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
        <label className="block space-y-1.5 text-sm font-medium">Clerk user ID
          <Input required value={form.clerkUserId} disabled={Boolean(editingId)} onChange={(event) => setForm({ ...form, clerkUserId: event.target.value })} placeholder="user_…" />
          <span className="block text-xs font-normal leading-5 text-muted-foreground">Find it in Clerk → Users. The person must sign in with the same Clerk application used by this site.</span>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium">Name
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="space-y-1.5 text-sm font-medium">Work email
            <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
        </div>
        <label className="block space-y-1.5 text-sm font-medium">Designation
          <Input required value={form.designation} onChange={(event) => setForm({ ...form, designation: event.target.value })} placeholder="Content editor, Communications lead…" />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">Role
          <select value={form.role} onChange={(event) => setRole(event.target.value as CmsRole)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="admin">Administrator — all CMS areas</option>
            <option value="editor">Editor — pages, content and media</option>
            <option value="viewer">Viewer — read-only content and media</option>
            <option value="custom">Custom access</option>
          </select>
        </label>
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold">Access areas</legend>
          {Object.entries(permissionLabels).map(([permission, label]) => (
            <label key={permission} className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={form.permissions.includes(permission as CmsPermission)} disabled={form.role === "admin" || form.role === "viewer"} onChange={(event) => setPermission(permission as CmsPermission, event.target.checked)} className="mt-0.5 size-4 accent-green-700" />
              <span>{label}{permission === "inbox" && <span className="block text-xs text-muted-foreground">Includes reviewing status and deleting submissions.</span>}</span>
            </label>
          ))}
        </fieldset>
        {editingId && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} className="size-4 accent-green-700" />Access enabled</label>}
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button type="submit" disabled={isSaving}>{isSaving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}{editingId ? "Save access" : "Add CMS user"}</Button>
          {!editingId && <p className="self-center text-xs text-muted-foreground">This assigns CMS access; it does not create or invite a Clerk account.</p>}
        </div>
      </form>
    </div>
  );
}
