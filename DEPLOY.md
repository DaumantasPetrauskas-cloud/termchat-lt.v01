🚀 DEPLOYMENT INSTRUCTIONS

## 1. GitHub Pages (Frontend)
```bash
# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/termchat-lt.git
git branch -M main
git push -u origin main
```
Then: GitHub repo → Settings → Pages → Source: Deploy from branch `main`
URL: https://YOUR_USERNAME.github.io/termchat-lt

## 2. Render (Backend AI Service)
1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python mqtt_service.py`
   - Environment Variables:
     * ZHIPU_API_KEY = 42b0a4fbe60e4568ba1b74d5e8d030d6.xSVMYljtqVXmRr33
     * AI_PROVIDER = zhipu
     * PORT = 10000

## 3. Alternative: Netlify (Frontend)
- Drag & drop project folder to netlify.com
- Instant deployment

✅ All files are ready for deployment!
✅ Security fixes applied
✅ PWA configured
✅ AI service ready