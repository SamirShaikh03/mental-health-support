// Test script to verify chat API functionality with both OpenAI and Gemini
// Run this with: node test-chat-api.js

const testMessages = [
  {
    role: 'system',
    content: 'You are a compassionate mental health assistant.'
  },
  {
    role: 'user', 
    content: 'I feel anxious today'
  }
];

async function testChatAPI() {
  try {
    console.log('Testing chat API with dual OpenAI/Gemini support...');
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: testMessages })
    });

    const result = await response.json();
    console.log('✅ API Response:', result.reply);
    console.log('📡 Response Source:', result.source);
    console.log('🔗 Status:', response.status);
    
    if (result.source === 'openai') {
      console.log('🤖 Using OpenAI API');
    } else if (result.source === 'gemini') {
      console.log('🧠 Using Gemini API');
    } else if (result.source === 'fallback') {
      console.log('🛡️ Using fallback responses (no API keys configured)');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function testMultipleMessages() {
  console.log('\n--- Testing conversation flow ---');
  
  const conversation = [
    {
      role: 'system',
      content: 'You are a compassionate mental health assistant.'
    },
    {
      role: 'user', 
      content: 'Hello, I need someone to talk to'
    },
    {
      role: 'assistant',
      content: 'Hello! I\'m here to listen and support you. How are you feeling today?'
    },
    {
      role: 'user',
      content: 'I\'ve been feeling very stressed lately with work'
    }
  ];

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: conversation })
    });

    const result = await response.json();
    console.log('💬 Conversation Response:', result.reply);
    console.log('📡 Source:', result.source);
    
  } catch (error) {
    console.error('❌ Conversation test failed:', error.message);
  }
}

// Uncomment the lines below to run tests when the dev server is running
// testChatAPI();
// setTimeout(testMultipleMessages, 2000);

console.log('🚀 Chat API test script ready!');
console.log('📋 Available tests:');
console.log('  - testChatAPI(): Test basic API functionality');
console.log('  - testMultipleMessages(): Test conversation flow');
console.log('');
console.log('💡 To run tests:');
console.log('  1. Start your dev server: npm start');
console.log('  2. Uncomment the test calls at the bottom of this file');
console.log('  3. Run: node test-chat-api.js');
console.log('');
console.log('🔑 API Key Status:');
console.log('  - Add OPENAI_API_KEY to .env.local for OpenAI');
console.log('  - Add GEMINI_API_KEY to .env.local for Gemini'); 
console.log('  - Without keys, fallback responses will be used');