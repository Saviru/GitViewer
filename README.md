# GitHub Profile Views Counter

A customizable GitHub profile views counter that you can embed in your README with custom themes and styling options.

## Features

- 📊 Real-time view counting
- 🎨 Custom themes with gradient support
- ⚡ Fast image generation with Canvas
- 🚀 Vercel hosting ready
- 📱 Responsive web interface
- 🔧 TypeScript support

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up Vercel KV database
4. Deploy to Vercel
5. Add your KV credentials to environment variables

## Usage

Visit the deployed application, enter your GitHub username, customize your theme, and copy the generated markdown code to your profile README.

## API Endpoint

```
GET /api/views/{username}?theme={themeName}
GET /api/views/{username}?customTheme={encodedThemeJSON}
```

## Environment Variables

- `KV_REST_API_URL`: Vercel KV REST API URL
- `KV_REST_API_TOKEN`: Vercel KV REST API Token

## Development

```bash
npm run dev
```

## Deployment

Deploy to Vercel with one click or use the Vercel CLI.