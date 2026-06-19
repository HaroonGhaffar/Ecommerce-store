require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  {
    title: 'Classic Cotton T-Shirt',
    description: 'Soft everyday cotton tee with a modern fit and breathable fabric.',
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    price: 24.99,
    stock: 25,
  },
  {
    title: 'Wireless Headphones',
    description: 'Noise-isolating wireless headphones with deep bass and long battery life.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1518441902117-f0a1c2f9c4c9?auto=format&fit=crop&w=900&q=80',
    price: 79.99,
    stock: 18,
  },
  {
    title: 'Smart Fitness Watch',
    description: 'Track your steps, heart rate, and workouts with a bright AMOLED display.',
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    price: 129.0,
    stock: 12,
  },
  {
    title: 'Leather Backpack',
    description: 'Durable everyday backpack with a premium leather finish and laptop sleeve.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    price: 94.5,
    stock: 14,
  },
  {
    title: 'Minimal Desk Lamp',
    description: 'Compact LED desk lamp with adjustable brightness for a clean workspace.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    price: 39.95,
    stock: 20,
  },
];

async function seedProducts() {
  await connectDB();

  await Product.deleteMany({
    title: { $in: products.map((product) => product.title) },
  });

  const inserted = await Product.insertMany(products);
  console.log(`Seeded ${inserted.length} products.`);
  process.exit(0);
}

seedProducts().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
