const express = require('express')
const router = express.Router()
const multer = require('multer')
const { supabase } = require('../config/database')

// Configure multer for file upload
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'))
    }
  }
})

// Upload blog image
router.post('/blog-image', upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request received')
    const file = req.file
    const { blogId, folder = 'blog-images' } = req.body

    console.log('File info:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size
    })
    console.log('Body data:', req.body)

    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const fileExtension = file.originalname.split('.').pop()
    const fileName = `${folder}/${blogId || 'temp'}-${timestamp}-${randomString}.${fileExtension}`

    console.log('Uploading to Supabase with filename:', fileName)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('accurateastro') // Your bucket name
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
        cacheControl: '3600'
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return res.status(500).json({ 
        success: false, 
        message: `Failed to upload image to storage: ${error.message}` 
      })
    }

    console.log('Supabase upload successful:', data)

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('accurateastro')
      .getPublicUrl(fileName)

    console.log('Public URL:', publicUrlData.publicUrl)

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: publicUrlData.publicUrl,
      fileName: fileName
    })

  } catch (error) {
    console.error('Image upload error:', error)
    res.status(500).json({ 
      success: false, 
      message: `Server error during image upload: ${error.message}` 
    })
  }
})

// Delete blog image
router.delete('/blog-image', async (req, res) => {
  try {
    const { fileName } = req.body

    console.log('Delete request for file:', fileName)

    if (!fileName) {
      return res.status(400).json({ 
        success: false, 
        message: 'File name is required' 
      })
    }

    const { data, error } = await supabase.storage
      .from('accurateastro')
      .remove([fileName])

    if (error) {
      console.error('Supabase delete error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete image' 
      })
    }

    console.log('Image deleted successfully:', data)

    res.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('Image delete error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error during image deletion' 
    })
  }
})

// Check if bucket exists and create if needed (run this once)
router.get('/setup-bucket', async (req, res) => {
  try {
    // List all buckets to check if ours exists
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error('Error listing buckets:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error checking buckets' 
      })
    }

    const bucketName = 'accurateastro'
    const bucketExists = buckets.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`)
      const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 2 * 1024 * 1024, // 2MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      })
      
      if (createError) {
        console.error('Error creating bucket:', createError)
        return res.status(500).json({ 
          success: false, 
          message: `Error creating bucket: ${createError.message}` 
        })
      }
      
      console.log('Bucket created successfully:', data)
    } else {
      console.log('Bucket already exists')
    }

    res.json({
      success: true,
      message: bucketExists ? 'Bucket already exists' : 'Bucket created successfully'
    })

  } catch (error) {
    console.error('Setup bucket error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error during bucket setup' 
    })
  }
})

module.exports = router