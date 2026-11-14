"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Search, Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import AdminPagination from "@/components/blogs/AdminPagination";
import { api } from "@/utils/api";
import { toast } from "sonner";

function TagsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tags, setTags] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Form states for Create
  const [newTagName, setNewTagName] = useState("");
  const [creating, setCreating] = useState(false);

  // Inline edit states
  const [editTagId, setEditTagId] = useState(null);
  const [editTagName, setEditTagName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // AlertDialog states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetTag, setTargetTag] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";

  const paramsObj = {
    ...(page ? { page } : {}),
    ...(search ? { search } : {}),
  };

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit: "15",
        ...(search ? { search } : {}),
        sortBy: "blogsCount",
        sortOrder: "desc",
      });

      const res = await api.get(`/api/admin/blog-tags?${query.toString()}`);
      setTags(res?.data?.items || res?.data?.docs || []);
      setTotalPages(res?.data?.totalPages || 1);
      setCurrentPage(res?.data?.currentPage || 1);
    } catch (err) {
      console.error("Failed to fetch blog tags:", err);
      toast.error("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [page, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }
    router.push(`/blogs/tags?${params.toString()}`);
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    const name = newTagName.trim();
    if (!name) return;

    setCreating(true);
    try {
      await api.post("/api/admin/blog-tags", { name });
      toast.success("Tag created successfully");
      setNewTagName("");
      fetchTags();
    } catch (err) {
      toast.error(err?.message || "Failed to create tag");
    } finally {
      setCreating(false);
    }
  };

  const startInlineEdit = (tag) => {
    setEditTagId(tag._id);
    setEditTagName(tag.name);
  };

  const cancelInlineEdit = () => {
    setEditTagId(null);
    setEditTagName("");
  };

  const saveInlineEdit = async (id) => {
    const name = editTagName.trim();
    if (!name) return;

    setSavingEdit(true);
    try {
      await api.patch(`/api/admin/blog-tags/${id}`, { name });
      toast.success("Tag renamed successfully");
      setEditTagId(null);
      setEditTagName("");
      fetchTags();
    } catch (err) {
      toast.error(err?.message || "Failed to update tag");
    } finally {
      setSavingEdit(false);
    }
  };

  const triggerDelete = (tag) => {
    setTargetTag(tag);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!targetTag) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/blog-tags/${targetTag._id}`);
      toast.success("Tag deleted successfully");
      fetchTags();
    } catch (err) {
      toast.error(err?.message || "Failed to delete tag");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setTargetTag(null);
    }
  };

  return (
    <>
      {/* Create & Search forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Inline Create Form */}
        <form
          onSubmit={handleCreateTag}
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3"
        >
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Add a new tag name..."
            required
            className="flex-1"
            disabled={creating}
          />
          <Button
            type="submit"
            disabled={creating || !newTagName.trim()}
            className="bg-[#6b7c4d] hover:bg-[#586540]"
          >
            {creating ? (
              <Loader2 size={16} className="animate-spin mr-1" />
            ) : (
              <Plus size={16} className="mr-1" />
            )}
            Add
          </Button>
        </form>

        {/* Search Filter */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tags..."
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>

      {/* Listing Table */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm font-semibold text-gray-500">
          Loading tags...
        </div>
      ) : tags.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-xl py-16 text-center bg-white">
          <p className="text-gray-500">No tags found matching these filters.</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Tag Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Blogs Count</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-28 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => {
                  const isEditing = editTagId === tag._id;
                  return (
                    <TableRow key={tag._id} className="hover:bg-gray-50/60 h-16">
                      <TableCell className="font-semibold text-gray-900">
                        {isEditing ? (
                          <Input
                            value={editTagName}
                            onChange={(e) => setEditTagName(e.target.value)}
                            className="h-9 w-60 max-w-full"
                            disabled={savingEdit}
                            autoFocus
                          />
                        ) : (
                          tag.name
                        )}
                      </TableCell>

                      <TableCell className="text-sm text-gray-500">
                        /{tag.slug}
                      </TableCell>

                      <TableCell className="text-center text-sm font-semibold text-gray-700">
                        {tag.blogsCount ?? 0}
                      </TableCell>

                      <TableCell className="text-sm text-gray-500">
                        {new Date(tag.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isEditing ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => saveInlineEdit(tag._id)}
                                disabled={savingEdit || !editTagName.trim()}
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                {savingEdit ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Check size={15} />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={cancelInlineEdit}
                                disabled={savingEdit}
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <X size={15} />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startInlineEdit(tag)}
                                className="h-8 w-8 text-gray-500 hover:text-gray-900"
                              >
                                <Pencil size={15} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => triggerDelete(tag)}
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={15} />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchParamsObj={paramsObj}
            basePath="/blogs/tags"
          />
        </>
      )}

      {/* Delete Tag AlertDialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete tag?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{targetTag?.name}&quot; will be permanently deleted. This tag cannot be deleted if it is currently linked to any active blogs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function TagsPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#6b7c4d] mb-1"
          >
            <ArrowLeft size={14} /> Back to Blogs
          </Link>
          <h1 className="text-2xl font-semibold text-[#233020]">Blog Tags</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage tags associated with blog content — quickly modify names, track uses, and clean up tag collections.
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm font-semibold text-gray-500">
            Loading...
          </div>
        }
      >
        <TagsContent />
      </Suspense>
    </div>
  );
}
