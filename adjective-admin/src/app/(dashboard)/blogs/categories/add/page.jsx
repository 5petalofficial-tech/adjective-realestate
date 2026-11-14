"use client";

import React from "react";
import CategoryForm from "@/components/blogs/CategoryForm";

export default function AddCategoryPage() {
  return (
    <div className="p-6">
      <CategoryForm mode="create" />
    </div>
  );
}
