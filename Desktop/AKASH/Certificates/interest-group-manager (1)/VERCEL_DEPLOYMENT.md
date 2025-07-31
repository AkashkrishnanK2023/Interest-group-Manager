# 🚀 Vercel Deployment Guide

This guide will help you deploy the Interest Group Manager application to Vercel successfully.

## 📋 Pre-Deployment Checklist

### ✅ Required Setup

1. **MongoDB Atlas Account** (Required for production)
   - Create a free MongoDB Atlas account at https://www.mongodb.com/atlas
   - Create a new cluster
   - Get your connection string
   - Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for all IPs)

2. **Vercel Account**
   - Sign up at https://vercel.com
   - Connect your GitHub account

## 🔧 Environment Variables Setup

In your Vercel dashboard, add these environment variables:

### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interest-groups?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
NODE_ENV=production
```

### How to Add Environment Variables in Vercel:
1. Go to your project dashboard in Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable with its value
5. Make sure to select "Production", "Preview", and "Development" for each variable

## 🚀 Deployment Steps

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Next.js project

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Add Environment Variables**
   - Add the required environment variables listed above

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 🔍 Post-Deployment Setup

### 1. Initialize Database
After successful deployment, you need to initialize your database:

1. **Access your deployed application**
2. **Create admin user** - The app will automatically create an admin user on first database connection
3. **Add sample groups** - You can use the provided scripts or create groups manually

### 2. Test the Application
1. Visit your deployed URL
2. Try logging in with admin credentials (admin / admin123)
3. Test creating a group
4. Test joining/leaving groups
5. Check all major functionality

## 🛠️ Troubleshooting Common Issues

### Build Errors

**Error: "Module not found"**
- Solution: Check all import paths are correct
- Make sure all dependencies are in package.json

**Error: "Environment variable not found"**
- Solution: Add all required environment variables in Vercel dashboard
- Make sure MONGODB_URI and JWT_SECRET are set

### Runtime Errors

**Error: "Cannot connect to MongoDB"**
- Check your MongoDB Atlas connection string
- Ensure IP whitelist includes 0.0.0.0/0 or Vercel's IPs
- Verify database user has read/write permissions

**Error: "JWT Secret not found"**
- Add JWT_SECRET environment variable
- Make sure it's a long, random string

### Performance Issues

**Slow API responses**
- Check MongoDB Atlas cluster region (choose closest to your users)
- Consider upgrading MongoDB Atlas tier if needed
- Monitor Vercel function execution time

## 📊 Monitoring & Maintenance

### Vercel Dashboard
- Monitor function invocations
- Check build logs
- Monitor performance metrics

### MongoDB Atlas
- Monitor database connections
- Check query performance
- Set up alerts for high usage

## 🔒 Security Considerations

### Environment Variables
- Never commit .env files to git
- Use strong, unique JWT_SECRET
- Rotate secrets periodically

### Database Security
- Use MongoDB Atlas built-in security features
- Enable authentication
- Use connection string with credentials
- Regularly update dependencies

## 📈 Scaling Considerations

### Vercel Limits (Hobby Plan)
- 100GB bandwidth per month
- 100 serverless function invocations per day
- 10 second function timeout

### MongoDB Atlas Limits (Free Tier)
- 512MB storage
- Shared cluster
- No backups

### Upgrade Paths
- Vercel Pro: $20/month for higher limits
- MongoDB Atlas: Dedicated clusters starting at $9/month

## 🎯 Success Checklist

After deployment, verify:
- [ ] Application loads without errors
- [ ] Admin login works (admin / admin123)
- [ ] Can create new groups
- [ ] Can join/leave groups
- [ ] Database operations work
- [ ] All pages render correctly
- [ ] API endpoints respond properly
- [ ] Environment variables are set
- [ ] MongoDB connection is stable

## 🆘 Getting Help

If you encounter issues:

1. **Check Vercel Build Logs**
   - Go to your project dashboard
   - Click on the failed deployment
   - Check the build logs for errors

2. **Check Function Logs**
   - Go to Functions tab in Vercel dashboard
   - Check real-time logs for API errors

3. **Common Solutions**
   - Clear Vercel build cache: `vercel --prod --force`
   - Redeploy: Push a new commit or trigger manual deploy
   - Check environment variables are correctly set

## 🎉 You're Ready!

Your Interest Group Manager application should now be successfully deployed on Vercel! 

**Default Admin Credentials:**
- Email: admin
- Password: admin123

**Remember to:**
- Change admin password after first login
- Add your own groups and content
- Monitor usage and performance
- Keep dependencies updated

Happy deploying! 🚀