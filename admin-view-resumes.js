// Admin Script to View All User Resumes
// Run this in your browser console or as a Node.js script

import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials (from your .env file)
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function viewAllUserResumes() {
  try {
    console.log('🔍 Fetching all user profiles...')
    
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('id, email, first_name, last_name, resume_url, created_at')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching users:', error)
      return
    }
    
    console.log(`✅ Found ${users.length} users:`)
    console.table(users)
    
    // Show users with resumes
    const usersWithResumes = users.filter(user => user.resume_url)
    console.log(`📄 Users with resumes: ${usersWithResumes.length}`)
    
    if (usersWithResumes.length > 0) {
      console.log('\n📋 Users with uploaded resumes:')
      usersWithResumes.forEach((user, index) => {
        console.log(`${index + 1}. ${user.first_name} ${user.last_name} (${user.email})`)
        console.log(`   Resume: ${user.resume_url}`)
        console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`)
        console.log('')
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the function
viewAllUserResumes()

