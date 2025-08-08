import './SupabaseSetup.css'

const SupabaseSetup = () => {
  return (
    <div className="supabase-setup-banner">
      <div className="setup-content">
        <h3>⚠️ Supabase Setup Required</h3>
        <p>To enable authentication, please:</p>
        <ol>
          <li>Create a project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
          <li>Get your Project URL and API Key</li>
          <li>Update credentials in <code>src/lib/supabase.js</code></li>
        </ol>
        <p className="setup-note">
          The app will work with mock authentication until you configure Supabase.
        </p>
        <div className="security-note">
          <strong>🔒 Security Note:</strong> The VITE_SUPABASE_ANON_KEY is safe to expose publicly. 
          Security is handled by Row Level Security (RLS) policies in your Supabase database.
        </div>
      </div>
    </div>
  )
}

export default SupabaseSetup