import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../components/AdminLayout";
import { adminFetchFormData, deleteRecord, loadHeroSections, resolveAdminMediaUrl } from "../api";
import type { HeroSectionRecord } from "../types";
import { useObjectUrl } from "../hooks/use-object-url";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface HeroFormState {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  badge: string;
  displayOrder: string;
  status: "active" | "inactive";
}

const EMPTY_FORM: HeroFormState = {
  title: "",
  subtitle: "",
  description: "",
  buttonText: "Enquire Now",
  buttonLink: "#enquire",
  badge: "",
  displayOrder: "0",
  status: "active",
};

function HeroEditorDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: HeroSectionRecord | null;
  onSubmit: (payload: FormData) => Promise<void>;
}) {
  const [form, setForm] = useState<HeroFormState>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const objectUrl = useObjectUrl(file);

  useEffect(() => {
    if (open) {
      setForm(
        item
          ? {
              title: item.title || "",
              subtitle: item.subtitle || "",
              description: item.description || "",
              buttonText: item.buttonText || "",
              buttonLink: item.buttonLink || "",
              badge: item.badge || "",
              displayOrder: String(item.displayOrder ?? 0),
              status: item.status,
            }
          : EMPTY_FORM,
      );
      setFile(null);
    }
  }, [open, item]);

  const previewSrc = objectUrl || resolveAdminMediaUrl(item?.backgroundImage);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title || !form.description || !form.buttonText || !form.buttonLink) {
      toast.error("Please fill in all required hero fields.");
      return;
    }

    if (!item && !file) {
      toast.error("Background image is required.");
      return;
    }

    const payload = new FormData();
    payload.set("title", form.title);
    payload.set("subtitle", form.subtitle);
    payload.set("description", form.description);
    payload.set("buttonText", form.buttonText);
    payload.set("buttonLink", form.buttonLink);
    payload.set("badge", form.badge);
    payload.set("displayOrder", form.displayOrder);
    payload.set("status", form.status);
    if (file) {
      payload.set("backgroundImage", file);
    } else if (item?.backgroundImage) {
      payload.set("existingBackgroundImage", item.backgroundImage);
    }

    setSaving(true);
    try {
      await onSubmit(payload);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Hero Banner" : "Add Hero Banner"}</DialogTitle>
          <DialogDescription>
            Update the slide content that appears on the homepage carousel.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={form.subtitle}
                onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-button-text">Button Text</Label>
              <Input
                id="hero-button-text"
                value={form.buttonText}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, buttonText: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-button-link">Button Link</Label>
              <Input
                id="hero-button-link"
                value={form.buttonLink}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, buttonLink: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-badge">Badge</Label>
              <Input
                id="hero-badge"
                value={form.badge}
                onChange={(event) => setForm((prev) => ({ ...prev, badge: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-order">Display Order</Label>
              <Input
                id="hero-order"
                type="number"
                value={form.displayOrder}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, displayOrder: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value as HeroFormState["status"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hero-image">Background Image</Label>
              <div className="flex flex-col gap-3">
                <Input
                  id="hero-image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
                {previewSrc && (
                  <div className="overflow-hidden rounded-2xl border border-border">
                    <img src={previewSrc} alt="Hero preview" className="h-48 w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? "Saving..." : "Save Hero"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminHeroPage() {
  const [items, setItems] = useState<HeroSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeroSectionRecord | null>(null);
  const [deletingItem, setDeletingItem] = useState<HeroSectionRecord | null>(null);

  async function loadItems() {
    setLoading(true);
    try {
      const response = await loadHeroSections();
      setItems(response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load hero banners");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !term ||
        [item.title, item.subtitle, item.description, item.buttonText, item.buttonLink, item.badge]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term));
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  async function saveHero(payload: FormData) {
    const response = editingItem
      ? await adminFetchFormData<HeroSectionRecord>(
          `/api/admin/hero/${editingItem.id}`,
          payload,
          "PUT",
        )
      : await adminFetchFormData<HeroSectionRecord>("/api/admin/hero", payload, "POST");
    toast.success(editingItem ? "Hero banner updated" : "Hero banner added");
    setItems((current) => {
      const next = editingItem
        ? current.map((item) => (item.id === response.id ? response : item))
        : [response, ...current];
      return next.sort((a, b) => a.displayOrder - b.displayOrder);
    });
  }

  async function quickToggle(item: HeroSectionRecord, nextStatus: "active" | "inactive") {
    try {
      const payload = new FormData();
      payload.set("title", item.title);
      payload.set("subtitle", item.subtitle || "");
      payload.set("description", item.description);
      payload.set("buttonText", item.buttonText);
      payload.set("buttonLink", item.buttonLink);
      payload.set("badge", item.badge || "");
      payload.set("displayOrder", String(item.displayOrder));
      payload.set("status", nextStatus);
      payload.set("existingBackgroundImage", item.backgroundImage);
      const response = await adminFetchFormData<HeroSectionRecord>(
        `/api/admin/hero/${item.id}`,
        payload,
        "PUT",
      );
      setItems((current) => current.map((row) => (row.id === response.id ? response : row)));
      toast.success(`Hero banner ${nextStatus === "active" ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update hero banner");
    }
  }

  async function handleDelete() {
    if (!deletingItem) {
      return;
    }
    try {
      await deleteRecord(`/api/admin/hero/${deletingItem.id}`);
      toast.success("Hero banner deleted");
      setItems((current) => current.filter((item) => item.id !== deletingItem.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete hero banner");
    } finally {
      setDeletingItem(null);
    }
  }

  return (
    <AdminLayout title="Hero Banners" subtitle="Manage the homepage carousel">
      <div className="space-y-6">
        <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-slate-950/20">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Homepage Hero Section</CardTitle>
              <p className="mt-1 text-sm text-slate-400">
                Add, edit, delete and reorder hero banners.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search hero banners..."
                  className="w-full border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-400 sm:w-72"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
              >
                <SelectTrigger className="w-full border-white/10 bg-white/5 text-white sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setEditorOpen(true);
                }}
                className="gap-2 bg-sky-500 text-white hover:bg-sky-400"
              >
                <Plus className="h-4 w-4" />
                Add Hero
              </Button>
              <HeroEditorDialog
                open={editorOpen}
                onOpenChange={setEditorOpen}
                item={editingItem}
                onSubmit={saveHero}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 rounded-2xl bg-white/10" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
                No hero banners found.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <Table>
                  <TableHeader className="[&>tr]:border-white/10">
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-slate-300">Banner</TableHead>
                      <TableHead className="text-slate-300">Title</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Order</TableHead>
                      <TableHead className="text-right text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <img
                            src={resolveAdminMediaUrl(item.backgroundImage)}
                            alt={item.title}
                            className="h-16 w-24 rounded-xl object-cover"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="font-semibold text-white">{item.title}</p>
                            <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                              {item.subtitle || item.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.status === "active" ? "default" : "secondary"}
                            className={
                              item.status === "active"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-white/10 text-slate-300"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{item.displayOrder}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={item.status === "active"}
                                onCheckedChange={(checked) =>
                                  quickToggle(item, checked ? "active" : "inactive")
                                }
                              />
                              <span className="text-xs text-slate-400">
                                {item.status === "active" ? "On" : "Off"}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-white/10 bg-white/5 text-white hover:bg-white hover:text-slate-950"
                              onClick={() => {
                                setEditingItem(item);
                                setEditorOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-white/10 bg-white/5 text-white hover:bg-rose-500 hover:text-white"
                              onClick={() => setDeletingItem(item)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog
          open={Boolean(deletingItem)}
          onOpenChange={(open) => !open && setDeletingItem(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this hero banner?</AlertDialogTitle>
              <AlertDialogDescription>{deletingItem?.title}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingItem(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-rose-600 text-white hover:bg-rose-500"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
