"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/blogs/BlogForm";
import { api, ApiError } from "@/utils/api";

export default function EditBlogPage() {
  const params = useParams();
  const id = params?.id;

  const [blogData, setBlogData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchEditData() {
      setLoading(true);
      setNotFoundState(false);
      try {
        const [blogRes, categoriesRes, tagsRes] = await Promise.all([
          api.get(`/api/admin/blogs/${id}`),
          api.get("/api/admin/blog-categories?limit=100&status=active"),
          api.get("/api/admin/blog-tags?limit=200"),
        ]);

        setBlogData(blogRes?.data || null);
        setCategories(categoriesRes?.data?.items || []);
        setTags(tagsRes?.data?.items || []);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFoundState(true);
        } else {
          console.error("Failed to fetch blog for editing:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchEditData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm font-semibold text-gray-500">
        Loading blog data for editing...
      </div>
    );
  }

  if (notFoundState || !blogData) {
    return (
      <div className="p-6 text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm font-semibold text-red-500">
        Blog post not found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <BlogForm
        mode="edit"
        initialData={blogData}
        categories={categories}
        availableTags={tags}
      />
    </div>
  );
}
