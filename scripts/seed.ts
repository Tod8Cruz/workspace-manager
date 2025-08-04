import { db } from '../lib/db';
import { employers, employees } from '../lib/schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data
    await db.delete(employees);
    await db.delete(employers);

    // Insert sample employers
    const sampleEmployers = await db.insert(employers).values([
      {
        name: 'John Smith',
        email: 'john.smith@techcorp.com',
        phone: '+1-555-0123',
        address: '123 Tech Street, Silicon Valley, CA 94025',
        companyName: 'TechCorp Solutions',
        industry: 'Technology',
        employeeCount: 150,
        isActive: true,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@innovate.com',
        phone: '+1-555-0456',
        address: '456 Innovation Ave, Austin, TX 73301',
        companyName: 'Innovate Labs',
        industry: 'Research & Development',
        employeeCount: 75,
        isActive: true,
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@globaltech.com',
        phone: '+1-555-0789',
        address: '789 Global Blvd, New York, NY 10001',
        companyName: 'GlobalTech Industries',
        industry: 'Manufacturing',
        employeeCount: 300,
        isActive: true,
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@startup.com',
        phone: '+1-555-0321',
        address: '321 Startup Lane, San Francisco, CA 94102',
        companyName: 'Startup Ventures',
        industry: 'Finance',
        employeeCount: 25,
        isActive: true,
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@consulting.com',
        phone: '+1-555-0654',
        address: '654 Consulting Court, Chicago, IL 60601',
        companyName: 'Wilson Consulting Group',
        industry: 'Consulting',
        employeeCount: 50,
        isActive: true,
      },
    ]).returning();

    console.log(`✅ Inserted ${sampleEmployers.length} employers`);

    // Insert sample employees
    const sampleEmployees = await db.insert(employees).values([
      {
        employerId: sampleEmployers[0].id,
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@techcorp.com',
        phone: '+1-555-0001',
        position: 'Senior Software Engineer',
        department: 'Engineering',
        hireDate: new Date('2022-01-15'),
        salary: 95000,
        isActive: true,
      },
      {
        employerId: sampleEmployers[0].id,
        firstName: 'Bob',
        lastName: 'Miller',
        email: 'bob.miller@techcorp.com',
        phone: '+1-555-0002',
        position: 'Product Manager',
        department: 'Product',
        hireDate: new Date('2022-03-01'),
        salary: 110000,
        isActive: true,
      },
      {
        employerId: sampleEmployers[1].id,
        firstName: 'Carol',
        lastName: 'Taylor',
        email: 'carol.taylor@innovate.com',
        phone: '+1-555-0003',
        position: 'Research Scientist',
        department: 'R&D',
        hireDate: new Date('2021-11-10'),
        salary: 120000,
        isActive: true,
      },
      {
        employerId: sampleEmployers[1].id,
        firstName: 'Daniel',
        lastName: 'Anderson',
        email: 'daniel.anderson@innovate.com',
        phone: '+1-555-0004',
        position: 'Lab Technician',
        department: 'R&D',
        hireDate: new Date('2023-02-20'),
        salary: 65000,
        isActive: true,
      },
      {
        employerId: sampleEmployers[2].id,
        firstName: 'Eva',
        lastName: 'Garcia',
        email: 'eva.garcia@globaltech.com',
        phone: '+1-555-0005',
        position: 'Operations Manager',
        department: 'Operations',
        hireDate: new Date('2020-08-15'),
        salary: 85000,
        isActive: true,
      },
      {
        employerId: sampleEmployers[2].id,
        firstName: 'Frank',
        lastName: 'Martinez',
        email: 'frank.martinez@globaltech.com',
        phone: '+1-555-0006',
        position: 'Quality Assurance Specialist',
        department: 'Quality',
        hireDate: new Date('2023-01-10'),
        salary: 70000,
        isActive: true,
      },
      {
        employerId: sampleEmployers[3].id,
        firstName: 'Grace',
        lastName: 'Lee',
        email: 'grace.lee@startup.com',
        phone: '+1-555-0007',
        position: 'Financial Analyst',
        department: 'Finance',
        hireDate: new Date('2023-06-01'),
        salary: 80000,
        isActive: true,
      },
      {
        employerId: sampleEmployers[4].id,
        firstName: 'Henry',
        lastName: 'Thompson',
        email: 'henry.thompson@consulting.com',
        phone: '+1-555-0008',
        position: 'Senior Consultant',
        department: 'Consulting',
        hireDate: new Date('2021-04-15'),
        salary: 95000,
        isActive: true,
      },
      {
        employerId: sampleEmployers[4].id,
        firstName: 'Iris',
        lastName: 'White',
        email: 'iris.white@consulting.com',
        phone: '+1-555-0009',
        position: 'Junior Consultant',
        department: 'Consulting',
        hireDate: new Date('2023-09-01'),
        salary: 65000,
        isActive: true,
      },
      {
        employerId: sampleEmployers[0].id,
        firstName: 'Jack',
        lastName: 'Clark',
        email: 'jack.clark@techcorp.com',
        phone: '+1-555-0010',
        position: 'DevOps Engineer',
        department: 'Engineering',
        hireDate: new Date('2022-07-15'),
        salary: 90000,
        isActive: true,
      },
    ]).returning();

    console.log(`✅ Inserted ${sampleEmployees.length} employees`);
    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }); 