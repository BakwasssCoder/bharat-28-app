# BHARAT 28 - Supabase Migration

This document explains how to set up and run the BHARAT 28 restaurant management system with Supabase as the backend.

## Prerequisites

1. Node.js (version 14 or higher)
2. A Supabase account and project

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and API keys

### 2. Database Setup

1. In your Supabase project, go to the SQL Editor
2. Copy and paste the contents of `supabase_schema_updated.sql` into the editor
3. Run the script to create all tables and set up Row Level Security

### 3. Environment Variables

#### Frontend (.env file)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (.env file)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 5. Run the Application

```bash
# Start the frontend
npm run dev

# In a separate terminal, start the backend
cd backend
npm run dev
```

## Testing the Supabase Connection

You can test the Supabase connection by running:

```bash
node test_supabase_connection.js
```

Make sure to set the environment variables first:

```bash
# On Windows
set SUPABASE_URL=your_supabase_project_url
set SUPABASE_ANON_KEY=your_supabase_anon_key

# On Mac/Linux
export SUPABASE_URL=your_supabase_project_url
export SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Key Features

1. **Full Menu Management**: Create, read, update, delete categories and items
2. **Order Workflow**: Pending orders via website, confirmation by admin
3. **Sales Dashboard**: Real-time analytics and reporting
4. **Content Management**: Dynamic site content from database
5. **Security**: Proper authentication and authorization with Row Level Security

## Security

The application implements Row Level Security (RLS) policies to ensure:
- Public read access to menu items and categories
- Admin write access to all tables
- Public order creation with admin-only order management
- Protected admin authentication

## Troubleshooting

If you encounter issues:

1. Verify all environment variables are set correctly
2. Check that the Supabase project URL and keys are correct
3. Ensure the database schema has been applied
4. Check the browser console and terminal for error messages

## Support

For any issues or questions, please check the documentation or reach out to the development team.