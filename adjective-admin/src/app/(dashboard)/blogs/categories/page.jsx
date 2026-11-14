"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, ArrowLeft, Image as ImageIcon, Pencil, Trash2, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import AdminPagination from "@/components/blogs/AdminPagination";
import { api } from "@/utils/api";
import { toast } from "sonner";
import Image from "next/image";

function CategoriesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // AlertDialog states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const paramsObj = {
    ...(page ? { page } : {}),
    ...(search ? { search } : {}),
    ...(status ? { status } : {}),
  };

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit: "15",
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        sortBy: "sortOrder",
        sortOrder: "asc",
      });

      const res = await api.get(`/api/admin/blog-categories?${query.toString()}`);
      setCategories(res?.data?.items || res?.data?.docs || []);
      setTotalPages(res?.data?.totalPages || 1);
      setCurrentPage(res?.data?.currentPage || 1);
    } catch (err) {
      console.error("Failed to fetch blog categories:", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, search, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }
    router.push(`/blogs/categories?${params.toString()}`);
  };

  const handleStatusChange = (val) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (val && val !== "all") {
      params.set("status", val);
    } else {
      params.delete("status");
    }
    router.push(`/blogs/categories?${params.toString()}`);
  };

  const triggerDelete = (category) => {
    setTargetCategory(category);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!targetCategory) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/blog-categories/${targetCategory._id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      toast.error(err?.message || "Failed to delete category");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setTargetCategory(null);
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.patch(`/api/admin/blog-categories/${id}/restore`);
      toast.success("Category restored successfully");
      fetchCategories();
    } catch (err) {
      toast.error(err?.message || "Failed to restore category");
    }
  };

  return (
    <>
      {/* Filters bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search categories..."
            className="pl-9"
          />
        </form>

        <div className="flex items-center gap-3">
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listing Table */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm font-semibold text-gray-500">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-xl py-16 text-center bg-white">
          <p className="text-gray-500">No categories found matching these filters.</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Sort Order</TableHead>
                  <TableHead className="text-center">Blogs Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-24 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat._id} className="hover:bg-gray-50/60">
                    <TableCell>
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
                        {cat.image?.url ? (
                          <Image
                            src={cat.image.url}
                            alt={cat.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ImageIcon size={18} className="text-gray-400" />
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-semibold text-gray-900 max-w-[200px] truncate">
                      <Link href={`/blogs/categories/${cat._id}/edit`} className="hover:text-[#6b7c4d]">
                        {cat.name}
                      </Link>
                      <div className="text-xs text-gray-400 font-normal">/{cat.slug}</div>
                    </TableCell>

                    <TableCell className="max-w-xs truncate text-gray-500 text-sm">
                      {cat.description || "—"}
                    </TableCell>

                    <TableCell className="text-center text-sm font-medium text-gray-700">
                      {cat.sortOrder}
                    </TableCell>

                    <TableCell className="text-center text-sm font-semibold text-gray-700">
                      {cat.blogsCount ?? 0}
                    </TableCell>

                    <TableCell>
                      {cat.isDeleted ? (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                          Deleted
                        </Badge>
                      ) : cat.status === "active" ? (
                        <Badge variant="outline" className="bg-[#e6ede0] text-[#4a6b32] border-[#c3d6b3]">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-sm text-gray-500">
                      {new Date(cat.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {cat.isDeleted ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Restore"
                            onClick={() => handleRestore(cat._id)}
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <RotateCcw size={15} />
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-8 w-8 text-gray-500 hover:text-gray-900"
                            >
                              <Link href={`/blogs/categories/${cat._id}/edit`}>
                                <Pencil size={15} />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => triggerDelete(cat)}
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchParamsObj={paramsObj}
            basePath="/blogs/categories"
          />
        </>
      )}

      {/* Delete Category AlertDialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{targetCategory?.name}&quot; will be deleted. This category cannot be deleted if it is currently assigned to any active blogs.
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

export default function CategoriesPage() {
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
          <h1 className="text-2xl font-semibold text-[#233020]">Blog Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Organise blog posts into content verticals and manage SEO settings for each category.
          </p>
        </div>

        <div>
          <Button asChild className="bg-[#6b7c4d] hover:bg-[#586540]">
            <Link href="/blogs/categories/add" className="flex items-center gap-2">
              <Plus size={16} /> Add Category
            </Link>
          </Button>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm font-semibold text-gray-500">
            Loading...
          </div>
        }
      >
        <CategoriesContent />
      </Suspense>
    </div>
  );
}
