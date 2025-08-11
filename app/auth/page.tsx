'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInForm } from '@/components/sign-in-form';
import { SignUpForm } from '@/components/sign-up-form';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const router = useRouter();

  const handleAuthSuccess = (user: any) => {
    // Redirect based on user role
    if (user.role === 'manager') {
      router.push('/admin-dashboard');
    } else {
      router.push('/employee-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isSignIn ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isSignIn 
              ? 'Sign in to your account to continue'
              : 'Sign up to get started with your account'
            }
          </p>
        </div>

        {isSignIn ? (
          <SignInForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={() => setIsSignIn(false)}
          />
        ) : (
          <SignUpForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignIn={() => setIsSignIn(true)}
          />
        )}
      </div>
    </div>
  );
}
