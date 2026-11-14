// src/app/(marketing)/blog/loading.jsx
// Next.js renders this automatically while the async page.jsx above is
// fetching data (React Suspense under the hood) — no wiring needed.

const BlogLoading = () => {
    return (
        <main className="bg-[#fbfaf6] min-h-screen">
            <div className="h-[320px] md:h-[380px] bg-[#233020]/90 animate-pulse" />

            <section className="max-w-6xl mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-[380px] rounded-2xl bg-[#eeece2] animate-pulse" />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default BlogLoading;