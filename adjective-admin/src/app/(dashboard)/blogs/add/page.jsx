"use client";

import React, { useState, useEffect } from "react";
import BlogForm from "@/components/blogs/BlogForm";
import { api } from "@/utils/api";

export default function AddBlogPage() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFormData() {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          api.get("/api/admin/blog-categories?limit=100&status=active"),
          api.get("/api/admin/blog-tags?limit=200"),
        ]);
        setCategories(categoriesRes?.data?.items || []);
        setTags(tagsRes?.data?.items || []);
      } catch (err) {
        console.error("Failed to fetch categories/tags for add blog:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFormData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm font-semibold text-gray-500">
        Loading form...
      </div>
    );
  }

  return (
    <div className="p-6">
      <BlogForm
        mode="create"
        categories={categories}
        availableTags={tags}
      />
    </div>
  );
}
