const { supabase, supabaseAdmin } = require('../config/database')

const createBlog = async (req, res) => {
  try {
    const { 
      title, 
      excerpt, 
      content, 
      image_url, 
      image_key,
      author, 
      tags, 
      published,
      featured,
      meta_title,
      meta_description
    } = req.body

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      })
    }

    const blogData = {
      title,
      excerpt: excerpt || title.substring(0, 150) + '...',
      content,
      image_url: image_url || null,
      image_key: image_key || null,
      author: author || 'Accurate Astro',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
      published: published !== undefined ? published : true,
      featured: featured || false,
      meta_title: meta_title || title,
      meta_description: meta_description || excerpt || title.substring(0, 150) + '...'
    }

    const { data: blog, error } = await supabaseAdmin
      .from('blogs')
      .insert([blogData])
      .select()
      .single()

    if (error) {
      console.error('Blog creation error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error creating blog' 
      })
    }

    res.json({
      success: true,
      message: 'Blog created successfully',
      blog
    })

  } catch (error) {
    console.error('Create blog error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating blog' 
    })
  }
}

const getBlogs = async (req, res) => {
  try {
    const { 
      published, 
      featured, 
      page = 1, 
      limit = 10, 
      search,
      tag 
    } = req.query
    const offset = (page - 1) * limit

    let query = supabase
      .from('blogs')
      .select('*', { count: 'exact' })

    // Apply filters for public access
    if (published !== undefined) {
      query = query.eq('published', published === 'true')
    } else {
      query = query.eq('published', true) // Default to published only
    }

    if (featured !== undefined) {
      query = query.eq('featured', featured === 'true')
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: blogs, error, count } = await query

    if (error) {
      console.error('Get blogs error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching blogs' 
      })
    }

    res.json({
      success: true,
      blogs: blogs || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Get blogs error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching blogs' 
    })
  }
}

const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    // Increment view count
    await supabase
      .from('blogs')
      .update({ view_count: supabase.rpc('increment', { x: 1 }) })
      .eq('slug', slug)

    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error || !blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      })
    }

    // Get related blogs
    const { data: relatedBlogs } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, image_url, created_at')
      .neq('id', blog.id)
      .eq('published', true)
      .limit(3)
      .order('created_at', { ascending: false })

    res.json({
      success: true,
      blog,
      relatedBlogs: relatedBlogs || []
    })

  } catch (error) {
    console.error('Get blog error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching blog' 
    })
  }
}

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Check if blog exists
    const { data: existingBlog, error: checkError } = await supabaseAdmin
      .from('blogs')
      .select('id')
      .eq('id', id)
      .single()

    if (checkError || !existingBlog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      })
    }

    // Update blog
    const { data: blog, error } = await supabaseAdmin
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update blog error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error updating blog' 
      })
    }

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog
    })

  } catch (error) {
    console.error('Update blog error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error updating blog' 
    })
  }
}

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete blog error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error deleting blog' 
      })
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    })

  } catch (error) {
    console.error('Delete blog error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting blog' 
    })
  }
}

const getFeaturedBlogs = async (req, res) => {
  try {
    const { limit = 3 } = req.query

    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, image_url, created_at, tags')
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    if (error) {
      console.error('Get featured blogs error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching featured blogs' 
      })
    }

    res.json({
      success: true,
      blogs: blogs || []
    })

  } catch (error) {
    console.error('Get featured blogs error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching featured blogs' 
    })
  }
}

const searchBlogs = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    if (!q) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      })
    }

    const { data: blogs, error, count } = await supabase
      .from('blogs')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Search blogs error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error searching blogs' 
      })
    }

    res.json({
      success: true,
      blogs: blogs || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Search blogs error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error searching blogs' 
    })
  }
}

module.exports = {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs,
  searchBlogs
}