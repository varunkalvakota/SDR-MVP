# Supabase Training Tables Setup

## How to Add Training Progress Tables to Your Supabase Database

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your SDR MVP project

### Step 2: Access SQL Editor
1. In the left sidebar, click **"SQL Editor"**
2. Click **"New Query"**

### Step 3: Run the Training Tables Script
1. Copy the contents of `add-training-tables.sql` file
2. Paste it into the SQL Editor
3. Click **"Run"** to execute the script

### Step 4: Verify Tables Created
1. Go to **"Table Editor"** in the left sidebar
2. You should see these new tables:
   - `training_progress`
   - `user_achievements`

### Step 5: Test the Training Camp
1. Go back to your app at http://localhost:5174/
2. Navigate to Dashboard → Training Camp
3. Try completing a lesson
4. Check the browser console for success messages

## What These Tables Do

### `training_progress` Table
- Stores user progress for each training module
- Tracks scores, completion status, and attempts
- Links to user accounts via `user_id`

### `user_achievements` Table
- Stores badges and achievements earned by users
- Tracks points and achievement types
- Links to user accounts via `user_id`

## Security Features
- **Row Level Security (RLS)** enabled on both tables
- Users can only see and modify their own data
- Policies prevent unauthorized access

## Troubleshooting
If you get errors:
1. Make sure you're logged into Supabase
2. Check that your project is active
3. Verify the SQL syntax is correct
4. Check the Supabase logs for detailed error messages

## Next Steps
Once the tables are created, the Training Camp will:
- ✅ Save progress to the database
- ✅ Load progress on page refresh
- ✅ Track XP and achievements
- ✅ Unlock modules based on completion
