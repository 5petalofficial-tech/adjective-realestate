// src/app/(marketing)/blog/[slug]/not-found.jsx
// Rendered automatically when notFound() is called in page.jsx —
// e.g. a deleted blog, or a mistyped/old slug someone still has bookmarked.

import Link from "next/link";

const BlogNotFound = () => {
    return (
        <main className="bg-[#fbfaf6] min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <p className="text-[#c9962f] font-serif text-6xl font-semibold mb-4">404</p>
                <h1 className="text-2xl font-semibold text-[#233020] mb-3">
                    This blog post doesn&apos;t exist
                </h1>
                <p className="text-gray-500 mb-8">
                    It may have been removed, or the link might be outdated. Head back to the blog to see
                    what&apos;s currently live.
                </p>
                <Link
                    href="/blog"
                    className="inline-block bg-[#6b7c4d] text-white font-medium px-6 py-3 rounded-full hover:bg-[#586540] transition-colors"
                >
                    Back to Blogs
                </Link>
            </div>
        </main>
    );
};

export default BlogNotFound;