const Razorpay = require('razorpay')
const crypto = require('crypto')
const { supabase, supabaseAdmin } = require('../config/database')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

const createKundliRequest = async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      email, 
      birth_date, 
      birth_time, 
      birth_place, 
      gender, 
      with_birth_time 
    } = req.body

    // Validate required fields
    if (!name || !phone || !birth_date || !birth_place || !gender) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields are missing' 
      })
    }

    // Validate phone number
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

    // Validate birth date is not in future
    const birthDate = new Date(birth_date)
    const today = new Date()
    if (birthDate > today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Birth date cannot be in the future' 
      })
    }

    // Create Razorpay order
    const amount = 300 * 100 // 300 INR in paise
    const currency = 'INR'
    const receipt = `kundli_${Date.now()}`

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      payment_capture: 1
    })

    // Create kundli request
    const kundliData = {
      name,
      phone,
      email: email || null,
      birth_date,
      birth_time: with_birth_time ? birth_time : null,
      birth_place,
      gender,
      with_birth_time: with_birth_time || false,
      amount: 300,
      razorpay_order_id: razorpayOrder.id,
      status: 'payment_pending'
    }

    const { data: kundli, error } = await supabase
      .from('kundli_requests')
      .insert([kundliData])
      .select()
      .single()

    if (error) {
      console.error('Kundli request creation error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error creating kundli request' 
      })
    }

    res.json({
      success: true,
      message: 'Kundli request created successfully',
      kundliId: kundli.id,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    })

  } catch (error) {
    console.error('Create kundli error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating kundli request' 
    })
  }
}

const verifyKundliPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, kundliId } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !kundliId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing payment verification details' 
      })
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature' 
      })
    }

    // Update kundli request status
    const { data: kundli, error } = await supabase
      .from('kundli_requests')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'submitted',
        payment_id: razorpay_payment_id
      })
      .eq('id', kundliId)
      .select()
      .single()

    if (error) {
      console.error('Kundli update error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error updating kundli request' 
      })
    }

    res.json({
      success: true,
      message: 'Payment verified successfully. Your kundli will be generated.',
      kundli
    })

  } catch (error) {
    console.error('Kundli payment verification error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying payment' 
    })
  }
}

const getKundliRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search, gender } = req.query
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('kundli_requests')
      .select('*', { count: 'exact' })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (gender) {
      query = query.eq('gender', gender)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%,birth_place.ilike.%${search}%`)
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: kundliRequests, error, count } = await query

    if (error) {
      console.error('Get kundli requests error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching kundli requests' 
      })
    }

    res.json({
      success: true,
      kundliRequests: kundliRequests || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Get kundli requests error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching kundli requests' 
    })
  }
}

const getKundliById = async (req, res) => {
  try {
    const { id } = req.params

    const { data: kundli, error } = await supabaseAdmin
      .from('kundli_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !kundli) {
      return res.status(404).json({ 
        success: false, 
        message: 'Kundli request not found' 
      })
    }

    res.json({
      success: true,
      kundli
    })

  } catch (error) {
    console.error('Get kundli error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching kundli request' 
    })
  }
}

const updateKundliStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, kundli_data, notes } = req.body

    if (!status || !['submitted', 'processing', 'completed'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid status is required' 
      })
    }

    const updateData = { status }
    if (kundli_data !== undefined) {
      updateData.kundli_data = kundli_data
    }
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const { data: kundli, error } = await supabaseAdmin
      .from('kundli_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update kundli error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error updating kundli request' 
      })
    }

    res.json({
      success: true,
      message: 'Kundli status updated successfully',
      kundli
    })

  } catch (error) {
    console.error('Update kundli error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error updating kundli request' 
    })
  }
}

const deleteKundli = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabaseAdmin
      .from('kundli_requests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete kundli error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error deleting kundli request' 
      })
    }

    res.json({
      success: true,
      message: 'Kundli request deleted successfully'
    })

  } catch (error) {
    console.error('Delete kundli error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting kundli request' 
    })
  }
}

module.exports = {
  createKundliRequest,
  verifyKundliPayment,
  getKundliRequests,
  getKundliById,
  updateKundliStatus,
  deleteKundli
}