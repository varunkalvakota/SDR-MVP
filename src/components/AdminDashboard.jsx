import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [resumeContent, setResumeContent] = useState('')

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        return
      }

      setUsers(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewResume = async (user) => {
    try {
      if (!user.resume_url) {
        alert('No resume uploaded for this user')
        return
      }

      setSelectedUser(user)
      
      // Extract file path from URL
      const urlParts = user.resume_url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const folderUserId = urlParts[urlParts.length - 2]
      const fullPath = `${folderUserId}/${fileName}`

      // Download resume content
      const { data: fileData, error } = await supabase.storage
        .from('resumes')
        .download(fullPath)

      if (error) {
        console.error('Error downloading resume:', error)
        setResumeContent('Error loading resume')
        return
      }

      // Convert to text
      const text = await fileData.text()
      setResumeContent(text)
    } catch (error) {
      console.error('Error viewing resume:', error)
      setResumeContent('Error loading resume')
    }
  }

  const downloadResume = async (user) => {
    try {
      if (!user.resume_url) {
        alert('No resume uploaded for this user')
        return
      }

      // Extract file path from URL
      const urlParts = user.resume_url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const folderUserId = urlParts[urlParts.length - 2]
      const fullPath = `${folderUserId}/${fileName}`

      // Download resume
      const { data: fileData, error } = await supabase.storage
        .from('resumes')
        .download(fullPath)

      if (error) {
        console.error('Error downloading resume:', error)
        return
      }

      // Create download link
      const blob = new Blob([fileData], { type: fileData.type })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${user.first_name}_${user.last_name}_resume.${fileName.split('.').pop()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading resume:', error)
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading user data...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Total Users: {users.length}</p>
        <p>Users with Resumes: {users.filter(u => u.resume_url).length}</p>
      </div>

      <div className="admin-content">
        <div className="users-list">
          <h2>All Users</h2>
          <div className="users-grid">
            {users.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <h3>{user.first_name} {user.last_name}</h3>
                  <p>{user.email}</p>
                  <p>Position: {user.current_position || 'Not specified'}</p>
                  <p>Experience: {user.experience_years || 'Not specified'}</p>
                  <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                  <p>Resume: {user.resume_url ? '✅ Uploaded' : '❌ Not uploaded'}</p>
                </div>
                
                <div className="user-actions">
                  {user.resume_url && (
                    <>
                      <button 
                        onClick={() => viewResume(user)}
                        className="btn-view"
                      >
                        View Resume
                      </button>
                      <button 
                        onClick={() => downloadResume(user)}
                        className="btn-download"
                      >
                        Download
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedUser && (
          <div className="resume-viewer">
            <div className="resume-header">
              <h2>Resume: {selectedUser.first_name} {selectedUser.last_name}</h2>
              <button onClick={() => setSelectedUser(null)}>Close</button>
            </div>
            <div className="resume-content">
              <pre>{resumeContent}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard




