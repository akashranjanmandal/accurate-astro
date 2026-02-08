import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaUser, FaPhone, FaEnvelope, FaCalendar, FaClock, 
  FaStar, FaEdit, FaTrash, FaEye, FaChartLine,
  FaMoneyBill, FaUsers, FaFileAlt, FaVideo,
  FaSignOutAlt, FaBars, FaTimes, FaSearch,
  FaFilter, FaDownload, FaCog, FaBell,
  FaPlus, FaTag, FaImage, FaSave, FaUpload,
  FaMapMarkerAlt, FaQuoteLeft, FaSpinner, FaLink
} from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import api from '../../utils/api'

const AdminDashboard = () => {
  const navigate = useNavigate()
const [sidebarOpen, setSidebarOpen] = useState(() => {
  return window.innerWidth >= 1024
})  
// Add this right after the sidebarOpen state:
const [windowWidth, setWindowWidth] = useState(window.innerWidth)

// Add this useEffect for responsive behavior:
useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth
    setWindowWidth(width)
    
    // Auto-open on desktop, auto-close on mobile
    if (width >= 1024) {
      setSidebarOpen(true)
    } else {
      setSidebarOpen(false)
    }
  }
  
  window.addEventListener('resize', handleResize)
  // Initial check
  handleResize()
  
  return () => window.removeEventListener('resize', handleResize)
}, [])

  const [activeTab, setActiveTab] = useState('dashboard')
  const [consultations, setConsultations] = useState([])
  const [demoBookings, setDemoBookings] = useState([])
  const [kundliRequests, setKundliRequests] = useState([])
  const [blogs, setBlogs] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  // Blog states
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    image_key: '',
    author: 'Accurate Astro',
    tags: '',
    published: true,
    featured: false,
    meta_title: '',
    meta_description: ''
  })
  const [blogSearchTerm, setBlogSearchTerm] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  // Testimonial states
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [testimonialFormData, setTestimonialFormData] = useState({
    name: '',
    youtube_url: '',
    description: '',
    rating: 5,
    location: 'India',
    is_featured: false,
    status: 'active'
  })

  // Helper function to extract YouTube video ID
  const extractVideoId = (url) => {
    if (!url) return null
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url?.match(regExp)
    return (match && match[7]?.length === 11) ? match[7] : null
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    toast.success('Logged out successfully')
    navigate('admin/login')
  }

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData()
    const userData = localStorage.getItem('adminUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [consultationsRes, demosRes, kundliRes, blogsRes, testimonialsRes] = await Promise.all([
        api.get('/consultations'),
        api.get('/demo-bookings'),
        api.get('/kundli'),
        api.get('/blogs'),
        api.get('/testimonials')
      ])

      if (consultationsRes.data.success) {
        setConsultations(consultationsRes.data.consultations)
      }

      if (demosRes.data.success) {
        setDemoBookings(demosRes.data.demoBookings)
      }

      if (kundliRes.data.success) {
        setKundliRequests(kundliRes.data.kundliRequests)
      }

      if (blogsRes.data.success) {
        setBlogs(blogsRes.data.blogs)
      }

      if (testimonialsRes.data.success) {
        setTestimonials(testimonialsRes.data.testimonials)
      }

    } catch (error) {
      toast.error('Error fetching dashboard data')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update status functions
  const updateConsultationStatus = async (id, newStatus) => {
    try {
      const response = await api.put(`/consultations/${id}/status`, { status: newStatus })
      if (response.data.success) {
        toast.success('Status updated successfully')
        fetchDashboardData()
      }
    } catch (error) {
      toast.error('Error updating status')
    }
  }

  const updateDemoStatus = async (id, newStatus) => {
    try {
      const response = await api.put(`/demo-bookings/${id}/status`, { status: newStatus })
      if (response.data.success) {
        toast.success('Status updated successfully')
        fetchDashboardData()
      }
    } catch (error) {
      toast.error('Error updating status')
    }
  }

  const updateKundliStatus = async (id, newStatus) => {
    try {
      const response = await api.put(`/kundli/${id}/status`, { status: newStatus })
      if (response.data.success) {
        toast.success('Status updated successfully')
        fetchDashboardData()
      }
    } catch (error) {
      toast.error('Error updating status')
    }
  }

  // Delete functions
  const handleDeleteConsultation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this consultation?')) return
    try {
      const response = await api.delete(`/consultations/${id}`)
      if (response.data.success) {
        toast.success('Consultation deleted successfully')
        fetchDashboardData()
      }
    } catch (error) {
      toast.error('Error deleting consultation')
    }
  }

  const handleDeleteDemo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this demo booking?')) return
    try {
      const response = await api.delete(`/demo-bookings/${id}`)
      if (response.data.success) {
        toast.success('Demo booking deleted successfully')
        fetchDashboardData()
      }
    } catch (error) {
      toast.error('Error deleting demo booking')
    }
  }

  const handleDeleteKundli = async (id) => {
    if (!window.confirm('Are you sure you want to delete this kundli request?')) return
    try {
      const response = await api.delete(`/kundli/${id}`)
      if (response.data.success) {
        toast.success('Kundli request deleted successfully')
        fetchDashboardData()
      }
    } catch (error) {
      toast.error('Error deleting kundli request')
    }
  }

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return
    try {
      const response = await api.delete(`/testimonials/${id}`)
      if (response.data.success) {
        toast.success('Testimonial deleted successfully')
        fetchDashboardData()
      }
    } catch (error) {
      toast.error('Error deleting testimonial')
    }
  }

  // Image upload function
  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('blogId', editingBlog?.id || 'temp')
      formData.append('folder', 'blog-images')

      console.log('Uploading image:', file.name, file.size)

      const response = await api.post('/upload/blog-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('Upload response:', response.data)

      if (response.data.success) {
        setBlogFormData({
          ...blogFormData,
          image_url: response.data.imageUrl,
          image_key: response.data.fileName
        })
        setImagePreview(response.data.imageUrl)
        toast.success('Image uploaded successfully')
      }
    } catch (error) {
      console.error('Image upload error:', error.response?.data || error)
      toast.error(error.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  // Blog functions
  const handleBlogInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setBlogFormData({
      ...blogFormData,
      [name]: type === 'checkbox' ? checked : value
    })
    
    // Update preview if image_url changes
    if (name === 'image_url') {
      setImagePreview(value)
    }
  }

  const handleBlogSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const tagsArray = blogFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      const blogData = {
        title: blogFormData.title,
        excerpt: blogFormData.excerpt,
        content: blogFormData.content,
        image_url: blogFormData.image_url,
        image_key: blogFormData.image_key,
        author: blogFormData.author,
        tags: tagsArray,
        published: blogFormData.published,
        featured: blogFormData.featured,
        meta_title: blogFormData.meta_title,
        meta_description: blogFormData.meta_description
      }

      console.log('Submitting blog data:', blogData)

      if (editingBlog) {
        const response = await api.put(`/blogs/${editingBlog.id}`, blogData)
        if (response.data.success) {
          toast.success('Blog updated successfully')
          setEditingBlog(null)
        }
      } else {
        const response = await api.post('/blogs', blogData)
        if (response.data.success) {
          toast.success('Blog created successfully')
        }
      }

      setShowBlogForm(false)
      setBlogFormData({
        title: '',
        excerpt: '',
        content: '',
        image_url: '',
        image_key: '',
        author: 'Accurate Astro',
        tags: '',
        published: true,
        featured: false,
        meta_title: '',
        meta_description: ''
      })
      setImagePreview('')
      fetchDashboardData()
      
    } catch (error) {
      console.error('Blog save error:', error.response?.data || error)
      toast.error(error.response?.data?.message || 'Error saving blog')
    }
  }

  const handleEditBlog = (blog) => {
    setEditingBlog(blog)
    setBlogFormData({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content,
      image_url: blog.image_url || '',
      image_key: blog.image_key || '',
      author: blog.author || 'Accurate Astro',
      tags: blog.tags?.join(', ') || '',
      published: blog.published !== false,
      featured: blog.featured || false,
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || ''
    })
    setImagePreview(blog.image_url || '')
    setShowBlogForm(true)
  }

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return

    try {
      const response = await api.delete(`/blogs/${id}`)
      if (response.data.success) {
        toast.success('Blog deleted successfully')
        fetchDashboardData()
      }
    } catch (error) {
      toast.error('Error deleting blog')
    }
  }

  // Testimonial functions
  const handleTestimonialInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setTestimonialFormData({
      ...testimonialFormData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault()
    
    console.log('Submitting testimonial data:', testimonialFormData)
    
    try {
      const testimonialData = {
        name: testimonialFormData.name,
        youtube_url: testimonialFormData.youtube_url,
        description: testimonialFormData.description,
        rating: parseInt(testimonialFormData.rating),
        location: testimonialFormData.location,
        is_featured: testimonialFormData.is_featured,
        status: testimonialFormData.status
      }

      console.log('Sending data to API:', testimonialData)

      let response
      if (editingTestimonial) {
        response = await api.put(`/testimonials/${editingTestimonial.id}`, testimonialData)
      } else {
        response = await api.post('/testimonials', testimonialData)
      }

      console.log('API Response:', response.data)

      if (response.data.success) {
        toast.success(editingTestimonial ? 'Testimonial updated successfully' : 'Testimonial created successfully')
        setEditingTestimonial(null)
        setShowTestimonialForm(false)
        setTestimonialFormData({
          name: '',
          youtube_url: '',
          description: '',
          rating: 5,
          location: 'India',
          is_featured: false,
          status: 'active'
        })
        fetchDashboardData()
      }
      
    } catch (error) {
      console.error('Testimonial submission error:', error.response?.data || error)
      toast.error(error.response?.data?.message || 'Error saving testimonial')
    }
  }

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial)
    setTestimonialFormData({
      name: testimonial.name,
      youtube_url: testimonial.youtube_url || '',
      description: testimonial.description || '',
      rating: testimonial.rating || 5,
      location: testimonial.location || 'India',
      is_featured: testimonial.is_featured || false,
      status: testimonial.status || 'active'
    })
    setShowTestimonialForm(true)
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
    blog.excerpt?.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
    blog.tags?.some(tag => tag.toLowerCase().includes(blogSearchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Fixed */}
      <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
>
  {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
</button>

              <div className="ml-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FaStar className="text-white text-sm" />
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-800">
                  Accurate Astro <span className="text-sm font-normal text-gray-500">Admin</span>
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">{user?.username || 'Admin'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
    {/* Sidebar - Fixed */}
<motion.aside
  initial={false}
  animate={{ 
    x: windowWidth >= 1024 ? 0 : (sidebarOpen ? 0 : -300)
  }}
  className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
    windowWidth >= 1024 ? 'translate-x-0' : ''
  }`}
  style={{ 
    top: '64px', 
    height: 'calc(100vh - 64px)'
  }}
>
  <div className="h-full flex flex-col">
    {/* Navigation Items - Scrollable */}
    <div className="flex-1 overflow-y-auto p-4">
      <nav className="space-y-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
          { id: 'consultations', label: 'Consultations', icon: FaUsers },
          { id: 'demo-bookings', label: 'Demo Bookings', icon: FaCalendar },
          { id: 'kundli-requests', label: 'Kundli Requests', icon: FaFileAlt },
          { id: 'blogs', label: 'Blogs', icon: FaEdit },
          { id: 'testimonials', label: 'Testimonials', icon: FaVideo },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id)
              if (windowWidth < 1024) {
                setSidebarOpen(false)
              }
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>

    {/* Fixed Logout Button at Bottom */}
    <div className="p-4 border-t bg-white">
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.username || 'Admin'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors border border-red-100"
      >
        <FaSignOutAlt />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  </div>
</motion.aside>

        {/* Overlay for mobile */}
        {sidebarOpen && window.innerWidth < 1024 && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
<main className={`flex-1 p-4 lg:p-6 overflow-x-auto transition-all duration-300 ${
  sidebarOpen && windowWidth >= 1024 ? 'lg:ml-128' : ''
}`}>          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Consultations</p>
                      <p className="text-2xl font-bold mt-1">{consultations.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaUsers className="text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Demo Bookings</p>
                      <p className="text-2xl font-bold mt-1">{demoBookings.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaCalendar className="text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Kundli Requests</p>
                      <p className="text-2xl font-bold mt-1">{kundliRequests.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FaFileAlt className="text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Blogs</p>
                      <p className="text-2xl font-bold mt-1">{blogs.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FaEdit className="text-amber-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <h2 className="text-lg lg:text-xl font-bold mb-4">Recent Activity</h2>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 lg:px-4">Type</th>
                        <th className="text-left py-3 px-2 lg:px-4">Name</th>
                        <th className="text-left py-3 px-2 lg:px-4">Status</th>
                        <th className="text-left py-3 px-2 lg:px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...consultations, ...demoBookings, ...kundliRequests]
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .slice(0, 10)
                        .map((item) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2 lg:px-4">
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100">
                                {item.type || 'consultation'}
                              </span>
                            </td>
                            <td className="py-3 px-2 lg:px-4 font-medium text-sm lg:text-base">{item.name}</td>
                            <td className="py-3 px-2 lg:px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                item.status === 'payment_pending' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {item.status?.replace('_', ' ') || 'pending'}
                              </span>
                            </td>
                            <td className="py-3 px-2 lg:px-4 text-gray-500 text-sm">
                              {new Date(item.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Consultations Tab */}
          {activeTab === 'consultations' && (
            <ConsultationsTable 
              data={consultations}
              loading={loading}
              onRefresh={fetchDashboardData}
              onUpdateStatus={updateConsultationStatus}
              onDelete={handleDeleteConsultation}
            />
          )}

          {/* Demo Bookings Tab */}
          {activeTab === 'demo-bookings' && (
            <DemoBookingsTable 
              data={demoBookings}
              loading={loading}
              onUpdateStatus={updateDemoStatus}
              onDelete={handleDeleteDemo}
            />
          )}

          {/* Kundli Requests Tab */}
          {activeTab === 'kundli-requests' && (
            <KundliRequestsTable 
              data={kundliRequests}
              loading={loading}
              onUpdateStatus={updateKundliStatus}
              onDelete={handleDeleteKundli}
            />
          )}

          {/* Blogs Tab */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <h2 className="text-xl lg:text-2xl font-bold">Blog Management</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search blogs..."
                      value={blogSearchTerm}
                      onChange={(e) => setBlogSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <button
                    onClick={() => {
                      setEditingBlog(null)
                      setBlogFormData({
                        title: '',
                        excerpt: '',
                        content: '',
                        image_url: '',
                        image_key: '',
                        author: 'Accurate Astro',
                        tags: '',
                        published: true,
                        featured: false,
                        meta_title: '',
                        meta_description: ''
                      })
                      setImagePreview('')
                      setShowBlogForm(true)
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:opacity-90 flex items-center justify-center space-x-2"
                  >
                    <FaPlus />
                    <span>New Blog</span>
                  </button>
                </div>
              </div>

              {/* Blogs Grid */}
              {loading ? (
                <div className="text-center py-12">Loading blogs...</div>
              ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No blogs found</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredBlogs.map((blog) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-shadow duration-300"
                    >
                      {/* Blog Image */}
                      <div className="h-48 overflow-hidden">
                        {blog.image_url ? (
                          <img 
                            src={blog.image_url} 
                            alt={blog.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <div className="text-white text-center">
                              <FaImage className="text-3xl sm:text-4xl mb-2 mx-auto" />
                              <p className="font-semibold">No Image</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Blog Content */}
                      <div className="p-4 sm:p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-sm sm:text-lg line-clamp-1">{blog.title}</h3>
                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mt-1">
                              <FaCalendar />
                              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                              <FaUser />
                              <span>{blog.author}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            {blog.featured && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                Featured
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              blog.published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {blog.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">
                          {blog.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {blog.tags?.slice(0, 3).map((tag) => (
                            <span 
                              key={tag} 
                              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                            <FaEye />
                            <span>{blog.view_count || 0} views</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditBlog(blog)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <TestimonialsManagement 
              testimonials={testimonials}
              loading={loading}
              onDelete={handleDeleteTestimonial}
              onEdit={handleEditTestimonial}
              onAddNew={() => {
                setEditingTestimonial(null)
                setTestimonialFormData({
                  name: '',
                  youtube_url: '',
                  description: '',
                  rating: 5,
                  location: 'India',
                  is_featured: false,
                  status: 'active'
                })
                setShowTestimonialForm(true)
              }}
              extractVideoId={extractVideoId}
            />
          )}
        </main>
      </div>

      {/* Blog Form Modal with Image Upload */}
      {showBlogForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold">
                  {editingBlog ? 'Edit Blog' : 'Create New Blog'}
                </h3>
                <button
                  onClick={() => {
                    setShowBlogForm(false)
                    setImagePreview('')
                    setUploadingImage(false)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleBlogSubmit} className="space-y-4 sm:space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={blogFormData.title}
                    onChange={handleBlogInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    placeholder="Enter blog title"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={blogFormData.excerpt}
                    onChange={handleBlogInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="3"
                    placeholder="Brief summary of the blog"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={blogFormData.content}
                    onChange={handleBlogInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="6"
                    required
                    placeholder="Write your blog content here..."
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaImage className="inline mr-2" /> Featured Image
                  </label>
                  
                  {/* Image Preview */}
                  {(imagePreview || blogFormData.image_url) && (
                    <div className="mb-4">
                      <div className="relative">
                        <img 
                          src={imagePreview || blogFormData.image_url} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setBlogFormData({
                              ...blogFormData,
                              image_url: '',
                              image_key: ''
                            })
                            setImagePreview('')
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                      {blogFormData.image_key && (
                        <div className="mt-2 text-xs text-gray-500">
                          File: {blogFormData.image_key.split('/').pop()}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Upload Options */}
                  <div className="space-y-4">
                    {/* Upload via File */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                toast.error('Image size should be less than 2MB')
                                return
                              }
                              handleImageUpload(file)
                            }
                          }}
                          className="hidden"
                          id="blog-image-upload"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor="blog-image-upload"
                          className={`flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                            uploadingImage 
                              ? 'bg-gray-100 border-gray-300' 
                              : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                          }`}
                        >
                          {uploadingImage ? (
                            <>
                              <FaSpinner className="animate-spin text-2xl mb-2 text-gray-500" />
                              <span className="text-gray-600">Uploading image...</span>
                            </>
                          ) : (
                            <>
                              <FaUpload className="text-2xl mb-2 text-gray-500" />
                              <span className="text-gray-700 font-medium">Click to upload image</span>
                              <span className="text-gray-500 text-sm mt-1">or drag and drop</span>
                              <span className="text-gray-400 text-xs mt-1">JPEG, PNG, WebP, GIF (max 2MB)</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* OR Separator */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-gray-500 font-medium">OR</span>
                      </div>
                    </div>

                    {/* External URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Use Image URL
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="url"
                          name="image_url"
                          value={blogFormData.image_url}
                          onChange={handleBlogInputChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                        />
                        {blogFormData.image_url && (
                          <button
                            type="button"
                            onClick={() => setImagePreview(blogFormData.image_url)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            Preview
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Enter direct URL to an image
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaTag className="inline mr-2" /> Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={blogFormData.tags}
                    onChange={handleBlogInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="vedic-astrology, horoscope, predictions"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate tags with commas
                  </p>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="inline mr-2" /> Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={blogFormData.author}
                    onChange={handleBlogInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="published"
                      checked={blogFormData.published}
                      onChange={handleBlogInputChange}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Published</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={blogFormData.featured}
                      onChange={handleBlogInputChange}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Featured</span>
                  </label>
                </div>

                {/* Meta Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title (for SEO)
                    </label>
                    <input
                      type="text"
                      name="meta_title"
                      value={blogFormData.meta_title}
                      onChange={handleBlogInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description (for SEO)
                    </label>
                    <textarea
                      name="meta_description"
                      value={blogFormData.meta_description}
                      onChange={handleBlogInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="2"
                      placeholder="SEO description for search engines"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBlogForm(false)
                      setImagePreview('')
                      setUploadingImage(false)
                    }}
                    className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingImage}
                    className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaSave />
                    )}
                    <span>{editingBlog ? 'Update Blog' : 'Create Blog'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Testimonial Form Modal */}
      {showTestimonialForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
                <button
                  onClick={() => setShowTestimonialForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleTestimonialSubmit} className="space-y-4 sm:space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="inline mr-2" /> Client Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={testimonialFormData.name}
                    onChange={handleTestimonialInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    placeholder="Enter client name"
                  />
                </div>

                {/* YouTube URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaVideo className="inline mr-2" /> YouTube URL *
                  </label>
                  <input
                    type="url"
                    name="youtube_url"
                    value={testimonialFormData.youtube_url}
                    onChange={handleTestimonialInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                  />
                  {testimonialFormData.youtube_url && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">
                        Video ID: {extractVideoId(testimonialFormData.youtube_url) || 'Invalid URL'}
                      </p>
                      {extractVideoId(testimonialFormData.youtube_url) && (
                        <div className="mt-2 relative pb-[56.25%]">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractVideoId(testimonialFormData.youtube_url)}`}
                            className="absolute top-0 left-0 w-full h-full rounded"
                            title="Preview"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Full YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaQuoteLeft className="inline mr-2" /> Testimonial Text *
                  </label>
                  <textarea
                    name="description"
                    value={testimonialFormData.description}
                    onChange={handleTestimonialInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="4"
                    required
                    placeholder="What did the client say about your service?"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaStar className="inline mr-2" /> Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setTestimonialFormData({...testimonialFormData, rating: star})}
                        className={`text-2xl ${star <= testimonialFormData.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        <FaStar />
                      </button>
                    ))}
                    <span className="ml-2 text-gray-600">{testimonialFormData.rating}/5</span>
                  </div>
                  <input
                    type="hidden"
                    name="rating"
                    value={testimonialFormData.rating}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaMapMarkerAlt className="inline mr-2" /> Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={testimonialFormData.location}
                    onChange={handleTestimonialInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Mumbai, India"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={testimonialFormData.is_featured}
                      onChange={handleTestimonialInputChange}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Featured Testimonial</span>
                  </label>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={testimonialFormData.status}
                    onChange={handleTestimonialInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowTestimonialForm(false)}
                    className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                  >
                    <FaSave />
                    <span>{editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Reusable Table Components (same as before)
const ConsultationsTable = ({ data, loading, onRefresh, onUpdateStatus, onDelete }) => {
  const [localData, setLocalData] = useState(data)

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await onUpdateStatus(id, newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold">Consultations</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : localData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No consultations found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Name</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Contact</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Amount</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Status</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Date of Birth & Gender</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Date</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {localData.map((consultation) => (
                <tr key={consultation.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 lg:px-4">
                    <div>
                      <p className="font-medium text-sm lg:text-base">{consultation.name}</p>
                      <p className="text-xs text-gray-500">{consultation.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-sm">{consultation.phone}</td>
                  <td className="py-3 px-2 lg:px-4 font-semibold text-sm lg:text-base">₹{consultation.amount || 0}</td>
                  <td className="py-3 px-2 lg:px-4">
                    <select 
                      value={consultation.status || 'payment_pending'}
                      onChange={(e) => handleStatusChange(consultation.id, e.target.value)}
                      className="px-2 py-1 rounded-full text-xs font-semibold border w-full max-w-[150px]"
                    >
                      <option value="payment_pending">Payment Pending</option>
                      <option value="received">Received</option>
                      <option value="on_the_call">On the Call</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 lg:px-4">
  <div>
    <p className="text-xs text-gray-500">
      {consultation.dob ? new Date(consultation.dob).toLocaleDateString() : 'N/A'} • 
      {consultation.gender ? ` ${consultation.gender.charAt(0).toUpperCase() + consultation.gender.slice(1)}` : ''}
    </p>
  </div>
</td>
                  <td className="py-3 px-2 lg:px-4 text-gray-500 text-sm">
                    {new Date(consultation.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 lg:px-4">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => onDelete(consultation.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const DemoBookingsTable = ({ data, loading, onUpdateStatus, onDelete }) => {
  const handleStatusChange = async (id, newStatus) => {
    try {
      await onUpdateStatus(id, newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
      <h2 className="text-xl font-bold mb-6">Demo Bookings</h2>
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No demo bookings found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Name</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Contact</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Date & Time</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Date of Birth & Gender</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Status</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 lg:px-4">
                    <div>
                      <p className="font-medium text-sm lg:text-base">{booking.name}</p>
                      <p className="text-xs text-gray-500">{booking.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-sm">{booking.phone}</td>
                  <td className="py-3 px-2 lg:px-4 text-sm">
                    {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'} 
                    {booking.time && ` at ${booking.time}`}
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-sm">
  <div>
    <p className="text-xs text-gray-500">
      {booking.dob ? new Date(booking.dob).toLocaleDateString() : 'N/A'} • 
      {booking.gender ? ` ${booking.gender.charAt(0).toUpperCase() + booking.gender.slice(1)}` : ''}
    </p>
  </div>
</td>
                  <td className="py-3 px-2 lg:px-4">
                    <select 
                      value={booking.status || 'submitted'}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="px-2 py-1 rounded-full text-xs font-semibold border w-full max-w-[150px]"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="meeting_due">Meeting Due</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 lg:px-4">
                    <div className="flex flex-col sm:flex-row gap-1">
                      <button 
                        onClick={() => onDelete(booking.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const KundliRequestsTable = ({ data, loading, onUpdateStatus, onDelete }) => {
  const handleStatusChange = async (id, newStatus) => {
    try {
      await onUpdateStatus(id, newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
      <h2 className="text-xl font-bold mb-6">Kundli Requests</h2>
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No kundli requests found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Name</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Birth Details</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Amount</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Status</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Date</th>
                <th className="text-left py-3 px-2 lg:px-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((request) => (
                <tr key={request.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 lg:px-4">
                    <div>
                      <p className="font-medium text-sm lg:text-base">{request.name}</p>
                      <p className="text-xs text-gray-500">{request.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-sm">
                    <div>
                      <p className="text-sm">
                        {request.birth_date ? new Date(request.birth_date).toLocaleDateString() : 'N/A'}
                        {request.birth_time && ` • ${request.birth_time}`}
                      </p>
                      <p className="text-xs text-gray-500">{request.birth_place || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4 font-semibold text-sm lg:text-base">₹{request.amount || 0}</td>
                  <td className="py-3 px-2 lg:px-4">
                    <select 
                      value={request.status || 'payment_pending'}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                      className="px-2 py-1 rounded-full text-xs font-semibold border w-full max-w-[150px]"
                    >
                      <option value="payment_pending">Payment Pending</option>
                      <option value="submitted">Submitted</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-gray-500 text-sm">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 lg:px-4">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => onDelete(request.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const TestimonialsManagement = ({ testimonials, loading, onDelete, onEdit, onAddNew, extractVideoId }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold">Testimonials Management</h2>
        <button 
          onClick={onAddNew}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:opacity-90 text-sm flex items-center space-x-2 transition-opacity"
        >
          <FaPlus />
          <span>Add New Testimonial</span>
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No testimonials found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => {
            const videoId = extractVideoId(testimonial.youtube_url)
            return (
              <div key={testimonial.id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <FaMapMarkerAlt />
                      <span>{testimonial.location || 'India'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {testimonial.is_featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                    <div className="flex items-center text-yellow-500">
                      <FaStar />
                      <span className="ml-1 text-sm font-semibold">{testimonial.rating || 5}</span>
                    </div>
                  </div>
                </div>
                
                {/* Video Preview */}
                {videoId && (
                  <div className="mb-3">
                    <div className="relative pb-[56.25%] bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        className="absolute top-0 left-0 w-full h-full"
                        title={testimonial.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      YouTube Video: {videoId}
                    </div>
                  </div>
                )}
                
                {/* Testimonial Text */}
                <div className="mb-4">
                  <div className="flex items-start mb-2">
                    <FaQuoteLeft className="text-gray-300 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {testimonial.description}
                    </p>
                  </div>
                  {testimonial.description?.length > 150 && (
                    <button 
                      onClick={() => {}}
                      className="text-xs text-purple-600 hover:text-purple-800"
                    >
                      Read more
                    </button>
                  )}
                </div>
                
                {/* Status and Actions */}
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    testimonial.status === 'active' ? 'bg-green-100 text-green-800' :
                    testimonial.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {testimonial.status || 'active'}
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onEdit(testimonial)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(testimonial.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard