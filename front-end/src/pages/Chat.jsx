import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faRobot, 
  faMicrophone,
  faStop,
  faDownload,
  faTrash,
  faHeart,
  faBrain,
  faSmile,
  faRefresh,
  faClock,
  faCommentDots,
  faShieldHeart,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const assistantName = "SerenityAI";
  const displayName = user?.name?.split(' ')[0] || 'friend';

  const heroStats = [
    { icon: faClock, label: 'Avg response time', value: '< 30 sec', detail: 'Stays in sync with you' },
    { icon: faCommentDots, label: 'Context depth', value: '8 turns', detail: 'Keeps recent nuances' },
    { icon: faShieldHeart, label: 'Care rating', value: '4.9 / 5', detail: 'Community feedback' }
  ];

  const moodOptions = [
    {
      id: 'steady',
      emoji: '🌤️',
      label: 'Steady-ish',
      helper: 'Need gentle reflection',
      prompt: "Mood check-in: I'm feeling relatively steady but would like a reflective prompt.",
      response: 'Noted. Let’s build on that steadiness with a grounding reflection—what would you like to appreciate about yourself today?'
    },
    {
      id: 'overwhelmed',
      emoji: '🌧️',
      label: 'Overwhelmed',
      helper: 'Need grounding support',
      prompt: 'Mood check-in: I feel overwhelmed and would like grounding guidance.',
      response: 'Thanks for letting me know. Let’s slow things down: inhale for 4, hold for 4, exhale for 6. Want to name one worry we can deconstruct together?'
    },
    {
      id: 'anxious',
      emoji: '⚡',
      label: 'Anxious',
      helper: 'Need calming plan',
      prompt: 'Mood check-in: Anxiety feels high and I need a calming plan.',
      response: 'Understood. We can pair a breathing cycle with a thought reframe. What trigger showed up most recently?'
    },
    {
      id: 'drained',
      emoji: '🌙',
      label: 'Drained',
      helper: 'Need restoration idea',
      prompt: 'Mood check-in: Energy is low; I need a restorative micro-ritual.',
      response: 'Let’s protect your energy. We can design a 10-minute decompression ritual—shall we start with environment or emotions?'
    }
  ];

  const quickPrompts = [
    'Guide me through a two-minute grounding exercise.',
    'Help me reframe a stressful thought I am stuck on.',
    'Plan tonight’s wind-down so I can actually rest.',
    'Coach me before a difficult conversation I am nervous about.',
    'How can I set a compassionate boundary today?'
  ];

  const wellnessTips = [
    {
      title: 'Micro-grounding reset',
      description: 'Name 5 things you can see, 4 you can touch, 3 you can hear. Pair it with a slow exhale to calm your nervous system.',
      prompt: 'Can you walk me through the 5-4-3 grounding technique right now?'
    },
    {
      title: 'Box breathing focus',
      description: 'Inhale 4 • Hold 4 • Exhale 6 • Rest 2. Repeat three rounds to lower cortisol and regain clarity before responding.',
      prompt: 'Lead me through three rounds of box breathing and add an empowering affirmation.'
    },
    {
      title: 'Energy audit',
      description: 'Track your energy on a 1–10 scale every 3 hours today. Jot what raised or drained it to spot hidden patterns.',
      prompt: 'Help me design a quick energy audit template I can use today.'
    }
  ];

  const currentTip = wellnessTips[tipIndex];
  const handleInputWrapperClick = (event) => {
    const element = event.target;
    const isButtonClick =
      typeof Element !== 'undefined' &&
      element instanceof Element &&
      element.closest('button');

    if (isButtonClick) {
      return;
    }
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (user) {
      startNewSession();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createBotMessage = (text, source = 'system') => ({
    id: Date.now() + Math.random(),
    sender: "bot",
    text,
    timestamp: new Date(),
    source
  });

  const startNewSession = (withGreeting = true) => {
    const sessionId = Date.now();
    const startTime = new Date();
    setChatSession(sessionId);
    setSessionStartTime(startTime);
    setSelectedMood(null);
    setTipIndex(0);
    setIsTyping(false);

    if (withGreeting && user) {
      const greeting = createBotMessage(
        `Hi ${displayName}, I'm ${assistantName}. I’ll keep things calm, clear, and confidential. Share what’s on your mind or tap a prompt to begin.`,
        'welcome'
      );
      setMessages([greeting]);
    } else {
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    // Add a small delay to ensure DOM is updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }, 100);
  }


  // Fallback rule-based response generator (used when Hugging Face key is not set)
  const generateResponse = (message) => {
    if (!message) return "Can you say that again?";
    const m = message.toString().toLowerCase();

    // urgent/crisis detection - keep short and safe
    if (/suicide|kill myself|end my life|hurt myself|i'm going to die|i will die/.test(m)) {
      return "If you are in immediate danger, please call your local emergency services or a crisis helpline right now.";
    }

    // quick intents
    if (/\b(hi|hello|hey)\b/.test(m)) return "Hello — I'm here to listen. How can I help you today?";
    if (/\b(thank|thanks)\b/.test(m)) return "You're welcome — I'm glad I could help.";
    if (/\b(stress|anxiety|anxious|depressed|depression)\b/.test(m)) {
      return "I’m sorry you’re feeling this way. Would you like a short breathing exercise or some coping tips?";
    }

    // default empathetic reply
    return "I hear you. Can you tell me a little more about that?";
  };

  // Enhanced sendMessage function with better error handling and user feedback
  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Build messages for model: include a short system prompt + recent history
    const system = { 
      role: 'system', 
      content: `${assistantName} is a compassionate, professional mental health AI assistant. Provide supportive, empathetic responses that validate feelings and offer practical coping strategies. Always encourage professional help for serious concerns. Keep responses concise but warm.` 
    };
    const history = messages.slice(-8).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));
    const payload = [system, ...history, { role: 'user', content: messageText }];

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ messages: payload })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const json = await response.json();
      const replyText = json.reply || 'I apologize, but I\'m having trouble responding right now. How are you feeling at this moment?';
      const source = json.source || 'unknown';

      // Add a slight delay for natural conversation flow
      setTimeout(() => {
        const botMsg = { 
          id: Date.now() + 1, 
          sender: "bot", 
          text: replyText, 
          timestamp: new Date(),
          source: source // Track whether response came from AI or fallback
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 800);

    } catch (err) {
      console.error('Chat error:', err);

      // Enhanced fallback response based on user message context
      const fallbackResponse = generateLocalFallback(messageText);
      
      setTimeout(() => {
        const botMsg = { 
          id: Date.now() + 1, 
          sender: "bot", 
          text: fallbackResponse, 
          timestamp: new Date(),
          source: 'local-fallback'
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 600);
    }
  };

  // Local fallback function for when API is completely unavailable
  const generateLocalFallback = (message) => {
    const msg = message.toLowerCase();
    
    if (/anxiety|anxious|panic/.test(msg)) {
      return "I can see you're feeling anxious. Try this: take a slow, deep breath in for 4 counts, hold for 4, then exhale for 6. You're safe right now. What's one thing you can see around you?";
    }
    
    if (/sad|depressed|down/.test(msg)) {
      return "Thank you for sharing how you're feeling. It's okay to feel this way, and it's brave of you to reach out. What's one small thing that usually brings you even a tiny bit of comfort?";
    }
    
    if (/stress|overwhelmed/.test(msg)) {
      return "Feeling overwhelmed is completely understandable. Let's take this one step at a time. What feels like the most urgent thing you're dealing with right now?";
    }
    
    return "I'm here to listen to you. Your feelings are valid, and it's important that you're taking time to check in with yourself. What would feel most helpful for you right now?";
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      setIsListening(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      startNewSession();
    }
  };

  const downloadChatHistory = () => {
    const chatData = {
      sessionId: chatSession,
      startTime: sessionStartTime,
      endTime: new Date(),
      messages: messages,
      user: user?.name || 'User'
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `serenityai-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Add this useEffect to prevent initial scroll issues
  useEffect(() => {
    // Reset scroll position on component mount
    window.scrollTo(0, 0);
  }, []);

  const handleMoodSelect = (option) => {
    const timestamp = new Date();
    setSelectedMood(option.id);

    const userMoodMessage = {
      id: timestamp.getTime(),
      sender: "user",
      text: option.prompt,
      timestamp
    };

    setMessages(prev => [...prev, userMoodMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const supportiveReply = {
        id: Date.now() + Math.random(),
        sender: "bot",
        text: option.response,
        timestamp: new Date(),
        source: 'mood-guide'
      };
      setMessages(prev => [...prev, supportiveReply]);
      setIsTyping(false);
    }, 700);
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const cycleTip = () => {
    setTipIndex(prev => (prev + 1) % wellnessTips.length);
  };

  if (!user) {
    return (
      <div className="chat-page">
        <div className="container">
          <div className="auth-required">
            <FontAwesomeIcon icon={faRobot} size="3x" />
            <h2>Please log in to chat with our AI therapist</h2>
            <p>Our AI companion is here to provide 24/7 mental health support</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="container">
        <section className="chat-hero-panel">
          <div className="chat-hero-copy">
            <div className="chat-hero-eyebrow">{assistantName} • AI Well-being Guide</div>
            <h1>Hi {displayName}, let’s create a calmer headspace.</h1>
            <p>
              {assistantName} blends attentive listening with real-time micro-practices so you can steady your thoughts, rehearse difficult moments, and protect your energy without judgment.
            </p>
            <div className="hero-actions">
              <button className="hero-btn primary" onClick={() => handlePromptClick('Can you help me plan my next therapy session agenda?')}>
                Start with a guided prompt
              </button>
              <button className="hero-btn ghost" onClick={scrollToBottom}>
                Resume session
              </button>
            </div>
          </div>
          <div className="chat-hero-stats">
            {heroStats.map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <div className="hero-stat-icon">
                  <FontAwesomeIcon icon={stat.icon} />
                </div>
                <div>
                  <p>{stat.label}</p>
                  <strong>{stat.value}</strong>
                  <span>{stat.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="chat-utilities-grid">
          <div className="mood-panel">
            <div className="panel-header">
              <h4>Mood check-in</h4>
              <span>Instantly tailor the conversation</span>
            </div>
            <div className="mood-chips">
              {moodOptions.map((option) => (
                <button
                  key={option.id}
                  className={`mood-chip ${selectedMood === option.id ? 'active' : ''}`}
                  onClick={() => handleMoodSelect(option)}
                >
                  <span className="mood-emoji">{option.emoji}</span>
                  <div>
                    <strong>{option.label}</strong>
                    <small>{option.helper}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="prompt-panel">
            <div className="panel-header">
              <h4>Guided prompts</h4>
              <span>Tap to auto-fill the message box</span>
            </div>
            <div className="prompt-chips">
              {quickPrompts.map((prompt) => (
                <button key={prompt} className="prompt-pill" onClick={() => handlePromptClick(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="tip-panel">
            <div className="panel-header">
              <h4>Micro-practice</h4>
              <span>Curated by {assistantName}</span>
            </div>
            <div className="tip-card">
              <div className="tip-icon">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <h5>{currentTip.title}</h5>
              <p>{currentTip.description}</p>
              <div className="tip-actions">
                <button className="hero-btn ghost" onClick={cycleTip}>Next idea</button>
                <button className="hero-btn primary" onClick={() => handlePromptClick(currentTip.prompt)}>
                  Try this now
                </button>
              </div>
            </div>
          </div>
        </section>

        <motion.div 
          className="chat-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-info">
              <div className="bot-avatar">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <div className="chat-details">
                <p className="assistant-pill">{assistantName}</p>
                <h2>Trusted mental health co-pilot</h2>
                <p className="status">
                  <span className="online-indicator"></span>
                  Live • Confidential • Trauma-informed
                </p>
                {sessionStartTime && (
                  <p className="session-time">
                    Session started at {formatTime(sessionStartTime)}
                  </p>
                )}
              </div>
            </div>

            <div className="chat-actions">
              <button 
                className="action-btn"
                onClick={downloadChatHistory}
                title="Download chat history"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
              <button 
                className="action-btn"
                onClick={clearChat}
                title="Clear chat"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button 
                className="action-btn"
                onClick={startNewSession}
                title="New session"
              >
                <FontAwesomeIcon icon={faRefresh} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                >
                  <div className="message-avatar">
                    {msg.sender === "user" ? (
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0077b6&color=fff`} 
                        alt="User"
                      />
                    ) : (
                      <div className="bot-avatar">
                        <FontAwesomeIcon icon={faRobot} />
                      </div>
                    )}
                  </div>
                  
                  <div className="message-content">
                    <div className="message-bubble">
                      <p>{msg.text}</p>
                      <span className="message-time">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="message bot-message typing"
                >
                  <div className="message-avatar">
                    <div className="bot-avatar">
                      <FontAwesomeIcon icon={faRobot} />
                    </div>
                  </div>
                  <div className="message-content">
                    <div className="message-bubble">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-input-container">
            <div className="input-wrapper" onClick={handleInputWrapperClick}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                rows={1}
                disabled={isTyping}
              />
              
              <div className="input-actions">
                <button
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={startVoiceInput}
                  disabled={isTyping || isListening}
                  title="Voice input"
                >
                  <FontAwesomeIcon icon={isListening ? faStop : faMicrophone} />
                </button>
                
                <button
                  className="send-btn"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  title="Send message"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
            
            {isListening && (
              <div className="listening-indicator">
                <FontAwesomeIcon icon={faMicrophone} />
                <span>Listening...</span>
              </div>
            )}
          </div>

          {/* Chat Footer */}
          <div className="chat-footer">
            <div className="footer-info">
              <div className="info-item">
                <FontAwesomeIcon icon={faHeart} />
                <span>Empathetic AI trained on therapeutic techniques</span>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faBrain} />
                <span>Evidence-based mental health support</span>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faSmile} />
                <span>Available 24/7 for your well-being</span>
              </div>
            </div>
            
            <div className="disclaimer">
              <small>
                <strong>Disclaimer:</strong> This AI assistant provides supportive conversations but is not a substitute for professional therapy or medical advice. 
                If you're experiencing a mental health crisis, please contact a mental health professional or emergency services.
              </small>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
