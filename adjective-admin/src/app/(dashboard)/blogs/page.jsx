"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, FolderKanban, Tags as TagsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogTableFilters from "@/components/blogs/BlogTableFilters";
import BlogTable from "@/components/blogs/BlogTable";
import AdminPagination from "@/components/blogs/AdminPagination";
import { api } from "@/utils/api";

function BlogsContent() {
  const searchParams = useSearchParams();

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";

  const paramsObj = {
    ...(page ? { page } : {}),
    ...(search ? { search } : {}),
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: page,
          limit: "20",
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
          ...(category ? { category } : {}),
        });

        const [blogsRes, categoriesRes] = await Promise.all([
          api.get(`/api/admin/blogs?${query.toString()}`),
          api.get(`/api/admin/blog-categories?limit=100`),
        ]);

        setBlogs(blogsRes?.data?.items || []);
        setTotalPages(blogsRes?.data?.totalPages || 1);
        setCurrentPage(blogsRes?.data?.currentPage || 1);
        setCategories(categoriesRes?.data?.items || []);
      } catch (err) {
        console.error("Failed to fetch blogs data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, search, status, category]);

  return (
    <>
      {/* Filters */}
      <BlogTableFilters categories={categories} />

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm font-semibold text-gray-500">
          Loading blogs...
        </div>
      ) : (
        <>
          <BlogTable blogs={blogs} />
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchParamsObj={paramsObj}
          />
        </>
      )}
    </>
  );
}

export default function BlogsPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#233020]">Blogs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage every blog post — draft, publish, schedule, or archive.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/blogs/categories" className="flex items-center gap-2">
              <FolderKanban size={16} /> Categories
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/blogs/tags" className="flex items-center gap-2">
              <TagsIcon size={16} /> Tags
            </Link>
          </Button>
          <Button asChild className="bg-[#6b7c4d] hover:bg-[#586540]">
            <Link href="/blogs/add" className="flex items-center gap-2">
              <Plus size={16} /> Add Blog
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
        <BlogsContent />
      </Suspense>
    </div>
  );
}
