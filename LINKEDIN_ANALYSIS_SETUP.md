# LinkedIn Analysis Setup Guide

## Quick Setup

To get the LinkedIn analysis feature working, you need to:

### 1. Set up Environment Variables

Create a `.env` file in your project root with:

```env
# Supabase Configuration (already configured)
VITE_SUPABASE_URL=https://upctqvobvdgqqyxrjajp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3Rxdm9idmRncXF5eHJqYWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTE1MDYsImV4cCI6MjA3MDI2NzUwNn0.RrY3DQ5UsRia-ZWZKuO5PCRPm1TqTJWM0BYIPLvzGQg

# AI API Configuration - REPLACE WITH YOUR ACTUAL API KEY
VITE_AI_API_KEY=your_openai_api_key_here
```

### 2. Get an OpenAI API Key

1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new API key
3. Replace `your_openai_api_key_here` in the `.env` file with your actual key

### 3. Test the Feature

1. Start the development server: `npm run dev`
2. Sign up or log in to the application
3. Complete the onboarding process (add your LinkedIn URL)
4. Go to the Dashboard
5. Click on the "LinkedIn Analysis" tab
6. Click "Analyze My Profile"

## How It Works

The LinkedIn analysis feature:

1. **Fetches your profile data** from the database (including LinkedIn URL)
2. **Uses AI to analyze** your profile information for SDR role optimization
3. **Provides recommendations** for:
   - Headline optimization
   - About section improvements
   - Skills to add
   - Content suggestions
   - Networking targets
4. **Shows metrics** like estimated profile views and engagement rates
5. **Saves the analysis** to your account for future reference

## Features

- **Profile Scoring**: Rates your LinkedIn effectiveness for SDR roles
- **Optimization Recommendations**: Specific suggestions for improvement
- **SDR Readiness Assessment**: Identifies strengths and gaps
- **Content Strategy**: AI-generated post topics and networking suggestions
- **Metrics Tracking**: Estimated performance indicators

## Troubleshooting

### "AI API key not configured" Error
- Make sure you've created the `.env` file
- Verify the API key is correct
- Restart the development server after adding the `.env` file

### "No LinkedIn URL found" Error
- Complete the onboarding process
- Make sure to add your LinkedIn URL during onboarding

### Analysis Not Working
- Check the browser console for error messages
- Verify your OpenAI API key has sufficient credits
- Make sure you're logged in and have completed onboarding

## Fallback Mode

If the AI service is not available, the system will use a fallback analysis based on your profile data, providing basic recommendations and scores.

## Next Steps

Once the LinkedIn analysis is working:

1. Review the recommendations
2. Update your LinkedIn profile accordingly
3. Use the content suggestions for networking
4. Track your progress over time
5. Re-analyze after making changes
