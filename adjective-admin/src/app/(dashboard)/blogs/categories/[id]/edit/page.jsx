"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CategoryForm from "@/components/blogs/CategoryForm";
import { api } from "@/utils/api";
import { toast } from "sonner";

export default function EditCategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await api.get(`/api/admin/blog-categories/${id}`);
        setCategory(res.data);
      } catch (err) {
        console.error("Failed to fetch category:", err);
        toast.error("Failed to load category data");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCategory();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm font-semibold text-gray-500">
        Loading category data...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6 text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm font-semibold text-gray-500">
        Category not found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <CategoryForm mode="edit" initialData={category} />
    </div>
  );
}
