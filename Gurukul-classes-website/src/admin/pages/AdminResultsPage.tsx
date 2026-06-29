import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../components/AdminLayout";
import { adminFetchFormData, deleteRecord, loadResults, resolveAdminMediaUrl } from "../api";
import type { ResultRecord } from "../types";
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

interface ResultFormState {
  studentName: string;
  examType: string;
  examLabel: string;
  resultValue: string;
  year: string;
  description: string;
  displayOrder: string;
  status: "active" | "inactive";
}

const EMPTY_FORM: ResultFormState = {
  studentName: "",
  examType: "NEET",
  examLabel: "",
  resultValue: "",
  year: new Date().getFullYear().toString(),
  description: "",
  displayOrder: "0",
  status: "active",
};

function ResultEditorDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ResultRecord | null;
  onSubmit: (payload: FormData) => Promise<void>;
}) {
  const [form, setForm] = useState<ResultFormState>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const objectUrl = useObjectUrl(file);

  useEffect(() => {
    if (open) {
      setForm(
        item
          ? {
              studentName: item.studentName || "",
              examType: item.examType || "NEET",
              examLabel: item.examLabel || "",
              resultValue: item.resultValue || "",
              year: String(item.year || new Date().getFullYear()),
              description: item.description || "",
              displayOrder: String(item.displayOrder ?? 0),
              status: item.status,
            }
          : EMPTY_FORM,
      );
      setFile(null);
    }
  }, [open, item]);

  const previewSrc = objectUrl || resolveAdminMediaUrl(item?.studentPhoto);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.studentName || !form.examLabel || !form.resultValue || !form.year) {
      toast.error("Please fill in the required result fields.");
      return;
    }
    if (!item && !file) {
      toast.error("Student photo is required.");
      return;
    }

    const payload = new FormData();
    payload.set("studentName", form.studentName);
    payload.set("examType", form.examType);
    payload.set("examLabel", form.examLabel);
    payload.set("resultValue", form.resultValue);
    payload.set("year", form.year);
    payload.set("description", form.description);
    payload.set("displayOrder", form.displayOrder);
    payload.set("status", form.status);
    if (file) {
      payload.set("studentPhoto", file);
    } else if (item?.studentPhoto) {
      payload.set("existingStudentPhoto", item.studentPhoto);
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
          <DialogTitle>{item ? "Edit Result" : "Add Result"}</DialogTitle>
          <DialogDescription>
            Create and update student result cards for the public results page.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="result-student">Student Name</Label>
              <Input
                id="result-student"
                value={form.studentName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, studentName: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="result-type">Exam Type</Label>
              <Select
                value={form.examType}
                onValueChange={(value) => setForm((prev) => ({ ...prev, examType: value }))}
              >
                <SelectTrigger id="result-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["IIT-JEE", "NEET", "MH-CET", "Board", "Other"].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="result-label">Exam Label</Label>
              <Input
                id="result-label"
                value={form.examLabel}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, examLabel: event.target.value }))
                }
                placeholder="NEET 2024"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="result-value">Marks / Rank / Percentile</Label>
              <Input
                id="result-value"
                value={form.resultValue}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, resultValue: event.target.value }))
                }
                placeholder="682 / 720"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="result-year">Year</Label>
              <Input
                id="result-year"
                type="number"
                value={form.year}
                onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="result-order">Display Order</Label>
              <Input
                id="result-order"
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
                  setForm((prev) => ({ ...prev, status: value as ResultFormState["status"] }))
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
              <Label htmlFor="result-description">Description</Label>
              <Textarea
                id="result-description"
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="Admission / college / extra result note"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="result-photo">Student Photo</Label>
              <Input
                id="result-photo"
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
              {previewSrc && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                  <img src={previewSrc} alt="Result preview" className="h-48 w-48 object-cover" />
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Result"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminResultsPage() {
  const [items, setItems] = useState<ResultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResultRecord | null>(null);
  const [deletingItem, setDeletingItem] = useState<ResultRecord | null>(null);

  async function loadItems() {
    setLoading(true);
    try {
      setItems(await loadResults());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load results");
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
      const searchable = [
        item.studentName,
        item.examType,
        item.examLabel,
        item.resultValue,
        item.description,
        String(item.year),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return (!term || searchable) && matchesStatus;
    });
  }, [items, search, statusFilter]);

  async function saveResult(payload: FormData) {
    const response = editingItem
      ? await adminFetchFormData<ResultRecord>(
          `/api/admin/results/${editingItem.id}`,
          payload,
          "PUT",
        )
      : await adminFetchFormData<ResultRecord>("/api/admin/results", payload, "POST");
    toast.success(editingItem ? "Result updated" : "Result added");
    setItems((current) => {
      const next = editingItem
        ? current.map((item) => (item.id === response.id ? response : item))
        : [response, ...current];
      return next.sort((a, b) => a.displayOrder - b.displayOrder);
    });
  }

  async function quickToggle(item: ResultRecord, nextStatus: "active" | "inactive") {
    try {
      const payload = new FormData();
      payload.set("studentName", item.studentName);
      payload.set("examType", item.examType);
      payload.set("examLabel", item.examLabel);
      payload.set("resultValue", item.resultValue);
      payload.set("year", String(item.year));
      payload.set("description", item.description || "");
      payload.set("displayOrder", String(item.displayOrder));
      payload.set("status", nextStatus);
      payload.set("existingStudentPhoto", item.studentPhoto || "");
      const response = await adminFetchFormData<ResultRecord>(
        `/api/admin/results/${item.id}`,
        payload,
        "PUT",
      );
      setItems((current) => current.map((row) => (row.id === response.id ? response : row)));
      toast.success(`Result ${nextStatus === "active" ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update result");
    }
  }

  async function handleDelete() {
    if (!deletingItem) return;
    try {
      await deleteRecord(`/api/admin/results/${deletingItem.id}`);
      setItems((current) => current.filter((row) => row.id !== deletingItem.id));
      toast.success("Result deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete result");
    } finally {
      setDeletingItem(null);
    }
  }

  return (
    <AdminLayout title="Results" subtitle="Manage topper cards on the results page">
      <div className="space-y-6">
        <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-slate-950/20">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Results Management</CardTitle>
              <p className="mt-1 text-sm text-slate-400">Add and update student result cards.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search results..."
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
                Add Result
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
                No results found.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-slate-300">Student</TableHead>
                      <TableHead className="text-slate-300">Exam</TableHead>
                      <TableHead className="text-slate-300">Result</TableHead>
                      <TableHead className="text-slate-300">Year</TableHead>
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
                              src={resolveAdminMediaUrl(item.studentPhoto)}
                              alt={item.studentName}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-white">{item.studentName}</p>
                              <p className="text-xs text-slate-400">{item.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-white">{item.examLabel}</p>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                              {item.examType}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-white">
                          {item.resultValue}
                        </TableCell>
                        <TableCell className="text-slate-300">{item.year}</TableCell>
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

        <ResultEditorDialog
          open={editorOpen}
          onOpenChange={setEditorOpen}
          item={editingItem}
          onSubmit={saveResult}
        />

        <AlertDialog
          open={Boolean(deletingItem)}
          onOpenChange={(open) => !open && setDeletingItem(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this result?</AlertDialogTitle>
              <AlertDialogDescription>{deletingItem?.studentName}</AlertDialogDescription>
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
