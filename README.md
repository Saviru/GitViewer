# Profile Views Counter

Deploy with Vercel

A serverless profile views counter that generates an animated SVG showing how many times your GitHub profile has been viewed. Built with Vercel serverless functions.

Last updated: 2025-04-02 15:34:05 UTC

## 🚀 One-Click Deployment

Click the "Deploy with Vercel" button above to deploy this project to your Vercel account in seconds.

## 💡 How It Works

### This counter:

- Generates a beautiful animated SVG badge
- Increments a counter each time your profile is viewed
- Displays the current count and last updated date
- Updates in real-time with no GitHub Actions required


## 📊 Usage

After deployment, add this to your GitHub profile README.md:

```
## Profile Views

![Profile Views](https://your-vercel-deployment-url.vercel.app/api/simple-svg)
```
###### *Replace your-vercel-deployment-url with the URL Vercel provides after deployment.

## 🧰 Features

- **Real-time updates**: Count increments instantly when someone views your profile
- **Animated design**: Pulsing effect makes your profile more engaging
- **Lightweight**: Minimal serverless implementation
- **No database required**: Uses in-memory storage for simplicity

## 📝 Implementation Details

This project uses:

- Vercel Serverless Functions
- SVG generation for the counter badge
- In-memory storage (resets on deployment)
- Simple API endpoint that increments the counter
🔄 Advanced Setup
For persistent storage that won't reset on deployment:

Set up Vercel KV or Upstash Redis
Configure the environment variables in your Vercel project
Use the advanced API endpoints as described in the code comments

<hr>
Made with ❤️ for the GitHub community