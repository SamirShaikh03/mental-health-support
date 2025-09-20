import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faRobot, 
  faUser,
  faMicrophone,
  faStop,
  faVolumeUp,
  faDownload,
  faTrash,
  faHeart,
  faBrain,
  faSmile,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const welcomeMessages = [
    "Hi there! I'm your AI mental health companion. How are you feeling today?",
    "Welcome back! I'm here to listen and support you. What's on your mind?",
    "Hello! I'm glad you're here. How can I help you with your mental wellness today?"
  ];

  const suggestionPrompts = [
    "I'm feeling anxious",
    "I need help with stress",
    "I'm having trouble sleeping",
  ];

  const therapyTechniques = {
    anxiety: [
      "Let's try a breathing exercise. Breathe in for 4 counts, hold for 4, and out for 4.",
      "Can you tell me about what specifically is making you feel anxious right now?",
      "Remember, anxiety is temporary. What has helped you cope with anxiety in the past?"
    ],
    stress: [
      "Stress can be overwhelming. What's the biggest source of stress in your life right now?",
      "Let's break down your stressors into manageable pieces. What feels most urgent?",
      "Have you tried any relaxation techniques recently? I can guide you through some."
    ],
    depression: [
      "I hear that you're struggling. Can you tell me about one small thing that brought you joy recently?",
      "Depression can make everything feel heavy. You're brave for reaching out.",
      "What does a good day look like for you? Even small positive moments matter."
    ],
    sleep: [
      "Sleep troubles can affect everything. What's your bedtime routine like?",
      "Let's explore what might be keeping you awake. Is it thoughts, physical discomfort, or environment?",
      "Good sleep hygiene can make a big difference. Are you interested in some tips?"
    ]
  };

  useEffect(() => {
    if (user && messages.length === 0) {
      startNewSession();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewSession = () => {
    const sessionId = Date.now();
    const startTime = new Date();
    setChatSession(sessionId);
    setSessionStartTime(startTime);
    
    const welcomeMsg = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    const botMessage = {
      id: Date.now(),
      sender: "bot",
      text: welcomeMsg,
      timestamp: startTime,
      type: "welcome"
    };
    
    setMessages([botMessage]);
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
  };

  const generateResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Simple keyword-based responses (in a real app, this would be an AI API)
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried')) {
      const responses = therapyTechniques.anxiety;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('stress') || message.includes('overwhelmed') || message.includes('pressure')) {
      const responses = therapyTechniques.stress;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('sad') || message.includes('depressed') || message.includes('down') || message.includes('hopeless')) {
      const responses = therapyTechniques.depression;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('sleep') || message.includes('insomnia') || message.includes('tired') || message.includes('rest')) {
      const responses = therapyTechniques.sleep;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to support you. How are you feeling right now?";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! I'm glad I could help. Is there anything else you'd like to talk about?";
    }
    
    if (message.includes('goodbye') || message.includes('bye')) {
      return "Take care! Remember, I'm always here when you need someone to talk to. You're doing great by taking care of your mental health.";
    }
    
    // Default empathetic responses
    const defaultResponses = [
      "I hear you. Can you tell me more about how you're feeling?",
      "That sounds challenging. You're not alone in feeling this way.",
      "Thank you for sharing that with me. How long have you been feeling this way?",
      "I appreciate you opening up. What do you think would help you feel better right now?",
      "Your feelings are valid. What support do you have in your life?",
      "That takes courage to share. What would you like to focus on today?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;
    
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = generateResponse(messageText);
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
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
      setMessages([]);
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
    link.download = `mindcare-chat-${new Date().toISOString().split('T')[0]}.json`;
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
                <h2>AI Therapy Assistant</h2>
                <p className="status">
                  <span className="online-indicator"></span>
                  Online • Confidential • Professional
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

          {/* Suggestion Prompts */}
          {messages.length <= 1 && (
            <motion.div 
              className="suggestion-prompts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p>Quick prompts to get started:</p>
              <div className="prompts-grid">
                {suggestionPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="prompt-btn"
                    onClick={() => sendMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat Input */}
          <div className="chat-input-container">
            <div className="input-wrapper">
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
