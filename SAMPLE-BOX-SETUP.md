# Sample Box - Sanity Setup Guide

## ✅ What's Been Done

1. ✅ **Sanity Schema Created** - `sanity/schemas/sampleBox.ts`
2. ✅ **Component Updated** - Fully integrated with Sanity
3. ✅ **Page Updated** - Fetches data from Sanity automatically

---

## 🚀 How to Add Your Media (3 Easy Steps)

### Step 1: Start Sanity Studio

```bash
cd sanity
npm run dev
```

Visit: `http://localhost:3333`

### Step 2: Create Sample Box Content

1. In Sanity Studio, click **"Sample Box"** in the sidebar
2. Click **"Create new Sample Box"**
3. Fill in the content:

**Image Gallery:**
- Click "Add item" to add images
- Upload your photos (3 recommended):
  - Box closed (outside view)
  - Box open with patches
  - Patches laid out
- Add Alt Text for each image (required for SEO)
- Optionally add Captions

**Unboxing Video:**
- Click "Upload" under Video File
- Upload your compressed video (MP4, under 5MB)
- Optionally upload a custom thumbnail
- Set video title (default: "Sample Box Unboxing")

4. Click **"Publish"**

### Step 3: View Your Site

Your changes will appear immediately! The page auto-refreshes from Sanity every hour.

---

## 📸 Recommended Media Specs

### Images:
- **Format:** JPG or WebP
- **Size:** 1200x900px (4:3 ratio)
- **File size:** Under 500KB each
- **Count:** 3-5 images

### Video:
- **Format:** MP4 (H.264 codec)
- **Length:** 10-30 seconds
- **File size:** Under 5MB
- **Resolution:** 1080p or 720p

---

## 🎬 How to Compress Your Video

### Option 1: HandBrake (Free Desktop App)
1. Download: https://handbrake.fr/
2. Open your video
3. Choose preset: "Web" → "Gmail Large 3 Minutes 720p30"
4. Click "Start Encode"

### Option 2: FFmpeg (Command Line)
```bash
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 2M -s 1280x720 output.mp4
```

### Option 3: CloudConvert (Online)
1. Visit: https://cloudconvert.com/mp4-converter
2. Upload your video
3. Set quality to 720p
4. Download compressed file

---

## 🔄 Updating Content Later

Want to swap images or update the video?

1. Go to Sanity Studio
2. Click on "Sample Box"
3. Click the existing document
4. Update images/video
5. Click "Publish"

**Done!** Changes appear automatically (within 1 hour)

---

## 🎯 Pro Tips

1. **First Image is Special** - Used as fallback for video thumbnail
2. **Alt Text Matters** - Great for SEO and accessibility
3. **Captions are Optional** - But they look nice overlaid on images
4. **Video is Optional** - Site works fine with just images
5. **Keep Videos Short** - 10-20 seconds is perfect for engagement

---

## ❓ Troubleshooting

**"I don't see my changes"**
- Wait up to 1 hour (ISR caching)
- Or restart your Next.js dev server

**"Images not loading"**
- Check that you clicked "Publish" in Sanity
- Verify image alt text is filled in (required)

**"Video not playing"**
- Ensure MP4 format
- Check file size is under 5MB
- Try H.264 codec

---

## 📚 What You Can Improve Later

- Add more images (up to 6 max)
- Create multiple unboxing videos
- Add image captions for storytelling
- Update video with better quality
- Add 360° product views

---

That's it! You now have a fully dynamic sample box page managed through Sanity CMS.

No code changes needed - just upload your media in Sanity Studio! 🎉
