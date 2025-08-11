import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/auth';
import { z } from 'zod';

const checkEmailSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = checkEmailSchema.parse(body);

    const user = await getUserByEmail(email);
    
    if (user) {
      return NextResponse.json(
        { exists: true, message: 'Email already exists' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { exists: false, message: 'Email is available' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.error('Check email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
