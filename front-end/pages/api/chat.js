const fetchFromApi = (...args) => {
  if (typeof fetch === 'function') {
    return fetch(...args);
  }
  return import('node-fetch').then(({ default: nodeFetch }) => nodeFetch(...args));
};

// Retry helper with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (error.message.includes('429')) {
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Rate limited, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// OpenAI API call function
async function callOpenAI(messages, apiKey) {
  return await retryWithBackoff(async () => {
    const response = await fetchFromApi('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages.slice(-10), // Keep last 10 messages for context
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content;
  });
}

// Gemini API call function
async function callGemini(messages, apiKey) {
  return await retryWithBackoff(async () => {
    // Convert messages to Gemini format
  const geminiMessages = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

  // Add system instruction as the first user message
  const systemMsg = messages.find(msg => msg.role === 'system');
  if (systemMsg) {
    geminiMessages.unshift({
      role: 'user',
      parts: [{ text: `Instructions: ${systemMsg.content}` }]
    });
  }

  const response = await fetchFromApi(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: geminiMessages.slice(-8), // Keep last 8 messages for context
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text;
  });
}

// OpenRouter API call function
async function callOpenRouter(messages, apiKey) {
  return await retryWithBackoff(async () => {
    const response = await fetchFromApi('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Mental Health Support App'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku', // Fast and affordable model
        messages: messages.slice(-10),
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content;
  });
}

async function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { messages } = body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const userMessage = messages[messages.length - 1]?.content || '';
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
    const API_PRIORITY = process.env.API_PRIORITY || 'both';
    
    // If no API keys are available, return error instead of fallback
    if (!OPENAI_KEY && !GEMINI_KEY && !OPENROUTER_KEY) {
      return res.status(503).json({ 
        error: 'AI service temporarily unavailable. Please try again later.',
        source: 'error'
      });
    }

    let reply = null;
    let source = 'error';

    // Try APIs based on priority
    if (API_PRIORITY === 'openrouter' && OPENROUTER_KEY) {
      try {
        console.log('Trying OpenRouter API...');
        reply = await callOpenRouter(messages, OPENROUTER_KEY);
        source = 'openrouter';
        console.log('OpenRouter API successful');
      } catch (error) {
        console.log('OpenRouter failed:', error.message);
        if (OPENAI_KEY) {
          try {
            console.log('Trying OpenAI API...');
            reply = await callOpenAI(messages, OPENAI_KEY);
            source = 'openai';
            console.log('OpenAI API successful');
          } catch (openaiError) {
            console.log('OpenAI also failed:', openaiError.message);
            if (GEMINI_KEY) {
              try {
                console.log('Trying Gemini API...');
                reply = await callGemini(messages, GEMINI_KEY);
                source = 'gemini';
                console.log('Gemini API successful');
              } catch (geminiError) {
                console.log('Gemini also failed:', geminiError.message);
              }
            }
          }
        }
      }
    } else if (API_PRIORITY === 'openai' && OPENAI_KEY) {
      try {
        console.log('Trying OpenAI API...');
        reply = await callOpenAI(messages, OPENAI_KEY);
        source = 'openai';
        console.log('OpenAI API successful');
      } catch (error) {
        console.log('OpenAI failed:', error.message);
        if (GEMINI_KEY) {
          try {
            console.log('Trying Gemini API...');
            reply = await callGemini(messages, GEMINI_KEY);
            source = 'gemini';
            console.log('Gemini API successful');
          } catch (geminiError) {
            console.log('Gemini also failed:', geminiError.message);
          }
        }
      }
    } else if (API_PRIORITY === 'gemini' && GEMINI_KEY) {
      try {
        reply = await callGemini(messages, GEMINI_KEY);
        source = 'gemini';
      } catch (error) {
        console.log('Gemini failed, trying OpenAI...', error.message);
        if (OPENAI_KEY) {
          try {
            reply = await callOpenAI(messages, OPENAI_KEY);
            source = 'openai';
          } catch (openaiError) {
            console.log('OpenAI also failed:', openaiError.message);
          }
        }
      }
    } else {
      // Try both APIs (default behavior)
      if (OPENAI_KEY) {
        try {
          reply = await callOpenAI(messages, OPENAI_KEY);
          source = 'openai';
        } catch (error) {
          console.log('OpenAI failed, trying Gemini...', error.message);
          if (GEMINI_KEY) {
            try {
              reply = await callGemini(messages, GEMINI_KEY);
              source = 'gemini';
            } catch (geminiError) {
              console.log('Gemini also failed:', geminiError.message);
            }
          }
        }
      } else if (GEMINI_KEY) {
        try {
          reply = await callGemini(messages, GEMINI_KEY);
          source = 'gemini';
        } catch (error) {
          console.log('Gemini failed:', error.message);
        }
      } else if (OPENROUTER_KEY) {
        try {
          reply = await callOpenRouter(messages, OPENROUTER_KEY);
          source = 'openrouter';
        } catch (error) {
          console.log('OpenRouter failed:', error.message);
        }
      }
    }

    // Return error if no API worked
    if (!reply) {
      return res.status(503).json({ 
        error: 'AI service temporarily unavailable. Please try again later.',
        source: 'error'
      });
    }
    
    return res.status(200).json({ reply, source });

  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ 
      error: 'Internal server error. Please try again later.',
      source: 'error'
    });
  }
}

module.exports = handler;