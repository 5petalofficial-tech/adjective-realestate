'use strict';

/**
 * migrateImagePaths.js
 *
 * Production-grade, idempotent migration script.
 * Normalises all file-path fields in the `builderprojects` and `solos`
 * MongoDB collections from Windows absolute paths (e.g. C:\Users\KRISHNA\...\
 * uploads\dealer\banner\file.jpg) into portable relative paths
 * (e.g. uploads/dealer/banner/file.jpg).
 *
 * USAGE
 * ─────
 *   # Step 1 — always run dry-run first and review the report
 *   node scripts/migrateImagePaths.js --dry-run
 *
 *   # Step 2 — only after reviewing and approving the dry-run output
 *   node scripts/migrateImagePaths.js
 *
 * FLAGS
 * ─────
 *   --dry-run    Print what WOULD change without writing anything to MongoDB.
 *   --verbose    Print every field checked, even if unchanged.
 *
 * IDEMPOTENCY
 * ───────────
 * Already-correct relative paths (starting with "uploads/") are left untouched.
 * HTTP/HTTPS URLs (Cloudinary, external) are left untouched.
 * Running this script twice produces zero additional changes.
 *
 * SAFETY
 * ──────
 * No records are deleted. No files are deleted. Only path strings are rewritten.
 * The script will NEVER modify a field unless the value actually changed.
 */

const path      = require('path');
const fs        = require('fs');
const mongoose  = require('mongoose');
const dns       = require('dns');

// Optional: Prevents some MongoDB Atlas DNS resolution issues
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
    console.warn("Unable to configure custom DNS servers.");
}

// Load .env from the backend project root (adjective-backend/)
const dotenvPath = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: dotenvPath });

// ─── Canonical UPLOADS_ROOT (same anchor as uploadPaths.js) ────────────────
// __dirname = adjective-backend/scripts
// ../      = adjective-backend/
// ../uploads = adjective-backend/uploads
const UPLOADS_ROOT = path.join(__dirname, '..', 'uploads');

// ─── CLI flags ─────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// ─── Path normalisation (mirrors uploadPaths.toRelativePath) ───────────────

/**
 * Returns true if `p` contains an absolute-looking path that needs migration.
 * Catches:
 *   - Windows absolute paths:  C:\Users\...   or  C:/Users/...
 *   - Unix absolute paths:     /home/user/...  or  /Users/...
 *   - Already-relative paths like "uploads/..." return false → no migration needed
 *   - HTTP/HTTPS URLs return false → never touched
 */
const needsMigration = (p) => {
    if (!p || typeof p !== 'string') return false;
    if (p.startsWith('http://') || p.startsWith('https://')) return false;
    // Already a clean relative path
    if (p.startsWith('uploads/')) return false;
    // Windows drive letter: C:/ or C:\
    if (/^[A-Za-z]:[/\\]/.test(p)) return true;
    // Unix absolute
    if (p.startsWith('/')) return true;
    return false;
};

/**
 * Normalise to a relative path.  Mirrors uploadPaths.toRelativePath exactly.
 * Returns null if the path cannot be normalised (no "uploads/" segment found).
 */
const normalise = (p) => {
    if (!p || typeof p !== 'string') return null;
    if (p.startsWith('http://') || p.startsWith('https://')) return p; // untouched
    const clean = p.replace(/\\/g, '/');
    const idx = clean.toLowerCase().indexOf('uploads/');
    if (idx !== -1) return clean.slice(idx);
    return null; // suspicious — no uploads/ segment
};

/** Check whether the file physically exists on this machine. */
const fileExists = (relativePath) => {
    if (!relativePath) return false;
    // Strip leading "uploads/" then join onto UPLOADS_ROOT
    const stripped = relativePath.startsWith('uploads/')
        ? relativePath.slice('uploads/'.length)
        : relativePath;
    const abs = path.join(UPLOADS_ROOT, stripped);
    return fs.existsSync(abs);
};

// ─── Collection field descriptors ──────────────────────────────────────────

/**
 * Each entry describes one collection and its file-bearing fields.
 * type: 'string'   → top-level or nested string field
 * type: 'array'    → array of strings
 * nested: true     → path is inside an embedded object (e.g. media.bannerImage)
 */
const COLLECTIONS = [
    {
        name:  'builderprojects',
        label: 'BuilderProject (Dealer)',
        fields: [
            // Nested under the `media` subdocument
            { key: 'media.bannerImage',    type: 'string',  nested: true,  parent: 'media', field: 'bannerImage'    },
            { key: 'media.projectGallery', type: 'array',   nested: true,  parent: 'media', field: 'projectGallery' },
            { key: 'media.brochureUrl',    type: 'string',  nested: true,  parent: 'media', field: 'brochureUrl'    },
            // Top-level field
            { key: 'floorPlanUrl',         type: 'string',  nested: false, field: 'floorPlanUrl' },
        ]
    },
    {
        name:  'solos',
        label: 'Solo (Resale)',
        fields: [
            { key: 'images',                    type: 'array',  nested: false, field: 'images'                    },
            { key: 'sitePlanUrl',               type: 'string', nested: false, field: 'sitePlanUrl'               },
            { key: 'completionCertificateUrl',   type: 'string', nested: false, field: 'completionCertificateUrl'  },
            { key: 'buildingPlanUrl',            type: 'string', nested: false, field: 'buildingPlanUrl'           },
        ]
    }
];

// ─── Main ──────────────────────────────────────────────────────────────────

const run = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.db_url;

    if (!MONGODB_URI) {
        console.error('\n❌  No MONGODB_URI found in environment.');
        console.error('    Ensure adjective-backend/.env is present and contains MONGODB_URI.\n');
        process.exit(1);
    }

    console.log('\n══════════════════════════════════════════════════════════════════');
    console.log('  Adjective Real Estate — Image Path Migration');
    console.log('══════════════════════════════════════════════════════════════════');
    console.log(`  Mode        : ${DRY_RUN ? '🟡 DRY RUN  (no writes will occur)' : '🔴 LIVE WRITE'}`);
    console.log(`  UPLOADS_ROOT: ${UPLOADS_ROOT}`);
    console.log(`  MongoDB     : ${MONGODB_URI.replace(/:([^@]+)@/, ':****@')}`);
    console.log('══════════════════════════════════════════════════════════════════\n');

    // ── Connect ──────────────────────────────────────────────────────────────
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME || 'adjective',
        });
        console.log(`✅  Connected: ${mongoose.connection.host} / ${mongoose.connection.name}\n`);
    } catch (err) {
        console.error('❌  MongoDB connection failed:', err.message);
        process.exit(1);
    }

    const db = mongoose.connection.db;

    // ── Global counters ──────────────────────────────────────────────────────
    const globalSummary = {
        totalDocsScanned:   0,
        totalDocsAffected:  0,
        totalFieldsChanged: 0,
        totalFieldsAlready: 0,
        totalMissingFiles:  0,
        totalSuspicious:    0,
        collections: []
    };

    // ── Process each collection ──────────────────────────────────────────────
    for (const colDef of COLLECTIONS) {
        const { name: colName, label, fields } = colDef;
        console.log(`\n┌── ${label} (${colName})`);

        const collection = db.collection(colName);
        const docCount   = await collection.countDocuments();
        console.log(`│   Documents in collection : ${docCount}`);

        if (docCount === 0) {
            console.log('│   (empty — skipping)\n└──\n');
            globalSummary.collections.push({ label, colName, docsScanned: 0, docsAffected: 0, fieldsChanged: 0, alreadyCorrect: 0, missingFiles: 0, suspicious: 0 });
            continue;
        }

        const docs = await collection.find({}).toArray();

        let docsAffected  = 0;
        let fieldsChanged = 0;
        let alreadyCorrect = 0;
        let missingFiles  = 0;
        let suspicious    = 0;

        for (const doc of docs) {
            globalSummary.totalDocsScanned++;
            let docNeedsUpdate = false;
            const $set = {};

            for (const fieldDef of fields) {
                const { key, type, nested, parent, field } = fieldDef;

                // ── Resolve current value from doc ─────────────────────────
                let current;
                if (nested) {
                    current = doc[parent]?.[field];
                } else {
                    current = doc[field];
                }

                // ── Process based on field type ────────────────────────────
                if (type === 'string') {
                    if (!current) {
                        VERBOSE && console.log(`│   [${doc._id}] ${key} : (empty — skip)`);
                        continue;
                    }

                    if (!needsMigration(current)) {
                        alreadyCorrect++;
                        globalSummary.totalFieldsAlready++;
                        VERBOSE && console.log(`│   [${doc._id}] ${key} : ✅ already correct → ${current}`);
                        continue;
                    }

                    const normalised = normalise(current);
                    if (normalised === null) {
                        // Could not find "uploads/" segment — log as suspicious, skip
                        suspicious++;
                        globalSummary.totalSuspicious++;
                        console.log(`│   ⚠️  [${doc._id}] ${key} : suspicious (no uploads/ segment) → "${current}"`);
                        continue;
                    }

                    const exists = fileExists(normalised);
                    if (!exists) {
                        missingFiles++;
                        globalSummary.totalMissingFiles++;
                        console.log(`│   📁 [${doc._id}] ${key} : file NOT found on disk`);
                        console.log(`│          was  → "${current}"`);
                        console.log(`│          will → "${normalised}"`);
                    } else {
                        VERBOSE && console.log(`│   [${doc._id}] ${key} : ✅ file exists`);
                    }

                    console.log(`│   🔄 [${doc._id}] ${key}`);
                    console.log(`│          before: "${current}"`);
                    console.log(`│          after : "${normalised}"`);

                    $set[key] = normalised;
                    docNeedsUpdate = true;
                    fieldsChanged++;
                    globalSummary.totalFieldsChanged++;

                } else if (type === 'array') {
                    const arr = nested ? (doc[parent]?.[field] ?? []) : (doc[field] ?? []);
                    if (!Array.isArray(arr) || arr.length === 0) {
                        VERBOSE && console.log(`│   [${doc._id}] ${key} : (empty array — skip)`);
                        continue;
                    }

                    let arrayChanged = false;
                    const newArr = arr.map((item, idx_) => {
                        if (!item || typeof item !== 'string') return item;

                        if (!needsMigration(item)) {
                            alreadyCorrect++;
                            globalSummary.totalFieldsAlready++;
                            VERBOSE && console.log(`│   [${doc._id}] ${key}[${idx_}] : ✅ already correct`);
                            return item;
                        }

                        const normalised = normalise(item);
                        if (normalised === null) {
                            suspicious++;
                            globalSummary.totalSuspicious++;
                            console.log(`│   ⚠️  [${doc._id}] ${key}[${idx_}] : suspicious → "${item}"`);
                            return item; // leave unchanged
                        }

                        const exists = fileExists(normalised);
                        if (!exists) {
                            missingFiles++;
                            globalSummary.totalMissingFiles++;
                            console.log(`│   📁 [${doc._id}] ${key}[${idx_}] : file NOT found on disk`);
                            console.log(`│          was  → "${item}"`);
                            console.log(`│          will → "${normalised}"`);
                        } else {
                            VERBOSE && console.log(`│   [${doc._id}] ${key}[${idx_}] : file exists`);
                        }

                        console.log(`│   🔄 [${doc._id}] ${key}[${idx_}]`);
                        console.log(`│          before: "${item}"`);
                        console.log(`│          after : "${normalised}"`);

                        arrayChanged   = true;
                        fieldsChanged++;
                        globalSummary.totalFieldsChanged++;
                        return normalised;
                    });

                    if (arrayChanged) {
                        $set[key] = newArr;
                        docNeedsUpdate = true;
                    }
                }
            } // end field loop

            if (docNeedsUpdate) {
                docsAffected++;
                globalSummary.totalDocsAffected++;

                if (!DRY_RUN) {
                    try {
                        await collection.updateOne(
                            { _id: doc._id },
                            { $set }
                        );
                    } catch (updateErr) {
                        console.error(`│   ❌ Failed to update [${doc._id}]: ${updateErr.message}`);
                    }
                }
            }
        } // end doc loop

        globalSummary.collections.push({
            label, colName,
            docsScanned:   docs.length,
            docsAffected,
            fieldsChanged,
            alreadyCorrect,
            missingFiles,
            suspicious,
        });

        console.log(`│   Documents scanned   : ${docs.length}`);
        console.log(`│   Documents affected  : ${docsAffected}`);
        console.log(`│   Fields changed      : ${fieldsChanged}`);
        console.log(`│   Already correct     : ${alreadyCorrect}`);
        console.log(`│   Missing on disk     : ${missingFiles}`);
        console.log(`│   Suspicious (no uploads/ segment) : ${suspicious}`);
        console.log(`└── ${DRY_RUN ? '[DRY RUN — no writes performed]' : '[WRITES COMMITTED]'}\n`);
    }

    // ── Final summary ────────────────────────────────────────────────────────
    console.log('\n══════════════════════════════════════════════════════════════════');
    console.log('  MIGRATION SUMMARY');
    console.log('══════════════════════════════════════════════════════════════════');
    console.log(`  Mode               : ${DRY_RUN ? '🟡 DRY RUN — MongoDB was NOT modified' : '✅  LIVE — changes committed to MongoDB'}`);
    console.log(`  Total docs scanned : ${globalSummary.totalDocsScanned}`);
    console.log(`  Docs affected      : ${globalSummary.totalDocsAffected}`);
    console.log(`  Fields changed     : ${globalSummary.totalFieldsChanged}`);
    console.log(`  Already correct    : ${globalSummary.totalFieldsAlready}`);
    console.log(`  Missing on disk    : ${globalSummary.totalMissingFiles}`);
    console.log(`  Suspicious paths   : ${globalSummary.totalSuspicious}`);
    console.log('──────────────────────────────────────────────────────────────────');

    for (const col of globalSummary.collections) {
        console.log(`  ${col.label} (${col.colName})`);
        console.log(`    scanned=${col.docsScanned}  affected=${col.docsAffected}  changed=${col.fieldsChanged}  correct=${col.alreadyCorrect}  missing=${col.missingFiles}  suspicious=${col.suspicious}`);
    }

    if (DRY_RUN) {
        console.log('\n  ⚠️  DRY RUN complete. Review the output above.');
        console.log('  To apply changes, re-run WITHOUT the --dry-run flag.');
        console.log('  Command:  node scripts/migrateImagePaths.js\n');
    } else {
        console.log('\n  ✅  Migration complete.\n');
    }

    console.log('══════════════════════════════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
};

run().catch((err) => {
    console.error('❌  Unexpected error:', err);
    process.exit(1);
});
