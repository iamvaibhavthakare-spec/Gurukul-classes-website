import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../components/AdminLayout";
import { adminFetchFormData, deleteRecord, loadBlogs, resolveAdminMediaUrl } from "../api";
import type { BlogRecord } from "../types";
import { useObjectUrl } from "../hooks/use-object-url";
import { slugify } from "@/lib/slugify";
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

interface BlogFormState {
  title: string;
  slug: string;
  shortDescription: string;
  fullContent: string;
  author: string;
  category: string;
  publishDate: string;
  status: "active" | "inactive";
  metaTitle: string;
  metaDescription: string;
  readTime: string;
  imageAlt: string;
  displayOrder: string;
  highlights: string;
}

const EMPTY_FORM: BlogFormState = {
  title: "",
  slug: "",
  shortDescription: "",
  fullContent: "",
  author: "Gurukul Team",
  category: "Study Routine",
  publishDate: new Date().toISOString().slice(0, 10),
  status: "active",
  metaTitle: "",
  metaDescription: "",
  readTime: "4 min read",
  imageAlt: "",
  displayOrder: "0",
  highlights: "",
};

function BlogEditorDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: BlogRecord | null;
  onSubmit: (payload: FormData) => Promise<void>;
}) {
  const [form, setForm] = useState<BlogFormState>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const objectUrl = useObjectUrl(file);

  useEffect(() => {
    if (open) {
      setForm(
        item
          ? {
              title: item.title || "",
              slug: item.slug || "",
              shortDescription: item.shortDescription || "",
              fullContent: item.fullContent || "",
              author: item.author || "",
              category: item.category || "",
              publishDate: item.publishDate || new Date().toISOString().slice(0, 10),
              status: item.status,
              metaTitle: item.metaTitle || "",
              metaDescription: item.metaDescription || "",
              readTime: item.readTime || "",
              imageAlt: item.imageAlt || "",
              displayOrder: String(item.displayOrder ?? 0),
              highlights: (item.highlights || []).join("\n"),
            }
          : EMPTY_FORM,
      );
      setFile(null);
      setSlugTouched(Boolean(item?.slug));
    }
  }, [open, item]);

  const previewSrc = objectUrl || resolveAdminMediaUrl(item?.featuredImage);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !form.title ||
      !form.slug ||
      !form.shortDescription ||
      !form.fullContent ||
      !form.author ||
      !form.category ||
      !form.publishDate
    ) {
      toast.error("Please fill in the required blog fields.");
      return;
    }
    if (!item && !file) {
      toast.error("Featured image is required.");
      return;
    }

    const payload = new FormData();
    payload.set("title", form.title);
    payload.set("slug", form.slug);
    payload.set("shortDescription", form.shortDescription);
    payload.set("fullContent", form.fullContent);
    payload.set("author", form.author);
    payload.set("category", form.category);
    payload.set("publishDate", form.publishDate);
    payload.set("status", form.status);
    payload.set("metaTitle", form.metaTitle || form.title);
    payload.set("metaDescription", form.metaDescription || form.shortDescription);
    payload.set("readTime", form.readTime);
    payload.set("imageAlt", form.imageAlt || form.title);
    payload.set("displayOrder", form.displayOrder);
    payload.set("highlights", form.highlights);

    if (file) {
      payload.set("featuredImage", file);
    } else if (item?.featuredImage) {
      payload.set("existingFeaturedImage", item.featuredImage);
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Blog" : "Add Blog"}</DialogTitle>
          <DialogDescription>Maintain blog posts and their SEO metadata.</DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input
                id="blog-title"
                value={form.title}
                onChange={(event) => {
                  const title = event.target.value;
                  setForm((prev) => ({
                    ...prev,
                    title,
                    slug: slugTouched ? prev.slug : slugify(title),
                    metaTitle: prev.metaTitle || title,
                    imageAlt: prev.imageAlt || title,
                  }));
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-slug">Slug</Label>
              <Input
                id="blog-slug"
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setForm((prev) => ({ ...prev, slug: event.target.value }));
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-category">Category</Label>
              <Input
                id="blog-category"
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="blog-short">Short Description</Label>
              <Textarea
                id="blog-short"
                rows={3}
                value={form.shortDescription}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, shortDescription: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="blog-content">Full Content</Label>
              <Textarea
                id="blog-content"
                rows={8}
                value={form.fullContent}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, fullContent: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-author">Author</Label>
              <Input
                id="blog-author"
                value={form.author}
                onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-date">Publish Date</Label>
              <Input
                id="blog-date"
                type="date"
                value={form.publishDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, publishDate: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-readtime">Read Time</Label>
              <Input
                id="blog-readtime"
                value={form.readTime}
                onChange={(event) => setForm((prev) => ({ ...prev, readTime: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-order">Display Order</Label>
              <Input
                id="blog-order"
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
                  setForm((prev) => ({ ...prev, status: value as BlogFormState["status"] }))
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
            <div className="space-y-2">
              <Label htmlFor="blog-meta-title">Meta Title</Label>
              <Input
                id="blog-meta-title"
                value={form.metaTitle}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, metaTitle: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-image-alt">Image Alt</Label>
              <Input
                id="blog-image-alt"
                value={form.imageAlt}
                onChange={(event) => setForm((prev) => ({ ...prev, imageAlt: event.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="blog-meta-description">Meta Description</Label>
              <Textarea
                id="blog-meta-description"
                rows={3}
                value={form.metaDescription}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, metaDescription: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="blog-highlights">Highlights</Label>
              <Textarea
                id="blog-highlights"
                rows={4}
                value={form.highlights}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, highlights: event.target.value }))
                }
                placeholder="One highlight per line"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="blog-image">Featured Image</Label>
              <Input
                id="blog-image"
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
              {previewSrc && (
                <img
                  src={previewSrc}
                  alt="Blog preview"
                  className="mt-3 h-56 w-full rounded-2xl object-cover"
                />
              )}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Blog"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminBlogPage() {
  const [items, setItems] = useState<BlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogRecord | null>(null);
  const [deletingItem, setDeletingItem] = useState<BlogRecord | null>(null);

  async function loadItems() {
    setLoading(true);
    try {
      setItems(await loadBlogs());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load blogs");
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
      const searchable = [item.title, item.slug, item.shortDescription, item.category, item.author]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return (!term || searchable) && matchesStatus;
    });
  }, [items, search, statusFilter]);

  async function saveBlog(payload: FormData) {
    const response = editingItem
      ? await adminFetchFormData<BlogRecord>(`/api/admin/blogs/${editingItem.id}`, payload, "PUT")
      : await adminFetchFormData<BlogRecord>("/api/admin/blogs", payload, "POST");
    toast.success(editingItem ? "Blog updated" : "Blog added");
    setItems((current) => {
      const next = editingItem
        ? current.map((item) => (item.id === response.id ? response : item))
        : [response, ...current];
      return next.sort(
        (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
      );
    });
  }

  async function quickToggle(item: BlogRecord, nextStatus: "active" | "inactive") {
    try {
      const payload = new FormData();
      payload.set("title", item.title);
      payload.set("slug", item.slug);
      payload.set("shortDescription", item.shortDescription);
      payload.set("fullContent", item.fullContent);
      payload.set("author", item.author);
      payload.set("category", item.category);
      payload.set("publishDate", item.publishDate);
      payload.set("status", nextStatus);
      payload.set("metaTitle", item.metaTitle);
      payload.set("metaDescription", item.metaDescription);
      payload.set("readTime", item.readTime);
      payload.set("imageAlt", item.imageAlt);
      payload.set("displayOrder", String(item.displayOrder));
      payload.set("highlights", item.highlights.join("\n"));
      if (item.featuredImage) {
        payload.set("existingFeaturedImage", item.featuredImage);
      }
      const response = await adminFetchFormData<BlogRecord>(
        `/api/admin/blogs/${item.id}`,
        payload,
        "PUT",
      );
      setItems((current) => current.map((row) => (row.id === response.id ? response : row)));
      toast.success(`Blog ${nextStatus === "active" ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update blog");
    }
  }

  async function handleDelete() {
    if (!deletingItem) return;
    try {
      await deleteRecord(`/api/admin/blogs/${deletingItem.id}`);
      setItems((current) => current.filter((row) => row.id !== deletingItem.id));
      toast.success("Blog deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete blog");
    } finally {
      setDeletingItem(null);
    }
  }

  return (
    <AdminLayout title="Blogs" subtitle="Manage articles, SEO data and blog details">
      <div className="space-y-6">
        <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-slate-950/20">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Blog Management</CardTitle>
              <p className="mt-1 text-sm text-slate-400">
                Publish and update blog posts dynamically by slug.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search blogs..."
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
                Add Blog
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
                No blogs found.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-slate-300">Title</TableHead>
                      <TableHead className="text-slate-300">Slug</TableHead>
                      <TableHead className="text-slate-300">Category</TableHead>
                      <TableHead className="text-slate-300">Publish Date</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-right text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={resolveAdminMediaUrl(item.featuredImage)}
                              alt={item.title}
                              className="h-12 w-12 rounded-xl object-cover"
                            />
                            <div>
                              <p className="font-semibold text-white">{item.title}</p>
                              <p className="text-xs text-slate-400">{item.shortDescription}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-white/10 text-white">{item.slug}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-white/10 text-white">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{item.publishDate}</TableCell>
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

        <BlogEditorDialog
          open={editorOpen}
          onOpenChange={setEditorOpen}
          item={editingItem}
          onSubmit={saveBlog}
        />

        <AlertDialog
          open={Boolean(deletingItem)}
          onOpenChange={(open) => !open && setDeletingItem(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
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
