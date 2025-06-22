# 🚀 Deployment Guide for Arithmetic Game

## Quick Deploy Options

### Option 1: Vercel (Recommended - 2 minutes)
```bash
# Deploy directly from your project
npx vercel

# Follow the prompts:
# - Set up and deploy? → Yes
# - Which scope? → Your account
# - Link to existing project? → No
# - Project name? → arithmetic-game (or your choice)
# - Directory? → ./ (current directory)
# - Override settings? → No
```

### Option 2: Netlify (Alternative)
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy!

### Option 3: GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

## 🎯 Recommended: Vercel Deployment

Vercel is the easiest option because:
- ✅ Automatic React detection
- ✅ Free hosting
- ✅ Custom domain support
- ✅ Automatic deployments from Git
- ✅ Great performance

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

1. **Build works locally:**
   ```bash
   npm run build
   ```

2. **All features work:**
   - ✅ Game starts properly
   - ✅ Sound effects work
   - ✅ High score saves
   - ✅ Revival modal appears
   - ✅ All screens display correctly

3. **Test the build:**
   ```bash
   npm run preview
   ```

## 🌐 After Deployment

### 1. Get Your Live URL
After deploying, you'll get a URL like:
- Vercel: `https://your-app.vercel.app`
- Netlify: `https://your-app.netlify.app`
- GitHub Pages: `https://username.github.io/repo-name`

### 2. Test Your Live Site
- ✅ Game loads properly
- ✅ All features work
- ✅ Mobile responsive
- ✅ Sound effects work
- ✅ Revival modal appears

### 3. Apply for AdSense
1. Go to [Google AdSense](https://www.google.com/adsense)
2. Click "Get Started"
3. Enter your live website URL
4. Fill out the application form
5. Wait for approval (usually 1-2 weeks)

## 🔧 AdSense Integration

Once approved:

1. **Get your AdSense code:**
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"></script>
   ```

2. **Add to your index.html:**
   ```html
   <head>
     <!-- Add AdSense code here -->
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"></script>
   </head>
   ```

3. **Update adService.ts:**
   Replace mock ads with real AdSense calls

## 📊 Expected Timeline

- **Deployment:** 5 minutes
- **AdSense Application:** 1-2 weeks
- **First Revenue:** 2-4 weeks after approval

## 💡 Tips for AdSense Approval

1. **Quality Content:** Your math game is perfect for this
2. **Original Content:** ✅ You built this yourself
3. **Good UX:** ✅ Non-intrusive ads
4. **Mobile Friendly:** ✅ Responsive design
5. **Privacy Policy:** Add one to your site
6. **Terms of Service:** Add one to your site

## 🚨 Common Issues

**Build Fails:**
```bash
# Check for TypeScript errors
npm run build

# Fix any errors before deploying
```

**AdSense Rejected:**
- Make sure site is live for at least 1 week
- Add privacy policy and terms
- Ensure original content
- Check mobile responsiveness

## 📞 Need Help?

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **AdSense Help:** [support.google.com/adsense](https://support.google.com/adsense)
- **GitHub Issues:** Create an issue in your repo

---

**Ready to deploy? Run: `npx vercel`** 