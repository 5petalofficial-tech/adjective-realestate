// src/components/blog/CategoryFilter.jsx
// Server Component. Filtering is driven entirely by the URL (?category=...)
// so the filter state is shareable/bookmarkable and needs zero client JS.

import Link from "next/link";

const CategoryFilter = ({ categories, activeCategory }) => {
    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const href = cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`;

                return (
                    <Link
                        key={cat}
                        href={href}
                        className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${isActive
                                ? "bg-[#6b7c4d] text-white border-[#6b7c4d]"
                                : "bg-white text-[#4a5340] border-[#d8d4c6] hover:border-[#6b7c4d]"
                            }`}
                    >
                        {cat}
                    </Link>
                );
            })}
        </div>
    );
};

export default CategoryFilter;