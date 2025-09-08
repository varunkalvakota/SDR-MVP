# Daily Missions Database Setup

## Overview
This guide will help you set up the database tables for the Daily Missions system in your Supabase project.

## Database Tables Created

### 1. `daily_missions`
Stores daily mission data for each user:
- Mission details (title, description, type)
- Progress tracking (target count, completed count)
- XP rewards and priority levels
- Tips and estimated time

### 2. `outreach_activities`
Tracks all outreach activities:
- Contact information
- Outreach type (email, LinkedIn, phone, video)
- Message content and timestamps
- Response tracking and interview booking status

### 3. `user_mission_stats`
Aggregates daily mission statistics:
- Daily completion counts
- XP earned per day
- Streak tracking
- Activity summaries

## Setup Instructions

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** tab
3. Click **New Query**

### Step 2: Run the SQL Script
1. Copy the entire contents of `add-daily-missions-tables.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

### Step 3: Verify Tables Created
After running the script, you should see:
- ✅ 3 new tables created
- ✅ Indexes for performance optimization
- ✅ Row Level Security (RLS) enabled
- ✅ Policies for data access control
- ✅ Triggers for automatic timestamp updates

### Step 4: Test the Setup
The Daily Missions component will automatically:
- Generate daily missions for users
- Save progress to the database
- Track outreach activities
- Maintain user statistics

## Features Enabled

### Daily Mission Generation
- **5 Mission Types**: Prospecting, Outreach, Follow-up, Research, Networking
- **Smart Scheduling**: New missions generated daily
- **Progress Tracking**: Real-time completion status
- **XP System**: Gamified rewards for completion

### Outreach Management
- **Multi-Channel Tracking**: Email, LinkedIn, Phone, Video
- **Response Monitoring**: Track replies and interview bookings
- **Contact Database**: Centralized prospect management
- **Activity History**: Complete outreach timeline

### Analytics & Insights
- **Daily Statistics**: Mission completion rates
- **Streak Tracking**: Consecutive days of activity
- **Performance Metrics**: XP earned, response rates
- **Progress Visualization**: Charts and progress bars

## Database Schema Details

### Daily Missions Table
```sql
daily_missions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  mission_date DATE,
  mission_type VARCHAR(50),
  title VARCHAR(255),
  description TEXT,
  target_count INTEGER,
  touches_completed INTEGER,
  mission_completed BOOLEAN,
  xp_reward INTEGER,
  priority VARCHAR(20),
  estimated_time VARCHAR(50),
  tips TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Outreach Activities Table
```sql
outreach_activities (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  contact_name VARCHAR(255),
  company_name VARCHAR(255),
  role_type VARCHAR(100),
  outreach_type VARCHAR(50),
  message_content TEXT,
  sent_at TIMESTAMP,
  replied_at TIMESTAMP,
  interview_booked BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### User Mission Stats Table
```sql
user_mission_stats (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  date DATE,
  missions_completed INTEGER,
  total_xp_earned INTEGER,
  streak_days INTEGER,
  last_activity_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Automatic user ID filtering

### Access Policies
- **SELECT**: Users can view their own records
- **INSERT**: Users can create their own records
- **UPDATE**: Users can modify their own records
- **DELETE**: Users can delete their own records

## Performance Optimizations

### Indexes Created
- `idx_daily_missions_user_date`: Fast user/date lookups
- `idx_outreach_activities_user`: Quick user activity queries
- `idx_outreach_activities_sent_at`: Time-based sorting
- `idx_user_mission_stats_user_date`: Efficient stats retrieval

### Automatic Updates
- `updated_at` timestamps automatically maintained
- Triggers ensure data consistency
- Optimized for real-time updates

## Troubleshooting

### Common Issues

**"Policy already exists" Error**
- This is normal and can be ignored
- The script uses `DROP POLICY IF EXISTS` to handle existing policies

**"Table already exists" Warning**
- This is expected if tables were previously created
- The script uses `CREATE TABLE IF NOT EXISTS` for safety

**Permission Errors**
- Ensure you're running the script as a database owner
- Check that RLS policies are properly configured

### Verification Steps
1. Check that all 3 tables exist in your database
2. Verify RLS is enabled on all tables
3. Test creating a mission (should work without errors)
4. Confirm data isolation (users only see their own data)

## Next Steps

After setting up the database:
1. **Test the Daily Missions feature** in your app
2. **Complete a few missions** to verify data persistence
3. **Check the analytics tab** for performance metrics
4. **Add outreach activities** to test contact management

The Daily Missions system is now fully integrated and ready to help users build consistent SDR habits!
