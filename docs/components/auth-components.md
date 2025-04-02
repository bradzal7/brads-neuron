# Authentication Components

This document provides detailed information about the authentication components used in Neuron Log.

## Overview

The authentication system in Neuron Log consists of several React components that work together to provide a secure user authentication experience. These components leverage Supabase Auth for the backend authentication functionality.

## Components

### SignIn Component

**File Location**: `app/components/Auth/SignIn.tsx`

**Purpose**: Provides a form for existing users to sign in with their email and password.

**Key Features**:
- Email and password validation
- Error message handling
- Loading state during authentication
- Redirect to dashboard after successful login

**Component Structure**:

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In to Neuron Log</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex justify-center"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
```

### SignUp Component

**File Location**: `app/components/Auth/SignUp.tsx`

**Purpose**: Allows new users to create an account with their email and password.

**Key Features**:
- Email and password validation
- Password confirmation
- Error message handling
- Success message after signup
- Loading state during account creation

**Component Structure**:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          Success! Check your email for a confirmation link.
        </div>
      )}
      
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex justify-center"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/signin" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
```

### AuthContext

**File Location**: `app/components/Auth/AuthContext.tsx`

**Purpose**: Provides authentication state and methods to all components in the application through React Context.

**Key Features**:
- User authentication state management
- Session persistence
- Auth state change subscription
- Sign out functionality
- Loading state during auth operations

**Component Structure**:

```tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

// Define the shape of the auth context
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component to wrap the app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to get the initial session
    async function getInitialSession() {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      setIsLoading(false);
    }

    // Call the function
    getInitialSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Provide the auth context to children
  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### ProtectedLayout Component

**File Location**: `app/components/Layout/ProtectedLayout.tsx`

**Purpose**: Ensures that only authenticated users can access protected routes.

**Key Features**:
- Redirects unauthenticated users to the sign-in page
- Shows loading state while checking authentication
- Wraps protected content with authentication check

**Component Structure**:

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Auth/AuthContext';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authentication check is complete and there's no user, redirect to sign in
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // If there's a user, render the children (protected content)
  if (user) {
    return <>{children}</>;
  }

  // This return is needed for TypeScript, but should never be shown
  // as the useEffect will redirect before this renders
  return null;
}
```

## Authentication Flow

1. **User Registration**:
   - User visits the `/signup` page
   - User enters email and password 
   - SignUp component calls `supabase.auth.signUp()`
   - User receives confirmation email (when email confirmation is enabled)
   - User confirms email to complete registration

2. **User Sign In**:
   - User visits the `/signin` page
   - User enters email and password
   - SignIn component calls `supabase.auth.signInWithPassword()`
   - On success, user is redirected to the dashboard

3. **Session Management**:
   - AuthContext initializes by checking for an existing session
   - AuthContext subscribes to auth state changes to update the UI accordingly
   - Protected routes check for a valid session before rendering

4. **Sign Out**:
   - User clicks the sign out button
   - `signOut` function from AuthContext is called
   - Session is invalidated and user is redirected to the sign-in page

## Usage Examples

### Using the AuthContext

```tsx
'use client';

import { useAuth } from '@/components/Auth/AuthContext';

export function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h2>User Profile</h2>
      <p>Email: {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protecting a Route

```tsx
// app/dashboard/layout.tsx
import ProtectedLayout from '@/components/Layout/ProtectedLayout';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedLayout>
      {/* Dashboard layout structure */}
      <div className="dashboard-layout">
        {children}
      </div>
    </ProtectedLayout>
  );
}
```

## Security Considerations

- Passwords are never stored in the application state
- Authentication tokens are securely stored by Supabase
- Protected routes redirect unauthenticated users
- Client-side validation is complemented by server-side validation

## Future Enhancements

1. **Social Login**: Add options for Google, GitHub, etc.
2. **Two-Factor Authentication**: Enhance security with 2FA
3. **Password Recovery**: Implement a password reset flow
4. **Remember Me**: Add option to persist login across browser sessions
5. **Profile Management**: Allow users to update profile information 