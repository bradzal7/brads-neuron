# Daily Log Feature

## Overview

The Daily Log is a core feature of Neuron Log that enables users to capture structured reflections on their day. It's designed around the concept of a "daily shutdown" ritual, where users document their accomplishments, ongoing work, blockers, and plans for the next day.

## User Experience

Users interact with the Daily Log through a structured form that contains multiple sections, each focusing on a different aspect of their day. The form auto-saves as users type, ensuring that no data is lost.

### Daily Log Workflow

1. User navigates to the Daily Log page
2. The system checks if a log exists for today's date
   - If one exists, it loads the existing log data
   - If none exists, it creates a new empty log
3. User fills in the various sections of the log
4. Data is automatically saved as the user types
5. User can mark their day as "shutdown" when they've completed their reflection

### Log Sections

The Daily Log is divided into these sections:

1. **Accomplished**: Tasks and goals completed during the day
2. **In Progress**: Work that's still ongoing
3. **Blockers**: Issues or obstacles that impeded progress
4. **Decisions Needed**: Decisions that need to be made
5. **Tomorrow**: Tasks planned for the next day
6. **Thoughts**: Free-form reflections or additional notes
7. **Cleanup**: Checklist for completing end-of-day organization tasks
8. **Shutdown**: Final toggle to mark the day as complete

## Implementation Details

### Component Structure

The Daily Log feature is implemented through a hierarchy of components:

```
LogForm (container)
├── AccomplishedSection
├── InProgressSection
├── BlockersSection
├── DecisionsSection
├── TomorrowSection
├── ThoughtsSection
├── CleanupSection
└── ShutdownSection
```

### Main Components

#### LogForm

**File**: `app/dashboard/log/LogForm.tsx`

This is the main container component that:
- Manages the overall form state
- Loads existing log data or initializes a new log
- Handles auto-saving
- Coordinates interactions between sections
- Manages communication with the database

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/Auth/AuthContext';
import { DailyLog, LogData } from '@/types';
// Import section components

// Initial empty state
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
  const isInitialRender = useRef(true);
  
  // Update handlers for each section
  // ...
  
  // Save to database
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
  
  // Auto-save
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (isSaving) return;
    
    const timerId = setTimeout(() => {
      saveLog();
    }, 2000);
    
    return () => clearTimeout(timerId);
  }, [logData]);
  
  // Render form
  return (
    <div className="space-y-8">
      {/* Form header */}
      {/* Section components */}
    </div>
  );
}
```

#### Section Components

Each section component follows a similar pattern:

```tsx
'use client';

interface SectionProps {
  items: string[]; // or appropriate type
  onChange: (items: string[]) => void; // or appropriate function
}

export function SectionName({ items, onChange }: SectionProps) {
  // Section-specific state and handlers
  
  return (
    <Card title="Section Title">
      <div className="space-y-4">
        {/* Section content */}
      </div>
    </Card>
  );
}
```

### Page Component

**File**: `app/dashboard/log/page.tsx`

This server component:
- Fetches the current date
- Checks for an existing log for the current date
- Passes the data to the LogForm component

```tsx
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LogForm } from './LogForm';

export default async function DailyLogPage() {
  // Get the current date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  // Initialize Supabase server client
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/signin');
  }
  
  // Check for existing log for today
  const { data: existingLog } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('date', today)
    .single();
  
  return (
    <div className="max-w-4xl mx-auto">
      <LogForm date={today} existingLog={existingLog} />
    </div>
  );
}
```

## Data Model

The Daily Log feature uses the following data model:

### TypeScript Interfaces

```typescript
// Types for the daily log data
interface CleanupStatus {
  workspace: boolean;
  email: boolean;
  calendar: boolean;
}

interface LogData {
  accomplished: string[];
  inProgress: string[];
  blockers: string[];
  decisions: string[];
  tomorrow: string[];
  thoughts: string;
  cleanup: CleanupStatus;
  shutdown: boolean;
}

// Database representation of a log
interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  log_data: LogData;
  created_at: string;
  updated_at: string;
}
```

### Database Schema

The daily logs are stored in the `daily_logs` table in Supabase with the following schema:

```sql
CREATE TABLE public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    log_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, date)
);
```

## API Operations

The Daily Log feature interacts with the Supabase API for the following operations:

### Check for Existing Log

```typescript
const { data: existingLog } = await supabase
  .from('daily_logs')
  .select('*')
  .eq('user_id', userId)
  .eq('date', date)
  .single();
```

### Create or Update Log

```typescript
const { error } = await supabase
  .from('daily_logs')
  .upsert({
    id: existingLogId, // Optional, if updating
    user_id: userId,
    date: date,
    log_data: logData,
    updated_at: new Date().toISOString()
  });
```

## Auto-Save Implementation

The auto-save functionality is implemented using:

1. React's `useEffect` hook to watch for changes to the log data
2. A debounce mechanism to prevent excessive API calls
3. State variables to track saving status

```typescript
// Auto-save on changes
useEffect(() => {
  if (isInitialRender.current) {
    isInitialRender.current = false;
    return;
  }
  
  if (isSaving) return;
  
  const timerId = setTimeout(() => {
    saveLog();
  }, 2000); // Wait 2 seconds after typing stops
  
  return () => clearTimeout(timerId);
}, [logData]);
```

## Future Enhancements

The following enhancements are planned for the Daily Log feature:

1. **Templates**: Allow users to create and select from log templates
2. **Rich Text Editing**: Upgrade the thoughts section to support rich text
3. **Attachment Support**: Enable file attachments for logs
4. **Tags**: Add tagging capability for better organization
5. **Calendar Integration**: Sync tomorrow's tasks with calendar apps
6. **Drag-and-Drop Reordering**: Allow reordering of list items
7. **Recurring Items**: Support for items that automatically appear each day
8. **Mobile Optimizations**: Enhanced mobile experience with swipe gestures 