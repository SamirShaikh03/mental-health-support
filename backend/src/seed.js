/**
 * Database Seeder
 * Initializes database with sample data for development/testing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Import models
const User = require('./models/User');
const Resource = require('./models/Resource');
const ForumPost = require('./models/ForumPost');

const logger = require('./utils/logger');

// Sample data
const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@wellsetu.com',
    password: 'Admin@123',
    role: 'admin',
    isVerified: true,
  },
  {
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'counselor@wellsetu.com',
    password: 'Counselor@123',
    role: 'counselor',
    isVerified: true,
    specialization: ['anxiety', 'depression', 'stress'],
    bio: 'Licensed counselor with 10+ years of experience helping students navigate mental health challenges.',
    counselorProfile: {
      qualifications: ['M.A. Clinical Psychology', 'Licensed Professional Counselor'],
      yearsExperience: 10,
      languages: ['English', 'Hindi'],
      availability: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '14:00' },
      },
    },
  },
  {
    firstName: 'Test',
    lastName: 'Student',
    email: 'student@wellsetu.com',
    password: 'Student@123',
    role: 'student',
    isVerified: true,
    age: 20,
  },
];

const resources = [
  {
    title: 'Getting Started with Mindfulness',
    slug: 'getting-started-mindfulness',
    description: 'Learn the basics of mindfulness meditation and how it can help reduce stress and anxiety.',
    content: `
# Getting Started with Mindfulness

Mindfulness is the practice of being fully present and engaged in the current moment, without judgment.

## What is Mindfulness?

Mindfulness involves paying attention to your thoughts, feelings, and surroundings without trying to change them. It's about acceptance and awareness.

## Benefits of Mindfulness

- Reduced stress and anxiety
- Improved focus and concentration
- Better emotional regulation
- Enhanced self-awareness
- Improved sleep quality

## A Simple Mindfulness Exercise

1. Find a comfortable position
2. Close your eyes or soften your gaze
3. Focus on your breath
4. Notice when your mind wanders
5. Gently return your attention to your breath
6. Start with 5 minutes and gradually increase

## Tips for Beginners

- Start small - even 2-3 minutes counts
- Be patient with yourself
- Practice regularly, ideally daily
- Use guided meditations if helpful
- Don't judge your experience
    `,
    type: 'article',
    category: 'mindfulness',
    tags: ['beginner', 'meditation', 'stress-relief'],
    duration: 10,
    difficulty: 'beginner',
    isPublished: true,
    isFeatured: true,
    language: 'en',
  },
  {
    title: 'Coping with Exam Stress',
    slug: 'coping-exam-stress',
    description: 'Practical strategies to manage stress during exam periods and perform at your best.',
    content: `
# Coping with Exam Stress

Exams can be challenging, but with the right strategies, you can manage stress effectively.

## Understanding Exam Stress

Some stress before exams is normal and can even enhance performance. However, excessive stress can be counterproductive.

## Practical Strategies

### 1. Plan Your Study Time
- Create a realistic study schedule
- Break material into manageable chunks
- Include breaks and rest time

### 2. Take Care of Your Body
- Get adequate sleep (7-9 hours)
- Eat nutritious meals
- Exercise regularly
- Stay hydrated

### 3. Use Relaxation Techniques
- Deep breathing exercises
- Progressive muscle relaxation
- Short meditation breaks

### 4. Stay Positive
- Challenge negative thoughts
- Focus on what you can control
- Celebrate small achievements

## On Exam Day

- Wake up early
- Have a good breakfast
- Arrive early
- Use deep breathing if anxious
- Read questions carefully
- Manage your time
    `,
    type: 'article',
    category: 'academic',
    tags: ['exams', 'stress', 'study-tips'],
    duration: 8,
    difficulty: 'beginner',
    isPublished: true,
    isFeatured: true,
    language: 'en',
  },
  {
    title: '5-Minute Breathing Exercise',
    slug: '5-minute-breathing-exercise',
    description: 'A quick breathing exercise to calm your mind and reduce anxiety in just 5 minutes.',
    content: `
# 5-Minute Breathing Exercise

This simple breathing technique can help you feel calmer and more centered.

## The 4-7-8 Breath Technique

This technique, developed by Dr. Andrew Weil, is known for its calming effects.

### How to Practice:

1. **Exhale completely** through your mouth
2. **Inhale** through your nose for 4 counts
3. **Hold** your breath for 7 counts
4. **Exhale** through your mouth for 8 counts
5. **Repeat** 4 times

## Tips

- Practice twice daily for best results
- Use when feeling anxious or before sleep
- Don't force it - let it feel natural
- Find a comfortable sitting position

## Benefits

- Reduces anxiety
- Helps with sleep
- Lowers blood pressure
- Increases focus
    `,
    type: 'exercise',
    category: 'anxiety',
    tags: ['breathing', 'quick', 'relaxation'],
    duration: 5,
    difficulty: 'beginner',
    isPublished: true,
    isFeatured: false,
    language: 'en',
  },
  {
    title: 'Understanding Anxiety',
    slug: 'understanding-anxiety',
    description: 'Learn about anxiety, its symptoms, and effective ways to manage it.',
    content: `
# Understanding Anxiety

Anxiety is one of the most common mental health concerns among students.

## What is Anxiety?

Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come.

## Common Symptoms

### Physical Symptoms
- Racing heart
- Sweating
- Trembling
- Shortness of breath
- Fatigue

### Mental Symptoms
- Excessive worry
- Difficulty concentrating
- Restlessness
- Fear of the worst

## Types of Anxiety

- Generalized Anxiety Disorder (GAD)
- Social Anxiety
- Panic Disorder
- Specific Phobias

## When to Seek Help

If anxiety is affecting your daily life, relationships, or academic performance, it's time to seek professional support.

## Self-Help Strategies

1. Practice relaxation techniques
2. Challenge anxious thoughts
3. Gradually face fears
4. Maintain a healthy lifestyle
5. Connect with others
    `,
    type: 'article',
    category: 'anxiety',
    tags: ['anxiety', 'education', 'mental-health'],
    duration: 12,
    difficulty: 'beginner',
    isPublished: true,
    isFeatured: true,
    language: 'en',
  },
];

const forumPosts = [
  {
    title: 'Welcome to WellSetu Community!',
    content: `Welcome to our peer support community! This is a safe space where you can share your experiences, ask questions, and support one another.

**Community Guidelines:**
- Be respectful and kind
- Maintain confidentiality
- Support each other
- Avoid giving medical advice
- Report any concerning content

Remember, you're not alone. We're all here to help each other through our mental health journey. 💙`,
    category: 'general',
    isAnonymous: false,
    isPinned: true,
    status: 'active',
    tags: ['welcome', 'guidelines'],
  },
  {
    title: 'Tips for Managing Exam Anxiety - What Works for You?',
    content: `Hey everyone! Exam season is approaching and I know many of us struggle with exam anxiety.

I wanted to start a thread where we can share our tips and strategies that have worked for us.

Here are some things that help me:
- Starting study sessions with 5 minutes of deep breathing
- Breaking study time into 25-minute chunks (Pomodoro technique)
- Going for a short walk between study sessions

What works for you? Let's help each other out! 📚`,
    category: 'academic_stress',
    isAnonymous: false,
    status: 'active',
    tags: ['exams', 'anxiety', 'tips'],
  },
  {
    title: 'Sharing my experience with counseling',
    content: `I want to share my positive experience with seeking help from a counselor on campus.

I was really nervous at first - I didn't know what to expect and was worried about being judged. But the counselor was so understanding and supportive.

After just a few sessions, I learned some really helpful coping strategies for my anxiety. I'm not "cured" but I feel like I have better tools to handle things now.

If you're on the fence about reaching out, I'd really encourage you to try it. The counselors here genuinely want to help. 💪`,
    category: 'success_stories',
    isAnonymous: true,
    status: 'active',
    tags: ['counseling', 'positive', 'support'],
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding');

    // Clear existing data (be careful with this in production!)
    if (process.env.NODE_ENV !== 'production') {
      await User.deleteMany({});
      await Resource.deleteMany({});
      await ForumPost.deleteMany({});
      logger.info('Cleared existing data');
    }

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      logger.info(`Created user: ${user.email}`);
    }

    // Find admin and counselor for reference
    const adminUser = createdUsers.find(u => u.role === 'admin');
    const counselorUser = createdUsers.find(u => u.role === 'counselor');

    // Create resources
    for (const resourceData of resources) {
      const resource = await Resource.create({
        ...resourceData,
        createdBy: adminUser._id,
        publishedAt: new Date(),
      });
      logger.info(`Created resource: ${resource.title}`);
    }

    // Create forum posts
    for (const postData of forumPosts) {
      const post = await ForumPost.create({
        ...postData,
        author: counselorUser._id,
      });
      logger.info(`Created forum post: ${post.title}`);
    }

    logger.info('✅ Database seeded successfully!');
    logger.info('\n📋 Test Accounts:');
    logger.info('Admin: admin@wellsetu.com / Admin@123');
    logger.info('Counselor: counselor@wellsetu.com / Counselor@123');
    logger.info('Student: student@wellsetu.com / Student@123');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
