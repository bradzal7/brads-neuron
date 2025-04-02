# Components Documentation

This directory contains documentation for the various components used in Neuron Log. The components follow a modular design approach and are organized by functionality.

## Component Categories

| Category | Description |
|----------|-------------|
| [Authentication Components](./auth-components.md) | Components for user authentication (SignIn, SignUp) |
| [Layout Components](./layout-components.md) | Components for page layouts (Dashboard Layout, Protected Layout) |
| [Form Components](./form-components.md) | Components for the daily log form with various sections |
| [UI Components](./ui-components.md) | Reusable UI components (buttons, inputs, cards) |
| [Navigation Components](./navigation-components.md) | Components for navigation (Sidebar, TopBar) |

## Component Design Principles

Neuron Log components follow these design principles:

1. **Single Responsibility**: Each component focuses on a specific piece of functionality
2. **Modularity**: Components can be composed to create more complex features
3. **Reusability**: Common UI elements are abstracted into reusable components
4. **Client vs Server Components**: Strategic use of Next.js client and server components
5. **TypeScript Typing**: All components have proper TypeScript type definitions

## Component File Structure

Components typically follow this file structure:

```
/components
  /Auth
    SignIn.tsx
    SignUp.tsx
    AuthContext.tsx
  /Layout
    DashboardLayout.tsx
    ProtectedLayout.tsx
  /LogForm
    AccomplishedSection.tsx
    BlockersSection.tsx
    InProgressSection.tsx
    ...other form sections
  /UI
    Button.tsx
    TextInput.tsx
    Card.tsx
    ...other UI components
  /Navigation
    Sidebar.tsx
    TopBar.tsx
```

## Common Component Pattern

Most Neuron Log components follow this pattern:

```tsx
// Import statements
import { useState } from 'react';
import { ComponentProps } from '@/types';

// Type definitions
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

// Component definition
export function Button({ 
  variant = 'primary', 
  isLoading = false, 
  children, 
  ...props 
}: ButtonProps) {
  // Component logic here
  
  // Generate class names based on props
  const baseClasses = "px-4 py-2 rounded font-medium focus:outline-none";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100"
  };
  
  const className = `${baseClasses} ${variantClasses[variant]}`;
  
  // Return the component JSX
  return (
    <button 
      className={className} 
      disabled={isLoading} 
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
}
```

## Client vs Server Components

Neuron Log strategically uses both client and server components:

### Server Components

Used for:
- Data fetching directly from the database
- Top-level page components
- Static UI elements

### Client Components

Used for:
- Interactive UI elements
- Form handling
- State management

Client components are marked with the `'use client'` directive at the top of the file.

## Component Testing

Component testing is planned using React Testing Library and Jest. Test files will be co-located with the component files using the `.test.tsx` extension.

## Further Documentation

For more detailed information about specific component categories, please refer to the individual documentation files listed in the categories section above. 