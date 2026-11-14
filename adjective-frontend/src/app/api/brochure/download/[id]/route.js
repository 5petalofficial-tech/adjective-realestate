// Force Node.js runtime — pdfkit uses Buffer/fs and does NOT work on Edge
export const runtime = "nodejs";

import PDFDocument from "pdfkit";

// ── Brand colours ──────────────────────────────────────────────────────────
const OLIVE       = "#5E6623";
const OLIVE_DARK  = "#4A5119";
const GOLD        = "#C9A84C";
const SLATE       = "#1E293B";
const SLATE_LIGHT = "#475569";
const BODY        = "#334155";
const BG_LIGHT    = "#FAF8F2";
const WHITE       = "#FFFFFF";
const RULE_COLOR  = "#E2E8F0";

// ── Image Helper ───────────────────────────────────────────────────────────
async function getImageBuffer(relPath) {
  if (!relPath || typeof relPath !== "string") return null;

  const cleanPath = relPath.replace(/\\/g, "/").trim();
  if (!cleanPath) return null;

  // 1. Direct HTTP/HTTPS URLs (e.g. Cloudinary, Unsplash, external CDN)
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    try {
      const res = await fetch(cleanPath);
      if (res.ok) {
        const ab = await res.arrayBuffer();
        return Buffer.from(ab);
      }
    } catch (err) {
      console.warn(`[getImageBuffer] HTTP fetch failed for external URL: ${cleanPath}`, err.message);
    }
    return null;
  }

  // 2. Relative backend upload paths (e.g. "uploads/dealer/banner/file.webp")
  const uploadsIdx = cleanPath.toLowerCase().indexOf("uploads/");
  const relativeUpload = uploadsIdx !== -1 ? cleanPath.slice(uploadsIdx) : cleanPath.replace(/^\/+/, "");

  // 3. Normalize NEXT_PUBLIC_API_URL (strip trailing /api or /api/)
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const baseHost = rawApiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
  const fullUrl = `${baseHost}/${relativeUpload}`;

  try {
    const res = await fetch(fullUrl);
    if (res.ok) {
      const ab = await res.arrayBuffer();
      return Buffer.from(ab);
    }
    console.warn(`[getImageBuffer] Backend HTTP fetch returned ${res.status} for ${fullUrl}`);
  } catch (err) {
    console.warn(`[getImageBuffer] Failed to fetch image from ${fullUrl}:`, err.message);
  }

  return null;
}

// ── Formatters ─────────────────────────────────────────────────────────────
function formatPrice(num) {
  if (!num) return "On Request";
  if (num >= 10_000_000) return `Rs. ${(num / 10_000_000).toFixed(2)} Cr`;
  if (num >= 100_000)    return `Rs. ${(num / 100_000).toFixed(2)} L`;
  return `Rs. ${num.toLocaleString("en-IN")}`;
}

// ── Property Fetch ─────────────────────────────────────────────────────────
async function fetchProperty(id) {
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
    /\/api\/?$/,
    ""
  );

  const [soloRes, dealerRes] = await Promise.allSettled([
    fetch(`${base}/api/solo/${id}`,   { cache: "no-store" }),
    fetch(`${base}/api/dealer/${id}`, { cache: "no-store" }),
  ]);

  // Try Solo
  if (soloRes.status === "fulfilled" && soloRes.value.ok) {
    const json = await soloRes.value.json();
    const p = json?.property;
    if (p) {
      return {
        name:               p.name || "Property",
        description:        p.description || p.overview || "",
        fullAddress:        p.address || [p.area, p.city, p.state].filter(Boolean).join(", "),
        locality:           p.area || p.city || "",
        city:               p.city || "",
        state:              p.state || "",
        reraId:             p.reraNumber || "",
        priceMin:           p.price || 0,
        priceMax:           0,
        configurations:     [],
        towers:             [],
        amenities:          Array.isArray(p.amenities) ? p.amenities : [],
        constructionStatus: p.constructionStatus || "",
        bannerImage:        p.image || (p.images && p.images[0]) || null,
        gallery:            Array.isArray(p.images) ? p.images : [],
      };
    }
  }

  // Try Dealer
  if (dealerRes.status === "fulfilled" && dealerRes.value.ok) {
    const json = await dealerRes.value.json();
    const p = json?.data;
    if (p) {
      const banner = p.media?.bannerImage || p.bannerImage || null;
      const gallery = Array.isArray(p.media?.projectGallery)
        ? p.media.projectGallery
        : Array.isArray(p.images)
        ? p.images
        : [];
      return {
        name:               p.projectName || "Property",
        description:        p.description || p.overview || "",
        fullAddress:        [
          p.location?.addressLine,
          p.location?.locality,
          p.location?.city,
          p.location?.state,
          p.location?.pincode,
        ].filter(Boolean).join(", "),
        locality:           p.location?.locality || p.location?.city || "",
        city:               p.location?.city || "",
        state:              p.location?.state || "",
        reraId:             p.reraNumber || "",
        priceMin:           p.priceRange?.minPrice || 0,
        priceMax:           p.priceRange?.maxPrice || 0,
        configurations:     Array.isArray(p.configurations) ? p.configurations : [],
        towers:             Array.isArray(p.towers) ? p.towers : [],
        amenities:          Array.isArray(p.amenities) ? p.amenities : [],
        constructionStatus: p.constructionStatus || "",
        bannerImage:        banner,
        gallery:            gallery,
      };
    }
  }

  return null;
}

// ── PDF Builder ────────────────────────────────────────────────────────────
async function buildPdfBuffer(property) {
  // Pre-fetch image buffers
  const bannerBuf = property.bannerImage ? await getImageBuffer(property.bannerImage) : null;

  const galleryBufs = [];
  if (property.gallery && property.gallery.length > 0) {
    for (const imgPath of property.gallery) {
      const buf = await getImageBuffer(imgPath);
      if (buf) galleryBufs.push(buf);
    }
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size:        "A4",
      margins:     { top: 0, bottom: 0, left: 0, right: 0 },
      bufferPages: true,
      info: {
        Title:   `${property.name} — Property Brochure`,
        Author:  "Adjective Real Estate",
        Subject: "Property Brochure",
      },
    });

    const chunks = [];
    doc.on("data",  (c) => chunks.push(c));
    doc.on("end",   () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W      = doc.page.width;   // 595.28
    const M      = 40;
    const innerW = W - M * 2;

    // ── Helpers ──────────────────────────────────────────────────────────
    function rule(y) {
      doc.save()
        .moveTo(M, y).lineTo(W - M, y)
        .strokeColor(RULE_COLOR).lineWidth(0.5).stroke()
        .restore();
    }

    function sectionHeader(label, y) {
      const barH = 22;
      doc.rect(M, y, innerW, barH).fill(OLIVE);
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor(WHITE)
        .text(label.toUpperCase(), M + 10, y + 7, { width: innerW - 20, characterSpacing: 1 });
      return y + barH + 10;
    }

    function checkPageBreak(y, needed = 120) {
      if (y + needed > doc.page.height - 60) {
        doc.addPage({ margins: { top: 0, bottom: 0, left: 0, right: 0 } });
        return 30;
      }
      return y;
    }

    // ── HEADER BANNER ────────────────────────────────────────────────────
    const BANNER_H = 110;
    doc.rect(0, 0, W, BANNER_H).fill(OLIVE_DARK);
    doc.rect(0, BANNER_H - 5, W, 5).fill(GOLD);

    // Portal brand
    doc.font("Helvetica").fontSize(7.5).fillColor(GOLD)
      .text("ADJECTIVE REAL ESTATE", M, 18, { characterSpacing: 2.5 });

    // Project name
    doc.font("Helvetica-Bold").fontSize(24).fillColor(WHITE)
      .text(property.name, M, 32, { width: innerW * 0.72, lineGap: 0 });

    // Status badge (top-right)
    if (property.constructionStatus) {
      const bW = 110, bX = W - M - bW;
      doc.roundedRect(bX, 20, bW, 18, 4).fill(GOLD);
      doc.font("Helvetica-Bold").fontSize(7).fillColor(OLIVE_DARK)
        .text(property.constructionStatus.toUpperCase(), bX, 25, {
          width: bW, align: "center", characterSpacing: 0.5,
        });
    }

    // Location
    const locText = [property.locality, property.city, property.state]
      .filter(Boolean).join("  |  ");
    doc.font("Helvetica").fontSize(9).fillColor("#D1FAE5")
      .text("Location: " + (locText || "—"), M, 84, { width: innerW });

    let y = BANNER_H + 14;

    // ── HERO IMAGE (IF AVAILABLE) ────────────────────────────────────────
    if (bannerBuf) {
      try {
        const heroH = 170;
        doc.save();
        // Background card container
        doc.roundedRect(M, y, innerW, heroH, 6).clip();
        doc.image(bannerBuf, M, y, {
          cover: [innerW, heroH],
          align: "center",
          valign: "center",
        });
        doc.restore();
        // Thin gold border
        doc.roundedRect(M, y, innerW, heroH, 6).strokeColor(GOLD).lineWidth(1).stroke();
        y += heroH + 16;
      } catch (err) {
        console.warn("Could not render banner image in PDF:", err.message);
      }
    }

    // ── PRICE BAND ───────────────────────────────────────────────────────
    doc.rect(M, y, innerW, 36).fill(BG_LIGHT);
    doc.font("Helvetica").fontSize(7.5).fillColor(OLIVE)
      .text("STARTING PRICE", M + 12, y + 5, { characterSpacing: 1 });

    const priceText =
      property.priceMin && property.priceMax
        ? `${formatPrice(property.priceMin)}  –  ${formatPrice(property.priceMax)}`
        : property.priceMin
        ? formatPrice(property.priceMin)
        : "Price on Request";

    doc.font("Helvetica-Bold").fontSize(14).fillColor(OLIVE_DARK)
      .text(priceText, M + 12, y + 16);

    if (property.reraId) {
      doc.font("Helvetica").fontSize(7).fillColor(SLATE_LIGHT)
        .text("RERA: " + property.reraId, 0, y + 8, { width: W - M - 10, align: "right" });
    }

    y += 48;

    // ── OVERVIEW ─────────────────────────────────────────────────────────
    if (property.description) {
      y = sectionHeader("Project Overview", y);
      doc.font("Helvetica").fontSize(9).fillColor(BODY)
        .text(property.description, M, y, {
          width: innerW, lineGap: 3, paragraphGap: 4,
        });
      y = doc.y + 16;
    }

    // ── GALLERY PHOTOS (IF AVAILABLE) ───────────────────────────────────
    if (galleryBufs.length > 0) {
      y = checkPageBreak(y, 160);
      y = sectionHeader("Property Gallery & Visuals", y);

      const maxImages = Math.min(galleryBufs.length, 4);
      const cols = maxImages >= 3 ? 3 : 2;
      const gap = 10;
      const imgW = (innerW - gap * (cols - 1)) / cols;
      const imgH = 100;

      let rowY = y;
      galleryBufs.slice(0, maxImages).forEach((buf, idx) => {
        const col = idx % cols;
        if (col === 0 && idx !== 0) rowY += imgH + gap;

        const imgX = M + col * (imgW + gap);
        try {
          doc.save();
          doc.roundedRect(imgX, rowY, imgW, imgH, 4).clip();
          doc.image(buf, imgX, rowY, {
            cover: [imgW, imgH],
            align: "center",
            valign: "center",
          });
          doc.restore();
          doc.roundedRect(imgX, rowY, imgW, imgH, 4).strokeColor(RULE_COLOR).lineWidth(0.5).stroke();
        } catch (err) {
          console.warn("Could not render gallery photo:", err.message);
        }
      });

      const totalRows = Math.ceil(maxImages / cols);
      y = rowY + imgH + 18;
    }

    // ── CONFIGURATIONS TABLE ──────────────────────────────────────────────
    if (property.configurations.length > 0) {
      y = checkPageBreak(y, 40 + property.configurations.length * 22);
      y = sectionHeader("Unit Configurations", y);

      const cols = [70, 100, 100, 100, innerW - 370];
      const headers = ["BHK Type", "Super Built-Up", "Built-Up", "Carpet Area", "Base Price"];
      const colX = cols.reduce((acc, w, i) => {
        acc.push(i === 0 ? M : acc[i - 1] + cols[i - 1]);
        return acc;
      }, []);
      const rowH = 22;

      // Header row
      doc.rect(M, y, innerW, rowH).fill(SLATE);
      headers.forEach((h, i) => {
        doc.font("Helvetica-Bold").fontSize(8).fillColor(WHITE)
          .text(h, colX[i] + 4, y + 7, { width: cols[i] - 8 });
      });
      y += rowH;

      property.configurations.forEach((cfg, idx) => {
        doc.rect(M, y, innerW, rowH).fill(idx % 2 === 0 ? WHITE : "#F1F5F9");
        const cells = [
          cfg.bhkType || "—",
          cfg.superBuiltUpAreaSize ? `${cfg.superBuiltUpAreaSize} sqft` : "—",
          cfg.builtUpAreaSize      ? `${cfg.builtUpAreaSize} sqft`      : "—",
          cfg.carpetAreaSize       ? `${cfg.carpetAreaSize} sqft`       : "—",
          cfg.basePrice ? formatPrice(cfg.basePrice) : "—",
        ];
        cells.forEach((cell, i) => {
          doc.font("Helvetica").fontSize(8).fillColor(BODY)
            .text(cell, colX[i] + 4, y + 7, { width: cols[i] - 8 });
        });
        rule(y + rowH);
        y += rowH;
      });
      y += 18;
    }

    // ── TOWERS ───────────────────────────────────────────────────────────
    if (property.towers.length > 0) {
      y = checkPageBreak(y, 40 + property.towers.length * 22);
      y = sectionHeader("Towers & Blocks", y);

      const tColW = [innerW / 3, innerW / 3, innerW / 3];
      const tColX = tColW.reduce((acc, w, i) => {
        acc.push(i === 0 ? M : acc[i - 1] + tColW[i - 1]);
        return acc;
      }, []);
      const rowH = 22;

      doc.rect(M, y, innerW, rowH).fill(SLATE);
      ["Tower Name", "Total Floors", "Total Units"].forEach((h, i) => {
        doc.font("Helvetica-Bold").fontSize(8).fillColor(WHITE)
          .text(h, tColX[i] + 4, y + 7, { width: tColW[i] - 8 });
      });
      y += rowH;

      property.towers.forEach((t, idx) => {
        doc.rect(M, y, innerW, rowH).fill(idx % 2 === 0 ? WHITE : "#F1F5F9");
        const cells = [
          t.towerName       || "—",
          t.totalFloors     ? `${t.totalFloors} Floors` : "—",
          t.totalUnitsCount ? `${t.totalUnitsCount} Units` : "—",
        ];
        cells.forEach((cell, i) => {
          doc.font("Helvetica").fontSize(8).fillColor(BODY)
            .text(cell, tColX[i] + 4, y + 7, { width: tColW[i] - 8 });
        });
        rule(y + rowH);
        y += rowH;
      });
      y += 18;
    }

    // ── AMENITIES ────────────────────────────────────────────────────────
    if (property.amenities.length > 0) {
      y = checkPageBreak(y, 50 + Math.ceil(property.amenities.length / 3) * 18);
      y = sectionHeader("Amenities & Features", y);

      const perRow = 3;
      const cellW  = innerW / perRow;
      let rowStart = y;

      property.amenities.forEach((item, idx) => {
        const col = idx % perRow;
        if (col === 0 && idx !== 0) rowStart += 18;
        const x = M + col * cellW;
        doc.circle(x + 7, rowStart + 6, 3).fill(OLIVE);
        doc.font("Helvetica").fontSize(8.5).fillColor(BODY)
          .text(String(item), x + 16, rowStart, { width: cellW - 22 });
      });

      y = rowStart + 22;
    }

    // ── ADDRESS ──────────────────────────────────────────────────────────
    if (property.fullAddress) {
      y = checkPageBreak(y, 60);
      y = sectionHeader("Location & Address", y);
      doc.font("Helvetica").fontSize(9).fillColor(BODY)
        .text(property.fullAddress, M, y, { width: innerW });
      y = doc.y + 16;
    }

    // ── FOOTER (all pages) ───────────────────────────────────────────────
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      const pgH = doc.page.height;
      doc.rect(0, pgH - 32, W, 32).fill(OLIVE_DARK);
      doc.font("Helvetica").fontSize(7.5).fillColor(GOLD)
        .text(
          "Adjective Real Estate  |  This brochure is generated for informational purposes only.",
          M, pgH - 21, { width: innerW - 60 }
        );
      doc.font("Helvetica-Bold").fontSize(8).fillColor(WHITE)
        .text(`Page ${i + 1} of ${range.count}`, 0, pgH - 20, {
          width: W - M, align: "right",
        });
    }

    doc.end();
  });
}

// ── Route Handler ──────────────────────────────────────────────────────────
export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Property ID is required" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const property = await fetchProperty(id);

    if (!property) {
      return new Response(JSON.stringify({ error: "Property not found." }), {
        status: 404, headers: { "Content-Type": "application/json" },
      });
    }

    const pdfBuffer = await buildPdfBuffer(property);
    const safeName  = property.name.replace(/[^a-zA-Z0-9_\- ]/g, "").trim();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}_Brochure.pdf"`,
        "Content-Length":      String(pdfBuffer.length),
        "Cache-Control":       "no-store",
      },
    });
  } catch (err) {
    console.error("[brochure/download] PDF generation error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate PDF." }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
