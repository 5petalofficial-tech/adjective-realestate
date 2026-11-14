// src/components/blog/BlogPagination.jsx
// Server Component. Page state also lives in the URL (?page=...), same
// reasoning as CategoryFilter — keeps this route fully SSR/SEO friendly.

import Link from "next/link";

const buildHref = (category, page) => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
};

const BlogPagination = ({ currentPage, totalPages, activeCategory }) => {
    if (totalPages <= 1) return null;

    return (
        <nav aria-label="Blog pagination" className="flex justify-center items-center gap-2 mt-12">
            <Link
                href={buildHref(activeCategory, Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full border border-[#d8d4c6] text-[#4a5340] transition-colors ${currentPage === 1
                        ? "opacity-40 pointer-events-none"
                        : "hover:border-[#6b7c4d]"
                    }`}
            >
                ‹
            </Link>

            {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const isActive = currentPage === page;

                return (
                    <Link
                        key={page}
                        href={buildHref(activeCategory, page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${isActive
                                ? "bg-[#c9962f] text-white"
                                : "border border-[#d8d4c6] text-[#4a5340] hover:border-[#6b7c4d]"
                            }`}
                    >
                        {page}
                    </Link>
                );
            })}

            <Link
                href={buildHref(activeCategory, Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage === totalPages}
                className={`w-10 h-10 flex items-center justify-center rounded-full border border-[#d8d4c6] text-[#4a5340] transition-colors ${currentPage === totalPages
                        ? "opacity-40 pointer-events-none"
                        : "hover:border-[#6b7c4d]"
                    }`}
            >
                ›
            </Link>
        </nav>
    );
};

export default BlogPagination;