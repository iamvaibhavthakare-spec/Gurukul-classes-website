import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Edit, ImagePlus, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../components/AdminLayout";
import { adminFetchFormData, deleteRecord, loadGallery, resolveAdminMediaUrl } from "../api";
import type { GalleryRecord } from "../types";
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

interface GalleryFormState {
  title: string;
  category: string;
  description: string;
  displayOrder: string;
  status: "active" | "inactive";
}

const EMPTY_FORM: GalleryFormState = {
  title: "",
  category: "Campus Life",
  description: "",
  displayOrder: "0",
  status: "active",
};

function GalleryEditorDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: GalleryRecord | null;
  onSubmit: (payload: FormData) => Promise<void>;
}) {
  const [form, setForm] = useState<GalleryFormState>(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const objectUrl = useObjectUrl(files[0] || null);

  useEffect(() => {
    if (open) {
      setForm(
        item
          ? {
              title: item.title || "",
              category: item.category || "Campus Life",
              description: item.description || "",
              displayOrder: String(item.displayOrder ?? 0),
              status: item.status,
            }
          : EMPTY_FORM,
      );
      setFiles([]);
    }
  }, [open, item]);

  const previewSrc = objectUrl || resolveAdminMediaUrl(item?.image);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title || !form.category) {
      toast.error("Please fill in the gallery title and category.");
      return;
    }
    if (!item && files.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    const payload = new FormData();
    payload.set("title", form.title);
    payload.set("category", form.category);
    payload.set("description", form.description);
    payload.set("displayOrder", form.displayOrder);
    payload.set("status", form.status);

    if (files.length > 0) {
      if (item) {
        payload.set("image", files[0]);
      } else {
        files.forEach((file) => payload.append("images", file));
      }
    } else if (item?.image) {
      payload.set("existingImage", item.image);
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Gallery Item" : "Add Gallery Item"}</DialogTitle>
          <DialogDescription>Upload a new image or replace the existing one.</DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gallery-title">Title</Label>
              <Input
                id="gallery-title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-category">Category</Label>
              <Input
                id="gallery-category"
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-order">Display Order</Label>
              <Input
                id="gallery-order"
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
                  setForm((prev) => ({ ...prev, status: value as GalleryFormState["status"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="gallery-description">Description</Label>
              <Textarea
                id="gallery-description"
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="gallery-image">{item ? "Replace Image" : "Upload Images"}</Label>
              <Input
                id="gallery-image"
                type="file"
                accept="image/*"
                multiple={!item}
                onChange={(event) => setFiles(Array.from(event.target.files || []))}
              />
              {previewSrc && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                  <img
                    src={previewSrc}
                    alt="Gallery preview"
                    className="h-56 w-full object-cover"
                  />
                </div>
              )}
              {!item && files.length > 1 && (
                <p className="text-xs text-slate-500">{files.length} files selected</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Gallery Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryRecord | null>(null);
  const [deletingItem, setDeletingItem] = useState<GalleryRecord | null>(null);

  async function loadItems() {
    setLoading(true);
    try {
      setItems(await loadGallery());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load gallery");
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
      const searchable = [item.title, item.category, item.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return (!term || searchable) && matchesStatus;
    });
  }, [items, search, statusFilter]);

  async function saveGallery(payload: FormData) {
    const response = editingItem
      ? await adminFetchFormData<GalleryRecord>(
          `/api/admin/gallery/${editingItem.id}`,
          payload,
          "PUT",
        )
      : await adminFetchFormData<GalleryRecord[] | GalleryRecord>(
          "/api/admin/gallery",
          payload,
          "POST",
        );
    toast.success(editingItem ? "Gallery item updated" : "Gallery item added");
    setItems((current) => {
      if (editingItem) {
        return current.map((item) =>
          item.id === (response as GalleryRecord).id ? (response as GalleryRecord) : item,
        );
      }
      const additions = Array.isArray(response) ? response : [response];
      return [...additions, ...current].sort((a, b) => a.displayOrder - b.displayOrder);
    });
  }

  async function quickToggle(item: GalleryRecord, nextStatus: "active" | "inactive") {
    try {
      const payload = new FormData();
      payload.set("title", item.title);
      payload.set("category", item.category);
      payload.set("description", item.description || "");
      payload.set("displayOrder", String(item.displayOrder));
      payload.set("status", nextStatus);
      payload.set("existingImage", item.image);
      const response = await adminFetchFormData<GalleryRecord>(
        `/api/admin/gallery/${item.id}`,
        payload,
        "PUT",
      );
      setItems((current) => current.map((row) => (row.id === response.id ? response : row)));
      toast.success(`Gallery item ${nextStatus === "active" ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update gallery item");
    }
  }

  async function handleDelete() {
    if (!deletingItem) return;
    try {
      await deleteRecord(`/api/admin/gallery/${deletingItem.id}`);
      setItems((current) => current.filter((row) => row.id !== deletingItem.id));
      toast.success("Gallery item deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete gallery item");
    } finally {
      setDeletingItem(null);
    }
  }

  return (
    <AdminLayout title="Gallery" subtitle="Manage photos shown across the website">
      <div className="space-y-6">
        <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-slate-950/20">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Gallery Management</CardTitle>
              <p className="mt-1 text-sm text-slate-400">
                Create, update and archive gallery images.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search gallery..."
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
                Add Image
              </Button>
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
                No gallery images found.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-slate-300">Image</TableHead>
                      <TableHead className="text-slate-300">Title</TableHead>
                      <TableHead className="text-slate-300">Category</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-right text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <img
                            src={resolveAdminMediaUrl(item.image)}
                            alt={item.title}
                            className="h-14 w-20 rounded-xl object-cover"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-white">{item.title}</p>
                            <p className="text-xs text-slate-400">{item.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-white/10 text-white">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.status === "active"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-white/10 text-slate-300"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-3">
                            <Switch
                              checked={item.status === "active"}
                              onCheckedChange={(checked) =>
                                quickToggle(item, checked ? "active" : "inactive")
                              }
                            />
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

        <GalleryEditorDialog
          open={editorOpen}
          onOpenChange={setEditorOpen}
          item={editingItem}
          onSubmit={saveGallery}
        />

        <AlertDialog
          open={Boolean(deletingItem)}
          onOpenChange={(open) => !open && setDeletingItem(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this gallery image?</AlertDialogTitle>
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
