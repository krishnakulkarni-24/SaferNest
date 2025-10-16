# SaferNest Deployment Guide for Render

This guide explains how to deploy the SaferNest application on Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A MongoDB Atlas account for the database (https://www.mongodb.com/cloud/atlas)
3. Your code pushed to a GitHub repository

## Project Structure

- **Backend**: Node.js/Express API (located in `/backend` directory)
- **Frontend**: Angular application (pre-built and served from `/backend/public/browser`)

## Deployment Steps

### 1. Set Up MongoDB Atlas

1. Create a MongoDB Atlas cluster (free tier is sufficient for testing)
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for Render access
4. Copy your MongoDB connection string (it should look like: `mongodb+srv://username:password@cluster.mongodb.net/safernest`)

### 2. Deploy on Render

#### Create a New Web Service

1. Log in to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service with the following settings:

**Basic Settings:**
- **Name**: `safernest` (or your preferred name)
- **Region**: Choose the closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Node`

**Build & Deploy Settings:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
Add the following environment variables in the Render dashboard:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment setting |
| `PORT` | `5000` | Port number (Render will override this) |
| `MONGO_URI` | `your-mongodb-connection-string` | MongoDB Atlas connection string |
| `JWT_SECRET` | `your-secure-random-string` | Secret key for JWT tokens (generate a strong random string) |
| `FRONTEND_URL` | `https://your-app-name.onrender.com` | Your Render app URL (update after deployment) |

**Important Notes:**
- For `JWT_SECRET`, generate a strong random string (at least 32 characters). You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- For `MONGO_URI`, replace `<username>`, `<password>`, and `<cluster>` with your actual MongoDB credentials
- The `FRONTEND_URL` should match your Render service URL

#### Advanced Settings (Optional)

- **Auto-Deploy**: Enable "Yes" to automatically deploy on git push
- **Health Check Path**: `/api/alerts` (or any API endpoint that returns 200)

### 3. Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Start the server (`npm start`)
3. Wait for the deployment to complete (usually 2-5 minutes)

### 4. Post-Deployment

1. Once deployed, your app will be available at: `https://your-app-name.onrender.com`
2. Update the `FRONTEND_URL` environment variable with your actual Render URL
3. Test your application:
   - Visit the homepage
   - Try registering a new user
   - Test login functionality
   - Create and view alerts

## Frontend Build

The Angular frontend has already been built and placed in `/backend/public/browser`. The backend server is configured to serve these static files.

If you need to rebuild the frontend:

```bash
cd frontend
npm install
npm run build
```

This will update the files in `/backend/public/browser`.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Verify your MongoDB connection string is correct
   - Ensure you've whitelisted IP address 0.0.0.0/0 in MongoDB Atlas
   - Check that your database user has proper permissions

2. **Server Fails to Start**
   - Check the Render logs for specific error messages
   - Verify all environment variables are set correctly
   - Ensure the `backend` directory is set as the root directory

3. **CORS Errors**
   - Update the `FRONTEND_URL` environment variable to match your Render URL
   - Restart the service after updating environment variables

4. **404 Errors for Routes**
   - The server is configured to serve the Angular app for all non-API routes
   - Ensure the build files exist in `/backend/public/browser`

### Viewing Logs

1. Go to your Render dashboard
2. Click on your service
3. Click on "Logs" tab to view real-time logs

## Environment Variables Reference

Create a `.env` file locally for development (never commit this file):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/safernest
JWT_SECRET=your-local-dev-secret-key
FRONTEND_URL=http://localhost:4200
```

## Updating Your Deployment

1. Push changes to your GitHub repository
2. If auto-deploy is enabled, Render will automatically redeploy
3. Otherwise, manually trigger a deploy from the Render dashboard

## Free Tier Limitations

Render's free tier includes:
- 750 hours of usage per month
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds to respond

For production use, consider upgrading to a paid plan for:
- Always-on service
- Better performance
- Custom domains
- Additional resources

## Security Best Practices

1. ✅ Use strong, unique passwords for MongoDB
2. ✅ Generate a secure random `JWT_SECRET`
3. ✅ Enable HTTPS (Render provides this automatically)
4. ✅ Keep dependencies up to date
5. ✅ Never commit `.env` files to version control
6. ✅ Use environment variables for all sensitive data

## Support

For issues specific to:
- **Render**: Check Render documentation or support
- **MongoDB Atlas**: Refer to MongoDB Atlas documentation
- **Application**: Check application logs and GitHub issues

## Success Checklist

Before considering deployment complete, verify:

- [ ] Application loads successfully
- [ ] MongoDB connection is established
- [ ] User registration works
- [ ] User login works
- [ ] All API endpoints respond correctly
- [ ] Frontend routing works properly
- [ ] No CORS errors in browser console
- [ ] Environment variables are properly set
- [ ] Logs show no critical errors

---

**Congratulations!** Your SaferNest application should now be deployed and running on Render.
