import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { FiUpload, FiRefreshCw } from 'react-icons/fi'

const ResumeStatus = () => {
  const { user } = useAuth()
  const [resumeInfo, setResumeInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    if (user) {
      checkResumeStatus()
    }
  }, [user])

  const checkResumeStatus = async () => {
    try {
      setLoading(true)
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('resume_url, first_name, last_name')
        .eq('id', user.id)
        .single()

      if (profileError) {
        setError(`Profile error: ${profileError.message}`)
        return
      }

      if (!profile?.resume_url) {
        setResumeInfo({ status: 'no_resume', message: 'No resume uploaded' })
        return
      }

      // Handle both old (full URL) and new (file path) resume_url formats
      let filePath = profile.resume_url
      let fileName = ''
      
      // If it's a full URL, extract the file path
      if (profile.resume_url.includes('http')) {
        const urlParts = profile.resume_url.split('/')
        fileName = urlParts[urlParts.length - 1]
        const userId = urlParts[urlParts.length - 2]
        filePath = `${userId}/${fileName}`
      } else {
        // It's already a file path
        fileName = profile.resume_url.split('/').pop()
        filePath = profile.resume_url
      }
      
      // For private buckets, we need to generate a signed URL
      const { data: signedUrl, error: urlError } = await supabase.storage
        .from('resumes')
        .createSignedUrl(filePath, 3600) // 1 hour expiry
      
      if (urlError) {
        console.error('Error generating signed URL:', urlError)
        setError(`URL generation error: ${urlError.message}`)
        return
      }
      
      // Extract file extension
      const fileExtension = fileName.split('.').pop().toLowerCase()
      
      setResumeInfo({
        status: 'has_resume',
        url: signedUrl.signedUrl,
        fileName: fileName,
        fileType: fileExtension,
        userName: `${profile.first_name} ${profile.last_name}`
      })

    } catch (error) {
      setError(`Error: ${error.message}`)
         } finally {
       setLoading(false)
     }
   }

   const handleFileUpload = async (event) => {
     const file = event.target.files[0]
     if (!file) return

     try {
       setUpdating(true)
       setError('')

       // Upload new resume
       const fileExt = file.name.split('.').pop()
       const fileName = `${user.id}/${Date.now()}.${fileExt}`
       
       const { data, error: uploadError } = await supabase.storage
         .from('resumes')
         .upload(fileName, file)

       if (uploadError) {
         throw new Error(`Upload failed: ${uploadError.message}`)
       }

       // Update user profile with new resume path
       const { error: updateError } = await supabase
         .from('user_profiles')
         .update({ resume_url: fileName })
         .eq('id', user.id)

       if (updateError) {
         throw new Error(`Profile update failed: ${updateError.message}`)
       }

       // Refresh resume info
       await checkResumeStatus()
       setShowUpload(false)
       
     } catch (error) {
       setError(`Update failed: ${error.message}`)
     } finally {
       setUpdating(false)
     }
   }

  if (loading) {
    return <div>Checking resume status...</div>
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>
  }

  if (!resumeInfo) {
    return <div>No resume information found</div>
  }

     return (
     <div style={{ 
       padding: '24px', 
       border: '1px solid #e1e5e9', 
       borderRadius: '12px', 
       margin: '20px 0',
       background: 'white',
       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
     }}>
       <h3 style={{ 
         margin: '0 0 20px 0', 
         fontSize: '24px', 
         fontWeight: '600', 
         color: '#1a1a1a' 
       }}>Resume Status Check</h3>
      
             {resumeInfo.status === 'no_resume' ? (
         <div>
           <p style={{ margin: '8px 0', fontSize: '16px', color: '#666' }}>
             <strong style={{ color: '#1a1a1a' }}>Status:</strong> ❌ No resume uploaded
           </p>
           <p style={{ margin: '8px 0', fontSize: '16px', color: '#666' }}>
             You need to upload a resume during onboarding to use the AI analysis feature.
           </p>
         </div>
       ) : (
                 <div>
           <p style={{ margin: '8px 0', fontSize: '16px', color: '#666' }}>
             <strong style={{ color: '#1a1a1a' }}>Status:</strong> ✅ Resume found
           </p>
           <p style={{ margin: '8px 0', fontSize: '16px', color: '#666' }}>
             <strong style={{ color: '#1a1a1a' }}>User:</strong> {resumeInfo.userName}
           </p>
           <p style={{ margin: '8px 0', fontSize: '16px', color: '#666' }}>
             <strong style={{ color: '#1a1a1a' }}>File Name:</strong> {resumeInfo.fileName}
           </p>
           <p style={{ margin: '8px 0', fontSize: '16px', color: '#666' }}>
             <strong style={{ color: '#1a1a1a' }}>File Type:</strong> {resumeInfo.fileType.toUpperCase()}
           </p>
           <p style={{ margin: '8px 0', fontSize: '16px', color: '#666' }}>
             <strong style={{ color: '#1a1a1a' }}>URL:</strong> 
             <a href={resumeInfo.url} target="_blank" rel="noopener noreferrer" 
                style={{ color: '#007bff', textDecoration: 'none', marginLeft: '8px' }}>
               View Resume
             </a>
           </p>
           
                        <div style={{ marginTop: '20px' }}>
               <button 
                 onClick={() => setShowUpload(!showUpload)}
                 style={{
                   background: '#007bff',
                   color: 'white',
                   border: 'none',
                   padding: '12px 20px',
                   borderRadius: '8px',
                   cursor: 'pointer',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px',
                   fontSize: '14px',
                   fontWeight: '500',
                   transition: 'background-color 0.2s'
                 }}
                 onMouseOver={(e) => e.target.style.background = '#0056b3'}
                 onMouseOut={(e) => e.target.style.background = '#007bff'}
               >
                 <FiRefreshCw /> Update Resume
               </button>
             </div>
           
                        {showUpload && (
               <div style={{ 
                 marginTop: '20px', 
                 padding: '20px', 
                 border: '1px solid #e1e5e9', 
                 borderRadius: '8px', 
                 background: '#f8f9fa' 
               }}>
                 <h4 style={{ 
                   margin: '0 0 15px 0', 
                   fontSize: '18px', 
                   fontWeight: '600', 
                   color: '#1a1a1a' 
                 }}>Upload New Resume</h4>
                 <input
                   type="file"
                   accept=".pdf,.doc,.docx,.txt"
                   onChange={handleFileUpload}
                   disabled={updating}
                   style={{ 
                     marginBottom: '15px',
                     padding: '8px',
                     border: '1px solid #ddd',
                     borderRadius: '4px',
                     fontSize: '14px'
                   }}
                 />
                 {updating && (
                   <p style={{ 
                     color: '#007bff', 
                     margin: '8px 0', 
                     fontSize: '14px',
                     fontWeight: '500'
                   }}>Uploading...</p>
                 )}
                 <p style={{ 
                   fontSize: '14px', 
                   color: '#666', 
                   margin: '8px 0',
                   lineHeight: '1.4'
                 }}>
                   This will replace your current resume. Supported formats: PDF, DOC, DOCX, TXT
                 </p>
               </div>
             )}
          
                     {resumeInfo.fileType === 'pdf' && (
             <div style={{ 
               background: '#f8f9fa', 
               padding: '12px', 
               borderRadius: '6px', 
               marginTop: '16px',
               border: '1px solid #e9ecef'
             }}>
               <p style={{ 
                 margin: '0', 
                 fontSize: '13px', 
                 color: '#6c757d',
                 lineHeight: '1.4',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '6px'
               }}>
                 <span style={{ fontSize: '14px' }}>ℹ️</span>
                 <span>For optimal AI analysis, consider uploading a text-based resume instead of PDF.</span>
               </p>
             </div>
           )}
           
           {['doc', 'docx'].includes(resumeInfo.fileType) && (
             <div style={{ 
               background: '#f8f9fa', 
               padding: '12px', 
               borderRadius: '6px', 
               marginTop: '16px',
               border: '1px solid #e9ecef'
             }}>
               <p style={{ 
                 margin: '0', 
                 fontSize: '13px', 
                 color: '#6c757d',
                 lineHeight: '1.4',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '6px'
               }}>
                 <span style={{ fontSize: '14px' }}>ℹ️</span>
                 <span>Word documents cannot be processed by the AI. Please upload a PDF or text file for analysis.</span>
               </p>
             </div>
           )}
        </div>
      )}
    </div>
  )
}

export default ResumeStatus
