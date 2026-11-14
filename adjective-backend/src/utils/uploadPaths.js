'use strict';

/**
 * uploadPaths.js
 *
 * Single source of truth for every filesystem path related to local uploads.
 *
 * WHY THIS EXISTS
 * ───────────────
 * `process.cwd()` is the directory from which the Node process was started.
 * In a monorepo the process is started from the repo root, NOT from
 * `adjective-backend/`, so any code that uses `process.cwd()` to locate the
 * uploads folder writes (and reads) from the wrong place.
 *
 * `__dirname` is always the directory that contains *this source file*
 * (`adjective-backend/src/utils/`), which is known at code-compile time and
 * never changes regardless of CWD, PM2, Docker, or any other launch method.
 *
 *   __dirname  = adjective-backend/src/utils
 *   ../../     = adjective-backend/
 *   ../../uploads = adjective-backend/uploads   ← always correct
 *
 * USAGE
 * ─────
 *   const { UPLOADS_ROOT, toRelativePath, toAbsolutePath } = require('./uploadPaths');
 *
 *   // Convert multer's absolute file.path → portable relative DB value
 *   const dbPath = toRelativePath(req.file.path);
 *   // → "uploads/dealer/banner/bannerImage-1712345678-123456789.webp"
 *
 *   // Convert a stored relative DB value → absolute path for fs operations
 *   const absPath = toAbsolutePath(dbPath);
 *   // → "C:\\…\\adjective-backend\\uploads\\dealer\\banner\\bannerImage-….webp"
 */

const path = require('path');

// ─── Canonical upload root ─────────────────────────────────────────────────
// Anchored to this file's location; never changes regardless of CWD.
const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'uploads');

// ─── toRelativePath ────────────────────────────────────────────────────────

/**
 * Normalise any path to a forward-slash relative upload path.
 *
 * Handles:
 *   - Windows absolute paths   C:\Users\KRISHNA\...\uploads\dealer\banner\x.jpg
 *   - Unix absolute paths      /home/user/adjective-backend/uploads/solo/y.jpg
 *   - Already-correct paths    uploads/dealer/banner/x.jpg  (idempotent)
 *   - HTTP/HTTPS URLs          returned unchanged
 *   - null / undefined / ""    returned as ""
 *
 * @param {string|null|undefined} p  Raw path (multer file.path or DB value)
 * @returns {string}  Relative path like "uploads/dealer/banner/file.jpg",
 *                    or the original value if no "uploads/" segment is found,
 *                    or "" for empty/null input.
 */
const toRelativePath = (p) => {
    if (!p || typeof p !== 'string') return '';

    // Pass HTTP/HTTPS URLs through unchanged — they live on external storage.
    if (p.startsWith('http://') || p.startsWith('https://')) return p;

    // Normalise backslashes → forward slashes (Windows absolute paths)
    let clean = p.replace(/\\/g, '/');

    // Normalize repeated forward slashes (e.g. "uploads//dealer" -> "uploads/dealer")
    clean = clean.replace(/\/+/g, '/');

    // Slice from the first occurrence of "uploads/" onward (case-insensitive)
    const idx = clean.toLowerCase().indexOf('uploads/');
    if (idx !== -1) {
        return clean.slice(idx);
    }

    // No "uploads/" segment found — return the normalised string as-is
    return clean;
};

// ─── toAbsolutePath ────────────────────────────────────────────────────────

/**
 * Resolve a stored relative upload path to its absolute filesystem path,
 * always anchored to UPLOADS_ROOT (adjective-backend/uploads).
 *
 * Security: Resolves both paths absolutely and uses a platform-safe containment
 * check via path.relative and path.isAbsolute to prevent directory traversal.
 * Returns null if the path escapes UPLOADS_ROOT.
 *
 * @param {string|null|undefined} relativePath  Stored relative path from DB
 * @returns {string|null}  Absolute path, or null for empty/null/unsafe input.
 */
const toAbsolutePath = (relativePath) => {
    if (!relativePath || typeof relativePath !== 'string') return null;

    // Pass HTTP/HTTPS URLs through as-is (nothing to resolve on disk)
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }

    // Normalise the relative path first, then strip the leading "uploads/" prefix
    // so we can safely join it onto UPLOADS_ROOT without doubling the segment.
    const normalised = toRelativePath(relativePath);
    const strippedPrefix = normalised.startsWith('uploads/')
        ? normalised.slice('uploads/'.length)
        : normalised;

    // Resolve target path and root path absolutely
    const resolvedPath = path.resolve(UPLOADS_ROOT, strippedPrefix);
    const resolvedRoot = path.resolve(UPLOADS_ROOT);

    // Platform-safe containment check:
    // path.relative(root, target) returns the relative path from root to target.
    // If target is outside root, it will start with '..' (e.g. '../secret.txt').
    // If target is on a different drive (Windows), it will return an absolute path (e.g. 'D:\file.jpg').
    const relative = path.relative(resolvedRoot, resolvedPath);
    const isInside = !relative.startsWith('..') && !path.isAbsolute(relative);

    if (!isInside) {
        console.warn(`[Security Alert] Blocked attempt to resolve path outside uploads directory: "${relativePath}"`);
        return null;
    }

    return resolvedPath;
};

module.exports = { UPLOADS_ROOT, toRelativePath, toAbsolutePath };
