import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaEdit, FaTrash, FaEye, FaPlus, FaSearch,
  FaCalendar, FaUser, FaTag, FaImage, FaSave,
  FaTimes, FaUpload
} from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import api from '../../utils/api'

const AdminBlogs = ({ blogs: propBlogs, loading: propLoading, onRefresh }) => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    author: 'Accurate Astro',
    tags: '',
    published: true,
    featured: false,
    meta_title: '',
    meta_description: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (propBlogs) {
      setBlogs(propBlogs)
      setLoading(propLoading)
    } else {
      fetchBlogs()
    }
  }, [propBlogs, propLoading])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/blogs')
      if (response.data.success) {
        setBlogs(response.data.blogs)
      }
    } catch (error) {
      toast.error('Error fetching blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      const blogData = {
        ...formData,
        tags: tagsArray
      }

      if (editingBlog) {
        const response = await api.put(`/admin/blogs/${editingBlog.id}`, blogData)
        if (response.data.success) {
          toast.success('Blog updated successfully')
          setEditingBlog(null)
        }
      } else {
        const response = await api.post('/admin/blogs', blogData)
        if (response.data.success) {
          toast.success('Blog created successfully')
        }
      }

      setShowForm(false)
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image_url: '',
        author: 'Accurate Astro',
        tags: '',
        published: true,
        featured: false,
        meta_title: '',
        meta_description: ''
      })
      
      if (onRefresh) {
        onRefresh()
      } else {
        fetchBlogs()
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving blog')
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image_url: blog.image_url || '',
      author: blog.author,
      tags: blog.tags?.join(', ') || '',
      published: blog.published,
      featured: blog.featured,
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return

    try {
      const response = await api.delete(`/admin/blogs/${id}`)
      if (response.data.success) {
        toast.success('Blog deleted successfully')
        if (onRefresh) {
          onRefresh()
        } else {
          fetchBlogs()
        }
      }
    } catch (error) {
      toast.error('Error deleting blog')
    }
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <h2 className="text-xl lg:text-2xl font-bold">Blog Management</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => {
              setEditingBlog(null)
              setFormData({
                title: '',
                excerpt: '',
                content: '',
                image_url: '',
                author: 'Accurate Astro',
                tags: '',
                published: true,
                featured: false,
                meta_title: '',
                meta_description: ''
              })
              setShowForm(true)
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 flex items-center justify-center space-x-2"
          >
            <FaPlus />
            <span>New Blog</span>
          </button>
        </div>
      </div>

      {/* Blog Form Modal */}
      {showForm && (
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
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Title */}
                <div>
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="form-label">Excerpt</label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="3"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="form-label">Content *</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="6"
                    required
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="form-label flex items-center">
                    <FaImage className="mr-2" /> Featured Image URL
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="form-label flex items-center">
                    <FaTag className="mr-2" /> Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="vedic-astrology, horoscope, predictions"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Published</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Featured</span>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 flex items-center justify-center space-x-2"
                  >
                    <FaSave />
                    <span>{editingBlog ? 'Update Blog' : 'Create Blog'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

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
              className="bg-white rounded-xl shadow-lg overflow-hidden border"
            >
              {/* Blog Image */}
              <div className="h-48 overflow-hidden">
                {blog.image_url ? (
                  <img 
                    src={blog.image_url} 
                    alt={blog.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
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
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
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
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
  )
}

export default AdminBlogs