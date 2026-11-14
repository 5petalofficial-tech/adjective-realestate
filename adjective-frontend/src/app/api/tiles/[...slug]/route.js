/**
 * Map Tile Proxy
 * Proxies OpenStreetMap tiles server-side with a proper User-Agent.
 * Usage in Leaflet: url="/api/tiles/{z}/{x}/{y}.png"
 *
 * This prevents OSM from blocking the production domain, since all
 * tile requests originate from the Next.js server (not the browser).
 */

const OSM_TILE_BASE = "https://tile.openstreetmap.org";

// Simple in-memory cache to reduce upstream requests
// (Next.js edge cache + CDN will handle longer-term caching in production)
const CACHE_SECONDS = 86400; // 24 hours

export async function GET(request, { params }) {
  try {
    const slug = (await params).slug; // e.g. ["12", "3456", "1234.png"]

    if (!slug || slug.length < 3) {
      return new Response("Invalid tile path", { status: 400 });
    }

    const tilePath = slug.join("/"); // "z/x/y.png"

    // Validate path format — must be digits/digits/digits.png
    if (!/^\d+\/\d+\/\d+\.png$/.test(tilePath)) {
      return new Response("Invalid tile path", { status: 400 });
    }

    const upstreamUrl = `${OSM_TILE_BASE}/${tilePath}`;

    const response = await fetch(upstreamUrl, {
      headers: {
        // OSM requires a descriptive User-Agent per their tile policy
        "User-Agent": "AdjectiveRealEstate/1.0 (https://adjectiverealestate.in; contact@adjectiverealestate.in)",
        "Accept": "image/png",
        "Referer": "https://adjectiverealestate.in",
      },
      // Don't cache the fetch itself — we handle caching via response headers
      cache: "no-store",
    });

    if (!response.ok) {
      return new Response(`Upstream tile error: ${response.status}`, {
        status: response.status,
      });
    }

    const tileBuffer = await response.arrayBuffer();

    return new Response(tileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=3600`,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("[Tile Proxy] Error:", err.message);
    return new Response("Tile proxy error", { status: 502 });
  }
}
