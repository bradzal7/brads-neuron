# API Structure

This document outlines the API structure for Neuron Log, detailing how data flows between the client and server.

## Overview

Neuron Log uses a combination of:

1. **Supabase JavaScript Client** - For direct communication with Supabase services
2. **Next.js API Routes** - For custom server-side logic
3. **Server Components** - For data fetching in the rendering pipeline

## API Endpoints

### Authentication API

Authentication is handled through the Supabase Auth API:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `supabase.auth.signUp()` | POST | Register a new user |
| `supabase.auth.signInWithPassword()` | POST | Authenticate a user |
| `supabase.auth.signOut()` | POST | Sign out a user |
| `supabase.auth.getSession()` | GET | Get the current session |

### Daily Logs API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `supabase.from('daily_logs').select()`| GET | Retrieve daily logs |
| `supabase.from('daily_logs').upsert()` | POST | Create/update a daily log |
| `supabase.from('daily_logs').delete()` | DELETE | Delete a daily log |

## Data Access Patterns

### Client-Side Data Access

For client components, data is accessed through direct Supabase client calls:

```typescript
// Example: Fetching logs in a client component
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function LogHistory() {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('id, date, log_data->summary')
        .order('date', { ascending: false });
        
      if (data) setLogs(data);
    }
    
    fetchLogs();
  }, []);
  
  // Render logs...
}
```

### Server Component Data Fetching

For server components, data is fetched during the rendering process:

```typescript
// Example: Fetching a specific log in a server component
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function LogDetail({ params }) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data: log } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('id', params.id)
    .single();
    
  // Render log details...
}
```

## API Helpers

### Supabase Client Initialization

#### Client-Side

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### Server-Side

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient(cookieStore) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

## Type Definitions

```typescript
// API response types
type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
};

// Daily log API types
type CreateLogRequest = {
  date: string;
  log_data: LogData;
};

type UpdateLogRequest = {
  id: string;
  log_data: Partial<LogData>;
};
```

## Error Handling

API errors are handled consistently throughout the application:

```typescript
try {
  const { data, error } = await supabase.from('daily_logs').select('*');
  
  if (error) {
    console.error('Error fetching logs:', error.message);
    // Handle error in UI
    return;
  }
  
  // Process data
} catch (e) {
  console.error('Unexpected error:', e);
  // Handle unexpected error
}
```

## Rate Limiting

Currently, Neuron Log relies on Supabase's default rate limiting. For a production application, we would implement:

1. Client-side throttling for form submissions
2. Server-side rate limiting for API routes
3. Monitoring for abuse patterns

## Future API Enhancements

1. **Custom Middleware**: Add request validation and transformation
2. **Edge Functions**: For global low-latency operations
3. **Caching Layer**: Implement SWR or React Query for optimistic updates and caching
4. **Webhook Support**: For integration with external services
5. **GraphQL API**: Consider adding a GraphQL layer for more flexible querying
6. **API Versioning**: Implement versioning for future API changes 