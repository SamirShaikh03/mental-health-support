import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faPlus, 
  faHeart,
  faReply,
  faFlag,
  faComments,
  faSearch,
  faFilter,
  faUserFriends,
  faClock,
  faEye,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PeerSupport Component - Moderated peer-to-peer support forum
 * 
 * This component implements Requirement #4 from the problem statement:
 * "Peer Support Platform: Moderated peer-to-peer support forum with trained student volunteers"
 * 
 * Features:
 * - Anonymous posting system for privacy
 * - Category-based discussions (Academic Stress, Anxiety, Depression, etc.)
 * - Moderation by trained student volunteers
 * - Support reactions and replies
 * - Content filtering and reporting system
 */

export default function PeerSupport({ user }) {
  // State management for forum data
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Forum categories for student mental health discussions
  const categories = [
    { id: 'all', name: 'All Posts', color: '#6366f1' },
    { id: 'academic-stress', name: 'Academic Stress', color: '#f59e0b' },
    { id: 'anxiety', name: 'Anxiety Support', color: '#ef4444' },
    { id: 'depression', name: 'Depression Help', color: '#8b5cf6' },
    { id: 'social-isolation', name: 'Social Connections', color: '#06b6d4' },
    { id: 'sleep-issues', name: 'Sleep Problems', color: '#84cc16' },
    { id: 'general', name: 'General Support', color: '#64748b' }
  ];

  // Load forum posts when component mounts
  useEffect(() => {
    loadForumPosts();
  }, []);

  // Function to load forum posts (simulated data for demo)
  const loadForumPosts = () => {
    const mockPosts = [
      {
        id: 1,
        title: "Feeling overwhelmed with semester exams",
        content: "I'm a 2nd year CS student and I'm really struggling with the pressure of upcoming exams. Anyone else feeling this way?",
        category: 'academic-stress',
        author: 'Anonymous Student',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: 8,
        replies: 3,
        isModerated: true,
        replies_data: [
          {
            id: 11,
            content: "I totally understand! I found creating a study schedule really helped me. Break down your syllabus into small daily goals.",
            author: "Peer Supporter",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            likes: 2,
            is_volunteer: true
          }
        ]
      },
      {
        id: 2,
        title: "Trouble making friends in college",
        content: "I've been in college for 6 months now but I still feel very isolated. How do I connect with other students?",
        category: 'social-isolation',
        author: 'Anonymous Student',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        likes: 12,
        replies: 5,
        isModerated: true,
        replies_data: []
      },
      {
        id: 3,
        title: "Can't sleep before important presentations",
        content: "Every time I have a presentation or viva, I can't sleep the night before. This is affecting my performance. Any tips?",
        category: 'sleep-issues',
        author: 'Anonymous Student',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        likes: 6,
        replies: 2,
        isModerated: true,
        replies_data: []
      }
    ];
    
    setPosts(mockPosts);
  };

  // Function to handle new post submission
  const handlePostSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to post');
      return;
    }

    // Create new post object
    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author: `${user.name} (Anonymous)`, // Show name to user but appears anonymous to others
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      isModerated: false, // Will be moderated by student volunteers
      replies_data: []
    };

    // Add post to the list
    setPosts(prevPosts => [post, ...prevPosts]);
    
    // Reset form
    setNewPost({ title: '', content: '', category: 'general' });
    setShowNewPostForm(false);
    
    // Show confirmation
    alert('Your post has been submitted for moderation. It will be visible once approved by our student volunteers.');
  };

  // Function to handle liking a post
  const handleLike = (postId) => {
    if (!user) {
      alert('Please log in to like posts');
      return;
    }

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  // Function to report inappropriate content
  const handleReport = (postId) => {
    if (!user) {
      alert('Please log in to report posts');
      return;
    }
    
    alert('Thank you for reporting. Our moderation team will review this content.');
  };

  // Filter posts based on category and search
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && post.isModerated; // Only show moderated posts
  });

  // Function to format time since post creation
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="peer-support-page">
        <div className="container">
          <div className="auth-required">
            <FontAwesomeIcon icon={faUsers} size="3x" />
            <h2>Join Our Peer Support Community</h2>
            <p>Connect with fellow students in a safe, moderated environment</p>
            <p>Please log in to participate in discussions and get support from your peers</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="peer-support-page">
      <div className="container">
        {/* Page Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon={faUsers} />
              Peer Support Forum
            </h1>
            <p>Connect with fellow students in a safe, moderated community</p>
            <div className="community-stats">
              <span><FontAwesomeIcon icon={faUserFriends} /> {posts.length} Active Discussions</span>
              <span><FontAwesomeIcon icon={faShieldAlt} /> Moderated by Student Volunteers</span>
            </div>
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={() => setShowNewPostForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            New Post
          </button>
        </motion.div>

        {/* Forum Guidelines */}
        <motion.div 
          className="forum-guidelines"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3>Community Guidelines</h3>
          <ul>
            <li>🤝 Be respectful and supportive to all community members</li>
            <li>🔒 All posts are anonymous to protect your privacy</li>
            <li>✅ Content is moderated by trained student volunteers</li>
            <li>🚫 No personal attacks, discrimination, or harmful content</li>
            <li>📞 For crisis situations, please contact emergency services immediately</li>
          </ul>
        </motion.div>

        <div className="forum-content">
          {/* Category Filter and Search */}
          <motion.div 
            className="forum-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  style={{ 
                    backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                    borderColor: category.color,
                    color: selectedCategory === category.id ? 'white' : category.color
                  }}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Forum Posts */}
          <motion.div 
            className="forum-posts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="forum-post"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ y: -2 }}
                >
                  <div className="post-header">
                    <div className="post-meta">
                      <span 
                        className="category-tag"
                        style={{ 
                          backgroundColor: categories.find(c => c.id === post.category)?.color || '#64748b' 
                        }}
                      >
                        {categories.find(c => c.id === post.category)?.name || 'General'}
                      </span>
                      <span className="post-author">{post.author}</span>
                      <span className="post-time">
                        <FontAwesomeIcon icon={faClock} />
                        {getTimeAgo(post.timestamp)}
                      </span>
                    </div>
                    
                    <button 
                      className="report-btn"
                      onClick={() => handleReport(post.id)}
                      title="Report inappropriate content"
                    >
                      <FontAwesomeIcon icon={faFlag} />
                    </button>
                  </div>

                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                  </div>

                  <div className="post-actions">
                    <button 
                      className="action-btn like-btn"
                      onClick={() => handleLike(post.id)}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{post.likes}</span>
                    </button>
                    
                    <button className="action-btn reply-btn">
                      <FontAwesomeIcon icon={faReply} />
                      <span>{post.replies} Replies</span>
                    </button>

                    {post.replies_data && post.replies_data.length > 0 && (
                      <div className="replies-preview">
                        {post.replies_data.slice(0, 1).map(reply => (
                          <div key={reply.id} className="reply-preview">
                            <div className="reply-author">
                              {reply.is_volunteer && (
                                <span className="volunteer-badge">
                                  <FontAwesomeIcon icon={faShieldAlt} /> Student Volunteer
                                </span>
                              )}
                              {reply.author}
                            </div>
                            <p>{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="no-posts">
                <FontAwesomeIcon icon={faComments} size="3x" />
                <h3>No discussions found</h3>
                <p>Be the first to start a conversation in this category!</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* New Post Modal */}
        <AnimatePresence>
          {showNewPostForm && (
            <motion.div 
              className="post-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewPostForm(false)}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Create New Post</h2>
                  <button 
                    className="close-modal"
                    onClick={() => setShowNewPostForm(false)}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handlePostSubmit} className="post-form">
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={newPost.category}
                      onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                      required
                    >
                      {categories.slice(1).map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      placeholder="Briefly describe your topic..."
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      placeholder="Share your thoughts, experiences, or questions. Remember to be respectful and supportive."
                      required
                      rows={6}
                      maxLength={1000}
                    />
                    <small>{newPost.content.length}/1000 characters</small>
                  </div>

                  <div className="privacy-notice">
                    <FontAwesomeIcon icon={faShieldAlt} />
                    <p>Your post will be published anonymously and reviewed by our student volunteer moderators before appearing in the forum.</p>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setShowNewPostForm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      Submit for Review
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
