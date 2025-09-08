# LinkedIn Analysis Database Setup

## How to Add LinkedIn Analysis Tables to Your Supabase Database

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your SDR MVP project

### Step 2: Access SQL Editor
1. In the left sidebar, click **"SQL Editor"**
2. Click **"New Query"**

### Step 3: Run the LinkedIn Analysis Tables Script
1. Copy the contents of `add-linkedin-analysis-tables.sql` file
2. Paste it into the SQL Editor
3. Click **"Run"** to execute the script

### Step 4: Verify Tables Created
1. Go to **"Table Editor"** in the left sidebar
2. You should see these new tables:
   - `linkedin_analysis_results`
   - `linkedin_profile_snapshots`
   - `linkedin_analysis_templates`
   - `linkedin_analysis_history`

## What These Tables Do

### `linkedin_analysis_results` Table
- **Purpose**: Stores complete LinkedIn analysis results
- **Key Features**:
  - Analysis data in JSONB format for flexibility
  - Extracted metrics (profile views, engagement rate, etc.)
  - Individual scores for different profile sections
  - Strengths, areas to improve, and detailed next steps
  - AI analysis metadata (model version, tokens used)
  - Favorites and tagging system

### `linkedin_profile_snapshots` Table
- **Purpose**: Tracks LinkedIn profile changes over time
- **Key Features**:
  - Historical profile data
  - Change detection between snapshots
  - Profile metrics tracking
  - Comparison capabilities

### `linkedin_analysis_templates` Table
- **Purpose**: Stores reusable analysis prompts and configurations
- **Key Features**:
  - Pre-built analysis templates
  - Customizable scoring criteria
  - Public and private templates
  - Different analysis types (SDR-focused, general, industry-specific)

### `linkedin_analysis_history` Table
- **Purpose**: Tracks all analysis requests and usage
- **Key Features**:
  - Request logging and analytics
  - Performance tracking
  - User behavior insights

## Security Features
- **Row Level Security (RLS)** enabled on all tables
- Users can only see and modify their own data
- Public templates are accessible to all users
- Policies prevent unauthorized access

## Default Templates Included
The script automatically creates these analysis templates:

1. **SDR-Focused Analysis** - Comprehensive analysis for SDR role readiness
2. **Quick Profile Review** - Fast analysis for general optimization
3. **Tech Sales Analysis** - Industry-specific analysis for tech sales roles

## Benefits of This Database Structure

### For Users:
- ✅ **Persistent Analysis History** - Never lose your analysis results
- ✅ **Progress Tracking** - See how your profile improves over time
- ✅ **Favorites System** - Save your best analyses
- ✅ **Detailed Recommendations** - Structured next steps with actions
- ✅ **Performance Metrics** - Track profile views and engagement

### For the Application:
- ✅ **Better Performance** - Cached analysis results
- ✅ **Analytics** - Track usage patterns and popular features
- ✅ **Scalability** - Efficient data storage and retrieval
- ✅ **Flexibility** - JSONB storage allows for easy feature additions

## Next Steps After Setup

1. **Test the LinkedIn Analysis**:
   - Go to Dashboard → LinkedIn Analysis
   - Run an analysis on your profile
   - Check that results are saved to the database

2. **Verify Data Storage**:
   - Go to Table Editor → `linkedin_analysis_results`
   - You should see your analysis data stored there

3. **Test Features**:
   - Mark analyses as favorites
   - Check analysis history
   - Verify progress tracking

## Troubleshooting
If you get errors:
1. Make sure you're logged into Supabase
2. Check that your project is active
3. Verify the SQL syntax is correct
4. Check the Supabase logs for detailed error messages
5. Ensure you have the necessary permissions to create tables

## Integration with Existing Code
The LinkedIn Analysis component will automatically use these tables once they're created. The existing code already has the database integration built-in, so no code changes are needed!
