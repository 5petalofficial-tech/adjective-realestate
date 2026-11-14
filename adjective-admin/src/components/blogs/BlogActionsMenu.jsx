// src/components/blogs/BlogActionsMenu.jsx
// Client Component — handles all row-level admin actions.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Copy,
  ExternalLink,
  CheckCircle2,
  Archive,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { api } from "@/utils/api";
import { toast } from "sonner"; // shadcn's recommended toast lib — swap if your project uses a different one

const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const BlogActionsMenu = ({ blog }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const runAction = async (action, successMessage) => {
    try {
      await action();
      toast.success(successMessage);
      startTransition(() => router.refresh());
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const handlePublish = () =>
    runAction(
      () => api.patch(`/api/admin/blogs/${blog._id}/status`, { status: "published" }),
      "Blog published"
    );

  const handleArchive = () =>
    runAction(
      () => api.patch(`/api/admin/blogs/${blog._id}/status`, { status: "archived" }),
      "Blog archived"
    );

  const handleToggleFeature = () =>
    runAction(
      () =>
        api.patch(`/api/admin/blogs/${blog._id}/feature`, { value: !blog.isFeatured }),
      blog.isFeatured ? "Removed from Featured" : "Marked as Featured"
    );

  const handleDuplicate = () =>
    runAction(
      () => api.post(`/api/admin/blogs/${blog._id}/duplicate`),
      "Blog duplicated as draft"
    );

  const handleDelete = () =>
    runAction(() => api.delete(`/api/admin/blogs/${blog._id}`), "Blog deleted");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending}>
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/blogs/${blog._id}/edit`} className="flex items-center gap-2">
              <Pencil size={14} /> Edit
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a
              href={`${PUBLIC_SITE_URL}/blog/${blog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Eye size={14} /> View Live
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a
              href={`${PUBLIC_SITE_URL}/blog/${blog.slug}?preview=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink size={14} /> Preview
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDuplicate} className="flex items-center gap-2">
            <Copy size={14} /> Duplicate
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {blog.status !== "published" && (
            <DropdownMenuItem onClick={handlePublish} className="flex items-center gap-2">
              <CheckCircle2 size={14} /> Publish
            </DropdownMenuItem>
          )}

          {blog.status !== "archived" && (
            <DropdownMenuItem onClick={handleArchive} className="flex items-center gap-2">
              <Archive size={14} /> Archive
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={handleToggleFeature} className="flex items-center gap-2">
            <Star size={14} />
            {blog.isFeatured ? "Unfeature" : "Mark as Featured"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-2 text-red-600 focus:text-red-600"
          >
            <Trash2 size={14} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{blog.title}&quot; will be moved to trash. This can be restored later from
              the deleted items view, it won&apos;t be permanently lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BlogActionsMenu;
