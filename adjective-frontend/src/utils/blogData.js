// src/utils/blogData.js
// -----------------------------------------------------------------------------
// TEMPORARY dummy data + data-access helpers.
//
// When the Express/MongoDB backend + admin panel is ready, only THIS file
// changes. Every function below already returns the shape the UI expects,
// so app/(marketing)/blog/page.jsx and app/(marketing)/blog/[id]/page.jsx
// won't need to change at all — just swap the function bodies for real
// `fetch()` calls against your API, e.g.:
//
//   export async function getBlogs({ category, page, limit } = {}) {
//     const params = new URLSearchParams();
//     if (category && category !== "All") params.set("category", category);
//     if (page) params.set("page", page);
//     if (limit) params.set("limit", limit);
//
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/blogs?${params.toString()}`,
//       { next: { revalidate: 60 } } // ISR — re-fetch every 60s
//     );
//     if (!res.ok) throw new Error("Failed to fetch blogs");
//     return res.json(); // { blogs, total, totalPages }
//   }
// -----------------------------------------------------------------------------

export const BLOGS_PER_PAGE = 6;

const dummyBlogs = [
    {
        _id: "1",
        slug: "first-time-buyers-home-loan-mistakes",
        title: "5 Things First-Time Buyers Get Wrong About Home Loans",
        excerpt:
            "From ignoring your CIBIL score to skipping pre-approval, here are the mistakes that cost first-time buyers the most.",
        coverImage:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
        author: "Admin",
        category: "Buying Tips",
        createdAt: "2026-07-18T10:00:00Z",
        comments: 4,
        tags: ["home-loan", "first-time-buyer", "finance"],
        content: [
            "Buying your first home is exciting, but the loan process trips up almost everyone at least once. Lenders look far beyond your salary slip — your credit history, existing EMIs, and even your job stability all factor into approval.",
            "The single biggest mistake we see is applying for pre-approval too late, after already finalising a property. This puts buyers in a weak negotiating position and can blow past their booking deadline.",
            "Another common slip: not accounting for the full cost of ownership. Registration, stamp duty, brokerage, and interiors can easily add 8–12% on top of the property price — budget for it up front, not as a surprise later.",
        ],
    },
    {
        _id: "2",
        slug: "kolkata-real-estate-market-2026",
        title: "Is Kolkata's Real Estate Market Cooling Down in 2026?",
        excerpt:
            "A look at price trends across New Town, Rajarhat, and Salt Lake — and what it means for buyers this quarter.",
        coverImage:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
        author: "Admin",
        category: "Market Trends",
        createdAt: "2026-07-15T10:00:00Z",
        comments: 9,
        tags: ["kolkata", "market-trends", "new-town"],
        content: [
            "After three straight years of double-digit appreciation, price growth in New Town and Rajarhat has slowed to a more sustainable pace in early 2026.",
            "Salt Lake continues to command a premium for its established infrastructure, while New Town is seeing the fastest absorption of new inventory thanks to metro connectivity improvements.",
            "For buyers, this is arguably the calmest negotiating window in years — inventory is healthy and developers are more open to price discussions than they were in 2023–24.",
        ],
    },
    {
        _id: "3",
        slug: "renting-vs-buying-2026",
        title: "Renting vs Buying: A Straight-Talk Comparison for 2026",
        excerpt:
            "No fluff — just the real numbers on EMI, rent, appreciation, and lifestyle flexibility, side by side.",
        coverImage:
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80",
        author: "Admin",
        category: "Guides",
        createdAt: "2026-07-10T10:00:00Z",
        comments: 2,
        tags: ["renting", "buying", "guide"],
        content: [
            "The rent-vs-buy decision comes down to one number most people never calculate: your break-even horizon. If you're likely to stay in the same city for 5+ years, buying usually wins financially.",
            "Renting keeps capital free and gives you flexibility — genuinely valuable if your job or family situation is still in flux.",
            "Run the numbers with a proper EMI calculator before deciding on gut feel alone; the difference between a 20-year and 25-year loan tenure is bigger than most buyers expect.",
        ],
    },
    {
        _id: "4",
        slug: "stage-apartment-before-listing",
        title: "How to Stage Your Apartment Before Listing It",
        excerpt:
            "Small, low-cost changes that make a real difference in how fast — and how well — your property sells.",
        coverImage:
            "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80",
        author: "Admin",
        category: "Selling Tips",
        createdAt: "2026-07-05T10:00:00Z",
        comments: 6,
        tags: ["selling", "staging", "tips"],
        content: [
            "Buyers decide within the first 90 seconds of walking in whether they can picture themselves living there. Decluttering and depersonalising the space matters more than any renovation.",
            "Fix the small, obvious things first — a leaking tap or a broken cupboard hinge signals neglect and gives buyers room to negotiate the price down.",
            "Good natural light photography for the online listing is non-negotiable in 2026 — most buyers now shortlist properties before ever seeing them in person.",
        ],
    },
    {
        _id: "5",
        slug: "understanding-rera-buyer-checklist",
        title: "Understanding RERA: What Every Buyer Should Check",
        excerpt:
            "RERA registration numbers, carpet area disclosures, and possession timelines — decoded in plain language.",
        coverImage:
            "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80",
        author: "Admin",
        category: "Legal",
        createdAt: "2026-06-29T10:00:00Z",
        comments: 11,
        tags: ["rera", "legal", "checklist"],
        content: [
            "Every project you consider should have a valid RERA registration number — verify it directly on your state's RERA portal, not just what's printed on the brochure.",
            "RERA also mandates that developers sell by carpet area, not the older, more inflated super built-up area — always ask for the carpet area figure explicitly.",
            "Delayed possession has a legal remedy under RERA: developers owe buyers interest for every month past the committed date. Know this before you sign.",
        ],
    },
    {
        _id: "6",
        slug: "top-localities-kolkata-rental-yield",
        title: "Top 7 Localities in Kolkata for Rental Yield",
        excerpt:
            "Where investors are getting the best rent-to-price ratio right now, and why these pockets are heating up.",
        coverImage:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
        author: "Admin",
        category: "Investment",
        createdAt: "2026-06-22T10:00:00Z",
        comments: 3,
        tags: ["investment", "rental-yield", "kolkata"],
        content: [
            "Rental yield — annual rent as a percentage of property price — is the number serious investors track, not just headline appreciation.",
            "Pockets near IT corridors like Sector V and New Town consistently outperform on yield thanks to steady tenant demand from working professionals.",
            "Smaller, well-located 2BHKs tend to out-yield larger luxury units — they rent faster and see less vacancy downtime between tenants.",
        ],
    },
];

/**
 * Get a paginated, optionally category-filtered list of blogs.
 * Mirrors what a real `GET /api/blogs?category=&page=&limit=` would return.
 */
export async function getBlogs({ category = "All", page = 1, limit = BLOGS_PER_PAGE } = {}) {
    // simulate network latency so loading.jsx is visible during dev
    await new Promise((resolve) => setTimeout(resolve, 200));

    const filtered =
        category && category !== "All"
            ? dummyBlogs.filter((b) => b.category === category)
            : dummyBlogs;

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * limit;

    return {
        blogs: filtered.slice(start, start + limit),
        total,
        totalPages,
        currentPage: safePage,
    };
}

/** Distinct category list, "All" first. */
export async function getCategories() {
    const unique = new Set(dummyBlogs.map((b) => b.category));
    return ["All", ...unique];
}

/** Single blog by slug — used by the [id] detail page. */
export async function getBlogBySlug(slug) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return dummyBlogs.find((b) => b.slug === slug) || null;
}

/** A few other posts in the same category, for the "Related Posts" rail. */
export async function getRelatedBlogs(category, excludeSlug, limit = 3) {
    return dummyBlogs
        .filter((b) => b.category === category && b.slug !== excludeSlug)
        .slice(0, limit);
}

export default dummyBlogs;