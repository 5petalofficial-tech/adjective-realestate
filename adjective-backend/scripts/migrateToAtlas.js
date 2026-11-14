const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch (e) {}
const mongoose = require('mongoose');
require('dotenv').config();

const localUrl = 'mongodb://127.0.0.1:27017/adjective';
const atlasUrl = process.env.db_url;

async function migrate() {
  console.log("Connecting to Local MongoDB...");
  const localConn = await mongoose.createConnection(localUrl).asPromise();
  console.log("Connected to Local MongoDB!");

  // Fetch collections from local DB
  const solos = await localConn.collection('solos').find({}).toArray();
  const dealers = await localConn.collection('dealers').find({}).toArray();
  const users = await localConn.collection('users').find({}).toArray();
  const enquiries = await localConn.collection('enquiries').find({}).toArray();

  console.log(`Found in local DB: ${solos.length} Solos, ${dealers.length} Dealers, ${users.length} Users, ${enquiries.length} Enquiries`);

  await localConn.close();

  if (solos.length === 0 && dealers.length === 0 && users.length === 0) {
    console.log("Local database is empty. No documents to migrate.");
    process.exit(0);
  }

  console.log("\nConnecting to MongoDB Atlas...");
  const atlasConn = await mongoose.createConnection(atlasUrl).asPromise();
  console.log("Connected to MongoDB Atlas!");

  if (solos.length > 0) {
    await atlasConn.collection('solos').deleteMany({});
    await atlasConn.collection('solos').insertMany(solos);
    console.log(`✅ Migrated ${solos.length} Solos to Atlas`);
  }

  if (dealers.length > 0) {
    await atlasConn.collection('dealers').deleteMany({});
    await atlasConn.collection('dealers').insertMany(dealers);
    console.log(`✅ Migrated ${dealers.length} Dealers to Atlas`);
  }

  if (users.length > 0) {
    await atlasConn.collection('users').deleteMany({});
    await atlasConn.collection('users').insertMany(users);
    console.log(`✅ Migrated ${users.length} Users to Atlas`);
  }

  if (enquiries.length > 0) {
    await atlasConn.collection('enquiries').deleteMany({});
    await atlasConn.collection('enquiries').insertMany(enquiries);
    console.log(`✅ Migrated ${enquiries.length} Enquiries to Atlas`);
  }

  await atlasConn.close();
  console.log("\n🎉 Migration completed successfully!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
