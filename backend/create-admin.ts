import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('Password hashed successfully');
    
    // Delete existing admin if exists
    await prisma.user.deleteMany({
      where: { email: 'admin@easy11.com' }
    });
    console.log('Deleted existing admin user (if any)');
    
    // Create new admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@easy11.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('\nYou can now login with:');
    console.log('Email: admin@easy11.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

