# Digital Barista - AI Coffee Taste Predictor

A modern, AI-powered coffee taste prediction service with beautiful animations and intuitive UI. This application helps coffee enthusiasts optimize their brewing parameters by analyzing bean characteristics and grinder settings.

## Features

### 1. Input Form with Smooth Transitions
- Bean information input (name and roast level)
- Interactive roast level slider (Light to Dark)
- Grinder model and grind size configuration
- Real-time form validation
- Smooth Framer Motion animations

### 2. AI Loading Animation
- Particle effects simulating coffee bean dispersion
- Water droplet animations
- Dynamic text transitions showing analysis steps
- Progress bar with gradient effects
- Ripple effects for visual appeal

### 3. Result Display
- Interactive radar chart showing 5 taste attributes:
  - Acidity
  - Sweetness
  - Bitterness
  - Body
  - Balance
- Typing effect for AI-generated comments
- Personalized brewing recommendations:
  - Optimal water temperature
  - Grind size adjustments
  - Brew time suggestions
- Overall quality score

## Tech Stack

- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom coffee theme
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Design Concept

**Theme**: Digital Barista - A blend of warm coffee tones and modern tech aesthetics

**Color Palette**:
- Coffee Dark: `#2c1810`
- Coffee Brown: `#5c3d2e`
- Coffee Medium: `#8b6f47`
- Coffee Light: `#c9a882`
- Cream: `#f5e6d3`
- Slate: `#475569`
- Accent Gold: `#d4a574`

**Typography**: System fonts optimized for readability (Inter/Pretendard style)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd coffee-taste-predictor
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## How It Works

### Gemini API Integration (Production Ready)

The application is **fully integrated with Google Gemini API** for real AI-powered coffee taste analysis:

1. **Input Collection**: Users provide bean and grinder information
2. **API Request**: Frontend sends data to `/api/analyze` endpoint
3. **AI Analysis**: Gemini AI analyzes the brewing parameters using coffee science expertise
4. **Result Display**: Beautiful UI shows taste radar chart, AI comment, and recommendations

### Setup Gemini API

1. Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create `.env.local` file in project root:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```
3. Restart the development server:
```bash
npm run dev
```

**📘 Detailed API documentation**: See [API_FORMAT.md](./API_FORMAT.md)

### Fallback Mode

If no API key is set, the app automatically falls back to **intelligent mock data** that simulates realistic coffee taste predictions based on brewing science principles.

## Project Structure

```
coffee-taste-predictor/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts           # Gemini API integration
│   ├── components/
│   │   ├── InputForm.tsx          # User input interface
│   │   ├── LoadingAnimation.tsx   # AI analysis animation
│   │   └── ResultDisplay.tsx      # Results with chart
│   ├── globals.css                # Tailwind + theme config
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main app logic
├── public/                        # Static assets
├── .env.local                     # Environment variables (create this)
├── .env.example                   # Example env file
├── API_FORMAT.md                  # API documentation
├── README.md                      # This file
└── package.json
```

## Key Components

### InputForm.tsx
- Handles user input collection
- Validates form data
- Smooth transition animations
- Custom slider for roast levels

### LoadingAnimation.tsx
- 12 rotating particles around coffee cup
- 6 falling water droplets
- 5 sequential loading messages
- Ripple effects and progress bar
- All animations synchronized with Framer Motion

### ResultDisplay.tsx
- Radar chart with 5 taste dimensions
- Typing effect for AI comments (30ms per character)
- 3 recommendation cards with hover effects
- Overall score with color-coded feedback
- Reset button to start new analysis

## Customization

### Modify Theme Colors
Edit `app/globals.css`:
```css
:root {
  --coffee-dark: #2c1810;
  --coffee-brown: #5c3d2e;
  /* Add your colors */
}
```

### Adjust Animation Timing
Edit component files:
- InputForm: Delay between form elements (0.1s increments)
- LoadingAnimation: Particle rotation (2s), droplets (1.5s)
- ResultDisplay: Typing speed (30ms), chart fade-in (0.4s)

### Change Loading Duration
Edit `app/page.tsx`:
```typescript
setTimeout(() => {
  // Change from 3000 to desired milliseconds
}, 3000);
```

## Deployment

### Cloudflare Pages (Recommended ⭐)

This project is optimized for **Cloudflare Pages** with Pages Functions for serverless API.

**Quick Deploy:**
1. Push to GitHub
2. Connect to Cloudflare Pages
3. Set `GEMINI_API_KEY` environment variable
4. Deploy!

**📘 Full Guide**: See [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md)

**Benefits:**
- ⚡ Edge computing (super fast)
- 💰 Free tier: 100k requests/day
- 🌍 Global CDN: 275+ cities
- 🔒 API key stays server-side

### Alternative: Vercel/Netlify

Traditional Next.js API Routes work out of the box on Vercel and Netlify.

```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Initial load: ~200KB gzipped
- Framer Motion tree-shaking enabled
- Tailwind CSS purging unused styles
- Next.js automatic code splitting

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Credits

Created as a demonstration of modern React patterns, animation techniques, and UI/UX best practices for AI-powered applications.

---

**Note**: This is a prototype application. The "AI analysis" is currently simulated with mock data. For production use, integrate with a real machine learning backend (Gemini API, OpenAI, or custom model).
