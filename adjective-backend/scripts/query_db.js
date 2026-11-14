const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  console.warn("Unable to configure custom DNS servers.");
}


const run = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log("Connecting to:", uri);
        await mongoose.connect(uri, {
            dbName: process.env.MONGODB_DB_NAME || 'adjective'
        });
        console.log("Connected!");
        
        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        // Let's get counts
        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} documents`);
        }

        // Get sample properties
        const solos = await mongoose.connection.db.collection('solos').find().limit(3).toArray();
        console.log("\nSample solos:", JSON.stringify(solos.map(s => ({ _id: s._id, name: s.name, status: s.status, isVerifiedByAdmin: s.isVerifiedByAdmin })), null, 2));

        const dealers = await mongoose.connection.db.collection('builderprojects').find().limit(3).toArray();
        console.log("\nSample builderprojects:", JSON.stringify(dealers.map(d => ({ _id: d._id, projectName: d.projectName, isActive: d.isActive })), null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
