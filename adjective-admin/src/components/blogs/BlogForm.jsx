// src/components/blogs/BlogForm.jsx
// Client Component. Shared by both /blogs/add and /blogs/[id]/edit —
// `mode` + `initialData` control the difference. Submits multipart/form-data
// so featuredImage/gallery files travel in the same request as the JSON
// payload (backend controller separates them: req.file(s) vs req.body.payload).

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ContentBlockEditor from "./ContentBlockEditor";
import TagsInput from "./TagsInput";
import { FeaturedImageField, GalleryField } from "./ImageUploadField";
import { api, ApiError } from "@/utils/api";
import { toast } from "sonner";

const emptyForm = {
  title: "",
  excerpt: "",
  content: [{ type: "paragraph", data: { text: "" } }],
  category: "",
  tags: [],
  status: "draft",
  publishDate: "",
  isFeatured: false,
  isTrending: false,
  seo: { seoTitle: "", seoDescription: "", seoKeywords: "", canonicalURL: "" },
  featuredImageFile: null,
  existingFeaturedImage: null,
  galleryFiles: [],
  existingGallery: [],
};

/**
 * @param {"create"|"edit"} mode
 * @param {object|null} initialData - existing blog (edit mode)
 * @param {Array} categories - for the category <Select>
 * @param {Array} availableTags - for the TagsInput combobox
 */
const BlogForm = ({ mode, initialData, categories, availableTags }) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState(() =>
    initialData
      ? {
          ...emptyForm,
          title: initialData.title,
          excerpt: initialData.excerpt,
          content: initialData.content,
          category: initialData.category?._id || "",
          tags: (initialData.tags || []).map((t) => {
            if (typeof t === "string") {
              const found = (availableTags || []).find((at) => at._id === t);
              return found ? found : { _id: t, name: t };
            }
            return t;
          }),
          status: initialData.status,
          publishDate: initialData.publishDate
            ? new Date(initialData.publishDate).toISOString().slice(0, 16)
            : "",
          isFeatured: initialData.isFeatured,
          isTrending: initialData.isTrending,
          seo: {
            seoTitle: initialData.seo?.seoTitle || "",
            seoDescription: initialData.seo?.seoDescription || "",
            seoKeywords: (initialData.seo?.seoKeywords || []).join(", "),
            canonicalURL: initialData.seo?.canonicalURL || "",
          },
          existingFeaturedImage: initialData.featuredImage || null,
          existingGallery: initialData.gallery || [],
        }
      : emptyForm
  );

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateSeoField = (key, value) =>
    setForm((f) => ({ ...f, seo: { ...f.seo, [key]: value } }));

  const buildFormData = (statusOverride) => {
    const sanitizedContent = (form.content || []).map((block) => {
      if (block.type === "list" && Array.isArray(block.data?.items)) {
        return {
          ...block,
          data: {
            ...block.data,
            items: block.data.items.map((item) => String(item).trim()).filter(Boolean),
          },
        };
      }
      return block;
    });

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: sanitizedContent,
      category: form.category,
      tags: form.tags
        .map((t) => (typeof t === "string" ? t : t?._id || String(t)))
        .filter(Boolean),
      status: statusOverride || form.status,
      isFeatured: form.isFeatured,
      isTrending: form.isTrending,
      seo: {
        seoTitle: form.seo.seoTitle,
        seoDescription: form.seo.seoDescription,
        seoKeywords: form.seo.seoKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        canonicalURL: form.seo.canonicalURL,
      },
    };

    if ((statusOverride || form.status) === "scheduled" && form.publishDate) {
      payload.publishDate = new Date(form.publishDate).toISOString();
    }

    const fd = new FormData();
    fd.append("payload", JSON.stringify(payload));
    if (form.featuredImageFile) fd.append("featuredImage", form.featuredImageFile);
    form.galleryFiles.forEach((file) => fd.append("gallery", file));

    return fd;
  };

  const submitForm = async (statusOverride) => {
    setFieldErrors({});
    setSubmitting(true);

    try {
      const fd = buildFormData(statusOverride);

      if (mode === "create") {
        const res = await api.post("/api/admin/blogs", fd, { isFormData: true });
        toast.success("Blog created");
        router.push(`/blogs/${res.data._id}/edit`);
      } else {
        await api.patch(`/api/admin/blogs/${initialData._id}`, fd, { isFormData: true });
        toast.success("Blog updated");
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
        href="/blogs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#6b7c4d] mb-4"
      >
        <ArrowLeft size={14} /> Back to Blogs
      </Link>

      <h1 className="text-2xl font-semibold text-[#233020] mb-6">
        {mode === "create" ? "Add New Blog" : "Edit Blog"}
      </h1>

      <div className="space-y-8">
        {/* Basic Info */}
        <Section title="Basic Information">
          <Field label="Title" error={fieldErrors.title}>
            <Input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. 5 Things First-Time Buyers Get Wrong"
              required
            />
          </Field>

          <Field label="Excerpt" error={fieldErrors.excerpt}>
            <Textarea
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              placeholder="A one-sentence summary shown on the blog listing card"
              rows={2}
              maxLength={300}
              required
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category" error={fieldErrors.category}>
              <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Tags">
              <TagsInput
                availableTags={availableTags}
                value={form.tags}
                onChange={(tags) => updateField("tags", tags)}
              />
            </Field>
          </div>
        </Section>

        {/* Media */}
        <Section title="Media">
          <Field label="Featured Image" error={fieldErrors.featuredImage}>
            <FeaturedImageField
              file={form.featuredImageFile}
              existingUrl={form.existingFeaturedImage?.url}
              onChange={(file) => updateField("featuredImageFile", file)}
            />
          </Field>

          <Field label="Gallery (optional)">
            <GalleryField
              files={form.galleryFiles}
              existingImages={form.existingGallery}
              onFilesChange={(files) => updateField("galleryFiles", files)}
              onRemoveExisting={(index) =>
                updateField(
                  "existingGallery",
                  form.existingGallery.filter((_, i) => i !== index)
                )
              }
            />
          </Field>
        </Section>

        {/* Content */}
        <Section title="Content">
          <ContentBlockEditor
            blocks={form.content}
            onChange={(blocks) => updateField("content", blocks)}
          />
        </Section>

        {/* Publishing */}
        <Section title="Publishing">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {form.status === "scheduled" && (
              <Field label="Publish Date" error={fieldErrors.publishDate}>
                <Input
                  type="datetime-local"
                  value={form.publishDate}
                  onChange={(e) => updateField("publishDate", e.target.value)}
                  required
                />
              </Field>
            )}
          </div>

          <div className="flex items-center gap-8 pt-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isFeatured}
                onCheckedChange={(v) => updateField("isFeatured", v)}
              />
              <Label>Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isTrending}
                onCheckedChange={(v) => updateField("isTrending", v)}
              />
              <Label>Trending</Label>
            </div>
          </div>
        </Section>

        {/* SEO */}
        <Section title="SEO">
          <Field label="SEO Title" hint="Falls back to blog title if left blank">
            <Input
              value={form.seo.seoTitle}
              onChange={(e) => updateSeoField("seoTitle", e.target.value)}
              maxLength={70}
            />
          </Field>
          <Field label="Meta Description" hint="Falls back to excerpt if left blank">
            <Textarea
              value={form.seo.seoDescription}
              onChange={(e) => updateSeoField("seoDescription", e.target.value)}
              rows={2}
              maxLength={160}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Keywords" hint="Comma-separated">
              <Input
                value={form.seo.seoKeywords}
                onChange={(e) => updateSeoField("seoKeywords", e.target.value)}
                placeholder="real estate, kolkata, buying guide"
              />
            </Field>
            <Field label="Canonical URL">
              <Input
                value={form.seo.canonicalURL}
                onChange={(e) => updateSeoField("canonicalURL", e.target.value)}
                placeholder="https://..."
              />
            </Field>
          </div>
        </Section>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-8 sticky bottom-0 bg-[#fbfaf6] py-4 border-t border-gray-200">
        <Button type="button" variant="outline" disabled={submitting} onClick={() => submitForm("draft")}>
          Save as Draft
        </Button>
        <Button
          type="button"
          disabled={submitting}
          className="bg-[#6b7c4d] hover:bg-[#586540]"
          onClick={() => submitForm("published")}
        >
          {submitting && <Loader2 size={16} className="mr-2 animate-spin" />}
          {mode === "create" ? "Publish" : "Update"}
        </Button>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">{title}</h2>
    <div className="space-y-4 bg-white border border-gray-200 rounded-xl p-5">{children}</div>
  </div>
);

const Field = ({ label, hint, error, children }) => (
  <div>
    <div className="flex items-baseline justify-between mb-1.5">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {hint && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
    {children}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default BlogForm;
