const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function initDatabase() {
  try {
    // Create admin user if it doesn't exist
    let admin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });
    
    if (!admin) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      admin = await prisma.admin.create({
        data: {
          username: 'admin',
          passwordHash: adminPassword,
          role: 'admin'
        }
      });
      console.log('Admin user created:', admin.username);
    } else {
      console.log('Admin user already exists:', admin.username);
    }

    // Create sample categories
    const categories = [
      { name: 'Bihar Specials', isActive: true },
      { name: 'Parathas & Rolls', isActive: true },
      { name: 'North Indian Classics', isActive: true },
      { name: 'Sides & Extras', isActive: true },
      { name: 'Desserts & Drinks', isActive: true }
    ];

    const createdCategories = [];
    for (const category of categories) {
      const createdCategory = await prisma.category.create({
        data: category
      });
      createdCategories.push(createdCategory);
      console.log('Category created:', createdCategory.name);
    }

    // Create sample menu items
    const menuItems = [
      // Bihar Specials
      {
        categoryId: createdCategories[0].id,
        name: 'Litti Chokha (Plate)',
        description: 'Traditional roasted litti served with spiced chokha and ghee.',
        price: 149,
        isAvailable: true,
        isFeatured: true
      },
      {
        categoryId: createdCategories[0].id,
        name: 'Sattu Paratha (2 pcs)',
        description: 'Stuffed parathas with sattu, served with curd and pickle.',
        price: 119,
        isAvailable: true,
        isFeatured: false
      },
      {
        categoryId: createdCategories[0].id,
        name: 'Dal Bati Churma (Veg)',
        description: 'Classic dal with bati and sweet churma.',
        price: 199,
        isAvailable: true,
        isFeatured: false
      },
      
      // Parathas & Rolls
      {
        categoryId: createdCategories[1].id,
        name: 'Aloo Paratha',
        description: 'Stuffed potato paratha with butter.',
        price: 89,
        isAvailable: true,
        isFeatured: false
      },
      {
        categoryId: createdCategories[1].id,
        name: 'Paneer Paratha',
        description: 'Cottage cheese stuffed paratha, served with raita.',
        price: 119,
        isAvailable: true,
        isFeatured: false
      },
      
      // North Indian Classics
      {
        categoryId: createdCategories[2].id,
        name: 'Butter Chicken (Half)',
        description: 'Creamy tomato-based chicken curry.',
        price: 229,
        isAvailable: true,
        isFeatured: true
      },
      {
        categoryId: createdCategories[2].id,
        name: 'Paneer Butter Masala',
        description: 'Cottage cheese in rich gravy.',
        price: 199,
        isAvailable: true,
        isFeatured: false
      },
      
      // Sides & Extras
      {
        categoryId: createdCategories[3].id,
        name: 'Raita',
        description: 'Cooling cucumber raita.',
        price: 39,
        isAvailable: true,
        isFeatured: false
      },
      {
        categoryId: createdCategories[3].id,
        name: 'Roasted Papad',
        description: 'Crispy roasted papad.',
        price: 19,
        isAvailable: true,
        isFeatured: false
      },
      
      // Desserts & Drinks
      {
        categoryId: createdCategories[4].id,
        name: 'Rabri',
        description: 'Rich condensed milk dessert.',
        price: 79,
        isAvailable: true,
        isFeatured: false
      },
      {
        categoryId: createdCategories[4].id,
        name: 'Masala Chai',
        description: 'Spiced tea.',
        price: 29,
        isAvailable: true,
        isFeatured: false
      }
    ];

    for (const item of menuItems) {
      const createdItem = await prisma.menuItem.create({
        data: item
      });
      console.log('Menu item created:', createdItem.name);
    }

    // Create sample site content
    const siteContents = [
      {
        key: 'homepage_banner_text',
        value: 'Experience the taste of authentic Bihar'
      },
      {
        key: 'vision_text',
        value: 'To serve authentic Bihari cuisine with love and tradition'
      },
      {
        key: 'footer_slogan',
        value: 'BHARAT 28 - Food Designed Around You'
      },
      {
        key: 'availability_notice',
        value: 'More dishes coming soon!'
      }
    ];

    for (const content of siteContents) {
      const createdContent = await prisma.siteContent.create({
        data: content
      });
      console.log('Site content created:', createdContent.key);
    }

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();