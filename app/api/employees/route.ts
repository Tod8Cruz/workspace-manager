import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employees, employers } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// GET /api/employees - Get all employees with employer info
export async function GET() {
  try {
    const allEmployees = await db
      .select({
        id: employees.id,
        firstName: employees.firstName,
        lastName: employees.lastName,
        email: employees.email,
        phone: employees.phone,
        position: employees.position,
        department: employees.department,
        hireDate: employees.hireDate,
        salary: employees.salary,
        isActive: employees.isActive,
        createdAt: employees.createdAt,
        updatedAt: employees.updatedAt,
        employer: {
          id: employers.id,
          name: employers.name,
          companyName: employers.companyName,
        },
      })
      .from(employees)
      .leftJoin(employers, eq(employees.employerId, employers.id));

    return NextResponse.json(allEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST /api/employees - Create a new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      employerId,
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      hireDate,
      salary,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    const newEmployee = await db.insert(employees).values({
      employerId,
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      hireDate,
      salary,
    }).returning();

    return NextResponse.json(newEmployee[0], { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
} 