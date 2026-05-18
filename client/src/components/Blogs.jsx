import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendar, FaUser, FaArrowRight, FaTimes } from 'react-icons/fa'

const Blogs = ({ blogs = [] }) => {
  const [visibleCount, setVisibleCount] = useState(3)
  const [selectedBlog, setSelectedBlog] = useState(null)
  
  // Ensure blogs is always an array
  const blogArray = Array.isArray(blogs) ? blogs : []

  const loadMore = () => {
    setVisibleCount(prev => prev + 3)
  }

  const openBlogModal = (blog) => {
    setSelectedBlog(blog)
    document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
  }

  const closeBlogModal = () => {
    setSelectedBlog(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <>
      <section id="blogs" className="section-padding bg-white">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="text-astro-teal font-semibold text-sm uppercase tracking-wider">Astrology Insights</span>
              <div className="h-1 w-20 bg-gradient-to-r from-astro-teal to-astro-blue mx-auto mt-2" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Latest <span className="gradient-text">Astrology Blogs</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dive deep into Vedic astrology, planetary movements, and spiritual wisdom through our expert articles.
            </p>
          </div>

          {/* Blogs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(blogArray) && blogArray.slice(0, visibleCount).map((blog, index) => (
              <motion.article
                key={blog?.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl card-hover group"
              >
                {/* Blog Image */}
                <div className="relative h-48 overflow-hidden">
                  {blog?.image_url ? (
                    <img 
                      src={blog.image_url} 
                      alt={blog?.title || 'Blog image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">✨</div>
                        <p className="font-semibold">Astrology Wisdom</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <FaCalendar className="mr-1" />
                        {blog?.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'Recent'}
                      </span>
                      <span className="flex items-center">
                        <FaUser className="mr-1" />
                        {blog?.author || 'Accurate Astro'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog?.title || 'Astrology Insights'}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {blog?.excerpt || 'Discover profound insights into astrology and spiritual wisdom...'}
                  </p>

                  {/* Read More Button */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <button 
                      onClick={() => openBlogModal(blog)}
                      className="text-astro-blue font-semibold hover:text-astro-dark flex items-center space-x-2 group"
                    >
                      <span>Read Full Article</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < blogArray.length && (
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMore}
                className="px-8 py-3 bg-gradient-to-r from-astro-blue to-astro-teal text-white rounded-full font-semibold hover:shadow-xl transition-shadow flex items-center mx-auto space-x-2"
              >
                <span>Load More Articles</span>
                <FaArrowRight />
              </motion.button>
            </div>
          )}
        </div>
      </section>

      {/* Blog Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={closeBlogModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl my-8 bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeBlogModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-colors"
              >
                <FaTimes className="text-gray-700 text-xl" />
              </button>

              {/* Blog Hero Image */}
              <div className="relative h-64 md:h-96 overflow-hidden">
                {selectedBlog?.image_url ? (
                  <img 
                    src={selectedBlog.image_url} 
                    alt={selectedBlog?.title || 'Blog image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-4">✨</div>
                      <p className="text-2xl font-semibold">Astrology Wisdom</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Blog Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {selectedBlog?.title || 'Astrology Insights'}
                  </h1>
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-6 md:p-8">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center text-gray-600">
                      <FaUser className="mr-2" />
                      <span>{selectedBlog?.author || 'Accurate Astro'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendar className="mr-2" />
                      <span>
                        {selectedBlog?.created_at ? new Date(selectedBlog.created_at).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'Recent'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Blog Body */}
                <article className="prose prose-lg max-w-none">
                  {selectedBlog?.content ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                  ) : (
                    // If there's no content, show the excerpt
                    <div className="space-y-4">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {selectedBlog?.excerpt || 'This article contains valuable insights into astrology and spiritual wisdom.'}
                      </p>
                    </div>
                  )}
                </article>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Blogs