# Vercel Deployment Guide

This guide will help you deploy your application to Vercel and configure the backend service properly.

## Frontend Deployment (React App) to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and connect your GitHub account
3. Import your project repository
4. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_BASE_URL`: Your backend server URL (e.g., `https://your-backend-app.onrender.com/api`)

## Backend Deployment Options

You need to deploy the backend server separately. Here are some options:

### Option 1: Deploy to Render.com

1. Create a `Dockerfile` in your `backend` directory:

```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

2. Create a `render.yaml` file in your project root:

```yaml
services:
- type: web
  name: bharat28-backend
  env: node
  buildCommand: "cd backend && npm install"
  startCommand: "cd backend && node server.js"
  envVars:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    generateValue: true
  - key: SUPABASE_URL
    value: your_supabase_url
  - key: SUPABASE_SERVICE_ROLE_KEY
    value: your_supabase_service_role_key
```

3. Connect your GitHub repo to Render and deploy

### Option 2: Deploy to Railway

1. Install Railway CLI or connect GitHub
2. Create a new project and add your backend code
3. Set environment variables in Railway dashboard

### Option 3: Deploy to Heroku

1. Create a `Procfile` in your `backend` directory:

```
web: node server.js
```

2. Deploy using Heroku CLI or GitHub integration

## Configuration After Deployment

1. After deploying your backend, you'll get a URL like `https://your-backend-app.onrender.com`
2. Update the `REACT_APP_API_BASE_URL` environment variable in Vercel to point to your backend: `https://your-backend-app.onrender.com/api`
3. Redeploy your frontend on Vercel

## Environment Variables

### Frontend (Vercel)
- `REACT_APP_API_BASE_URL`: Your backend server URL with `/api` suffix

### Backend (Render/Heroku/Railway)
- `JWT_SECRET`: Secret key for JWT tokens
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `PORT`: Port number (usually set automatically by the platform)

## Troubleshooting

1. **Admin panel not accessible**: Make sure `REACT_APP_API_BASE_URL` is correctly set in Vercel environment variables
2. **Page refresh issues**: The `vercel.json` file should handle this - make sure it's in your project root
3. **WhatsApp checkout not working**: Check browser console for API errors and ensure the backend URL is correct
4. **CORS errors**: The backend is configured to allow all origins, but double-check your deployment

## Testing

After deployment:
1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Try navigating to different pages - they should load without 404 errors
3. Test the admin panel login at `/admin`
4. Test the WhatsApp checkout flow