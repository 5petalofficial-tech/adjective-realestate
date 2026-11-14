const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  // Non-fatal DNS configuration error
}

const run = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("MONGODB_URI not found in env");
            process.exit(1);
        }

        console.log("Connecting to database...");
        await mongoose.connect(uri, {
            dbName: process.env.MONGODB_DB_NAME || 'adjective'
        });
        
        console.log("Connected! Finding documents containing '/Projects/One10.webp'...");
        const solosCollection = mongoose.connection.db.collection('solos');

        // Query documents matching exactly
        const query = { images: '/Projects/One10.webp' };
        const matchingDocs = await solosCollection.find(query).toArray();

        if (matchingDocs.length === 0) {
            console.log("No documents containing '/Projects/One10.webp' were found. Database is already clean.");
            await mongoose.disconnect();
            process.exit(0);
        }

        console.log(`Found ${matchingDocs.length} matching document(s):`);
        matchingDocs.forEach(doc => {
            console.log(`- ID: ${doc._id}, Name: "${doc.name}", Images: ${JSON.stringify(doc.images)}`);
        });

        console.log("\nUpdating stale references...");
        const res = await solosCollection.updateMany(
            query,
            { $set: { "images.$[elem]": "https://placehold.co/800x500/5E6623/white?text=No+Image" } },
            { arrayFilters: [{ "elem": "/Projects/One10.webp" }] }
        );

        console.log(`Successfully updated ${res.modifiedCount} document(s).`);

        await mongoose.disconnect();
        console.log("Disconnected from database. Migration finished successfully!");
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
};

run();
