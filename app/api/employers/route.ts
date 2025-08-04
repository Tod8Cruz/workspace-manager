import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employers } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// GET /api/employers - Get all employers
export async function GET() {
  try {
    const allEmployers = await db.select().from(employers);
    return NextResponse.json(allEmployers);
  } catch (error) {
    console.error('Error fetching employers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employers' },
      { status: 500 }
    );
  }
}

// POST /api/employers - Create a new employer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, address, companyName, industry, employeeCount } = body;

    // Validate required fields
    if (!name || !email || !companyName) {
      return NextResponse.json(
        { error: 'Name, email, and company name are required' },
        { status: 400 }
      );
    }

    const newEmployer = await db.insert(employers).values({
      name,
      email,
      phone,
      address,
      companyName,
      industry,
      employeeCount,
    }).returning();

    return NextResponse.json(newEmployer[0], { status: 201 });
  } catch (error) {
    console.error('Error creating employer:', error);
    return NextResponse.json(
      { error: 'Failed to create employer' },
      { status: 500 }
    );
  }
} 