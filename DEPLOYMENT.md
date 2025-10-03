# 🚀 Deployment Guide

## 📋 Files to Remove Before Deployment

### Backend (Render):
```bash
rm -rf backend/tests/
rm backend/pytest.ini
rm backend/Dockerfile
rm backend/env.example
```

### Frontend (Vercel):
```bash
rm frontend/Dockerfile
rm frontend/README.md
rm frontend/src/data/mockData.ts
```

### Root:
```bash
rm -rf deployment/
rm README.md  # optional
```

## 🔧 Backend Deployment (Render)

### 1. Create Render Web Service
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Python Version**: 3.11+

### 2. Environment Variables (Render)
```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://your-vercel-app.vercel.app/auth/callback
SECRET_KEY=your_jwt_secret_key
DATABASE_URL=postgresql://... (provided by Render)
FRONTEND_URL=https://your-vercel-app.vercel.app
ENVIRONMENT=production
```

### 3. Database Setup
- Render will provide PostgreSQL automatically
- Tables will be created automatically on first startup
- No migration needed (SQLAlchemy handles it)

## 🎨 Frontend Deployment (Vercel)

### 1. Create Vercel Project
- Connect your GitHub repository
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2. Environment Variables (Vercel)
```
VITE_API_URL=https://your-render-app.onrender.com
```

### 3. Update Configuration
After deployment, update these files with your actual URLs:
- `backend/config.py`: Update `frontend_url` and `github_redirect_uri`
- `frontend/src/services/api.ts`: Update `API_BASE_URL`

## 🔄 GitHub OAuth Setup

### 1. Update GitHub OAuth App
- Go to GitHub Settings > Developer settings > OAuth Apps
- Update **Authorization callback URL** to: `https://your-vercel-app.vercel.app/auth/callback`

### 2. Update Environment Variables
- Update `GITHUB_REDIRECT_URI` in Render with your Vercel URL

## 📝 Post-Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Database connected (PostgreSQL)
- [ ] GitHub OAuth configured
- [ ] CORS settings updated
- [ ] Environment variables set
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Test file explorer
- [ ] Test PR commenting

## 🐛 Troubleshooting

### Backend Issues:
- Check Render logs for startup errors
- Verify environment variables
- Check database connection

### Frontend Issues:
- Check Vercel build logs
- Verify API URL configuration
- Check browser console for CORS errors

### GitHub OAuth Issues:
- Verify callback URL matches exactly
- Check client ID and secret
- Ensure redirect URI is HTTPS
