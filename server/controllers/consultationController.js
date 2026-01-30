const Razorpay = require('razorpay')
const crypto = require('crypto')
const { supabase, supabaseAdmin } = require('../config/database')
const { v4: uuidv4 } = require('uuid')

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

const createConsultation = async (req, res) => {
  try {
    const { name, email, phone } = req.body

    // Validate input
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and phone are required' 
      })
    }

    // Create Razorpay order
    const amount = 600 * 100 // 600 INR in paise
    const currency = 'INR'
    const receipt = `consultation_${Date.now()}`

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      payment_capture: 1
    })

    // Create consultation record
    const consultationData = {
      name,
      email,
      phone,
      amount: 600,
      razorpay_order_id: razorpayOrder.id,
      status: 'payment_pending'
    }

    const { data: consultation, error } = await supabase
      .from('consultations')
      .insert([consultationData])
      .select()
      .single()

    if (error) {
      console.error('Consultation creation error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error creating consultation' 
      })
    }

    res.json({
      success: true,
      message: 'Consultation created successfully',
      consultationId: consultation.id,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    })

  } catch (error) {
    console.error('Create consultation error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating consultation' 
    })
  }
}

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, consultationId } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !consultationId) {
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

    // Update consultation status
    const { data: consultation, error } = await supabase
      .from('consultations')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'received',
        payment_id: razorpay_payment_id
      })
      .eq('id', consultationId)
      .select()
      .single()

    if (error) {
      console.error('Consultation update error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error updating consultation' 
      })
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      consultation
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying payment' 
    })
  }
}

const getConsultations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('consultations')
      .select('*', { count: 'exact' })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: consultations, error, count } = await query

    if (error) {
      console.error('Get consultations error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching consultations' 
      })
    }

    res.json({
      success: true,
      consultations: consultations || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Get consultations error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching consultations' 
    })
  }
}

const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params

    const { data: consultation, error } = await supabaseAdmin
      .from('consultations')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !consultation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Consultation not found' 
      })
    }

    res.json({
      success: true,
      consultation
    })

  } catch (error) {
    console.error('Get consultation error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching consultation' 
    })
  }
}

const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    if (!status || !['received', 'on_the_call', 'completed'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid status is required' 
      })
    }

    const updateData = { status }
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const { data: consultation, error } = await supabaseAdmin
      .from('consultations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update consultation error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error updating consultation' 
      })
    }

    res.json({
      success: true,
      message: 'Consultation status updated successfully',
      consultation
    })

  } catch (error) {
    console.error('Update consultation error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error updating consultation' 
    })
  }
}

const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabaseAdmin
      .from('consultations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete consultation error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error deleting consultation' 
      })
    }

    res.json({
      success: true,
      message: 'Consultation deleted successfully'
    })

  } catch (error) {
    console.error('Delete consultation error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting consultation' 
    })
  }
}

module.exports = {
  createConsultation,
  verifyPayment,
  getConsultations,
  getConsultationById,
  updateConsultationStatus,
  deleteConsultation
}