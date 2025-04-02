# Neuron Log

A personal "Second Brain" application focused on capturing structured daily shutdown reflections. Log what you accomplished, what's in progress, what's blocking you, what you need to do tomorrow, and any loose thoughts—then eventually scale to semantic search, AI summarization, and collaborative team use.

## Features

- **User Authentication**: Email/password login using Supabase Auth
- **Daily Shutdown Log**: Structured form to capture your daily reflections
- **History View**: Timeline of all your past logs
- **Mobile Support**: Responsive design for use on any device

## Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: Vercel
- **Data Storage**: Supabase Postgres using JSONB for flexible structured data

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Supabase account

### Setup Instructions

1. Clone the repository:
```
git clone https://github.com/yourusername/neuron-log.git
cd neuron-log
```

2. Install dependencies:
```
npm install
```

3. Create a Supabase project at [https://supabase.com](https://supabase.com)

4. Set up the database table in Supabase:
```sql
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  log_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Row Level Security policies
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own logs
CREATE POLICY "Users can only access their own logs" 
  ON daily_logs 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create an index for faster queries
CREATE INDEX daily_logs_user_id_date_idx ON daily_logs (user_id, date);
```

5. Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

6. Run the development server:
```
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Create an account using the Sign Up page
2. Log in to access your dashboard
3. Fill out today's shutdown log with:
   - Tasks you accomplished
   - Tasks still in progress
   - Blockers and decisions needed
   - Tomorrow's priorities
   - Loose thoughts
   - Workspace cleanup checklist
   - Shutdown ritual
4. View your history of past logs by clicking on the History section

## Future Enhancements

- **Reminder System**: Daily email reminders to complete your shutdown log
- **Export Feature**: Export logs as markdown or JSON
- **AI Summarization**: GPT-4 powered summaries and insights
- **Semantic Search**: Natural language search across all your logs
- **Team Collaboration**: Share logs with team members for better coordination

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.