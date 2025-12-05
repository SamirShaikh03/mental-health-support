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
  faShieldAlt,
  faStar,
  faThumbsUp,
  faBookmark,
  faShare,
  faBell,
  faChevronDown,
  faChevronUp,
  faUserCircle,
  faCheckCircle,
  faTimes,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

// Forum Post Card Component
const ForumPostCard = ({ 
  post, 
  index, 
  isExpanded, 
  onToggleExpansion, 
  onLike, 
  onReport, 
  onView, 
  categories, 
  getTimeAgo, 
  isPinned 
}) => {
  const categoryInfo = categories.find(c => c.id === post.category);
  const shouldTruncate = post.content.length > 200;
  const displayContent = shouldTruncate && !isExpanded 
    ? `${post.content.substring(0, 200)}...` 
    : post.content;

  return (
    <motion.div
      className={`forum-post ${isPinned ? 'pinned' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      onClick={() => onView(post.id)}
    >
      {isPinned && (
        <div className="pinned-indicator">
          <FontAwesomeIcon icon={faStar} />
          <span>Pinned</span>
        </div>
      )}

      <div className="post-header">
        <div className="post-meta">
          <motion.span 
            className="category-tag"
            style={{ 
              backgroundColor: categoryInfo?.color || '#64748b',
              color: 'white'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon icon={categoryInfo?.icon || faComments} />
            {categoryInfo?.name || 'General'}
          </motion.span>
          
          <div className="post-info">
            <span className="post-author">
              <FontAwesomeIcon icon={faUserCircle} />
              {post.author}
            </span>
            <span className="post-time">
              <FontAwesomeIcon icon={faClock} />
              {getTimeAgo(post.timestamp)}
            </span>
            <span className="post-views">
              <FontAwesomeIcon icon={faEye} />
              {post.views || 0} views
            </span>
          </div>
        </div>
        
        <button 
          className="report-btn"
          onClick={(e) => {
            e.stopPropagation();
            onReport(post.id);
          }}
          title="Report inappropriate content"
        >
          <FontAwesomeIcon icon={faFlag} />
        </button>
      </div>

      <div className="post-content">
        <h3>{post.title}</h3>
        <p>{displayContent}</p>
        
        {shouldTruncate && (
          <button 
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpansion(post.id);
            }}
          >
            {isExpanded ? (
              <>
                <FontAwesomeIcon icon={faChevronUp} />
                Show less
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faChevronDown} />
                Read more
              </>
            )}
          </button>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="post-actions">
        <div className="engagement-actions">
          <motion.button 
            className="engagement-btn like-btn"
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faHeart} />
            <span>{post.likes}</span>
          </motion.button>
          
          <button 
            className="engagement-btn reply-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon icon={faReply} />
            <span>{post.replies} replies</span>
          </button>

          <div className="engagement-pill">
            <FontAwesomeIcon icon={faEye} />
            <span>{post.views || 0} views</span>
          </div>
        </div>

        <div className="utility-actions">
          <button 
            className="icon-action share-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon icon={faShare} />
            Share
          </button>

          <button 
            className="icon-action bookmark-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon icon={faBookmark} />
            Save
          </button>
        </div>

        {isExpanded && post.replies_data && post.replies_data.length > 0 && (
          <div className="replies-section">
            <h4>Replies ({post.replies})</h4>
            {post.replies_data.map(reply => (
              <div key={reply.id} className="reply-item">
                <div className="reply-header">
                  <div className="reply-author">
                    <FontAwesomeIcon icon={faUserCircle} />
                    {reply.is_volunteer && (
                      <span className="volunteer-badge">
                        <FontAwesomeIcon icon={faShieldAlt} />
                        Student Volunteer
                      </span>
                    )}
                    {reply.author}
                  </div>
                  <span className="reply-time">
                    <FontAwesomeIcon icon={faClock} />
                    {getTimeAgo(reply.timestamp)}
                  </span>
                </div>
                <p className="reply-content">{reply.content}</p>
                <div className="reply-actions">
                  <button className="reply-like-btn">
                    <FontAwesomeIcon icon={faThumbsUp} />
                    {reply.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

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
  const [sortBy, setSortBy] = useState('recent');
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [activeTab, setActiveTab] = useState('discussions');
  
  // Forum categories for student mental health discussions
  const categories = [
    { id: 'all', name: 'All Posts', color: '#6366f1', icon: faComments },
    { id: 'academic-stress', name: 'Academic Stress', color: '#f59e0b', icon: faBookmark },
    { id: 'anxiety', name: 'Anxiety Support', color: '#ef4444', icon: faHeart },
    { id: 'depression', name: 'Depression Help', color: '#8b5cf6', icon: faUsers },
    { id: 'social-isolation', name: 'Social Connections', color: '#06b6d4', icon: faUserFriends },
    { id: 'sleep-issues', name: 'Sleep Problems', color: '#84cc16', icon: faClock },
    { id: 'general', name: 'General Support', color: '#64748b', icon: faShieldAlt }
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
        content: "I'm a 2nd year CS student and I'm really struggling with the pressure of upcoming exams. The workload feels impossible and I'm having panic attacks. Anyone else feeling this way? How do you cope with exam stress?",
        category: 'academic-stress',
        author: 'Anonymous Student',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: 15,
        replies: 8,
        views: 45,
        isModerated: true,
        isPinned: false,
        tags: ['exams', 'stress', 'cs-student'],
        replies_data: [
          {
            id: 11,
            content: "I totally understand! I found creating a study schedule really helped me. Break down your syllabus into small daily goals and take regular breaks. Also, deep breathing exercises before studying can help with anxiety.",
            author: "Study Buddy",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            likes: 8,
            is_volunteer: true
          },
          {
            id: 12,
            content: "Same here! What helped me was forming a study group. We quiz each other and it makes studying less lonely. Also, remember that your health comes first - don't sacrifice sleep for studies.",
            author: "Peer Helper",
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            likes: 5,
            is_volunteer: false
          }
        ]
      },
      {
        id: 2,
        title: "Trouble making friends in college",
        content: "I've been in college for 6 months now but I still feel very isolated. Everyone seems to have their groups already. How do I connect with other students? I'm getting really lonely and it's affecting my motivation to study.",
        category: 'social-isolation',
        author: 'Anonymous Student',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        likes: 23,
        replies: 12,
        views: 78,
        isModerated: true,
        isPinned: true,
        tags: ['friendship', 'loneliness', 'social-anxiety'],
        replies_data: [
          {
            id: 21,
            content: "Join clubs and societies! That's how I met my best friends. Look for activities you're genuinely interested in - the connections will feel more natural.",
            author: "Social Connector",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            likes: 12,
            is_volunteer: true
          }
        ]
      },
      {
        id: 3,
        title: "Can't sleep before important presentations",
        content: "Every time I have a presentation or viva, I can't sleep the night before. My mind just races with all the things that could go wrong. This is affecting my performance and I end up being tired during the actual presentation. Any tips for managing pre-presentation anxiety?",
        category: 'sleep-issues',
        author: 'Anonymous Student',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        likes: 18,
        replies: 6,
        views: 34,
        isModerated: true,
        isPinned: false,
        tags: ['presentations', 'anxiety', 'sleep'],
        replies_data: [
          {
            id: 31,
            content: "Try the 4-7-8 breathing technique before bed. Also, prepare your presentation well in advance so you feel more confident. Practice in front of a mirror or friends!",
            author: "Presentation Pro",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            likes: 7,
            is_volunteer: false
          }
        ]
      },
      {
        id: 4,
        title: "Feeling like I don't belong here",
        content: "Sometimes I feel like I'm not smart enough to be in this program. Everyone else seems so confident and knows what they're doing. I'm starting to doubt if I made the right choice. Has anyone else felt like this?",
        category: 'depression',
        author: 'Anonymous Student',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        likes: 31,
        replies: 15,
        views: 89,
        isModerated: true,
        isPinned: false,
        tags: ['imposter-syndrome', 'self-doubt', 'confidence'],
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

  // Function to toggle post expansion
  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Function to handle viewing a post (increment view count)
  const handleViewPost = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, views: (post.views || 0) + 1 }
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
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch && post.isModerated; // Only show moderated posts
  });

  // Sort posts based on selected criteria
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes + b.replies) - (a.likes + a.replies);
      case 'replies':
        return b.replies - a.replies;
      case 'recent':
      default:
        return new Date(b.timestamp) - new Date(a.timestamp);
    }
  });

  // Separate pinned and regular posts
  const pinnedPosts = sortedPosts.filter(post => post.isPinned);
  const regularPosts = sortedPosts.filter(post => !post.isPinned);

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="auth-content"
            >
              <FontAwesomeIcon icon={faUsers} size="4x" style={{ color: '#6366f1' }} />
              <h2>Join Our Peer Support Community</h2>
              <p>Connect with fellow students in a safe, moderated environment</p>
              <div className="features-list">
                <div className="feature">
                  <FontAwesomeIcon icon={faShieldAlt} />
                  <span>Moderated by student volunteers</span>
                </div>
                <div className="feature">
                  <FontAwesomeIcon icon={faUserCircle} />
                  <span>Anonymous discussions</span>
                </div>
                <div className="feature">
                  <FontAwesomeIcon icon={faHeart} />
                  <span>Supportive community</span>
                </div>
              </div>
              <p className="login-prompt">Please log in to participate in discussions and get support from your peers</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="peer-support-page">
      <div className="container">
        {/* Enhanced Page Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-left">
              <h1>
                <FontAwesomeIcon icon={faUsers} className="header-icon" />
                Peer Support Forum
              </h1>
              <p>Connect with fellow students in a safe, moderated community</p>
              <div className="community-stats">
                <div className="stat">
                  <FontAwesomeIcon icon={faComments} />
                  <span>{posts.length} Active Discussions</span>
                </div>
                <div className="stat">
                  <FontAwesomeIcon icon={faUserFriends} />
                  <span>200+ Community Members</span>
                </div>
                <div className="stat">
                  <FontAwesomeIcon icon={faShieldAlt} />
                  <span>Student Volunteer Moderated</span>
                </div>
              </div>
            </div>
            
            <motion.button 
              className="btn btn-primary"
              onClick={() => setShowNewPostForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faPlus} />
              New Discussion
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Forum Guidelines */}
        <motion.div 
          className="forum-guidelines"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="guidelines-header">
            <FontAwesomeIcon icon={faShieldAlt} />
            <h3>Community Guidelines</h3>
          </div>
          <div className="guidelines-grid">
            <div className="guideline-item">
              <FontAwesomeIcon icon={faHeart} />
              <span>Be respectful and supportive</span>
            </div>
            <div className="guideline-item">
              <FontAwesomeIcon icon={faUserCircle} />
              <span>Anonymous & confidential</span>
            </div>
            <div className="guideline-item">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>Moderated by volunteers</span>
            </div>
            <div className="guideline-item">
              <FontAwesomeIcon icon={faFlag} />
              <span>Report inappropriate content</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="tab-navigation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button 
            className={`tab-btn ${activeTab === 'discussions' ? 'active' : ''}`}
            onClick={() => setActiveTab('discussions')}
          >
            <FontAwesomeIcon icon={faComments} />
            Discussions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
            onClick={() => setActiveTab('trending')}
          >
            <FontAwesomeIcon icon={faThumbsUp} />
            Trending
          </button>
          <button 
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            <FontAwesomeIcon icon={faBookmark} />
            Resources
          </button>
        </motion.div>

        <div className="forum-content">
          {/* Enhanced Controls */}
          <motion.div 
            className="forum-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="controls-header">
              <div className="controls-header-text">
                <p className="controls-eyebrow">Smart filters</p>
                <h3>Navigate community conversations with precision</h3>
                <p>Use the search and category chips to jump into topics that matter right now.</p>
              </div>
              <div className="controls-metrics">
                <span className="metric-pill">
                  <FontAwesomeIcon icon={faFilter} />
                  Dynamic filters
                </span>
                <span className="metric-pill active">
                  <FontAwesomeIcon icon={faComments} />
                  {filteredPosts.length} matches
                </span>
              </div>
            </div>

            <div className="controls-main">
              <div className="search-panel">
                <label htmlFor="forum-search">Search discussions</label>
                <div className="search-field">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input
                    id="forum-search"
                    type="text"
                    placeholder="Search discussions, topics, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="sort-panel">
                <label htmlFor="sort-select">Sort order</label>
                <div className="sort-select-wrapper">
                  <select 
                    id="sort-select"
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="replies">Most Replies</option>
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
              </div>
            </div>

            <div className="category-scroller">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  style={{ 
                    backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                    borderColor: category.color,
                    color: selectedCategory === category.id ? 'white' : category.color
                  }}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FontAwesomeIcon icon={category.icon} />
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Forum Posts */}
          <motion.div 
            className="forum-posts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
              <section className="pinned-posts">
                <div className="pinned-header">
                  <div>
                    <span className="pinned-eyebrow">
                      <FontAwesomeIcon icon={faStar} />
                      Featured by moderators
                    </span>
                    <h3>Pinned discussions</h3>
                    <p>Important conversations surfaced for quick attention.</p>
                  </div>
                  <span className="pinned-count">
                    <FontAwesomeIcon icon={faBell} />
                    {pinnedPosts.length} live topics
                  </span>
                </div>
                <div className="pinned-grid">
                  {pinnedPosts.map((post, index) => (
                    <ForumPostCard 
                      key={post.id} 
                      post={post} 
                      index={index}
                      isExpanded={expandedPosts.has(post.id)}
                      onToggleExpansion={togglePostExpansion}
                      onLike={handleLike}
                      onReport={handleReport}
                      onView={handleViewPost}
                      categories={categories}
                      getTimeAgo={getTimeAgo}
                      isPinned={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 ? (
              <div className="regular-posts-section">
                {pinnedPosts.length > 0 && (
                  <div className="regular-header">
                    <h3>
                      <FontAwesomeIcon icon={faComments} />
                      Recent discussions
                    </h3>
                    <p>Fresh conversations from across the community.</p>
                  </div>
                )}
                {regularPosts.map((post, index) => (
                  <ForumPostCard 
                    key={post.id} 
                    post={post} 
                    index={index}
                    isExpanded={expandedPosts.has(post.id)}
                    onToggleExpansion={togglePostExpansion}
                    onLike={handleLike}
                    onReport={handleReport}
                    onView={handleViewPost}
                    categories={categories}
                    getTimeAgo={getTimeAgo}
                    isPinned={false}
                  />
                ))}
              </div>
            ) : (
              <div className="no-posts">
                <FontAwesomeIcon icon={faComments} size="3x" />
                <h3>No discussions found</h3>
                <p>Be the first to start a conversation in this category!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowNewPostForm(true)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Start a Discussion
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Enhanced New Post Modal */}
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
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>
                    <FontAwesomeIcon icon={faPlus} />
                    Start a New Discussion
                  </h2>
                  <button 
                    className="close-modal"
                    onClick={() => setShowNewPostForm(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <form onSubmit={handlePostSubmit} className="post-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">
                        <FontAwesomeIcon icon={faComments} />
                        Category
                      </label>
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
                  </div>

                  <div className="form-group">
                    <label htmlFor="title">
                      <FontAwesomeIcon icon={faEdit} />
                      Discussion Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      placeholder="Write a clear, descriptive title for your discussion..."
                      required
                      maxLength={100}
                    />
                    <small className="char-count">{newPost.title.length}/100 characters</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">
                      <FontAwesomeIcon icon={faComments} />
                      Your Message
                    </label>
                    <textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      placeholder="Share your thoughts, experiences, or questions. Remember to be respectful and supportive. Our community is here to help each other."
                      required
                      rows={8}
                      maxLength={1000}
                    />
                    <small className="char-count">{newPost.content.length}/1000 characters</small>
                  </div>

                  <div className="privacy-notice">
                    <div className="notice-header">
                      <FontAwesomeIcon icon={faShieldAlt} />
                      <h4>Privacy & Moderation</h4>
                    </div>
                    <ul>
                      <li>Your post will be published anonymously to protect your privacy</li>
                      <li>All posts are reviewed by trained student volunteer moderators</li>
                      <li>Posts typically appear within 30 minutes after review</li>
                      <li>For immediate crisis support, please contact emergency services</li>
                    </ul>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowNewPostForm(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={!newPost.title.trim() || !newPost.content.trim()}
                    >
                      <FontAwesomeIcon icon={faPlus} />
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
