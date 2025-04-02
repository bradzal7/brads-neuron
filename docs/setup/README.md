# Setup Documentation

This directory contains documentation for setting up and deploying the Neuron Log application.

## Project Setup

| Guide | Description |
|-------|-------------|
| [Development Environment](./development-environment.md) | Setting up the local development environment |
| [Database Setup](./database-setup.md) | Configuring Supabase database and authentication |
| [Environment Variables](./environment-variables.md) | Required environment variables |
| [Deployment](./deployment.md) | Deploying to Vercel |

## Quick Start

### Prerequisites

- Node.js (v18 or newer)
- npm (v8 or newer)
- Git
- Supabase account
- Vercel account (for deployment)

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/neuron-log.git
   cd neuron-log
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Access the application**

   Open your browser and navigate to `http://localhost:3000`

## Database Setup

Neuron Log uses Supabase for authentication and database. The main steps for setting up the database are:

1. Create a new Supabase project
2. Enable email/password authentication
3. Create the `daily_logs` table
4. Set up row-level security policies

Detailed instructions are available in the [Database Setup](./database-setup.md) guide.

## Environment Variables

The following environment variables are required:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abcdefghijklm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |

## Deployment

Neuron Log can be deployed to Vercel with minimal configuration:

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect the repository to Vercel
3. Configure environment variables
4. Deploy

For detailed deployment instructions, see the [Deployment](./deployment.md) guide.

## Project Structure

```
neuron-log/
├── app/                   # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── dashboard/         # Dashboard routes
│   └── lib/               # Utility libraries
├── public/                # Static assets
├── types/                 # TypeScript type definitions
├── .env.example           # Example environment variables
├── .eslintrc.json         # ESLint configuration
├── next.config.mjs        # Next.js configuration
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── README.md              # Project README
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Troubleshooting

If you encounter issues during setup, check these common solutions:

- **Authentication errors**: Make sure your Supabase URL and anon key are correct
- **Database errors**: Verify that you've created the necessary tables and policies
- **Next.js errors**: Ensure you're using a compatible Node.js version

For more detailed troubleshooting, refer to the specific setup guides in this directory. 