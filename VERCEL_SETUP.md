# Vercel Deployment Guide

This project is now configured to work with Vercel using Pusher for real-time communication.

## Prerequisites
- A Vercel account
- A Pusher account (free tier available)

## Setup Steps

### 1. Get Pusher Credentials

1. Go to [Pusher Dashboard](https://dashboard.pusher.com/)
2. Sign up or log in
3. Click "Create app"
4. Fill in:
   - Name: `openhouse-slides` (or any name you prefer)
   - Cluster: Choose the closest to your location (e.g., `ap1` for Asia Pacific)
   - Create app for: `Front-end` and `Back-end`
5. Click "Create app"
6. Go to "App Keys" tab and copy:
   - `app_id`
   - `key`
   - `secret`
   - `cluster`

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. In the "Configure Project" section:
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
5. Add Environment Variables:
   ```
   PUSHER_APP_ID=your_app_id_here
   NEXT_PUBLIC_PUSHER_KEY=your_key_here
   PUSHER_SECRET=your_secret_here
   NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster_here
   ```
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables via CLI:
   ```bash
   vercel env add PUSHER_APP_ID
   vercel env add NEXT_PUBLIC_PUSHER_KEY
   vercel env add PUSHER_SECRET
   vercel env add NEXT_PUBLIC_PUSHER_CLUSTER
   ```

5. Redeploy after adding env vars:
   ```bash
   vercel --prod
   ```

### 3. Local Development with Pusher

1. Create a `.env.local` file in the project root:
   ```
   PUSHER_APP_ID=your_app_id_here
   NEXT_PUBLIC_PUSHER_KEY=your_key_here
   PUSHER_SECRET=your_secret_here
   NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster_here
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### 4. How to Use

1. **Main Display**: Open `https://your-vercel-url.vercel.app` on the display screen(s)
2. **Remote Control**: Open `https://your-vercel-url.vercel.app/remote` on your phone/tablet

The remote will now control **ALL** connected displays simultaneously!

## Features

- ✅ Real-time slide control across multiple displays
- ✅ Skippable video transitions (click video or "Skip" button)
- ✅ Professional presentation styling
- ✅ Works on Vercel serverless infrastructure
- ✅ No server maintenance required

## Troubleshooting

### Remote not controlling slides
- Check that all environment variables are set correctly in Vercel
- Verify Pusher credentials are correct
- Check browser console for errors
- Ensure the Pusher app is not suspended (free tier limits)

### Videos not playing
- Make sure video files are in `/public/videos/` directory
- Check video file names match: `intro.mp4` and `outro.mp4`
- Ensure videos are in a web-compatible format (H.264)

### Slides not showing
- Verify images are in `/public/syl/` directory
- Check `data.json` paths are correct
- Ensure images are optimized for web

## Project Structure

```
openhouse2025/
├── app/
│   ├── api/
│   │   └── pusher/
│   │       └── route.ts          # Pusher API endpoint
│   ├── remote/
│   │   └── page.tsx              # Remote control page
│   └── page.tsx                  # Main display page
├── lib/
│   └── pusher.ts                 # Pusher client utilities
├── public/
│   ├── syl/                      # Slide images
│   ├── videos/                   # Transition videos
│   └── data.json                 # Slides configuration
└── vercel.json                   # Vercel configuration
```

## Support

For issues, check:
- [Pusher Documentation](https://pusher.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
