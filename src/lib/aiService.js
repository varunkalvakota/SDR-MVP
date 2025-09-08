import { supabase } from './supabase.js'

class AIService {
  constructor() {
    // Get the API key from environment variables
    this.apiKey = import.meta.env.VITE_AI_API_KEY
    // Use direct OpenAI API endpoint
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions'
    this.model = 'gpt-3.5-turbo' // OpenAI model
    
    // Debug logging
    console.log('AIService initialized with:')
    console.log('API Endpoint:', this.apiEndpoint)
    console.log('API Key exists:', !!this.apiKey)
    console.log('API Key prefix:', this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'none')
    console.log('Model:', this.model)
    
    // Check if API key is missing
    if (!this.apiKey) {
      console.error('❌ VITE_AI_API_KEY is not set in environment variables')
      console.error('Please check your .env file contains: VITE_AI_API_KEY=your_api_key_here')
      console.error('🔍 import.meta.env.VITE_AI_API_KEY:', import.meta.env.VITE_AI_API_KEY)
    } else {
      console.log('✅ API key loaded successfully')
      console.log('🔍 API Key length:', this.apiKey.length)
      console.log('🔍 API Key starts with:', this.apiKey.substring(0, 7))
    }
    
    // Debug all environment variables
    console.log('🔍 All VITE_ environment variables:')
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith('VITE_')) {
        console.log(`${key}: ${import.meta.env[key] ? 'SET' : 'NOT SET'}`)
      }
    })
    
    // Debug environment variables
    console.log('🔍 Environment variables loaded successfully')
  }

  // Get the stored resume content from Supabase storage
  async getResumeContent(userId) {
    try {
      // First get the user profile to find the resume URL
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('resume_url')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Profile error:', profileError)
        throw new Error(`Failed to get user profile: ${profileError.message}`)
      }
      
      if (!profile?.resume_url) {
        throw new Error('No resume found for this user. Please upload a resume during onboarding.')
      }
      
      console.log('Found resume URL:', profile.resume_url)

      // Extract the file path from the URL
      // The URL format is: https://xxx.supabase.co/storage/v1/object/public/resumes/userId/timestamp.ext
      const urlParts = profile.resume_url.split('/')
      const fileName = urlParts[urlParts.length - 1] // Get the filename with extension
      const folderUserId = urlParts[urlParts.length - 2] // Get the user ID folder
      const fullPath = `${folderUserId}/${fileName}` // Reconstruct the full path
      
      console.log('Attempting to download resume:', fullPath)

      // Download the resume file from storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from('resumes')
        .download(fullPath)

      if (fileError) {
        console.error('Storage download error:', fileError)
        throw new Error(`Failed to download resume file: ${fileError.message}`)
      }

      if (!fileData) {
        throw new Error('No file data received from storage')
      }

      // Convert file to text (assuming it's a PDF or text file)
      const text = await this.extractTextFromFile(fileData)
      return text
    } catch (error) {
      console.error('Error getting resume content:', error)
      throw error
    }
  }

  // Extract text from various file types
  async extractTextFromFile(file) {
    console.log('Extracting text from file type:', file.type)
    
    if (file.type === 'text/plain' || file.type === 'text/html') {
      return await file.text()
    } else if (file.type === 'application/pdf') {
      // Enhanced PDF text extraction
      try {
        // First, try to read as text (some PDFs can be read this way)
        const text = await file.text()
        console.log('PDF text extraction result length:', text.length)
        
        // Check if we got meaningful content
        if (text && text.length > 50) {
          // Clean up the extracted text
          const cleanedText = this.cleanExtractedText(text)
          if (cleanedText.length > 30) {
            console.log('Successfully extracted PDF text:', cleanedText.substring(0, 100) + '...')
            return cleanedText
          }
        }
        
        // If text extraction didn't work well, try alternative approach
        console.log('Text extraction did not yield good results, trying alternative...')
        return this.extractTextFromPDFAlternative(file)
        
      } catch (e) {
        console.error('Error extracting PDF text:', e)
        return this.extractTextFromPDFAlternative(file)
      }
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return 'Word document extraction requires additional libraries. Please upload a text-based resume for AI analysis.'
    } else {
      // Try to read as text anyway for other file types
      try {
        const text = await file.text()
        if (text && text.length > 50) {
          return this.cleanExtractedText(text)
        }
      } catch (e) {
        console.log('Could not read file as text:', e)
      }
      
      throw new Error(`Unsupported file type: ${file.type}. Please upload a text-based resume (.txt, .pdf, or .html).`)
    }
  }

  // Clean extracted text from common artifacts
  cleanExtractedText(text) {
    return text
      .replace(/\f/g, '\n') // Replace form feeds with newlines
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive empty lines
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters that might cause issues
      .trim()
  }

  // Alternative PDF extraction method
  async extractTextFromPDFAlternative(file) {
    try {
      // Convert file to ArrayBuffer and try to extract text
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      
      // Look for text content in the PDF
      const textDecoder = new TextDecoder('utf-8')
      const fullText = textDecoder.decode(uint8Array)
      
      // Extract text between common PDF text markers
      const textMatches = fullText.match(/\(([^)]+)\)/g)
      if (textMatches && textMatches.length > 10) {
        const extractedText = textMatches
          .map(match => match.replace(/[()]/g, ''))
          .filter(text => text.length > 2 && !text.match(/^[0-9\s]+$/))
          .join(' ')
        
        if (extractedText.length > 100) {
          console.log('Successfully extracted PDF text using alternative method')
          return this.cleanExtractedText(extractedText)
        }
      }
      
      // If all else fails, return a helpful message
      console.log('Could not extract meaningful text from PDF')
      return 'I was unable to extract readable text from this PDF file. This could be because:\n\n1. The PDF contains images/scanned content\n2. The PDF is password-protected\n3. The PDF uses special formatting\n\nPlease try uploading a text-based resume (.txt) or copy and paste your resume content directly for analysis.'
      
    } catch (error) {
      console.error('Error in alternative PDF extraction:', error)
      return 'I was unable to process this PDF file. Please upload a text-based resume (.txt) or copy and paste your resume content directly for analysis.'
    }
  }

  // Process resume with AI using system prompt
  async processResumeWithAI(userId, systemPrompt, userPrompt = '') {
    try {
      if (!this.apiKey) {
        throw new Error('AI API key not configured')
      }

      // Get the resume content
      const resumeContent = await this.getResumeContent(userId)

      // Smart content optimization for better efficiency
      const optimizedContent = this.optimizeResumeContent(resumeContent)
      
      console.log(`Original: ${resumeContent.length} chars, Optimized: ${optimizedContent.length} chars`)

      // Prepare the messages for the AI with optimized content
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Resume Content:\n\n${optimizedContent}\n\n${userPrompt}`
        }
      ]

      // Make the API call with optimized settings
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: 800,
          temperature: 0.5, presence_penalty: 0.1, frequency_penalty: 0.1, presence_penalty: 0.1, frequency_penalty: 0.1,
          stream: false
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`AI API Error: ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0].message.content

    } catch (error) {
      console.error('Error processing resume with AI:', error)
      throw error
    }
  }



  // Process manually entered text with AI
  async processManualTextWithAI(resumeText, systemPrompt, userPrompt = '') {
    try {
      if (!this.apiKey) {
        throw new Error('AI API key not configured')
      }

      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error('Please provide at least 50 characters of resume content for analysis.')
      }

      // Smart content optimization for better efficiency
      const optimizedContent = this.optimizeResumeContent(resumeText)
      
      console.log(`Manual text length: ${resumeText.length} chars, Optimized: ${optimizedContent.length} chars`)

      // Prepare the messages for the AI with optimized content
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Resume Content:\n\n${optimizedContent}\n\n${userPrompt}`
        }
      ]

      // Make the API call with optimized settings
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: 800,
          temperature: 0.5, presence_penalty: 0.1, frequency_penalty: 0.1, presence_penalty: 0.1, frequency_penalty: 0.1,
          stream: false
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`AI API Error: ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0].message.content

    } catch (error) {
      console.error('Error processing manual text with AI:', error)
      throw error
    }
  }

  // Smart content optimization to reduce tokens while preserving key information
  optimizeResumeContent(content) {
    // Remove excessive whitespace and normalize
    let optimized = content
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim()

    // Remove common resume formatting artifacts
    optimized = optimized
      .replace(/•/g, '-') // Standardize bullet points
      .replace(/[●◆■]/g, '-') // Replace fancy bullets
      .replace(/\|/g, ' | ') // Add spaces around pipes
      .replace(/\s{2,}/g, ' ') // Remove double spaces

    // Extract and prioritize key sections
    const sections = this.extractKeySections(optimized)
    
    // Combine sections with smart truncation
    let result = ''
    const maxLength = 8000 // ~2000 tokens - more efficient
    
    for (const section of sections) {
      if (result.length + section.length > maxLength) {
        const remaining = maxLength - result.length
        if (remaining > 200) { // Only add if we have meaningful space
          result += section.substring(0, remaining) + '\n\n[Content truncated]'
        }
        break
      }
      result += section + '\n\n'
    }

    return result.trim()
  }

  // Extract and prioritize the most important resume sections
  extractKeySections(content) {
    const sections = []
    
    // Split by common section headers
    const sectionRegex = /(?:^|\n)(?:EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|EDUCATION|SKILLS|TECHNICAL SKILLS|SUMMARY|OBJECTIVE|PROFILE|ACHIEVEMENTS|PROJECTS|CERTIFICATIONS|LANGUAGES|INTERESTS|REFERENCES?)(?:\s*:|\s*\n)/gi
    
    let lastIndex = 0
    let match
    
    while ((match = sectionRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        // Add content before this section
        const beforeSection = content.substring(lastIndex, match.index).trim()
        if (beforeSection.length > 50) { // Only add if substantial
          sections.push(beforeSection)
        }
      }
      
      // Add this section
      const sectionStart = match.index
      const nextMatch = sectionRegex.exec(content)
      const sectionEnd = nextMatch ? nextMatch.index : content.length
      const sectionContent = content.substring(sectionStart, sectionEnd).trim()
      
      if (sectionContent.length > 30) { // Only add if substantial
        sections.push(sectionContent)
      }
      
      lastIndex = sectionEnd
      if (nextMatch) {
        sectionRegex.lastIndex = nextMatch.index // Reset for next iteration
      }
    }
    
    // Add remaining content
    if (lastIndex < content.length) {
      const remaining = content.substring(lastIndex).trim()
      if (remaining.length > 50) {
        sections.push(remaining)
      }
    }
    
    // If no sections found, use the original content
    if (sections.length === 0) {
      return [content.substring(0, 8000)]
    }
    
    return sections
  }

  // Master prompt for comprehensive SDR resume analysis
  getSystemPrompts() {
    return {
      masterAnalysis: `Hi! I'm Becky, your friendly AI career coach! 👋 I have 15+ years of experience helping SDRs succeed and I'm here to give you personalized insights to boost your career!

ANALYZE THIS RESUME COMPREHENSIVELY:

🎯 SKILLS & SDR FIT ASSESSMENT:
- Identify relevant sales skills (cold calling, prospecting, CRM, objection handling, etc.)
- Highlight transferable skills from other industries/roles
- Assess communication, persistence, and resilience indicators
- Rate overall SDR fit (1-10) with specific reasoning
- Identify critical skill gaps and improvement recommendations

📈 CAREER PATH & PROGRESSION:
- Recommend optimal SDR career trajectory (SDR → SMB AE → Enterprise AE → Sales Manager)
- Provide realistic timeline for advancement (3-6 months, 1-2 years, 3-5 years)
- Suggest target companies based on experience level and industry background
- Estimate salary expectations for current level and next steps
- Identify key skills to develop for career advancement

🎤 INTERVIEW PREPARATION:
- Generate 5-7 specific interview questions based on their experience
- Provide STAR method responses for key achievements mentioned
- Identify areas to emphasize during interviews
- Flag potential red flags and how to address them proactively
- Suggest 3-5 thoughtful questions for them to ask interviewers

🎯 PERSONALIZATION & OUTREACH:
- Extract unique selling points and differentiators
- Identify relevant experience to highlight in outreach
- Suggest industry-specific talking points
- Recommend networking opportunities and events
- Provide personal brand development suggestions

FORMAT YOUR RESPONSE AS:
1. EXECUTIVE SUMMARY (2-3 sentences)
2. SKILLS ASSESSMENT (with SDR fit score)
3. CAREER RECOMMENDATIONS
4. INTERVIEW STRATEGY
5. PERSONALIZATION TIPS
6. ACTION ITEMS (3 specific next steps)

Be specific, actionable, and encouraging. Focus on their unique background and how it translates to SDR success. 

Remember to be warm, supportive, and use encouraging language throughout. I want to be their biggest cheerleader! 🎉`,

      advancedAnalysis: `Hey there! I'm Becky, your strategic career partner! 🚀 I specialize in competitive analysis and market positioning to help you stand out in the SDR world.

COMPREHENSIVE SDR MARKET ANALYSIS:

📊 RESUME SCORING & COMPETITIVE POSITIONING:
- Score resume on 10 key SDR competencies (1-10 each)
- Compare to market standards for entry-level SDR positions
- Identify competitive advantages and disadvantages
- Assess market positioning and differentiation opportunities
- Provide specific improvement recommendations with priority levels

🎯 INDUSTRY-SPECIFIC INSIGHTS:
- Analyze fit for different SDR specializations (B2B SaaS, Enterprise, SMB, etc.)
- Recommend target industries based on background and skills
- Identify industry-specific salary ranges and expectations
- Suggest relevant certifications and training programs
- Highlight industry networking opportunities and events

💼 COMPANY MATCHING & CULTURE FIT:
- Recommend 5-7 specific companies that would be ideal matches
- Analyze company culture fit based on experience and preferences
- Identify companies with strong SDR training programs
- Suggest companies with good advancement opportunities
- Provide company-specific application strategies

📈 ADVANCED CAREER STRATEGY:
- Create 90-day, 6-month, and 1-year career development plans
- Identify mentorship opportunities and industry leaders to connect with
- Recommend advanced skills development (negotiation, consultative selling, etc.)
- Suggest side projects and portfolio building activities
- Provide long-term career trajectory planning (5-10 years)

FORMAT RESPONSE WITH:
1. COMPETITIVE ANALYSIS (scores and positioning)
2. INDUSTRY RECOMMENDATIONS
3. COMPANY MATCHES
4. ADVANCED STRATEGY
5. EXECUTION PLAN

Keep it encouraging and actionable - I want to empower them to take their career to the next level! 💪`,

      skillAnalysis: `Hi! I'm Becky, your skills assessment specialist! 🔍 Let me analyze your resume for sales skills, transferable abilities, skill gaps, and SDR fit. I'll provide actionable insights to help you shine!`,

      careerPath: `Hello! I'm Becky, your career path navigator! 🗺️ Let me assess your resume for sales career progression, timeline, key skills to develop, target companies, and salary guidance. Together, we'll map out your success journey!`,

      interviewPrep: `Hey there! I'm Becky, your interview prep buddy! 🎤 Based on your resume, I'll provide relevant interview questions, STAR responses, emphasis areas, red flags to address, and questions for you to ask. Let's get you interview-ready!`,

      personalization: `Hi! I'm Becky, your personalization pro! 🎯 I'll identify unique selling points, relevant experience highlights, industry insights, networking opportunities, and personal brand elements to help you stand out!`
    }
  }

  // Generate personalized coaching recommendations
  async generateCoachingPlan(userId) {
    try {
      const resumeContent = await this.getResumeContent(userId)
      const optimizedContent = this.optimizeResumeContent(resumeContent)
      
      const coachingPrompt = `Hi! I'm Becky, your personal SDR coach! 💪 Based on this resume, I want to create a personalized 30-day coaching plan with:
      1. Daily/weekly action items
      2. Skill development exercises
      3. Networking activities
      4. Interview practice scenarios
      5. Progress tracking metrics
      
      Make it specific, actionable, and tailored to their background. Be encouraging and supportive throughout!`

      const messages = [
        { role: 'system', content: coachingPrompt },
        { role: 'user', content: `Resume: ${optimizedContent}` }
      ]

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: 1200,
          temperature: 0.7,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate coaching plan')
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Error generating coaching plan:', error)
      throw error
    }
  }

  // Analyze resume against job descriptions
  async analyzeJobFit(userId, jobDescription) {
    try {
      const resumeContent = await this.getResumeContent(userId)
      const optimizedContent = this.optimizeResumeContent(resumeContent)
      
      const fitPrompt = `Hi! I'm Becky, your job fit analyzer! 🎯 Let me compare this resume against the job description and provide:
      1. Overall fit score (1-10)
      2. Matching skills and experience
      3. Missing requirements
      4. Resume customization suggestions
      5. Interview preparation tips specific to this role
      
      Be specific, actionable, and encouraging! I want to help them succeed!`

      const messages = [
        { role: 'system', content: fitPrompt },
        { role: 'user', content: `Resume: ${optimizedContent}\n\nJob Description: ${jobDescription}` }
      ]

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.5, presence_penalty: 0.1, frequency_penalty: 0.1, presence_penalty: 0.1, frequency_penalty: 0.1,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze job fit')
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Error analyzing job fit:', error)
      throw error
    }
  }

  // Log AI interactions for tracking (disabled until api_integrations table is created)
  async logAIInteraction(userId, promptType, input, output, success = true) {
    // Temporarily disabled to prevent 404 errors
    console.log('AI Interaction logged:', { promptType, success })
  }

  // Save analysis result to database
  async saveAnalysisResult(userId, analysisType, analysisContent, metadata = {}) {
    try {
      // Get current resume version for tracking
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('resume_url')
        .eq('id', userId)
        .single()

      const resumeVersion = profile?.resume_url ? 
        profile.resume_url.split('/').pop() : 
        'unknown'

      // Generate a title for the analysis
      const analysisTitle = this.generateAnalysisTitle(analysisType, resumeVersion)

      // Extract key insights for metadata
      const extractedMetadata = this.extractAnalysisMetadata(analysisContent, analysisType)

      const { data, error } = await supabase
        .from('ai_analysis_results')
        .insert({
          user_id: userId,
          analysis_type: analysisType,
          analysis_title: analysisTitle,
          analysis_content: analysisContent,
          resume_version: resumeVersion,
          metadata: { ...metadata, ...extractedMetadata },
          tags: this.generateTags(analysisType, extractedMetadata)
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving analysis result:', error)
        throw error
      }

      console.log('Analysis result saved successfully:', data.id)
      return data
    } catch (error) {
      console.error('Error saving analysis result:', error)
      throw error
    }
  }

  // Get user's analysis history
  async getAnalysisHistory(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('ai_analysis_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching analysis history:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching analysis history:', error)
      return []
    }
  }

  // Get specific analysis by ID
  async getAnalysisById(analysisId) {
    try {
      const { data, error } = await supabase
        .from('ai_analysis_results')
        .select('*')
        .eq('id', analysisId)
        .single()

      if (error) {
        console.error('Error fetching analysis:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching analysis:', error)
      throw error
    }
  }

  // Update analysis (favorite, tags, etc.)
  async updateAnalysis(analysisId, updates) {
    try {
      const { data, error } = await supabase
        .from('ai_analysis_results')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', analysisId)
        .select()
        .single()

      if (error) {
        console.error('Error updating analysis:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating analysis:', error)
      throw error
    }
  }

  // Delete analysis
  async deleteAnalysis(analysisId) {
    try {
      const { error } = await supabase
        .from('ai_analysis_results')
        .delete()
        .eq('id', analysisId)

      if (error) {
        console.error('Error deleting analysis:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error deleting analysis:', error)
      throw error
    }
  }

  // Helper methods for analysis management
  generateAnalysisTitle(analysisType, resumeVersion) {
    const date = new Date().toLocaleDateString()
    const typeLabels = {
      masterAnalysis: 'Master Analysis',
      advancedAnalysis: 'Advanced Analysis',
      skillAnalysis: 'Skill Analysis',
      careerPath: 'Career Path Analysis',
      interviewPrep: 'Interview Preparation',
      personalization: 'Personalization Analysis'
    }
    
    return `${typeLabels[analysisType] || 'Analysis'} - ${date}`
  }

  extractAnalysisMetadata(content, analysisType) {
    const metadata = {
      analysisType,
      contentLength: content.length,
      hasRecommendations: content.includes('RECOMMENDATION') || content.includes('ACTION'),
      hasScores: content.includes('score') || content.includes('rating'),
      extractedAt: new Date().toISOString()
    }

    // Extract specific data based on analysis type
    if (analysisType === 'masterAnalysis') {
      // Try to extract SDR fit score
      const scoreMatch = content.match(/SDR fit.*?(\d+)/i)
      if (scoreMatch) {
        metadata.sdrFitScore = parseInt(scoreMatch[1])
      }
    }

    return metadata
  }

  generateTags(analysisType, metadata) {
    const tags = [analysisType]
    
    if (metadata.sdrFitScore) {
      tags.push(`score-${metadata.sdrFitScore}`)
    }
    
    if (metadata.hasRecommendations) {
      tags.push('has-recommendations')
    }
    
    return tags
  }

  // LinkedIn Profile Analysis
  async analyzeLinkedInProfile(profileData) {
    try {
      if (!this.apiKey) {
        throw new Error('AI API key not configured')
      }

      const systemPrompt = `You are an expert LinkedIn profile optimizer and SDR career coach. Analyze the provided profile information and provide comprehensive LinkedIn optimization recommendations for someone transitioning to SDR roles.`

      const userPrompt = `
        Analyze this LinkedIn profile for SDR (Sales Development Representative) role optimization:
        
        Profile Information:
        - Current Position: ${profileData.current_position || 'Not specified'}
        - Experience Years: ${profileData.experience_years || 'Not specified'}
        - Career Goal: ${profileData.career_goal || 'Not specified'}
        - Skills: ${profileData.skills?.join(', ') || 'Not specified'}
        - LinkedIn URL: ${profileData.linkedin_url}
        
        Please provide a comprehensive LinkedIn optimization analysis for someone transitioning to SDR roles. Include:
        
        1. Profile Score (0-100): Overall LinkedIn effectiveness for SDR roles
        2. Optimization Score (0-100): Potential for improvement
        3. SDR Readiness Score (0-100): How well the profile positions them for SDR roles
        
        4. Specific Recommendations for:
           - Headline optimization
           - About section rewrite
           - Featured content suggestions
           - Experience bullet improvements
           - Skills to add
        
        5. SDR Readiness Assessment:
           - Strengths that transfer to SDR roles
           - Gaps that need addressing
           - Specific skills to develop
        
        6. Action Plan:
           - 5 specific next steps to implement with detailed instructions
           - Priority order for changes (high/medium/low)
           - Expected impact of each change
           - Time estimates for completion
           - Step-by-step guidance for each action
        
        7. Content Suggestions:
           - Sample posts for SDR networking
           - Topics to engage with
           - People to connect with
        
        Format the response as a JSON object with the following structure:
        {
          "profileScore": number,
          "optimizationScore": number,
          "recommendations": [
            {
              "category": "string",
              "current": "string",
              "suggested": "string", 
              "priority": "high|medium|low",
              "impact": "string"
            }
          ],
          "sdrReadiness": {
            "score": number,
            "strengths": ["string"],
            "gaps": ["string"]
          },
          "nextSteps": [
            {
              "title": "string",
              "description": "string", 
              "action": "string",
              "impact": "string",
              "timeToComplete": "string",
              "priority": "high|medium|low"
            }
          ],
          "contentSuggestions": {
            "postTopics": ["string"],
            "networkingTargets": ["string"],
            "engagementStrategy": "string"
          },
          "metrics": {
            "profileViews": number,
            "connectionRequests": number,
            "engagementRate": number,
            "recruiterViews": number
          }
        }
        
        Focus on actionable, specific advice that will help this person stand out to SDR recruiters and hiring managers.
      `

      // Create the profile text for analysis
      const profileText = `Profile Information:
        - Current Position: ${profileData.current_position || 'Not specified'}
        - Experience Years: ${profileData.experience_years || 'Not specified'}
        - Career Goal: ${profileData.career_goal || 'Not specified'}
        - Skills: ${profileData.skills?.join(', ') || 'Not specified'}
        - LinkedIn URL: ${profileData.linkedin_url}`

      // Use the manual text processing method
      const aiResponse = await this.processManualTextWithAI(
        profileText,
        systemPrompt,
        userPrompt
      )

      return aiResponse
    } catch (error) {
      console.error('Error analyzing LinkedIn profile with AI:', error)
      throw error
    }
  }
}

export const aiService = new AIService()
