# SDR MVP Setup Guide

## Environment Configuration

To fix the configuration issues you're seeing in the console, you need to create a `.env` file in your project root with the following variables:

### Step 1: Create `.env` file

Create a file named `.env` in your project root directory (same level as `package.json`) with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://upctqvobvdgqqyxrjajp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3Rxdm9idmRncXF5eHJqYWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTE1MDYsImV4cCI6MjA3MDI2NzUwNn0.RrY3DQ5UsRia-ZWZKuO5PCRPm1TqTJWM0BYIPLvzGQg

# AI API Configuration
# Replace 'your_ai_api_key_here' with your actual OpenAI API key
VITE_AI_API_KEY=your_ai_api_key_here
VITE_AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
```

### Step 2: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to "API Keys" in the left sidebar
4. Click "Create new secret key"
5. Copy the generated key
6. Replace `your_ai_api_key_here` in the `.env` file with your actual API key

### Step 3: Restart Your Development Server

After creating the `.env` file:

1. Stop your development server (Ctrl+C)
2. Run `npm run dev` again
3. The environment variables will now be loaded

## Current Issues Fixed

✅ **Supabase Configuration**: Now uses environment variables instead of hardcoded values
✅ **AI API Key**: Will be loaded from environment variables
✅ **Missing Environment Variables**: All required variables are now properly configured

## Verification

After setup, you should see in the console:
- ✅ `VITE_AI_API_KEY: SET`
- ✅ `VITE_SUPABASE_ANON_KEY: SET`
- ✅ `VITE_SUPABASE_URL: SET`
- ✅ No more "AI API key not configured" errors

## Security Notes

- The `.env` file should be added to `.gitignore` to keep your API key secure
- Never commit API keys to version control
- The current Supabase credentials are already public (anon key), so they're safe to use

## Troubleshooting

If you still see errors after creating the `.env` file:

1. Make sure the `.env` file is in the project root (same directory as `package.json`)
2. Restart your development server completely
3. Check that your OpenAI API key is valid and has credits
4. Verify the file name is exactly `.env` (not `.env.txt` or similar)

## Next Steps

Once the environment variables are configured:

1. The LinkedIn Profile Analysis should work properly
2. AI resume analysis features will be functional
3. All Supabase database operations will work correctly
4. The application will be fully operational

