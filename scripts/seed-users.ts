import 'dotenv/config';
import { db } from '../lib/db';
import { users } from '../lib/schema';
import { hashPassword } from '../lib/auth';

async function seedUsers() {
  try {
    console.log('🌱 Seeding users...');

    // Create a manager user
    const managerPassword = await hashPassword('manager123');
    await db.insert(users).values({
      email: 'manager@company.com',
      password: managerPassword,
      firstName: 'Admin',
      lastName: 'Manager',
      role: 'manager',
    });

    // Create a member user
    const memberPassword = await hashPassword('member123');
    await db.insert(users).values({
      email: 'member@company.com',
      password: memberPassword,
      firstName: 'John',
      lastName: 'Employee',
      role: 'member',
    });

    console.log('✅ Users seeded successfully!');
    console.log('Manager: manager@company.com / manager123');
    console.log('Member: member@company.com / member123');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    process.exit(0);
  }
}

seedUsers();
