// server/controllers/testimonials.js
const { supabase, supabaseAdmin } = require('../config/database')

const createTestimonial = async (req, res) => {
  try {
    const { 
      name, 
      youtube_url, 
      description, 
      rating, 
      location,
      is_featured,
      display_order,
      status 
    } = req.body

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and description are required' 
      })
    }

    // Validate YouTube URL if provided and not empty
    if (youtube_url && youtube_url.trim() !== '') {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
      if (!youtubeRegex.test(youtube_url)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please enter a valid YouTube URL' 
        })
      }
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      })
    }

    // Validate status if provided
    const validStatuses = ['active', 'inactive', 'pending']
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value' 
      })
    }

    const testimonialData = {
      name,
      description: description || null,
      rating: rating || 5,
      location: location || null,
      is_featured: is_featured || false,
      display_order: display_order || 0,
      status: status || 'active',
      // Convert empty string to null
      youtube_url: youtube_url && youtube_url.trim() !== '' ? youtube_url : null
    }

    const { data: testimonial, error } = await supabaseAdmin
      .from('testimonials')
      .insert([testimonialData])
      .select()
      .single()

    if (error) {
      console.error('Testimonial creation error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error creating testimonial' 
      })
    }

    res.json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial
    })

  } catch (error) {
    console.error('Create testimonial error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating testimonial' 
    })
  }
}

const getTestimonials = async (req, res) => {
  try {
    const { 
      featured, 
      page = 1, 
      limit = 10, 
      search,
      status 
    } = req.query
    const offset = (page - 1) * limit

    // Select ALL columns including generated ones
    let query = supabase
      .from('testimonials')
      .select('*', { count: 'exact' }) // This should include video_id

    // Apply filters
    if (featured !== undefined) {
      query = query.eq('is_featured', featured === 'true')
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`)
    }

    // Only show active testimonials for public by default
    if (!req.user || req.user.role !== 'admin') {
      query = query.eq('status', 'active')
    }

    // Apply pagination
    query = query
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: testimonials, error, count } = await query

    if (error) {
      console.error('Get testimonials error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching testimonials' 
      })
    }

    // Add hasVideo field to each testimonial
    const testimonialsWithVideoFlag = testimonials.map(testimonial => ({
      ...testimonial,
      hasVideo: !!testimonial.youtube_url,
      hasText: !!testimonial.description && testimonial.description.trim().length > 0
    }))

    res.json({
      success: true,
      testimonials: testimonialsWithVideoFlag || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Get testimonials error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching testimonials' 
    })
  }
}

const getFeaturedTestimonials = async (req, res) => {
  try {
    const { limit = 3 } = req.query

    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'active')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    if (error) {
      console.error('Get featured testimonials error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching featured testimonials' 
      })
    }

    // Add hasVideo field to each testimonial
    const testimonialsWithVideoFlag = testimonials.map(testimonial => ({
      ...testimonial,
      hasVideo: !!testimonial.youtube_url,
      hasText: !!testimonial.description && testimonial.description.trim().length > 0
    }))

    res.json({
      success: true,
      testimonials: testimonialsWithVideoFlag || []
    })

  } catch (error) {
    console.error('Get featured testimonials error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching featured testimonials' 
    })
  }
}

const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params

    const { data: testimonial, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !testimonial) {
      return res.status(404).json({ 
        success: false, 
        message: 'Testimonial not found' 
      })
    }

    // Add hasVideo field
    testimonial.hasVideo = !!testimonial.youtube_url
    testimonial.hasText = !!testimonial.description && testimonial.description.trim().length > 0

    res.json({
      success: true,
      testimonial
    })

  } catch (error) {
    console.error('Get testimonial error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching testimonial' 
    })
  }
}

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    console.log('Updating testimonial:', { id, updateData })

    // Check if testimonial exists - use admin client
    const { data: existingTestimonial, error: checkError } = await supabaseAdmin
      .from('testimonials')
      .select('id')
      .eq('id', id)
      .single()

    if (checkError || !existingTestimonial) {
      console.error('Testimonial not found:', checkError)
      return res.status(404).json({ 
        success: false, 
        message: 'Testimonial not found' 
      })
    }

    // Validate rating if provided
    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      })
    }

    // Validate status if provided
    const validStatuses = ['active', 'inactive', 'pending']
    if (updateData.status && !validStatuses.includes(updateData.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value' 
      })
    }

    // Clean up the update data
    const cleanedData = {
      name: updateData.name,
      description: updateData.description,
      rating: updateData.rating,
      location: updateData.location,
      is_featured: updateData.is_featured,
      status: updateData.status
    }

    // Handle youtube_url specially - if it's empty string or null, remove it from update
    // This way the column keeps its existing value or uses the default
    if (updateData.youtube_url && updateData.youtube_url.trim() !== '') {
      cleanedData.youtube_url = updateData.youtube_url
    } else {
      // If it's empty or null, we don't include it in the update
      // This avoids the NOT NULL constraint violation
      console.log('YouTube URL is empty, keeping existing value or default')
    }

    // Update testimonial - use admin client for RLS bypass
    const { data: testimonial, error } = await supabaseAdmin
      .from('testimonials')
      .update(cleanedData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update testimonial error:', error)
      return res.status(500).json({ 
        success: false, 
        message: `Error updating testimonial: ${error.message}` 
      })
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial
    })

  } catch (error) {
    console.error('Update testimonial error:', error)
    res.status(500).json({ 
      success: false, 
      message: `Server error updating testimonial: ${error.message}` 
    })
  }
}

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete testimonial error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error deleting testimonial' 
      })
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    })

  } catch (error) {
    console.error('Delete testimonial error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting testimonial' 
    })
  }
}

module.exports = {
  createTestimonial,
  getTestimonials,
  getFeaturedTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial
}