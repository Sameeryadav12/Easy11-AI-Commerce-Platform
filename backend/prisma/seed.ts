import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@easy11.com' },
    update: {},
    create: {
      email: 'admin@easy11.com',
      name: 'Admin User',
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyFK2ePRK1.2', // password: admin123
      role: 'ADMIN'
    }
  });
  console.log('✅ Created admin user:', admin.email);

  // Create test customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer@easy11.com' },
    update: {},
    create: {
      email: 'customer@easy11.com',
      name: 'Test Customer',
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyFK2ePRK1.2', // password: admin123
      role: 'CUSTOMER'
    }
  });
  console.log('✅ Created customer:', customer.email);

  // Create sample products
  const products = [
    {
      name: 'Smartphone Pro Max',
      description: 'Latest generation smartphone with advanced features',
      price: 999.99,
      category: 'electronics',
      stock: 50,
      rating: 4.5,
      tags: ['smartphone', 'android', '5g']
    },
    {
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones',
      price: 299.99,
      category: 'electronics',
      stock: 100,
      rating: 4.8,
      tags: ['headphones', 'wireless', 'audio']
    },
    {
      name: 'Designer Watch',
      description: 'Luxury automatic watch with leather strap',
      price: 599.99,
      category: 'accessories',
      stock: 30,
      rating: 4.7,
      tags: ['watch', 'luxury', 'timepiece']
    },
    {
      name: 'Laptop Ultra Slim',
      description: 'High-performance ultrabook for professionals',
      price: 1299.99,
      category: 'electronics',
      stock: 25,
      rating: 4.6,
      tags: ['laptop', 'ultrabook', 'portable']
    },
    {
      name: 'Running Shoes',
      description: 'Professional running shoes with cushion technology',
      price: 129.99,
      category: 'clothing',
      stock: 200,
      rating: 4.4,
      tags: ['shoes', 'running', 'sports']
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }
  console.log(`✅ Created ${products.length} products`);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

