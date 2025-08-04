import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employers } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// GET /api/employers/[id] - Get a specific employer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid employer ID' },
        { status: 400 }
      );
    }

    const employer = await db
      .select()
      .from(employers)
      .where(eq(employers.id, id));

    if (employer.length === 0) {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(employer[0]);
  } catch (error) {
    console.error('Error fetching employer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employer' },
      { status: 500 }
    );
  }
}

// PUT /api/employers/[id] - Update a specific employer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid employer ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, phone, address, companyName, industry, employeeCount, isActive } = body;

    const updatedEmployer = await db
      .update(employers)
      .set({
        name,
        email,
        phone,
        address,
        companyName,
        industry,
        employeeCount,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(employers.id, id))
      .returning();

    if (updatedEmployer.length === 0) {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEmployer[0]);
  } catch (error) {
    console.error('Error updating employer:', error);
    return NextResponse.json(
      { error: 'Failed to update employer' },
      { status: 500 }
    );
  }
}

// DELETE /api/employers/[id] - Delete a specific employer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid employer ID' },
        { status: 400 }
      );
    }

    const deletedEmployer = await db
      .delete(employers)
      .where(eq(employers.id, id))
      .returning();

    if (deletedEmployer.length === 0) {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Employer deleted successfully' });
  } catch (error) {
    console.error('Error deleting employer:', error);
    return NextResponse.json(
      { error: 'Failed to delete employer' },
      { status: 500 }
    );
  }
} 