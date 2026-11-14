// src/app/(marketing)/blog/[slug]/page.jsx
// Server Component. Folder + param are named [slug] to match what's
// actually in the URL — getBlogBySlug() below matches on `slug`.

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MessageCircle, User, ArrowLeft } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import { getBlogBySlug, getRelatedBlogs } from "@/utils/blogData";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return { title: "Blog Not Found | Adjective Real Estate" };
    }

    return {
        title: `${blog.title} | Adjective Real Estate`,
        description: blog.excerpt,
        openGraph: {
            title: blog.title,
            description: blog.excerpt,
            images: [blog.coverImage],
        },
    };
}

const BlogDetailPage = async ({ params }) => {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    // Triggers app/(marketing)/blog/[slug]/not-found.jsx automatically.
    if (!blog) notFound();

    const relatedBlogs = await getRelatedBlogs(blog.category, blog.slug);

    const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <main className="bg-[#fbfaf6] min-h-screen">
            <Navbar />
            <div className="h-24"></div>
            {/* Hero cover image */}
            <section className="relative h-[320px] md:h-[420px]">
                <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-[#233020]/60" />

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-3xl mx-auto px-4 md:px-6 pb-10 w-full">
                        <span className="inline-block bg-[#6b7c4d] text-white text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full mb-4">
                            {blog.category}
                        </span>
                        <h1 className="text-white text-3xl md:text-4xl font-serif font-semibold leading-tight">
                            {blog.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Article body */}
            <article className="max-w-3xl mx-auto px-4 md:px-6 py-12">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#6b7c4d] hover:text-[#c9962f] transition-colors mb-6"
                >
                    <ArrowLeft size={16} />
                    Back to Blogs
                </Link>

                {/* Meta row */}
                <div className="flex items-center gap-5 text-sm text-gray-500 border-b border-[#e7e4da] pb-6 mb-8 flex-wrap">
                    <span className="flex items-center gap-1.5">
                        <User size={16} className="text-[#c9962f]" />
                        {blog.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <CalendarDays size={16} className="text-[#c9962f]" />
                        {formattedDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MessageCircle size={16} className="text-[#c9962f]" />
                        {blog.comments} Comments
                    </span>
                </div>

                {/* Content paragraphs */}
                <div className="prose prose-neutral max-w-none">
                    {blog.content.map((paragraph, i) => (
                        <p key={i} className="text-[#3d4636] leading-relaxed mb-5">
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Tags */}
                {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-10">
                        {blog.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs font-medium text-[#4a5340] bg-[#eeece2] px-3 py-1 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </article>

            {/* Related posts */}
            {relatedBlogs.length > 0 && (
                <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
                    <h2 className="text-2xl font-serif font-semibold text-[#233020] mb-6">
                        More in {blog.category}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedBlogs.map((related) => (
                            <BlogCard key={related._id} blog={related} />
                        ))}
                    </div>
                </section>
            )}
            <Footer />
        </main>
    );
};

export default BlogDetailPage;