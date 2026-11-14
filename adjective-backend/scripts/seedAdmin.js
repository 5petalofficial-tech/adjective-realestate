const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch (e) { }
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/modules/users/user.model');
require('dotenv').config();

const dbUrl = process.env.MONGODB_URI ;

async function seedAdmin() {
  try {
    console.log(`Connecting to database: ${dbUrl}...`);
    await mongoose.connect(dbUrl);

    const adminEmail = 'admin@adjective.com';
    const adminPassword = 'adminpassword123';

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      existingAdmin.fullName = existingAdmin.fullName || 'System Admin';
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.isEmailVerified = true;
      existingAdmin.status = 'active';
      await existingAdmin.save();
      console.log('\n==================================================');
      console.log('🎉 Existing Admin User Password Reset Successfully!');
      console.log(`📧 Email:    ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log('==================================================\n');
    } else {
      const adminUser = new User({
        fullName: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '1234567890',
        role: 'admin',
        isEmailVerified: true,
        status: 'active',
      });

      await adminUser.save();
      console.log('\n==================================================');
      console.log('🎉 Admin User Seeded Successfully!');
      console.log(`📧 Email:    ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log('==================================================\n');
    }

  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();