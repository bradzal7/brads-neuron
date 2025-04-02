# Navigation Components

This document provides information about the navigation components used in Neuron Log.

## Overview

Neuron Log uses a combination of navigation components to provide intuitive application navigation. These components include a sidebar for main navigation, a top bar for contextual actions, and breadcrumbs for nested navigation.

## Navigation Components

### Sidebar

**File Location**: `app/components/Navigation/Sidebar.tsx`

**Purpose**: Provides the main application navigation menu with links to different sections.

**Key Features**:
- Responsive design (collapsible on mobile)
- Active route highlighting
- Consistent navigation structure
- Icon and text labels

**Component Structure**:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, CalendarIcon, ClockIcon, CogIcon } from '@heroicons/react/24/outline';

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Daily Log', href: '/dashboard/log', icon: CalendarIcon },
    { name: 'History', href: '/dashboard/history', icon: ClockIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        onClick={toggleMobileMenu}
        aria-controls="mobile-menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className="sr-only">Open sidebar menu</span>
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar for mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}>
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <span className="text-xl font-semibold text-gray-800">Neuron Log</span>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="mt-4 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={toggleMobileMenu}
                >
                  <item.icon className={`mr-4 h-6 w-6 ${
                    isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <span className="text-xl font-semibold text-gray-800">Neuron Log</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 py-4 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
```

### TopBar

**File Location**: `app/components/Navigation/TopBar.tsx`

**Purpose**: Provides contextual actions, search functionality, and user profile menu.

**Key Features**:
- User profile dropdown
- Current date display
- Responsive design
- Search functionality (future)

**Component Structure**:

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Auth/AuthContext';

export function TopBar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };
  
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      <div className="flex-1 px-4 flex items-center justify-between">
        <div className="flex-1 flex">
          <div className="hidden md:block">
            <p className="text-gray-500 text-sm">{formatDate()}</p>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id="user-menu"
                aria-expanded="false"
                aria-haspopup="true"
                onClick={toggleProfile}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>
            </div>
            
            {isProfileOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  {user?.email}
                </div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => router.push('/dashboard/settings')}
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={handleSignOut}
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Breadcrumbs

**File Location**: `app/components/Navigation/Breadcrumbs.tsx`

**Purpose**: Provides hierarchical navigation context for nested pages.

**Key Features**:
- Automatic route parsing
- Visual separation of path segments
- Home link integration
- Current page indication

**Component Structure**:

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface BreadcrumbSegment {
  name: string;
  href: string;
  isCurrent: boolean;
}

const getPathSegments = (pathname: string): BreadcrumbSegment[] => {
  const segments = pathname.split('/').filter(Boolean);
  
  // Handle special cases like dashboard as home
  if (segments.length > 0 && segments[0] === 'dashboard') {
    segments[0] = 'Dashboard';
  }
  
  return segments.map((segment, index) => {
    // Format segment name (capitalize, replace hyphens)
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Build href up to this point
    const href = `/${segments.slice(0, index + 1).join('/')}`.toLowerCase();
    
    // Check if this is the current (last) segment
    const isCurrent = index === segments.length - 1;
    
    return { name, href, isCurrent };
  });
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = getPathSegments(pathname);

  // If we're at the dashboard root, don't show breadcrumbs
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex py-3 px-5 text-gray-700 bg-gray-50 rounded-lg" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </li>
        
        {segments.map((segment, index) => (
          <li key={segment.href}>
            <div className="flex items-center">
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              {segment.isCurrent ? (
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {segment.name}
                </span>
              ) : (
                <Link 
                  href={segment.href} 
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  {segment.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### PageTabs

**File Location**: `app/components/Navigation/PageTabs.tsx`

**Purpose**: Provides tab-based navigation within a specific page section.

**Key Features**:
- Horizontal tab layout
- Active tab indication
- Click handlers for tab switching
- Consistent styling

**Component Structure**:

```tsx
'use client';

interface Tab {
  id: string;
  name: string;
}

interface PageTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function PageTabs({ tabs, activeTab, onChange, className = '' }: PageTabsProps) {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
```

## Navigation Patterns

### Main Navigation Flow

The main navigation flow in Neuron Log follows this pattern:

1. User signs in and is directed to the dashboard
2. Sidebar provides navigation to main sections
3. TopBar shows user profile and global actions
4. Within each section, breadcrumbs show hierarchical location

### Mobile Navigation

On mobile devices:

1. Sidebar is hidden by default
2. A hamburger menu button appears in the top-left
3. Tapping the hamburger menu opens a slide-out navigation panel
4. Menu automatically closes after selection

### Navigation State Management

Navigation state is managed using Next.js App Router:

```tsx
// Detecting the current route
import { usePathname } from 'next/navigation';

const pathname = usePathname();
const isActive = (href: string) => {
  return pathname === href || pathname.startsWith(`${href}/`);
};
```

### User Authentication Navigation

When handling authentication-related navigation:

```tsx
// Redirecting after sign out
const handleSignOut = async () => {
  await signOut();
  router.push('/signin');
};
```

## Integration with Layout

The navigation components are integrated with the application layout:

```tsx
// app/dashboard/layout.tsx
import { Sidebar } from '@/components/Navigation/Sidebar';
import { TopBar } from '@/components/Navigation/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
```

## Navigation SEO and Accessibility

Neuron Log navigation components follow these accessibility practices:

1. **Semantic HTML**: Using appropriate HTML elements like `<nav>` and `<ol>`
2. **ARIA Attributes**: Including `aria-label`, `aria-current`, and other ARIA roles
3. **Keyboard Navigation**: Ensuring all navigation items are keyboard accessible
4. **Screen Reader Support**: Providing text alternatives for icons
5. **Focus Management**: Handling focus appropriately when opening/closing menus

## Future Navigation Enhancements

Planned improvements for navigation components:

1. **Search Integration**: Adding global search functionality in TopBar
2. **Notifications**: Adding a notification system in the TopBar
3. **Recent Items**: Quick access to recently viewed logs
4. **Keyboard Shortcuts**: Adding keyboard navigation shortcuts
5. **Customizable Sidebar**: Allowing users to customize their sidebar links 