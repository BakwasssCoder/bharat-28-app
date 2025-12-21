const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    // Create tables by running a simple query
    await prisma.$queryRaw`PRAGMA foreign_keys = OFF;`;
    
    // Create Admin table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Admin" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "username" TEXT NOT NULL UNIQUE,
        "passwordHash" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'admin',
        "lastLogin" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `;
    
    // Create Category table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL UNIQUE,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `;
    
    // Create MenuItem table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "MenuItem" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "categoryId" INTEGER NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" REAL NOT NULL,
        "isAvailable" BOOLEAN NOT NULL DEFAULT true,
        "imageUrl" TEXT,
        "isFeatured" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `;
    
    // Create MediaAsset table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "MediaAsset" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "fileUrl" TEXT NOT NULL,
        "uploadedBy" INTEGER NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create SiteContent table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "SiteContent" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "key" TEXT NOT NULL UNIQUE,
        "value" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `;
    
    // Create Order table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "orderNumber" TEXT NOT NULL UNIQUE,
        "totalAmount" REAL NOT NULL,
        "paymentMode" TEXT NOT NULL,
        "orderSource" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `;
    
    // Create OrderItem table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "orderId" INTEGER NOT NULL,
        "menuItemId" INTEGER NOT NULL,
        "quantity" INTEGER NOT NULL,
        "priceAtSale" REAL NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY ("menuItemId") REFERENCES "MenuItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `;
    
    // Create DailySalesSnapshot table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "DailySalesSnapshot" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "date" DATETIME NOT NULL UNIQUE,
        "totalOrders" INTEGER NOT NULL,
        "totalRevenue" REAL NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create indexes
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Admin_username_key" ON "Admin"("username");`;
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");`;
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "SiteContent_key_key" ON "SiteContent"("key");`;
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber");`;
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "DailySalesSnapshot_date_key" ON "DailySalesSnapshot"("date");`;
    
    await prisma.$queryRaw`PRAGMA foreign_keys = ON;`;
    
    console.log('Database tables created successfully!');
    
    // Now create the admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        passwordHash: adminPassword,
        role: 'admin'
      }
    });
    console.log('Admin user created:', admin.username);
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();