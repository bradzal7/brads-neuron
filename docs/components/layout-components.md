# Layout Components

This document provides detailed information about the layout components used in Neuron Log.

## Overview

Layout components in Neuron Log create the structural framework for the application. They handle the overall page structure, navigation elements, responsive behavior, and provide consistent UI across different sections of the application.

## Components

### DashboardLayout

**File Location**: `app/dashboard/layout.tsx`

**Purpose**: Provides the main layout structure for all dashboard pages, including navigation and common UI elements.

**Key Features**:
- Responsive sidebar navigation
- Top navigation bar with user profile
- Consistent padding and structure
- Mobile-responsive design

**Component Structure**:

```tsx
// app/dashboard/layout.tsx
import { Sidebar } from '@/components/Navigation/Sidebar';
import { TopBar } from '@/components/Navigation/TopBar';
import { AuthProvider } from '@/components/Auth/AuthContext';
import ProtectedLayout from '@/components/Layout/ProtectedLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedLayout>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top navigation */}
            <TopBar />
            
            {/* Page content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </ProtectedLayout>
    </AuthProvider>
  );
}
```

### ProtectedLayout

**File Location**: `app/components/Layout/ProtectedLayout.tsx`

**Purpose**: Ensures that only authenticated users can access certain routes. Redirects unauthenticated users to the sign-in page.

**Key Features**:
- Authentication checking
- Loading state during authentication check
- Redirection for unauthenticated users

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

### RootLayout

**File Location**: `app/layout.tsx`

**Purpose**: Provides the base layout for the entire application, including global styles and metadata.

**Key Features**:
- HTML document structure
- Global styles
- Metadata for SEO
- Font loading

**Component Structure**:

```tsx
// app/layout.tsx
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Neuron Log - Your Second Brain',
  description: 'Personal knowledge management and daily reflection tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

### AuthLayout

**File Location**: `app/(auth)/layout.tsx`

**Purpose**: Provides layout for authentication pages like sign-in and sign-up.

**Key Features**:
- Clean, focused design for authentication forms
- Logo and branding elements
- Responsive design for various screen sizes

**Component Structure**:

```tsx
// app/(auth)/layout.tsx
import { Metadata } from 'next';
import { AuthProvider } from '@/components/Auth/AuthContext';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication - Neuron Log',
  description: 'Sign in or sign up to Neuron Log',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <span className="text-3xl font-bold text-blue-600">Neuron Log</span>
          </Link>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
```

### PageContainer

**File Location**: `app/components/Layout/PageContainer.tsx`

**Purpose**: Provides consistent margins, padding, and max-width for page content.

**Key Features**:
- Consistent spacing
- Responsive max-width
- Optional header section

**Component Structure**:

```tsx
// app/components/Layout/PageContainer.tsx
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export function PageContainer({ children, title, actions }: PageContainerProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      {(title || actions) && (
        <div className="flex justify-between items-center mb-6">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          )}
          {actions && (
            <div className="flex space-x-3">{actions}</div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
```

### Card

**File Location**: `app/components/UI/Card.tsx`

**Purpose**: Provides a consistent card container for content blocks.

**Key Features**:
- Consistent styling
- Optional header and footer sections
- Customizable padding

**Component Structure**:

```tsx
// app/components/UI/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ 
  children, 
  title, 
  footer, 
  className = '', 
  noPadding = false 
}: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}
```

## Layout Hierarchy

The layout components in Neuron Log form a hierarchical structure:

```
RootLayout
├── AuthLayout (for authentication routes)
│   ├── SignIn page
│   └── SignUp page
└── DashboardLayout (for authenticated routes)
    ├── PageContainer
    │   └── Card components
    ├── DailyLog page
    └── History page
```

## Responsive Design

All layout components in Neuron Log are designed to be responsive across different screen sizes:

### Desktop (>= 1024px)
- Full sidebar navigation
- Multi-column layouts where appropriate
- Comfortable spacing

### Tablet (768px - 1023px)
- Collapsed sidebar with icons
- Adapted spacing for medium screens
- Some layout adjustments for width

### Mobile (< 768px)
- Hidden sidebar with toggle menu
- Single column layouts
- Adjusted spacing for touch targets
- Simplified UI where necessary

## Key CSS Classes

Neuron Log uses Tailwind CSS classes for layout management:

| Class | Purpose |
|-------|---------|
| `flex` | Creates a flex container |
| `flex-col` | Sets flex direction to column |
| `grid` | Creates a grid container |
| `w-full` | Sets width to 100% |
| `max-w-[size]` | Sets maximum width |
| `h-screen` | Sets height to 100vh |
| `p-[size]` | Sets padding |
| `m-[size]` | Sets margin |
| `gap-[size]` | Sets gap between grid/flex items |
| `overflow-[value]` | Controls overflow behavior |

## Implementation Examples

### Basic Page Structure

```tsx
// Example page component using layout components
import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/UI/Card';

export default function ExamplePage() {
  return (
    <PageContainer title="Example Page">
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Section One">
          <p>Content for section one goes here.</p>
        </Card>
        
        <Card title="Section Two">
          <p>Content for section two goes here.</p>
        </Card>
      </div>
    </PageContainer>
  );
}
```

### Responsive Navigation

The `Sidebar` component (part of the DashboardLayout) includes responsive behavior:

```tsx
// Simplified example of responsive navigation
export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Toggle menu on mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <>
      {/* Mobile menu button - visible on small screens */}
      <button 
        className="md:hidden fixed top-4 left-4 z-20" 
        onClick={toggleMobileMenu}
      >
        <MenuIcon />
      </button>
      
      {/* Sidebar - different styles based on screen size */}
      <div className={`
        bg-white shadow-lg
        fixed md:static
        inset-y-0 left-0
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        transition duration-200 ease-in-out
        w-64 md:w-20 lg:w-64
        z-10
      `}>
        {/* Sidebar content */}
      </div>
    </>
  );
}
```

## Best Practices

When using or extending Neuron Log layout components:

1. **Maintain Hierarchy**: Follow the established component hierarchy
2. **Stay Responsive**: Test any changes across different screen sizes
3. **Use PageContainer**: Wrap page content in PageContainer for consistent spacing
4. **Leverage Cards**: Use Card components for content blocks that need visual separation
5. **Consider Composition**: Compose smaller components rather than creating large monolithic layouts
6. **Use TypeScript Props**: Define proper TypeScript interfaces for component props 