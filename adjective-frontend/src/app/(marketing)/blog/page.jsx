// src/app/(marketing)/blog/page.jsx
// Server Component (default in App Router) — fetches on the server,
// filter/pagination state lives in the URL, so this route is fully
// SSR'd and shareable/bookmarkable. No client JS is shipped for this page.

import Image from "next/image";
import CategoryFilter from "@/components/blog/CategoryFilter";
import BlogCard from "@/components/blog/BlogCard";
import BlogPagination from "@/components/blog/BlogPagination";
import { getBlogs, getCategories } from "@/utils/blogData";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: "Our Blogs | Adjective Real Estate",
    description:
        "Buying guides, market trends, legal checklists and investment tips from the Adjective Real Estate team.",
};

const BlogPage = async ({ searchParams }) => {
    // Next.js 15 passes searchParams as a Promise; awaiting a plain object
    // (older Next versions) is a harmless no-op, so this works either way.
    const params = await searchParams;

    const activeCategory = params?.category || "All";
    const currentPage = Number(params?.page) || 1;

    const [{ blogs, totalPages, currentPage: safePage }, categories] = await Promise.all([
        getBlogs({ category: activeCategory, page: currentPage }),
        getCategories(),
    ]);

    return (
        <main className="bg-[#fbfaf6] min-h-screen">
            <Navbar />
            <div className="h-24"></div>
            {/* Hero banner */}
            <section className="relative h-[320px] md:h-[380px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1494526585095-c41746248156?w=1600&q=80"
                    alt=""
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-[#233020]/70" />
                <div className="relative text-center px-4">
                    <p className="text-[#e0c98f] tracking-[0.2em] text-xs md:text-sm font-semibold uppercase mb-3">
                        Adjective Real Estate
                    </p>
                    <h1 className="text-white text-4xl md:text-5xl font-serif font-semibold">
                        Our Blogs
                    </h1>
                </div>
            </section>

            {/* Category filter */}
            <section className="max-w-6xl mx-auto px-4 md:px-6 mt-10">
                <CategoryFilter categories={categories} activeCategory={activeCategory} />
            </section>

            {/* Blog grid */}
            <section className="max-w-6xl mx-auto px-4 md:px-6 py-12">
                {blogs.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500">No blogs found in this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                )}

                <BlogPagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    activeCategory={activeCategory}
                />
            </section>
            <Footer />
        </main>
    );
};

export default BlogPage;