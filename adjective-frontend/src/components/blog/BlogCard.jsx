// src/components/blog/BlogCard.jsx
// Server Component — no hooks/state used, so no "use client" needed.
// Reused on the blog grid and on the "Related Posts" rail of the detail page.

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MessageCircle, User } from "lucide-react";

const BlogCard = ({ blog }) => {
    const { title, slug, excerpt, coverImage, author, category, createdAt, comments } = blog;

    const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <article className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e7e4da] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            {/* Cover image */}
            <Link href={`/blog/${slug}`} className="block relative h-56 overflow-hidden">
                <Image
                    src={coverImage}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#6b7c4d] text-white text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full">
                    {category}
                </span>
            </Link>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                        <User size={14} className="text-[#c9962f]" />
                        {author}
                    </span>
                    <span className="flex items-center gap-1">
                        <CalendarDays size={14} className="text-[#c9962f]" />
                        {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageCircle size={14} className="text-[#c9962f]" />
                        {comments} Comments
                    </span>
                </div>

                <h3 className="text-lg font-semibold text-[#233020] leading-snug mb-2 line-clamp-2">
                    <Link href={`/blog/${slug}`} className="hover:text-[#6b7c4d] transition-colors">
                        {title}
                    </Link>
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{excerpt}</p>

                <Link
                    href={`/blog/${slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#c9962f] hover:text-[#6b7c4d] transition-colors"
                >
                    Read More
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        →
                    </span>
                </Link>
            </div>
        </article>
    );
};

export default BlogCard;