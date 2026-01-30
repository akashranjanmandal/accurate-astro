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
      display_order 
    } = req.body

    // Validate required fields
    if (!name || !youtube_url) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and YouTube URL are required' 
      })
    }

    // Validate YouTube URL format
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
    if (!youtubeRegex.test(youtube_url)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid YouTube URL' 
      })
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      })
    }

    const testimonialData = {
      name,
      youtube_url,
      description: description || null,
      rating: rating || 5,
      location: location || null,
      is_featured: is_featured || false,
      display_order: display_order || 0
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

// In your testimonial controller
const getTestimonials = async (req, res) => {
  try {
    const { 
      featured, 
      page = 1, 
      limit = 10, 
      search 
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

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`)
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

    res.json({
      success: true,
      testimonials: testimonials || [],
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

    res.json({
      success: true,
      testimonials: testimonials || []
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

// In your testimonial controller, update the updateTestimonial function
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

    // Update testimonial - use admin client for RLS bypass
    const { data: testimonial, error } = await supabaseAdmin
      .from('testimonials')
      .update(updateData)
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