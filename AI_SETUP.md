# AI Resume Analysis Setup Guide

This guide will help you set up the AI resume analysis feature using your client's API key.

## Prerequisites

1. Your client's AI API key (OpenAI, Anthropic, or other compatible provider)
2. Supabase project with the database schema already set up
3. Resumes uploaded to the Supabase storage bucket

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Configuration
VITE_AI_API_KEY=your_ai_api_key_here
VITE_AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
```

### AI API Configuration Options

#### OpenAI (Default)
```env
VITE_AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
```

#### Anthropic Claude
```env
VITE_AI_API_ENDPOINT=https://api.anthropic.com/v1/messages
```

#### Custom Provider
```env
VITE_AI_API_ENDPOINT=https://your-custom-endpoint.com/v1/chat/completions
```

## Features

### 1. Predefined Analysis Types

The AI service comes with 4 predefined analysis types:

- **Skill Analysis**: Analyzes sales skills and identifies areas for improvement
- **Career Path Planning**: Provides career progression recommendations and timeline
- **Interview Preparation**: Prepares for sales interviews with targeted questions
- **Outreach Personalization**: Creates personalized outreach strategies

### 2. Custom Analysis

Users can write their own system prompts for custom analysis needs.

### 3. Analysis History

All analyses are logged and can be viewed in the history section.

## Usage

1. Navigate to the Dashboard
2. Click on the "AI Analysis" tab in the sidebar
3. Select an analysis type or write a custom prompt
4. Click "Analyze Resume"
5. View, copy, or download the results

## Security Notes

- The AI API key is stored in environment variables and is safe to expose in the frontend
- All AI interactions are logged in the `api_integrations` table for tracking
- Resume content is retrieved securely from Supabase storage

## Customization

### Adding New Analysis Types

To add new predefined analysis types, edit the `getSystemPrompts()` method in `src/lib/aiService.js`:

```javascript
getSystemPrompts() {
  return {
    // ... existing prompts
    yourNewType: `Your custom system prompt here...`
  }
}
```

### Modifying the AI Model

To change the AI model, edit the `processResumeWithAI()` method in `src/lib/aiService.js`:

```javascript
body: JSON.stringify({
  model: 'gpt-4-turbo', // Change this to your preferred model
  messages: messages,
  max_tokens: 2000,
  temperature: 0.7
})
```

## Troubleshooting

### Common Issues

1. **"AI API key not configured"**: Make sure `VITE_AI_API_KEY` is set in your `.env` file
2. **"No resume found"**: Ensure the user has uploaded a resume during onboarding
3. **API errors**: Check that your API key is valid and has sufficient credits

### File Type Support

Currently supported file types:
- Text files (.txt)
- PDF files (basic support - may need additional libraries for full PDF parsing)

To add PDF parsing support, consider adding a library like `pdf-parse` or `pdfjs-dist`.

## API Integration Logs

All AI interactions are automatically logged in the `api_integrations` table with:
- User ID
- API name
- Request/response data
- Success/failure status
- Timestamps

This helps with debugging and usage tracking.
