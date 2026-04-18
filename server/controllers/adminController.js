const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { supabaseAdmin } = require('../config/database')

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      })
    }

    // Fetch admin from database
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      })
    }

    // Update last login
    await supabaseAdmin
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id)

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username, 
        email: admin.email, 
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    })
  }
}

const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const [
      consultationsCount,
      demoBookingsCount,
      kundliRequestsCount,
      testimonialsCount,
      blogsCount
    ] = await Promise.all([
      supabaseAdmin.from('consultations').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('demo_bookings').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('kundli_requests').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('testimonials').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('blogs').select('*', { count: 'exact', head: true })
    ])

    // Get revenue
    const { data: consultationRevenue } = await supabaseAdmin
      .from('consultations')
      .select('amount')
      .eq('status', 'completed')

    const { data: kundliRevenue } = await supabaseAdmin
      .from('kundli_requests')
      .select('amount')
      .eq('status', 'completed')

    const totalRevenue = (consultationRevenue || []).reduce((sum, item) => sum + item.amount, 0) +
                         (kundliRevenue || []).reduce((sum, item) => sum + item.amount, 0)

    // Get pending counts
    const [
      pendingConsultations,
      pendingDemos,
      pendingKundli
    ] = await Promise.all([
      supabaseAdmin.from('consultations').select('*', { count: 'exact', head: true })
        .in('status', ['payment_pending', 'received']),
      supabaseAdmin.from('demo_bookings').select('*', { count: 'exact', head: true })
        .eq('status', 'submitted'),
      supabaseAdmin.from('kundli_requests').select('*', { count: 'exact', head: true })
        .in('status', ['payment_pending', 'submitted'])
    ])

    // Get today's counts
    const today = new Date().toISOString().split('T')[0]
    const [
      todayConsultations,
      todayDemos,
      todayKundli
    ] = await Promise.all([
      supabaseAdmin.from('consultations').select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`),
      supabaseAdmin.from('demo_bookings').select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`),
      supabaseAdmin.from('kundli_requests').select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
    ])

    // Get recent activity
    const { data: recentActivity } = await supabaseAdmin
      .from('recent_activity')
      .select('*')
      .limit(10)
      .order('created_at', { ascending: false })

    // Get revenue analytics
    const { data: revenueData } = await supabaseAdmin
      .from('revenue_analytics')
      .select('*')
      .order('month', { ascending: false })
      .limit(6)

    res.json({
      success: true,
      stats: {
        total: {
          consultations: consultationsCount.count || 0,
          demoBookings: demoBookingsCount.count || 0,
          kundliRequests: kundliRequestsCount.count || 0,
          testimonials: testimonialsCount.count || 0,
          blogs: blogsCount.count || 0,
          revenue: totalRevenue
        },
        pending: {
          consultations: pendingConsultations.count || 0,
          demos: pendingDemos.count || 0,
          kundli: pendingKundli.count || 0
        },
        today: {
          consultations: todayConsultations.count || 0,
          demos: todayDemos.count || 0,
          kundli: todayKundli.count || 0
        }
      },
      recentActivity: recentActivity || [],
      revenueAnalytics: revenueData || []
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard statistics' 
    })
  }
}

const getProfile = async (req, res) => {
  try {
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, username, email, role, last_login, created_at')
      .eq('id', req.user.id)
      .single()

    if (error || !admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      })
    }

    res.json({
      success: true,
      profile: admin
    })

  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile' 
    })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body

    // Validate input
    if (!username || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and email are required' 
      })
    }

    // Check if username or email already exists
    const { data: existingAdmin } = await supabaseAdmin
      .from('admins')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .neq('id', req.user.id)
      .single()

    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username or email already exists' 
      })
    }

    // Update profile
    const { data: updatedAdmin, error } = await supabaseAdmin
      .from('admins')
      .update({ username, email })
      .eq('id', req.user.id)
      .select('id, username, email, role, last_login, created_at')
      .single()

    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Error updating profile' 
      })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedAdmin
    })

  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile' 
    })
  }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current and new password are required' 
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be at least 6 characters long' 
      })
    }

    // Get current admin
    const { data: admin, error: fetchError } = await supabaseAdmin
      .from('admins')
      .select('password_hash')
      .eq('id', req.user.id)
      .single()

    if (fetchError || !admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const newPasswordHash = await bcrypt.hash(newPassword, salt)

    // Update password
    const { error: updateError } = await supabaseAdmin
      .from('admins')
      .update({ password_hash: newPasswordHash })
      .eq('id', req.user.id)

    if (updateError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Error changing password' 
      })
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error changing password' 
    })
  }
}

const logout = (req, res) => {
  // Since we're using JWT, we can't invalidate the token on the server
  // The client should remove the token
  res.json({
    success: true,
    message: 'Logout successful'
  })
}

module.exports = {
  login,
  getDashboardStats,
  getProfile,
  updateProfile,
  changePassword,
  logout
}