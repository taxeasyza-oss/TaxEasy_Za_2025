# TaxEasy ZA 2025 - Deployment Guide

This guide provides step-by-step instructions for deploying TaxEasy ZA 2025 to various hosting platforms, with specific focus on GitHub Pages and Render.com.

## 🚀 Quick Deployment Options

### Option 1: GitHub Pages (Recommended for Static Hosting)
- **Cost**: Free
- **SSL**: Automatic HTTPS
- **CDN**: Global content delivery
- **Custom Domain**: Supported
- **Best For**: Static site hosting with automatic deployments

### Option 2: Render.com (Recommended for Full-Stack)
- **Cost**: Free tier available
- **SSL**: Automatic HTTPS
- **CDN**: Global edge network
- **Auto-Deploy**: Git integration
- **Best For**: Static sites with potential backend expansion

### Option 3: Netlify
- **Cost**: Free tier available
- **SSL**: Automatic HTTPS
- **CDN**: Global distribution
- **Forms**: Built-in form handling
- **Best For**: JAMstack applications

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have completed:

- [x] ✅ All preservation guidelines followed
- [x] ✅ POPIA compliance implemented
- [x] ✅ PWA functionality tested
- [x] ✅ Multilingual support verified
- [x] ✅ Dark mode functionality working
- [x] ✅ All "Jozi Angels" references removed
- [x] ✅ Git repository initialized and committed
- [x] ✅ README.md and documentation complete

## 🔧 GitHub Pages Deployment

### Step 1: Create GitHub Repository

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Repository name: `TaxEasy-ZA-2025` (or your preferred name)
   - Description: "Professional South African Tax Calculator 2025 - SARS Compliant"
   - Set to Public (required for free GitHub Pages)
   - Do NOT initialize with README (we already have one)

2. **Connect your local repository**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/TaxEasy-ZA-2025.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Configure GitHub Pages

1. **Navigate to repository settings**:
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll down to "Pages" section

2. **Configure Pages settings**:
   - Source: "Deploy from a branch"
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
   - Click "Save"

3. **Wait for deployment**:
   - GitHub will build and deploy your site
   - This usually takes 2-5 minutes
   - You'll see a green checkmark when complete

4. **Access your site**:
   - Your site will be available at: `https://YOUR_USERNAME.github.io/TaxEasy-ZA-2025`
   - GitHub will show you the URL in the Pages settings

### Step 3: Custom Domain (Optional)

1. **Purchase a domain** (e.g., `taxeasy-za.com`)

2. **Configure DNS**:
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`
   - Or add A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

3. **Configure in GitHub**:
   - In Pages settings, add your custom domain
   - Enable "Enforce HTTPS"

## 🌐 Render.com Deployment

### Step 1: Create Render Account

1. **Sign up at Render.com**:
   - Go to https://render.com
   - Sign up with GitHub account (recommended)
   - This allows automatic repository access

### Step 2: Create Static Site

1. **Create new Static Site**:
   - Click "New +" button
   - Select "Static Site"
   - Connect your GitHub repository

2. **Configure build settings**:
   - **Name**: `taxeasy-za-2025`
   - **Branch**: `main`
   - **Root Directory**: `/` (leave empty)
   - **Build Command**: `echo "Static site - no build required"`
   - **Publish Directory**: `public`

3. **Advanced settings**:
   - **Auto-Deploy**: Yes (recommended)
   - **Environment**: Production
   - **Node Version**: 18 (if needed)

### Step 3: Deploy

1. **Click "Create Static Site"**
2. **Wait for deployment** (usually 1-2 minutes)
3. **Access your site** at the provided Render URL
4. **Optional**: Configure custom domain in Render settings

## 📱 Netlify Deployment

### Step 1: Deploy via Git

1. **Connect repository**:
   - Go to https://netlify.com
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Configure build**:
   - **Branch**: `main`
   - **Base directory**: `/`
   - **Build command**: `echo "Static site"`
   - **Publish directory**: `public`

3. **Deploy site**:
   - Click "Deploy site"
   - Wait for deployment to complete

### Step 2: Configure Settings

1. **Site settings**:
   - Change site name to something memorable
   - Configure custom domain if desired

2. **Form handling** (for future contact forms):
   - Netlify automatically handles form submissions
   - Add `netlify` attribute to forms when needed

## 🔒 Security Configuration

### HTTPS Setup
All recommended platforms provide automatic HTTPS:
- **GitHub Pages**: Automatic with custom domains
- **Render**: Automatic SSL certificates
- **Netlify**: Automatic SSL with Let's Encrypt

### Security Headers
Add these headers for enhanced security (platform-specific):

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'
```

## 🚀 Performance Optimization

### Pre-Deployment Optimization

1. **Minify assets** (optional):
   ```bash
   # Install minification tools
   npm install -g html-minifier clean-css-cli uglify-js
   
   # Minify files (backup originals first)
   html-minifier --collapse-whitespace --remove-comments public/index.html -o public/index.min.html
   cleancss -o public/css/styles.min.css public/css/styles.css
   uglifyjs public/js/main.js -o public/js/main.min.js
   ```

2. **Optimize images**:
   - Compress PNG/JPG files
   - Convert to WebP format for better compression
   - Use appropriate image sizes

3. **Enable compression**:
   - Most platforms enable gzip/brotli automatically
   - Verify compression is working after deployment

### Post-Deployment Testing

1. **Lighthouse audit**:
   - Open Chrome DevTools
   - Go to Lighthouse tab
   - Run audit on deployed site
   - Target: 95+ score on all metrics

2. **PWA testing**:
   - Verify service worker registration
   - Test offline functionality
   - Confirm installability

3. **Cross-browser testing**:
   - Test on Chrome, Firefox, Safari, Edge
   - Verify mobile responsiveness
   - Check all languages work correctly

## 🔄 Continuous Deployment

### Automatic Deployments

All recommended platforms support automatic deployment:

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "feat: Add new feature #XXX-PRESERVE"
   git push origin main
   ```

2. **Deployment triggers automatically**:
   - GitHub Pages: 2-5 minutes
   - Render: 1-2 minutes
   - Netlify: 1-2 minutes

### Branch Protection

Set up branch protection rules:

1. **GitHub repository settings**:
   - Go to Settings > Branches
   - Add rule for `main` branch
   - Require pull request reviews
   - Require status checks to pass

## 🐛 Troubleshooting

### Common Issues

1. **404 errors on refresh**:
   - Add `_redirects` file (already included)
   - Configure server to serve `index.html` for all routes

2. **Service worker not registering**:
   - Ensure HTTPS is enabled
   - Check browser console for errors
   - Verify service worker file is accessible

3. **PWA not installable**:
   - Verify manifest.json is valid
   - Ensure all required icons are present
   - Check HTTPS is working

4. **Fonts not loading**:
   - Verify Google Fonts URLs are correct
   - Check Content Security Policy settings
   - Ensure CORS is properly configured

### Debug Commands

```bash
# Check git status
git status

# View commit history
git log --oneline

# Check remote repositories
git remote -v

# Test local server
python3 -m http.server 8080 --directory public

# Check for broken links
# (Install linkchecker first: pip install linkchecker)
linkchecker http://localhost:8080
```

## 📊 Monitoring and Analytics

### Performance Monitoring

1. **Google PageSpeed Insights**:
   - Test your deployed site regularly
   - Monitor Core Web Vitals
   - Address performance issues promptly

2. **Lighthouse CI**:
   - Set up automated Lighthouse testing
   - Monitor performance over time
   - Get alerts for regressions

### Error Monitoring

1. **Browser Console**:
   - Monitor for JavaScript errors
   - Check network requests
   - Verify service worker functionality

2. **Platform-specific monitoring**:
   - GitHub Pages: Check Actions tab for build errors
   - Render: Monitor deployment logs
   - Netlify: Check deploy logs and functions

## 🎯 Post-Deployment Checklist

After successful deployment, verify:

- [ ] ✅ Site loads correctly at deployed URL
- [ ] ✅ All pages and assets load without errors
- [ ] ✅ HTTPS is working and enforced
- [ ] ✅ PWA functionality works (offline, installable)
- [ ] ✅ All languages switch correctly
- [ ] ✅ Dark mode toggle functions properly
- [ ] ✅ POPIA consent banner appears and works
- [ ] ✅ Forms validate correctly
- [ ] ✅ Mobile responsiveness verified
- [ ] ✅ Lighthouse score is 95+ on all metrics
- [ ] ✅ No console errors or warnings
- [ ] ✅ Service worker registers successfully

## 🆘 Support and Maintenance

### Regular Maintenance Tasks

1. **Monthly**:
   - Check for security updates
   - Review performance metrics
   - Test all functionality

2. **Quarterly**:
   - Update dependencies
   - Review and update content
   - Perform security audit

3. **Annually**:
   - Update tax calculations for new year
   - Review POPIA compliance
   - Update documentation

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **Platform Documentation**: 
  - [GitHub Pages Docs](https://docs.github.com/en/pages)
  - [Render Docs](https://render.com/docs)
  - [Netlify Docs](https://docs.netlify.com)
- **Community Support**: Stack Overflow, GitHub Discussions

---

**Congratulations!** Your TaxEasy ZA 2025 application is now deployed and ready to help South African taxpayers with their tax calculations.

Remember to follow the preservation guidelines for any future updates and maintain the high standards of accessibility, performance, and compliance that make this application professional and reliable.



## 🎫 Promotional Code System Configuration

### Overview

The TaxEasy ZA 2025 application includes a promotional code system for testing purposes. This system allows bypassing PayFast payment processing to access premium PDF reports using one-time promotional codes.

### Pre-Deployment Configuration

Before deploying to production, you must configure the promotional code system:

#### For Testing/Development Deployment

1. **Keep promotional codes enabled** (default configuration):
   ```javascript
   // In public/js/config.js
   window.TaxEasyConfig.promoCodes = {
       enabled: true,  // Keep as true for testing
       codes: [
           // 100 promotional codes are pre-configured
       ]
   };
   ```

2. **Available promotional codes**: The system includes 100 unique UUID-based promotional codes
3. **Usage**: Each code can be used only once and is marked as used after successful validation

#### For Production Deployment

1. **Disable promotional codes** for live production:
   ```javascript
   // In public/js/config.js
   window.TaxEasyConfig.promoCodes = {
       enabled: false,  // Set to false for production
       codes: [
           // Codes remain but are not accessible
       ]
   };
   ```

2. **PayFast integration**: With promotional codes disabled, the application will use normal PayFast payment processing

### Promotional Code System Features

- **One-time use enforcement**: Each promotional code can only be used once
- **Seamless integration**: No modification to existing payment flow
- **Feature flag control**: Easy enable/disable via configuration
- **Professional PDF generation**: Bypasses payment to generate premium reports
- **Preservation compliant**: All changes follow injection-only workflow

### Testing the Promotional Code System

1. **Navigate to Summary step**: Complete the tax calculation wizard to reach Step 5
2. **Locate promotional code option**: Look for "Have a promotional code?" link in Professional Report section
3. **Enter promotional code**: Use any of the 100 pre-configured codes (see PROMOTIONAL_CODES.md)
4. **Validate and use**: Apply the code to access free professional PDF generation

### Sample Promotional Codes for Testing

Here are 10 sample promotional codes you can use for testing:

```
5d4468e1-f386-4cd9-bf75-52a83da2911a
6f69dd23-ec36-4387-a1fc-8f1d14c88392
0c601819-a854-4163-b1bb-f43b51c34e3d
1fae01a0-7349-4c8b-bbdb-a4bb60a5c8a0
2606663e-a265-4740-bb79-2b27ddc47ed3
8940a5ed-b057-4f3a-8571-ca61033c4f6c
5890b58b-fbd1-49d6-82e4-1fa23820adcb
de4b306f-d2f9-4aee-b8c3-0298f76549d1
14a8dcd1-92db-4618-a2bd-0be3ae64ad46
b8077a6d-028e-4bdb-86a9-87b32f9dfedc
```

### Important Notes

- **Security**: Current implementation is for testing purposes only
- **Client-side validation**: Promotional codes are validated client-side for simplicity
- **Production considerations**: For production use, implement server-side validation
- **Documentation**: Complete promotional code documentation available in PROMOTIONAL_CODES.md

### Troubleshooting

If promotional code functionality is not working:

1. **Check configuration**: Verify `promoCodes.enabled` is set to `true`
2. **Browser console**: Check for JavaScript errors
3. **File loading**: Ensure all JavaScript files are loading correctly
4. **Step completion**: Confirm you are on the Summary step (Step 5)


