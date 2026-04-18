// server/controllers/demoBookings.js
const { supabase, supabaseAdmin } = require('../config/database')

const createDemoBooking = async (req, res) => {
  try {
    const { name, phone, email, date, time, dob, gender } = req.body

    // Validate required fields
    if (!name || !phone || !date || !time || !dob || !gender) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      })
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid 10-digit phone number' 
      })
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please enter a valid email address' 
        })
      }
    }

    // Validate gender
    const validGenders = ['male', 'female', 'other', 'prefer_not_to_say']
    if (!validGenders.includes(gender)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid gender selection' 
      })
    }

    // Validate date of birth (must be at least 18 years old)
    const dobDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - dobDate.getFullYear()
    const monthDiff = today.getMonth() - dobDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--
    }
    
    if (age < 18) {
      return res.status(400).json({ 
        success: false, 
        message: 'You must be at least 18 years old' 
      })
    }

    // Validate date of birth range (100 years max)
    const minDate = new Date()
    minDate.setFullYear(minDate.getFullYear() - 100)
    
    if (dobDate < minDate || dobDate > today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid date of birth' 
      })
    }

    // Validate demo date is not in the past
    const demoDate = new Date(date)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    
    if (demoDate < todayDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot book demo for past dates' 
      })
    }

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(time)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid time format. Use HH:MM format.' 
      })
    }

    // Check for existing booking at same time
    const { data: existingBooking } = await supabase
      .from('demo_bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .in('status', ['submitted', 'meeting_due'])
      .single()

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'This time slot is already booked. Please choose another time.' 
      })
    }

    // Create demo booking
    const demoData = {
      name,
      phone,
      email: email || null,
      date,
      time,
      dob,
      gender,
      status: 'submitted'
    }

    const { data: booking, error } = await supabase
      .from('demo_bookings')
      .insert([demoData])
      .select()
      .single()

    if (error) {
      console.error('Demo booking creation error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error creating demo booking' 
      })
    }

    res.json({
      success: true,
      message: 'Demo booked successfully! We will contact you soon.',
      booking
    })

  } catch (error) {
    console.error('Create demo booking error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating demo booking' 
    })
  }
}

const getDemoBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search, dateFrom, dateTo } = req.query
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('demo_bookings')
      .select('*', { count: 'exact' })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (dateFrom) {
      query = query.gte('date', dateFrom)
    }

    if (dateTo) {
      query = query.lte('date', dateTo)
    }

    // Apply pagination and ordering
    query = query
      .order('date', { ascending: true })
      .order('time', { ascending: true })
      .range(offset, offset + limit - 1)

    const { data: demoBookings, error, count } = await query

    if (error) {
      console.error('Get demo bookings error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching demo bookings' 
      })
    }

    res.json({
      success: true,
      demoBookings: demoBookings || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Get demo bookings error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching demo bookings' 
    })
  }
}

const getDemoBookingById = async (req, res) => {
  try {
    const { id } = req.params

    const { data: booking, error } = await supabaseAdmin
      .from('demo_bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Demo booking not found' 
      })
    }

    res.json({
      success: true,
      booking
    })

  } catch (error) {
    console.error('Get demo booking error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching demo booking' 
    })
  }
}

const updateDemoBookingStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    if (!status || !['submitted', 'meeting_due', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid status is required' 
      })
    }

    const updateData = { status }
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const { data: booking, error } = await supabaseAdmin
      .from('demo_bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update demo booking error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error updating demo booking' 
      })
    }

    res.json({
      success: true,
      message: 'Demo booking status updated successfully',
      booking
    })

  } catch (error) {
    console.error('Update demo booking error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error updating demo booking' 
    })
  }
}

const deleteDemoBooking = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabaseAdmin
      .from('demo_bookings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete demo booking error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error deleting demo booking' 
      })
    }

    res.json({
      success: true,
      message: 'Demo booking deleted successfully'
    })

  } catch (error) {
    console.error('Delete demo booking error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting demo booking' 
    })
  }
}

const getUpcomingDemos = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const { data: upcomingDemos, error } = await supabaseAdmin
      .from('demo_bookings')
      .select('*')
      .gte('date', today)
      .eq('status', 'submitted')
      .order('date', { ascending: true })
      .order('time', { ascending: true })
      .limit(10)

    if (error) {
      console.error('Get upcoming demos error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching upcoming demos' 
      })
    }

    res.json({
      success: true,
      upcomingDemos: upcomingDemos || []
    })

  } catch (error) {
    console.error('Get upcoming demos error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching upcoming demos' 
    })
  }
}

module.exports = {
  createDemoBooking,
  getDemoBookings,
  getDemoBookingById,
  updateDemoBookingStatus,
  deleteDemoBooking,
  getUpcomingDemos
}