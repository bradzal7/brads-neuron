# UI Components

This document provides information about the reusable UI components used throughout Neuron Log.

## Overview

Neuron Log uses a set of consistent, reusable UI components to maintain visual coherence and reduce code duplication. These components are built with Tailwind CSS and follow a design system approach.

## Core UI Components

### Button

**File Location**: `app/components/UI/Button.tsx`

**Purpose**: Provides a consistent button component with various styles.

**Key Features**:
- Multiple variants (primary, secondary, outline)
- Loading state
- Disabled state
- Consistent styling

**Component Structure**:

```tsx
'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  // Base classes
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-colors";
  
  // Size classes
  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3"
  };
  
  // Variant classes
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
  };
  
  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";
  
  // Disabled classes
  const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${disabledClasses} ${className}`;
  
  return (
    <button className={buttonClasses} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
}
```

**Usage Example**:

```tsx
<Button>Default Button</Button>
<Button variant="secondary" size="lg">Large Secondary Button</Button>
<Button variant="outline" isLoading={true}>Loading Button</Button>
<Button disabled>Disabled Button</Button>
<Button fullWidth>Full Width Button</Button>
```

### Card

**File Location**: `app/components/UI/Card.tsx`

**Purpose**: Provides a consistent container for content blocks.

**Key Features**:
- Optional title and footer
- Customizable padding
- Consistent styling

**Component Structure**:

```tsx
'use client';

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
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
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

**Usage Example**:

```tsx
<Card title="User Profile">
  <p>Profile content goes here</p>
</Card>

<Card 
  title="Actions" 
  footer={<Button>Save Changes</Button>}
>
  <p>Main content here</p>
</Card>

<Card noPadding className="mt-4">
  <img src="/full-width-image.jpg" alt="Full width" />
</Card>
```

### TextInput

**File Location**: `app/components/UI/TextInput.tsx`

**Purpose**: Provides a consistent text input component.

**Key Features**:
- Optional label
- Error message handling
- Accessibility support

**Component Structure**:

```tsx
'use client';

import { forwardRef } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id: string;
  helpText?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, id, helpText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={id}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
          {...props}
        />
        
        {helpText && !error && (
          <p id={`${id}-help`} className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}
        
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
```

**Usage Example**:

```tsx
<TextInput 
  id="email" 
  label="Email Address" 
  type="email" 
  helpText="We'll never share your email"
/>

<TextInput 
  id="password" 
  label="Password" 
  type="password" 
  error="Password must be at least 8 characters" 
/>
```

### Textarea

**File Location**: `app/components/UI/Textarea.tsx`

**Purpose**: Provides a consistent textarea component.

**Key Features**:
- Auto-expanding height (optional)
- Character count
- Similar API to TextInput

**Component Structure**:

```tsx
'use client';

import { forwardRef, useState, useEffect, useRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  id: string;
  helpText?: string;
  showCount?: boolean;
  autoExpand?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, helpText, showCount, autoExpand = false, className = '', ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [count, setCount] = useState(props.value?.toString().length || 0);
    
    // Set up combined ref
    const setRefs = (element: HTMLTextAreaElement) => {
      textareaRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };
    
    // Update count when value changes
    useEffect(() => {
      if (showCount) {
        setCount(props.value?.toString().length || 0);
      }
    }, [props.value, showCount]);
    
    // Auto-expand height
    useEffect(() => {
      if (autoExpand && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [props.value, autoExpand]);
    
    // Handle onChange to update count
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCount) {
        setCount(e.target.value.length);
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <textarea
          ref={setRefs}
          id={id}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
          {...props}
        />
        
        <div className="flex justify-between mt-1">
          {(helpText && !error) && (
            <p id={`${id}-help`} className="text-sm text-gray-500">
              {helpText}
            </p>
          )}
          
          {error && (
            <p id={`${id}-error`} className="text-sm text-red-600">
              {error}
            </p>
          )}
          
          {showCount && (
            <p className={`text-xs ${error ? 'text-red-500' : 'text-gray-400'} ml-auto`}>
              {count} characters
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
```

**Usage Example**:

```tsx
<Textarea 
  id="notes" 
  label="Notes" 
  rows={4} 
  showCount 
  autoExpand
/>

<Textarea 
  id="description" 
  label="Description" 
  helpText="Briefly describe your project" 
  maxLength={500}
  showCount
/>
```

### EditableList

**File Location**: `app/components/UI/EditableList.tsx`

**Purpose**: Provides a list component that can be edited.

**Key Features**:
- Add, remove items
- Empty state handling
- Consistent styling

**Component Structure**:

```tsx
'use client';

import { useState } from 'react';

interface EditableListProps {
  items: string[];
  onAdd?: (item: string) => void;
  onRemove: (index: number) => void;
  emptyMessage?: string;
  maxItems?: number;
  showAddForm?: boolean;
  placeholder?: string;
}

export function EditableList({
  items,
  onAdd,
  onRemove,
  emptyMessage = "No items",
  maxItems,
  showAddForm = false,
  placeholder = "Add new item..."
}: EditableListProps) {
  const [newItem, setNewItem] = useState('');
  
  const handleAddItem = () => {
    if (!newItem.trim() || !onAdd) return;
    onAdd(newItem.trim());
    setNewItem('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };
  
  const isMaxItems = maxItems !== undefined && items.length >= maxItems;

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="text-gray-500 italic text-sm">{emptyMessage}</li>
        ) : (
          items.map((item, index) => (
            <li key={index} className="flex items-center bg-gray-50 p-2 rounded border border-gray-200">
              <span className="flex-1">{item}</span>
              <button
                onClick={() => onRemove(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove item"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </li>
          ))
        )}
      </ul>
      
      {showAddForm && onAdd && !isMaxItems && (
        <div className="flex">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleAddItem}
            disabled={!newItem.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      )}
      
      {isMaxItems && (
        <p className="text-sm text-amber-600">
          Maximum of {maxItems} items reached
        </p>
      )}
    </div>
  );
}
```

**Usage Example**:

```tsx
const [items, setItems] = useState(['Item 1', 'Item 2']);

const handleAdd = (item: string) => {
  setItems([...items, item]);
};

const handleRemove = (index: number) => {
  setItems(items.filter((_, i) => i !== index));
};

<EditableList 
  items={items}
  onAdd={handleAdd}
  onRemove={handleRemove}
  showAddForm
  emptyMessage="No items added yet"
  maxItems={10}
/>
```

### LoadingSpinner

**File Location**: `app/components/UI/LoadingSpinner.tsx`

**Purpose**: Provides a consistent loading indicator.

**Key Features**:
- Size variations
- Color customization
- Accessible

**Component Structure**:

```tsx
'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className = ''
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const colorMap = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-400'
  };
  
  return (
    <div className={`${className}`} role="status" aria-label="Loading">
      <svg 
        className={`animate-spin ${sizeMap[size]} ${colorMap[color]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  );
}
```

**Usage Example**:

```tsx
<LoadingSpinner size="sm" />
<LoadingSpinner color="white" />
<LoadingSpinner size="lg" color="gray" className="mx-auto" />
```

### Alert

**File Location**: `app/components/UI/Alert.tsx`

**Purpose**: Provides a consistent alert/notification component.

**Key Features**:
- Multiple variants (info, success, warning, error)
- Optional dismissible functionality
- Icon integration

**Component Structure**:

```tsx
'use client';

import { useState } from 'react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  className?: string;
}

export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  className = ''
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };
  
  const iconMap = {
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  };
  
  return (
    <div className={`border rounded-md p-4 ${variantStyles[variant]} ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          {iconMap[variant]}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className={`text-sm ${title ? 'mt-2' : ''}`}>
            {children}
          </div>
        </div>
        {dismissible && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 inline-flex text-current hover:bg-opacity-10 hover:bg-black focus:outline-none"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
```

**Usage Example**:

```tsx
<Alert>
  This is a default info alert
</Alert>

<Alert variant="success" title="Success!">
  Your changes have been saved successfully.
</Alert>

<Alert variant="warning" dismissible>
  Your session will expire in 5 minutes.
</Alert>

<Alert variant="error" title="Error">
  There was a problem processing your request.
</Alert>
```

## Design Principles

The UI components in Neuron Log follow these design principles:

1. **Consistency**: All components share a common design language
2. **Composability**: Components can be combined to create more complex interfaces
3. **Accessibility**: Components include ARIA attributes and keyboard navigation
4. **Customization**: Components accept props for customization while maintaining consistency
5. **Type Safety**: All components have TypeScript interfaces for props

## Styling Approach

Neuron Log uses a utility-first approach with Tailwind CSS:

- **No CSS Files**: Components use Tailwind utility classes directly
- **Dynamic Classes**: Classes are applied conditionally based on props
- **Class Composition**: Complex components compose classes from simpler ones
- **Responsive Design**: All components adapt to different screen sizes

## Best Practices for Using UI Components

1. **Prefer Existing Components**: Use existing UI components instead of creating new ones
2. **Extend With Props**: When customization is needed, use props rather than modifying the component
3. **Maintain Consistency**: Keep the visual language consistent across the application
4. **Use TypeScript**: Leverage TypeScript interfaces to ensure correct usage
5. **Test Responsively**: Ensure components work across all viewport sizes

## Component Documentation Template

When creating new UI components, follow this documentation template:

```
## ComponentName

**File Location**: `path/to/Component.tsx`

**Purpose**: Brief description of the component's purpose

**Key Features**:
- Feature 1
- Feature 2
- Feature 3

**Component Structure**:
```tsx
// Code snippet
```

**Usage Example**:
```tsx
// Example usage
``` 