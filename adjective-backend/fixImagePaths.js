/**
 * fixImagePaths.js
 * Run this once to fix absolute disk paths stored in MongoDB.
 * Usage: node fixImagePaths.js
 */

const mongoose = require('mongoose');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
require('dotenv').config();

const dealer = require('./schema/dealer');
const Solo = require('./schema/solo');

function toRelativePath(p) {
    if (!p || typeof p !== 'string') return p;
    if (p.startsWith('http://') || p.startsWith('https://')) return p;
    // Convert Windows backslashes to forward slashes
    const clean = p.replace(/\\/g, '/');
    const idx = clean.toLowerCase().indexOf('uploads/');
    if (idx !== -1) {
        return clean.slice(idx);
    }
    return p;
}

async function fixDealerImages() {
    const properties = await dealer.find();
    let count = 0;
    for (const p of properties) {
        let changed = false;
        const media = p.media || {};

        const newBanner = toRelativePath(media.bannerImage);
        if (newBanner !== media.bannerImage) {
            media.bannerImage = newBanner;
            changed = true;
        }

        const newGallery = (media.projectGallery || []).map(img => {
            const clean = toRelativePath(img);
            if (clean !== img) changed = true;
            return clean;
        });
        media.projectGallery = newGallery;

        const newBrochure = toRelativePath(media.brochureUrl);
        if (newBrochure !== media.brochureUrl) {
            media.brochureUrl = newBrochure;
            changed = true;
        }

        if (changed) {
            p.media = media;
            p.markModified('media');
            await p.save();
            count++;
            console.log(`✅ Fixed dealer: ${p.projectName} (${p._id})`);
        }
    }
    console.log(`Fixed ${count} dealer records.`);
}

async function fixSoloImages() {
    const properties = await Solo.find();
    let count = 0;
    for (const p of properties) {
        let changed = false;
        const newImages = (p.images || []).map(img => {
            const clean = toRelativePath(img);
            if (clean !== img) changed = true;
            return clean;
        });

        if (changed) {
            p.images = newImages;
            await p.save();
            count++;
            console.log(`✅ Fixed solo: ${p.name} (${p._id})`);
        }
    }
    console.log(`Fixed ${count} solo records.`);
}

async function main() {
    const MONGO_URI = process.env.MONGODB_URI;
    if (!MONGO_URI) {
        console.error('ERROR: No db_url found in .env');
        process.exit(1);
    }
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB. Fixing image paths...\n');
    await fixDealerImages();
    await fixSoloImages();
    console.log('\nDone! Disconnect.');
    await mongoose.disconnect();
}

main().catch(console.error);
