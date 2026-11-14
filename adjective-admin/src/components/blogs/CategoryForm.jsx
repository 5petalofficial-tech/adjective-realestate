"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeaturedImageField } from "./ImageUploadField";
import { api, ApiError } from "@/utils/api";
import { toast } from "sonner";

const emptyForm = {
  name: "",
  description: "",
  status: "active",
  sortOrder: 0,
  seo: { seoTitle: "", seoDescription: "", seoKeywords: "" },
  imageFile: null,
  existingImageUrl: null,
};

const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
    <h2 className="text-lg font-semibold text-[#233020] border-b border-gray-100 pb-2">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium text-gray-700">{label}</Label>
    {children}
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

export default function CategoryForm({ mode, initialData }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState(() =>
    initialData
      ? {
          ...emptyForm,
          name: initialData.name || "",
          description: initialData.description || "",
          status: initialData.status || "active",
          sortOrder: initialData.sortOrder ?? 0,
          seo: {
            seoTitle: initialData.seo?.seoTitle || "",
            seoDescription: initialData.seo?.seoDescription || "",
            seoKeywords: (initialData.seo?.seoKeywords || []).join(", "),
          },
          existingImageUrl: initialData.image?.url || null,
        }
      : emptyForm
  );

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateSeoField = (key, value) =>
    setForm((f) => ({ ...f, seo: { ...f.seo, [key]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        sortOrder: Number(form.sortOrder),
        seo: {
          seoTitle: form.seo.seoTitle.trim(),
          seoDescription: form.seo.seoDescription.trim(),
          seoKeywords: form.seo.seoKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        },
      };

      if (mode === "create") {
        // Step 1: Create category with JSON payload
        const res = await api.post("/api/admin/blog-categories", payload);
        const categoryId = res.data?._id;

        // Step 2: Upload image if selected
        if (form.imageFile && categoryId) {
          const fd = new FormData();
          fd.append("name", form.name.trim()); // to satisfy .min(1) on update schema
          fd.append("image", form.imageFile);
          await api.patch(`/api/admin/blog-categories/${categoryId}`, fd, { isFormData: true });
        }

        toast.success("Category created successfully");
        router.push("/blogs/categories");
      } else {
        const categoryId = initialData._id;

        // Step 1: Update text & SEO fields with JSON payload
        await api.patch(`/api/admin/blog-categories/${categoryId}`, payload);

        // Step 2: Update image if changed/selected
        if (form.imageFile) {
          const fd = new FormData();
          fd.append("name", form.name.trim()); // to satisfy .min(1) on update schema
          fd.append("image", form.imageFile);
          await api.patch(`/api/admin/blog-categories/${categoryId}`, fd, { isFormData: true });
        }

        toast.success("Category updated successfully");
        router.push("/blogs/categories");
        router.refresh();
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setFieldErrors(err.details?.errors || {});
        toast.error("Please fix the highlighted fields");
      } else {
        toast.error(err?.message || "Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <Link
        href="/blogs/categories"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#6b7c4d] mb-4"
      >
        <ArrowLeft size={14} /> Back to Categories
      </Link>

      <h1 className="text-2xl font-semibold text-[#233020] mb-6">
        {mode === "create" ? "Add New Category" : "Edit Category"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Basic Information">
          <Field label="Category Name" error={fieldErrors.name}>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Market Trends"
              required
            />
          </Field>

          <Field label="Description" error={fieldErrors.description}>
            <Textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Brief summary of this category"
              rows={3}
              maxLength={500}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Status" error={fieldErrors.status}>
              <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Sort Order" error={fieldErrors.sortOrder}>
              <Input
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={(e) => updateField("sortOrder", e.target.value)}
                placeholder="0"
              />
            </Field>
          </div>
        </Section>

        <Section title="Media">
          <Field label="Category Image" error={fieldErrors.image}>
            <FeaturedImageField
              file={form.imageFile}
              existingUrl={form.existingImageUrl}
              onChange={(file) => updateField("imageFile", file)}
            />
          </Field>
        </Section>

        <Section title="SEO Settings">
          <Field label="SEO Title" error={fieldErrors["seo.seoTitle"]}>
            <Input
              value={form.seo.seoTitle}
              onChange={(e) => updateSeoField("seoTitle", e.target.value)}
              placeholder="Meta title shown in search results"
            />
          </Field>

          <Field label="SEO Description" error={fieldErrors["seo.seoDescription"]}>
            <Textarea
              value={form.seo.seoDescription}
              onChange={(e) => updateSeoField("seoDescription", e.target.value)}
              placeholder="Meta description shown in search results"
              rows={2}
              maxLength={160}
            />
          </Field>

          <Field label="SEO Keywords" error={fieldErrors["seo.seoKeywords"]}>
            <Input
              value={form.seo.seoKeywords}
              onChange={(e) => updateSeoField("seoKeywords", e.target.value)}
              placeholder="e.g. real estate, buy home, investment (comma separated)"
            />
          </Field>
        </Section>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/blogs/categories")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#6b7c4d] hover:bg-[#586540]"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Category"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
