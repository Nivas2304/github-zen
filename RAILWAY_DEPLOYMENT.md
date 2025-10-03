# 🚀 Railway Deployment Guide

## Step-by-Step Railway Deployment

### 1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub account

### 2. Deploy Your Backend
1. **Click "New Project"** in Railway dashboard
2. **Select "Deploy from GitHub repo"**
3. **Choose your repository**: `Nivas2304/github-zen`
4. **Railway will use our configuration files**:
   - `railway.json` - Railway deployment config
   - `nixpacks.toml` - Build configuration
   - `start.sh` - Startup script
5. **Click "Deploy"** - Railway will automatically:
   - Detect Python/FastAPI from our config
   - Install dependencies from `backend/requirements.txt`
   - Run your app using our startup script

### 3. Add PostgreSQL Database
1. **In your project dashboard**, click **"+ New"**
2. **Select "Database"** → **"PostgreSQL"**
3. **Railway will create** a PostgreSQL database
4. **Note the connection details** (we'll use them in environment variables)

### 4. Configure Environment Variables
1. **Click on your FastAPI service** in the dashboard
2. **Go to "Variables" tab**
3. **Add these environment variables**:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/railway
# (Railway will provide the actual DATABASE_URL automatically)

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://your-app-name.up.railway.app/auth/callback

# Frontend URL
FRONTEND_URL=https://your-vercel-app.vercel.app

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Get Your Railway URLs
1. **Backend URL**: `https://your-app-name.up.railway.app`
2. **Database URL**: Automatically provided by Railway
3. **Copy the backend URL** for your frontend configuration

### 6. Update Frontend Configuration
Update your frontend `src/services/api.ts`:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.up.railway.app'
  : 'http://localhost:8000';
```

### 7. Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend/`
4. Add environment variables:
   ```bash
   VITE_API_URL=https://your-app-name.up.railway.app
   ```

## 🎯 Railway Advantages

✅ **Zero Configuration** - Auto-detects FastAPI
✅ **No Build Issues** - Handles Python dependencies perfectly  
✅ **Built-in Database** - PostgreSQL included
✅ **Automatic HTTPS** - SSL certificates included
✅ **Auto Deployments** - Deploys on every git push
✅ **Health Checks** - Built-in monitoring
✅ **Free Tier** - $5 credit monthly

## 🔧 Troubleshooting

### If deployment fails:
1. **Check logs** in Railway dashboard
2. **Verify environment variables** are set correctly
3. **Ensure requirements.txt** has correct dependencies
4. **Check Procfile** syntax

### Common issues:
- **Missing environment variables** → Add them in Railway dashboard
- **Database connection issues** → Railway provides DATABASE_URL automatically
- **CORS errors** → Update FRONTEND_URL environment variable

## 📊 Monitoring

Railway provides:
- **Real-time logs**
- **Performance metrics**
- **Automatic restarts** on failures
- **Health check monitoring**

## 🚀 Next Steps

1. **Deploy backend** to Railway
2. **Deploy frontend** to Vercel  
3. **Test the complete application**
4. **Share your live URLs**!

Your app will be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.up.railway.app`

## 🎉 Success!

Once deployed, your GitHub Zen application will be:
- ✅ **Fully functional** with real GitHub data
- ✅ **Scalable** with Railway's infrastructure
- ✅ **Secure** with HTTPS and proper authentication
- ✅ **Monitored** with health checks and logs

**Ready to deploy? Let's get started!** 🚀
