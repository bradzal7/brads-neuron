# Database Setup

This guide explains how to set up the Supabase database for Neuron Log.

## Overview

Neuron Log uses Supabase as the backend service for:

1. User authentication
2. PostgreSQL database for storing logs
3. Row-level security for data protection

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign in or create an account
2. Click "New Project" in the dashboard
3. Enter a name for your project (e.g., "neuron-log")
4. Set a secure database password (save this somewhere safe)
5. Choose a region closest to your users
6. Click "Create new project"

Wait for the project to be created. This can take a few minutes.

## Step 2: Configure Authentication

1. In the Supabase dashboard, go to **Authentication** > **Providers**
2. Ensure that **Email** is enabled (it should be by default)
3. Configure email authentication settings:
   - Set **Confirm email** to **Enabled** for production or **Disabled** for development
   - Customize the email template if desired

## Step 3: Create Database Tables

Neuron Log requires a `daily_logs` table to store user logs. You can create this table using the Supabase SQL editor.

1. Go to **SQL Editor** in the Supabase dashboard
2. Create a new query
3. Paste the following SQL:

```sql
-- Create daily logs table
CREATE TABLE public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    log_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, date)
);

-- Set up row-level security
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select their own logs
CREATE POLICY "Users can view their own logs" 
ON public.daily_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to insert their own logs
CREATE POLICY "Users can insert their own logs" 
ON public.daily_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own logs
CREATE POLICY "Users can update their own logs" 
ON public.daily_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for users to delete their own logs
CREATE POLICY "Users can delete their own logs" 
ON public.daily_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_daily_logs_user_id_date ON public.daily_logs (user_id, date);
```

4. Click "Run" to execute the SQL

## Step 4: Verify Table Creation

1. Go to **Table Editor** in the Supabase dashboard
2. Check that the `daily_logs` table appears in the list
3. Review the table structure to ensure it matches the expected schema

## Step 5: Get API Keys

You'll need the Supabase URL and anon key for your application:

1. Go to **Project Settings** > **API** in the Supabase dashboard
2. Copy the **Project URL** and **anon public** key
3. Add these values to your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL=your-project-url`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`

## Understanding the Data Model

### daily_logs Table

The `daily_logs` table stores each user's daily reflections:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, automatically generated |
| user_id | UUID | Foreign key to auth.users, identifies the log owner |
| date | DATE | The date this log is for |
| log_data | JSONB | Stores the structured log data |
| created_at | TIMESTAMP | When the log was created |
| updated_at | TIMESTAMP | When the log was last updated |

The `log_data` is a JSON object with this structure:

```json
{
  "accomplished": ["string", "string"],
  "inProgress": ["string", "string"],
  "blockers": ["string", "string"],
  "decisions": ["string", "string"],
  "tomorrow": ["string", "string"],
  "thoughts": "string",
  "cleanup": {
    "workspace": boolean,
    "email": boolean,
    "calendar": boolean
  },
  "shutdown": boolean
}
```

## Row-Level Security

Row-level security (RLS) ensures that users can only access their own data. The policies created above enforce these rules:

1. Users can only view logs they created
2. Users can only insert logs with their own user_id
3. Users can only update their own logs
4. Users can only delete their own logs

## Troubleshooting

### Common Issues

#### Error: "relation 'daily_logs' already exists"

This means you're trying to create a table that already exists. You can either:
- Drop the existing table (will delete all data): `DROP TABLE public.daily_logs;`
- Skip this step if the table structure is correct

#### Users cannot see their logs

Check the RLS policies for the `daily_logs` table:
1. Go to **Authentication** > **Policies** in the Supabase dashboard
2. Verify that the policies for `daily_logs` are set up correctly
3. Ensure your application is passing the correct authentication token

#### Database query timeout errors

If you're experiencing timeouts:
1. Check if your indexes are set up correctly
2. Consider optimizing your queries
3. Check your Supabase plan limits

## Next Steps

After setting up the database:

1. Configure your [environment variables](./environment-variables.md)
2. Start your [local development server](./development-environment.md)
3. [Deploy your application](./deployment.md) to Vercel 