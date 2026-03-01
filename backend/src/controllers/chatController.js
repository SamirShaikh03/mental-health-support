/**
 * Chat Controller
 * Handles AI chat sessions using OpenAI or Google Gemini
 */

const ChatSession = require('../models/ChatSession');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Crisis keywords for flagging
const crisisKeywords = [
  'suicide', 'kill myself', 'end my life', 'want to die',
  'self harm', 'hurt myself', 'cutting', 'overdose',
  'kill myself', 'not worth living', 'better off dead',
];

/**
 * Check message for crisis indicators
 */
const checkForCrisis = (message) => {
  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Generate AI response using OpenAI or Gemini
 */
const generateAIResponse = async (messages, userContext = {}) => {
  const useGemini = process.env.AI_PROVIDER === 'gemini';
  
  const systemPrompt = `You are WellSetu, a compassionate and supportive mental health assistant for students. 
Your role is to:
- Listen empathetically and validate feelings
- Provide general coping strategies and self-help techniques
- Encourage professional help when appropriate
- Never diagnose or provide medical advice
- Respond in a warm, supportive tone
- Keep responses concise but helpful

Important guidelines:
- If someone expresses thoughts of self-harm or suicide, express concern and provide crisis resources
- Remind users that you're an AI and encourage them to speak with a counselor for serious concerns
- Be culturally sensitive and inclusive
- Focus on evidence-based techniques like mindfulness, CBT principles, and stress management`;

  try {
    if (useGemini) {
      // Google Gemini API
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Format messages for Gemini
      const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'I understand. I\'m WellSetu, here to provide compassionate support.' }] },
          ...history,
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      return response.text();

    } else {
      // OpenAI API
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    }
  } catch (error) {
    logger.error('AI API error:', error);
    throw new AppError('Failed to generate response. Please try again.', 500);
  }
};

/**
 * Crisis response message
 */
const getCrisisResponse = () => ({
  content: `I'm concerned about what you've shared. Your safety is the most important thing right now.

**If you're in immediate danger, please:**
- Call emergency services: 112 (India) or your local emergency number
- iCALL: 9152987821 (Mon-Sat, 8am-10pm)
- Vandrevala Foundation: 1860-2662-345 (24/7)
- NIMHANS: 080-46110007 (24/7)

You don't have to face this alone. A counselor at WellSetu is available to help you. Would you like me to help you schedule an appointment?

Please reach out to someone you trust or one of these helplines. They're trained to help and want to support you.`,
  isCrisisResponse: true,
});

/**
 * Start or continue chat session
 * POST /api/v1/chat
 */
exports.chat = async (req, res, next) => {
  try {
    const { sessionId, message, context } = req.body;

    // Check for crisis keywords
    const isCrisis = checkForCrisis(message);

    let session;

    if (sessionId) {
      // Continue existing session
      session = await ChatSession.findOne({
        _id: sessionId,
        user: req.user._id,
        isActive: true,
      });

      if (!session) {
        return next(new AppError('Chat session not found or expired.', 404));
      }
    } else {
      // Create new session
      session = await ChatSession.create({
        user: req.user._id,
        context: {
          userMood: context?.mood,
          topic: context?.topic,
          userAgent: req.headers['user-agent'],
        },
      });
    }

    // Add user message
    session.messages.push({
      role: 'user',
      content: message,
    });

    let aiResponse;

    if (isCrisis) {
      // Flag session and provide crisis response
      session.concernFlags.push({
        type: 'crisis_keywords',
        severity: 'high',
        message: message,
        flaggedAt: new Date(),
      });
      
      aiResponse = getCrisisResponse();
      logger.warn(`Crisis keywords detected in session ${session._id} for user ${req.user._id}`);
    } else {
      // Generate AI response
      const aiContent = await generateAIResponse(
        session.messages.map(m => ({ role: m.role, content: m.content })),
        session.context
      );
      
      aiResponse = { content: aiContent };
    }

    // Add assistant message
    session.messages.push({
      role: 'assistant',
      content: aiResponse.content,
      metadata: {
        isCrisisResponse: aiResponse.isCrisisResponse || false,
        model: process.env.AI_PROVIDER === 'gemini' ? 'gemini-pro' : (process.env.OPENAI_MODEL || 'gpt-3.5-turbo'),
      },
    });

    session.lastActivityAt = new Date();
    await session.save();

    res.status(200).json({
      status: 'success',
      data: {
        sessionId: session._id,
        message: {
          role: 'assistant',
          content: aiResponse.content,
          isCrisisResponse: aiResponse.isCrisisResponse || false,
          timestamp: new Date(),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get chat history
 * GET /api/v1/chat/history
 */
exports.getChatHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await ChatSession.countDocuments({ user: req.user._id });
    const sessions = await ChatSession.find({ user: req.user._id })
      .sort({ lastActivityAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('title context.topic messagesCount isActive createdAt lastActivityAt')
      .lean();

    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: {
        sessions,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single chat session
 * GET /api/v1/chat/:sessionId
 */
exports.getChatSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).select('-concernFlags -metadata');

    if (!session) {
      return next(new AppError('Chat session not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        session,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * End chat session
 * POST /api/v1/chat/:sessionId/end
 */
exports.endChatSession = async (req, res, next) => {
  try {
    const { feedback } = req.body;

    const session = await ChatSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
      isActive: true,
    });

    if (!session) {
      return next(new AppError('Active chat session not found.', 404));
    }

    session.isActive = false;
    session.endedAt = new Date();
    
    if (feedback) {
      session.feedback = feedback;
    }

    await session.save();

    res.status(200).json({
      status: 'success',
      message: 'Chat session ended.',
      data: {
        sessionId: session._id,
        duration: session.duration,
        messagesCount: session.messagesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit feedback for session
 * POST /api/v1/chat/:sessionId/feedback
 */
exports.submitFeedback = async (req, res, next) => {
  try {
    const { helpful, rating, comment } = req.body;

    const session = await ChatSession.findOneAndUpdate(
      {
        _id: req.params.sessionId,
        user: req.user._id,
      },
      {
        'feedback.helpful': helpful,
        'feedback.rating': rating,
        'feedback.comment': comment,
      },
      { new: true }
    );

    if (!session) {
      return next(new AppError('Chat session not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Feedback submitted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete chat session
 * DELETE /api/v1/chat/:sessionId
 */
exports.deleteChatSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findOneAndDelete({
      _id: req.params.sessionId,
      user: req.user._id,
    });

    if (!session) {
      return next(new AppError('Chat session not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Chat session deleted.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get suggested prompts
 * GET /api/v1/chat/prompts
 */
exports.getSuggestedPrompts = async (req, res, next) => {
  const prompts = [
    {
      category: 'stress',
      prompts: [
        'I\'m feeling overwhelmed with assignments',
        'How can I manage exam stress?',
        'I can\'t stop worrying about my grades',
      ],
    },
    {
      category: 'anxiety',
      prompts: [
        'I feel anxious before presentations',
        'How do I deal with social anxiety?',
        'I\'m having trouble sleeping due to anxiety',
      ],
    },
    {
      category: 'mood',
      prompts: [
        'I\'ve been feeling down lately',
        'I lack motivation to do anything',
        'How can I improve my mood?',
      ],
    },
    {
      category: 'self_care',
      prompts: [
        'What are some quick relaxation techniques?',
        'How can I practice mindfulness?',
        'Tips for better sleep habits',
      ],
    },
    {
      category: 'relationships',
      prompts: [
        'I\'m having trouble with my roommate',
        'How do I deal with peer pressure?',
        'I feel lonely at college',
      ],
    },
  ];

  res.status(200).json({
    status: 'success',
    data: {
      prompts,
    },
  });
};

/**
 * Get flagged sessions (Counselor/Admin)
 * GET /api/v1/chat/flagged
 */
exports.getFlaggedSessions = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({
      'concernFlags.0': { $exists: true },
    })
      .sort({ 'concernFlags.flaggedAt': -1 })
      .populate('user', 'name email')
      .select('user concernFlags messagesCount createdAt lastActivityAt');

    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: {
        sessions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get chat analytics (Admin)
 * GET /api/v1/chat/analytics
 */
exports.getChatAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const analytics = await ChatSession.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalMessages: { $sum: { $size: '$messages' } },
          avgMessagesPerSession: { $avg: { $size: '$messages' } },
          crisisFlags: {
            $sum: {
              $size: {
                $filter: {
                  input: '$concernFlags',
                  cond: { $eq: ['$$this.severity', 'high'] },
                },
              },
            },
          },
        },
      },
    ]);

    // Sessions per day
    const sessionsPerDay = await ChatSession.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Topic distribution
    const topicDistribution = await ChatSession.aggregate([
      { $match: { createdAt: { $gte: startDate }, 'context.topic': { $exists: true } } },
      { $group: { _id: '$context.topic', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        summary: analytics[0] || {},
        sessionsPerDay,
        topicDistribution,
        period: `${days} days`,
      },
    });
  } catch (error) {
    next(error);
  }
};
