# 🎬 Remotion Reels Factory

**Premium AI-powered motivational reels with After Effects-quality motion graphics.**

Fully automated pipeline: AI writes the script → generates voiceover → renders cinematic video → uploads to Google Drive.

## Architecture

```
n8n (Orchestration)                    GitHub Actions (Rendering)
┌────────────────────────┐             ┌──────────────────────────┐
│ Schedule (every 4h)    │             │ 1. Checkout Remotion     │
│ → Groq AI: Script      │             │ 2. npm ci                │
│ → Edge TTS: Voiceover  │  dispatch   │ 3. Render video          │
│ → Upload audio to Drive│ ─────────→  │ 4. Download audio        │
│ → Trigger GitHub       │             │ 5. FFmpeg merge          │
│ → Update Sheet         │             │ 6. Upload to Drive       │
└────────────────────────┘             │ 7. Webhook → n8n         │
         ↑                             └──────────────────────────┘
         │ webhook callback                      │
         └───────────────────────────────────────┘
```

## Reel Structure (30-45 seconds)

| Scene | Duration | Effect |
|-------|----------|--------|
| **Hook** | 0-3.5s | Dramatic zoom-in + flash + particles |
| **Quote Reveal** | 3.5-22s | Word-by-word kinetic typography + glow |
| **Author** | 22-28s | Elegant fade-in + decorative lines |
| **CTA** | 28-35s | Animated follow button + handle |

### Visual Effects
- ✨ **Particle Field** — 45 floating bokeh particles with random drift
- 🎨 **Animated Gradients** — Slowly rotating multi-color backgrounds
- ✍️ **Kinetic Typography** — Spring-animated word-by-word text reveal
- 💫 **Glow Effects** — Multi-layer pulsing text glow
- 📹 **Camera Drift** — Subtle position/scale movement
- 🌑 **Film Grain + Vignette** — Cinematic finish

### 5 Premium Themes
| Theme | Primary | Accent |
|-------|---------|--------|
| `dark` | Deep purple/blue | Indigo |
| `sunset` | Warm brown | Orange |
| `ocean` | Deep teal | Cyan |
| `fire` | Deep red | Red |
| `galaxy` | Midnight blue | Purple |

---

## Quick Setup (20 minutes)

### Step 1: Install Dependencies

```bash
cd 10-RemotionReels/remotion-reels
npm install
```

### Step 2: Test Locally

```bash
# Open Remotion Studio (live preview)
npx remotion studio

# Render a test video
npx remotion render MotivationalReel out/test.mp4
```

### Step 3: Create GitHub Repository

```bash
cd remotion-reels
git init
git add .
git commit -m "Initial Remotion Reels Factory"
git remote add origin https://github.com/YOUR_USERNAME/remotion-reels.git
git push -u origin main
```

### Step 4: Add GitHub Secrets

Go to repo → Settings → Secrets → Actions:

| Secret | Value |
|--------|-------|
| `RCLONE_CONFIG` | Base64-encoded rclone config (see below) |
| `OUTPUT_FOLDER_PATH` | Google Drive folder path for rclone (e.g., `Reels Output`) |
| `N8N_WEBHOOK_URL` | Your n8n webhook URL for `reel-complete` |

**Rclone Setup:**
```bash
# Install rclone locally
# Configure with: rclone config
# Create a remote called "gdrive" with your Google account
# Then encode it:
base64 -w 0 ~/.config/rclone/rclone.conf
# Copy the output as RCLONE_CONFIG secret
```

### Step 5: Configure n8n Workflow

The workflow "Remotion Reels Factory" is already created in your n8n instance.

**Update these placeholders:**
1. **Groq API credential**: Create HTTP Header Auth → `Authorization: Bearer YOUR_GROQ_KEY`
2. **GitHub PAT credential**: Create HTTP Header Auth → `Authorization: Bearer ghp_YOUR_TOKEN`
3. **Google Drive**: Connect your OAuth2 credential
4. **Google Sheets**: Connect + set your Sheet ID
5. **Trigger GitHub Actions node**: Replace `YOUR_USERNAME/remotion-reels` in the URL
6. **Upload Audio node**: Set your Google Drive folder ID
7. **Watermark**: Change `@YourPage` in Parse Script to your handle

### Step 6: Activate!

Toggle the workflow to Active. It will auto-run every 4 hours.

---

## API Keys Needed (All FREE)

| Service | Get From | Cost |
|---------|----------|------|
| Groq API | [console.groq.com](https://console.groq.com) | Free tier |
| GitHub PAT | [github.com/settings/tokens](https://github.com/settings/tokens) | Free |
| Google Drive | [console.cloud.google.com](https://console.cloud.google.com) | 15 GB free |
| Edge TTS | StreamElements API | Free, unlimited |

**Estimated cost per reel: $0.00** (all free APIs!)

---

## File Structure

```
10-RemotionReels/remotion-reels/
├── .github/workflows/
│   └── render-reel.yml          # GitHub Actions: render + merge + upload
├── src/
│   ├── index.ts                 # Remotion entry point
│   ├── Root.tsx                 # Composition registration
│   ├── schema.ts                # Zod schema + theme colors
│   ├── compositions/
│   │   └── MotivationalReel.tsx # Main 4-scene composition
│   └── components/
│       ├── ParticleField.tsx     # Floating bokeh particles
│       ├── GradientBackground.tsx # Animated gradient + vignette
│       ├── KineticText.tsx       # Word-by-word spring text
│       ├── GlowText.tsx          # Multi-layer glow text
│       ├── Watermark.tsx         # Channel overlay
│       └── CTAScene.tsx          # Follow button animation
├── package.json
├── tsconfig.json
├── remotion.config.ts
└── README.md
```

## Customization

### Change Voice
In the n8n workflow "Edge TTS" node, change the `voice` parameter:
- `Brian` — Deep male (default, most popular for motivation)
- `Matthew` — Natural male
- `Jenny` — Female

### Change Niche
Update the Groq system prompt in the "Groq - Generate Script" node to generate different content:
- Business tips
- Tech facts
- Stoic philosophy
- Fitness motivation
- Financial wisdom

### Add Background Music
In the GitHub Actions workflow, add a step to mix background music:
```yaml
- name: Add background music
  run: |
    ffmpeg -i /tmp/final-reel.mp4 -i music.mp3 \
      -filter_complex "[1:a]volume=0.15[bg];[0:a][bg]amix=inputs=2:duration=first" \
      -c:v copy -y /tmp/final-with-music.mp4
```

---

## n8n Workflow Details

**Workflow ID:** `t2upbgTE61ZZ5kVK`

| Node | Type | Purpose |
|------|------|---------|
| Schedule Trigger | Schedule | Every 4 hours |
| Groq - Generate Script | HTTP Request | AI motivational script generation |
| Parse Script | Code | Extract JSON, pick random theme, calculate duration |
| Edge TTS - Voiceover | HTTP Request | Free neural voice synthesis |
| Upload Audio to Drive | Google Drive | Store voiceover for GitHub Actions |
| Prepare GitHub Dispatch | Code | Build inputProps + audio URL |
| Trigger GitHub Actions | HTTP Request | repository_dispatch to render |
| Update Sheet - Rendering | Google Sheets | Track status |
| Webhook - Reel Complete | Webhook | Receive render completion callback |
| Update Sheet - Complete | Google Sheets | Mark as completed |
