# KU Open House 2025 - Slideshow System

A Next.js-based slideshow presentation system with remote control capabilities using Socket.IO.

## Features

- **Display Page** (`/`): Main presentation display with automatic slide transitions
- **Remote Control** (`/remote`): Control interface with 3 buttons
  - Reset: Return to idle screen
  - Previous Slide: Navigate to previous slide
  - Next Slide: Navigate to next slide
- **Real-time Sync**: Uses Socket.IO for instant remote control
- **Video Transitions**: Smooth video transitions between idle and slides
- **Repeatable Loop**: Automatically returns to idle after last slide

## Setup

1. **Install dependencies** (already completed):
   ```bash
   npm install socket.io socket.io-client
   ```

2. **Add required assets**:
   - Place QR code images in `public/`:
     - `public/cpe.png` (CPE program QR code)
     - `public/ske.png` (SKE program QR code)
   - Place intro video at: `public/videos/intro.mp4` (plays when going from idle to first slide)
   - Place outro video at: `public/videos/outro.mp4` (plays when going from last slide to idle)
   - Slide images are already in `public/syl/` (1.png through 8.png)

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Display page: `http://localhost:3000/`
   - Remote control: `http://localhost:3000/remote`

## Project Structure

```
openhouse2025/
├── app/
│   ├── page.tsx              # Main display page
│   ├── remote/
│   │   └── page.tsx          # Remote control interface
│   └── api/
│       └── socket/
│           └── route.ts      # Socket.IO API route
├── public/
│   ├── data.json             # Slide configuration
│   ├── cpe.png               # CPE QR code (needs to be added)
│   ├── ske.png               # SKE QR code (needs to be added)
│   ├── syl/                  # Slide images
│   │   └── 1.png - 8.png     # Slide images
│   └── videos/               # Transition videos (needs to be created)
│       ├── intro.mp4         # Idle to first slide
│       └── outro.mp4         # Last slide to idle
├── server.js                 # Custom server with Socket.IO
└── lib/
    └── socket.ts             # Socket.IO utilities
```

## Usage Flow

1. **Idle State**: Display shows two QR codes (CPE and SKE) on a galaxy-themed black background
2. **Start Presentation**: Click "Next Slide" on remote
   - Plays intro video (`intro.mp4`)
   - Automatically transitions to first slide after video ends
3. **Navigate Slides**: Use "Next" and "Previous" buttons
   - All slides displayed on galaxy-themed black background with stars
4. **End Presentation**: From last slide, click "Next"
   - Plays outro video (`outro.mp4`)
   - Automatically returns to idle screen after video ends
5. **Reset Anytime**: Click "Reset" to immediately return to idle

## Notes

- The system is fully repeatable - after reaching idle, you can start over
- Socket.IO ensures real-time synchronization between display and remote
- Video transitions provide smooth visual flow between states
- All slides are stored in `public/data.json` for easy configuration

## Development

- Built with Next.js 16, React 19, and TypeScript
- Uses Tailwind CSS for styling
- Socket.IO for real-time communication
- Custom server implementation for Socket.IO integration
