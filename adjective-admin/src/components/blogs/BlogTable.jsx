// src/components/blogs/BlogTable.jsx
// Server Component — pure render, no client state. All interactivity lives
// in BlogActionsMenu (row actions) and BlogTableFilters (search/filter).

import Image from "next/image";
import Link from "next/link";
import { Star, TrendingUp, Eye, Image as ImageIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "./StatusBadge";
import BlogActionsMenu from "./BlogActionsMenu";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const BlogTable = ({ blogs }) => {
  if (blogs.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 rounded-xl py-16 text-center">
        <p className="text-gray-500">No blogs match these filters.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog._id} className="hover:bg-gray-50/60">
              <TableCell>
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  {blog.featuredImage?.url ? (
                    <Image
                      src={blog.featuredImage.url}
                      alt={blog.title || "Blog thumbnail"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon size={18} className="text-gray-400" />
                  )}
                </div>
              </TableCell>

              <TableCell className="max-w-[280px]">
                <Link
                  href={`/blogs/${blog._id}/edit`}
                  className="font-medium text-[#233020] hover:text-[#6b7c4d] line-clamp-2"
                >
                  {blog.title}
                </Link>
              </TableCell>

              <TableCell>
                <span className="text-sm text-gray-600">{blog.category?.name || "—"}</span>
              </TableCell>

              <TableCell>
                <span className="text-sm text-gray-600">{blog.author?.name || "—"}</span>
              </TableCell>

              <TableCell>
                <StatusBadge status={blog.status} />
              </TableCell>

              <TableCell className="text-right">
                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                  <Eye size={13} className="text-gray-400" />
                  {blog.views?.toLocaleString() ?? 0}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5">
                  {blog.isFeatured && (
                    <span title="Featured">
                      <Star size={14} className="text-[#c9962f] fill-[#c9962f]" />
                    </span>
                  )}
                  {blog.isTrending && (
                    <span title="Trending">
                      <TrendingUp size={14} className="text-[#6b7c4d]" />
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <span className="text-sm text-gray-500">{formatDate(blog.createdAt)}</span>
              </TableCell>

              <TableCell>
                <BlogActionsMenu blog={blog} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogTable;
