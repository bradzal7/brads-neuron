# State Management

This document outlines the state management approach used in Neuron Log, covering how application state is handled across different components and features.

## Overview

Neuron Log uses a hybrid state management approach:

1. **React Hooks** - For local component state
2. **Context API** - For shared application state
3. **URL/Router State** - For navigation and UI state persistence
4. **Supabase** - For server state/data storage

## State Categories

### Authentication State

Authentication state is managed through a custom AuthContext:

```typescript
// app/components/Auth/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initialize authentication state
    async function getInitialSession() {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      setIsLoading(false);
    }

    getInitialSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Form State

The daily log form uses a combination of React's `useState` and custom hooks:

```typescript
// app/dashboard/log/LogForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/Auth/AuthContext';
import { DailyLog, LogData } from '@/types';

// Initial state for a new log
const initialLogData: LogData = {
  accomplished: [],
  inProgress: [],
  blockers: [],
  decisions: [],
  tomorrow: [],
  thoughts: '',
  cleanup: { workspace: false, email: false, calendar: false },
  shutdown: false
};

export function LogForm({ date, existingLog }: { date: string, existingLog?: DailyLog }) {
  const { user } = useAuth();
  const [logData, setLogData] = useState<LogData>(existingLog?.log_data || initialLogData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Form update handlers for each section
  const updateAccomplished = (items: string[]) => {
    setLogData(prev => ({ ...prev, accomplished: items }));
  };
  
  // ... other update handlers

  // Save log to Supabase
  const saveLog = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      const { error } = await supabase
        .from('daily_logs')
        .upsert({
          id: existingLog?.id,
          user_id: user.id,
          date,
          log_data: logData,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving log:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // Form JSX with sections and buttons
  );
}
```

### URL/Router State

Next.js App Router is used for navigation state, handling:

1. Current view/page
2. Selected log date
3. Query parameters for filtering

```typescript
// Example: Accessing and updating URL state
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function HistoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentFilter = searchParams.get('filter') || 'all';
  
  const updateFilter = (newFilter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('filter', newFilter);
    router.push(`/dashboard/history?${params.toString()}`);
  };
  
  return (
    // Filter UI
  );
}
```

## State Management Patterns

### Controlled Components

Form inputs are implemented as controlled components:

```typescript
// Example: Text input component
export function TextInput({ value, onChange, ...props }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 w-full"
      {...props}
    />
  );
}
```

### Lifting State Up

When multiple components need access to the same state, we lift the state to their closest common ancestor:

```typescript
function LogSection() {
  const [sectionData, setSectionData] = useState([]);
  
  return (
    <div>
      <SectionHeader data={sectionData} />
      <SectionContent 
        data={sectionData} 
        onUpdate={(newData) => setSectionData(newData)} 
      />
      <SectionFooter data={sectionData} />
    </div>
  );
}
```

### Custom Hooks

Custom hooks encapsulate reusable stateful logic:

```typescript
// Example: Hook for managing editable list items
function useEditableList(initialItems = []) {
  const [items, setItems] = useState(initialItems);
  
  const addItem = (item) => {
    setItems([...items, item]);
  };
  
  const updateItem = (index, newValue) => {
    const newItems = [...items];
    newItems[index] = newValue;
    setItems(newItems);
  };
  
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  return {
    items,
    addItem,
    updateItem,
    removeItem,
    setItems
  };
}
```

## Auto-Save Implementation

The log form implements auto-save functionality:

```typescript
// Auto-save functionality excerpt
useEffect(() => {
  // Skip initial render and don't save if already saving
  if (isInitialRender.current || isSaving) {
    isInitialRender.current = false;
    return;
  }
  
  // Debounce save operation
  const timerId = setTimeout(() => {
    saveLog();
  }, 2000);
  
  return () => clearTimeout(timerId);
}, [logData]);
```

## Future State Management Considerations

As the application grows, we plan to:

1. **Implement React Query** - For more sophisticated server state management
2. **Add Optimistic Updates** - For improved UX during data mutations
3. **Consider Zustand** - For complex client-side state management
4. **Add Form Validation Library** - Such as Zod or Yup for more robust form handling
5. **Implement Undo/Redo** - For better user experience when editing logs 