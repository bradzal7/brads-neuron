# Data Model

This document describes the data models used in Neuron Log, both at the application level (TypeScript interfaces) and the database level (Supabase PostgreSQL tables).

## TypeScript Models

### User

```typescript
export interface User {
  id: string;
  email: string;
}
```

### Daily Log Structure

```typescript
export interface BlockerItem {
  item: string;
  needs: string;
}

export interface DecisionNeededItem {
  item: string;
  needs: string;
}

export interface CleanupStatus {
  cleared_desktop: boolean;
  closed_files_tabs: boolean;
  updated_calendar: boolean;
  desk_reset: boolean;
}

export interface LogData {
  date: string;
  accomplished: string[];
  in_progress: string[];
  not_done_reasoning: Record<string, string>;
  blockers: BlockerItem[];
  decisions_needed: DecisionNeededItem[];
  tomorrow_priorities: string[];
  loose_thoughts: string[];
  cleanup: CleanupStatus;
  shutdown_ritual: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  log_data: LogData;
  created_at: string;
  updated_at: string;
}

// For history view, we only need certain fields for the list
export type LogHistoryItem = Pick<DailyLog, 'id' | 'date'> & { 
  log_data: Pick<LogData, 'accomplished' | 'in_progress'> 
};
```

## Database Schema

### Users Table

The `users` table is managed by Supabase Auth and contains:

- `id` (UUID, primary key)
- `email` (string, unique)
- Other Supabase Auth fields (created_at, updated_at, etc.)

### Daily Logs Table

```sql
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  log_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Row Level Security Policies

```sql
-- Enable row-level security
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own logs
CREATE POLICY "Users can only access their own logs" 
  ON daily_logs 
  FOR ALL 
  USING (auth.uid() = user_id);
```

#### Indexes

```sql
-- Create an index for faster queries
CREATE INDEX daily_logs_user_id_date_idx ON daily_logs (user_id, date);
```

## Data Flow

### Creating a New Log

1. When a user visits the dashboard, we check if a log exists for today
2. If not, we create a new log with default values
3. The log is stored in Supabase with the user's ID

### Updating a Log

1. User makes changes to any section of the log
2. The updated section is sent to Supabase
3. The entire log data is updated, preserving other sections

### Fetching Log History

1. We fetch a list of logs with minimal data (date, ID, accomplishments count, etc.)
2. When a user selects a specific log, we fetch the complete log data

## Data Validation

Currently, data validation happens at the component level with TypeScript types ensuring the correct structure. Future enhancements could include:

1. Server-side validation using Zod or similar
2. Database constraints for critical fields
3. Input validation for security and data integrity

## Future Data Model Enhancements

1. **Tags**: Add the ability to tag logs for better organization
2. **Templates**: Allow users to create templates for common log structures
3. **Metrics**: Track metrics over time (accomplished tasks per day, recurring blockers, etc.)
4. **Relationships**: Add relationships between logs (e.g., tracking blockers across days)
5. **External References**: Allow referencing external resources (links, files, etc.) 