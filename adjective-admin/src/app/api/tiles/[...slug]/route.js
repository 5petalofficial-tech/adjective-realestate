/**
 * Map Tile Proxy — Admin
 * Proxies OpenStreetMap tiles server-side with a proper User-Agent.
 */

const OSM_TILE_BASE = "https://tile.openstreetmap.org";
const CACHE_SECONDS = 86400;

export async function GET(request, { params }) {
  try {
    const slug = (await params).slug;

    if (!slug || slug.length < 3) {
      return new Response("Invalid tile path", { status: 400 });
    }

    const tilePath = slug.join("/");

    if (!/^\d+\/\d+\/\d+\.png$/.test(tilePath)) {
      return new Response("Invalid tile path", { status: 400 });
    }

    const upstreamUrl = `${OSM_TILE_BASE}/${tilePath}`;

    const response = await fetch(upstreamUrl, {
      headers: {
        "User-Agent": "AdjectiveRealEstate/1.0 (https://adjectiverealestate.in; contact@adjectiverealestate.in)",
        "Accept": "image/png",
        "Referer": "https://adjectiverealestate.in",
      },
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
