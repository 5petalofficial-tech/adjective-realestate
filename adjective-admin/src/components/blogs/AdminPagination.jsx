// src/components/blogs/AdminPagination.jsx
// Server Component, URL-driven — same pattern as the public site's pagination.

import Link from "next/link";

const buildHref = (searchParamsObj, page, basePath = "/blogs") => {
  const params = new URLSearchParams(searchParamsObj);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
};

const AdminPagination = ({ currentPage, totalPages, searchParamsObj, basePath = "/blogs" }) => {
  if (totalPages <= 1) return null;

  // Keep the pager compact on large result sets: show first, last, current
  // +/-1, and ellipses instead of every single page number.
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="flex items-center justify-between mt-5">
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <Link
          href={buildHref(searchParamsObj, Math.max(1, currentPage - 1), basePath)}
          className={`px-3 py-1.5 rounded-md text-sm border border-gray-200 text-gray-600 ${
            currentPage === 1 ? "opacity-40 pointer-events-none" : "hover:border-[#6b7c4d]"
          }`}
        >
          Prev
        </Link>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(searchParamsObj, p, basePath)}
              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                p === currentPage
                  ? "bg-[#6b7c4d] text-white"
                  : "border border-gray-200 text-gray-600 hover:border-[#6b7c4d]"
              }`}
            >
              {p}
            </Link>
          )
        )}

        <Link
          href={buildHref(searchParamsObj, Math.min(totalPages, currentPage + 1), basePath)}
          className={`px-3 py-1.5 rounded-md text-sm border border-gray-200 text-gray-600 ${
            currentPage === totalPages ? "opacity-40 pointer-events-none" : "hover:border-[#6b7c4d]"
          }`}
        >
          Next
        </Link>
      </div>
    </nav>
  );
};

export default AdminPagination;
