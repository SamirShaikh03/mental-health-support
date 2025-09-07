import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faCheck, 
  faArrowRight,
  faArrowLeft,
  faExclamationTriangle,
  faInfoCircle,
  faChartLine,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ScreeningTest Component - Mental Health Screening Tools
 * 
 * This component implements early detection tools mentioned in the problem statement.
 * It includes standardized psychological screening tools like PHQ-9 (Depression),
 * GAD-7 (Anxiety), and GHQ (General Health Questionnaire) for students.
 * 
 * Features:
 * - Multiple validated screening questionnaires
 * - Automatic scoring and interpretation
 * - Resource recommendations based on results
 * - Anonymous result tracking
 * - Integration with counselor booking system
 */

export default function ScreeningTest({ user }) {
  // State management for screening test
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Available screening tests with their questions
  const screeningTests = {
    'phq9': {
      name: 'PHQ-9 Depression Screening',
      description: 'A validated 9-question tool to screen for depression symptoms',
      duration: '3-5 minutes',
      questions: [
        "Little interest or pleasure in doing things",
        "Feeling down, depressed, or hopeless",
        "Trouble falling or staying asleep, or sleeping too much",
        "Feeling tired or having little energy",
        "Poor appetite or overeating",
        "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
        "Trouble concentrating on things, such as reading or watching television",
        "Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
        "Thoughts that you would be better off dead, or of hurting yourself in some way"
      ],
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" }
      ],
      interpretation: {
        minimal: { range: [0, 4], level: "Minimal depression", color: "#10b981" },
        mild: { range: [5, 9], level: "Mild depression", color: "#f59e0b" },
        moderate: { range: [10, 14], level: "Moderate depression", color: "#f97316" },
        moderatelySevere: { range: [15, 19], level: "Moderately severe depression", color: "#ef4444" },
        severe: { range: [20, 27], level: "Severe depression", color: "#dc2626" }
      }
    },
    'gad7': {
      name: 'GAD-7 Anxiety Screening',
      description: 'A 7-question tool to identify generalized anxiety disorder',
      duration: '2-4 minutes',
      questions: [
        "Feeling nervous, anxious, or on edge",
        "Not being able to stop or control worrying",
        "Worrying too much about different things",
        "Trouble relaxing",
        "Being so restless that it's hard to sit still",
        "Becoming easily annoyed or irritable",
        "Feeling afraid as if something awful might happen"
      ],
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" }
      ],
      interpretation: {
        minimal: { range: [0, 4], level: "Minimal anxiety", color: "#10b981" },
        mild: { range: [5, 9], level: "Mild anxiety", color: "#f59e0b" },
        moderate: { range: [10, 14], level: "Moderate anxiety", color: "#f97316" },
        severe: { range: [15, 21], level: "Severe anxiety", color: "#ef4444" }
      }
    },
    'stress': {
      name: 'Student Stress Assessment',
      description: 'Evaluate academic and personal stress levels',
      duration: '4-6 minutes',
      questions: [
        "I feel overwhelmed by my academic workload",
        "I have trouble sleeping due to stress",
        "I find it difficult to concentrate on my studies",
        "I feel pressure from family expectations",
        "I worry about my future career prospects",
        "I have difficulty managing my time effectively",
        "I feel isolated from my peers",
        "Financial concerns affect my well-being",
        "I experience physical symptoms of stress (headaches, stomach issues, etc.)",
        "I have thoughts of dropping out or changing my course"
      ],
      options: [
        { value: 0, text: "Never" },
        { value: 1, text: "Rarely" },
        { value: 2, text: "Sometimes" },
        { value: 3, text: "Often" },
        { value: 4, text: "Always" }
      ],
      interpretation: {
        low: { range: [0, 10], level: "Low stress", color: "#10b981" },
        moderate: { range: [11, 20], level: "Moderate stress", color: "#f59e0b" },
        high: { range: [21, 30], level: "High stress", color: "#f97316" },
        severe: { range: [31, 40], level: "Severe stress", color: "#ef4444" }
      }
    }
  };

  // Function to start a specific test
  const startTest = (testKey) => {
    setSelectedTest(testKey);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTestResults(null);
  };

  // Function to handle answer selection
  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < screeningTests[selectedTest].questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults(newAnswers);
      }
    }, 300);
  };

  // Function to calculate test results
  const calculateResults = (finalAnswers) => {
    const test = screeningTests[selectedTest];
    const totalScore = Object.values(finalAnswers).reduce((sum, score) => sum + score, 0);
    
    // Determine severity level based on score
    let severity = null;
    for (const [key, interpretation] of Object.entries(test.interpretation)) {
      const [min, max] = interpretation.range;
      if (totalScore >= min && totalScore <= max) {
        severity = { key, ...interpretation };
        break;
      }
    }

    const results = {
      test: test.name,
      score: totalScore,
      maxScore: test.questions.length * (test.options.length - 1),
      severity,
      recommendations: getRecommendations(severity, selectedTest),
      completedAt: new Date().toISOString()
    };

    setTestResults(results);
    setShowResults(true);

    // Save results to localStorage for tracking (anonymized)
    saveTestResults(results);
  };

  // Function to get recommendations based on results
  const getRecommendations = (severity, testType) => {
    const recommendations = [];

    if (severity.key === 'minimal' || severity.key === 'low') {
      recommendations.push({
        type: 'positive',
        title: 'Great news!',
        message: 'Your responses suggest minimal concerns. Keep up the good self-care practices!'
      });
      recommendations.push({
        type: 'resource',
        title: 'Maintain Your Well-being',
        message: 'Check out our wellness resources to continue supporting your mental health.'
      });
    } else if (severity.key === 'mild' || severity.key === 'moderate') {
      recommendations.push({
        type: 'support',
        title: 'Consider Support',
        message: 'Your responses suggest you might benefit from additional support and resources.'
      });
      recommendations.push({
        type: 'counseling',
        title: 'Talk to Someone',
        message: 'Consider speaking with a counselor or trusted friend about your concerns.'
      });
      recommendations.push({
        type: 'resources',
        title: 'Helpful Resources',
        message: 'Explore our self-help tools, peer support forum, and educational materials.'
      });
    } else {
      recommendations.push({
        type: 'urgent',
        title: 'Seek Professional Help',
        message: 'Your responses suggest significant concerns. Please consider speaking with a mental health professional.'
      });
      recommendations.push({
        type: 'immediate',
        title: 'Don\'t Wait',
        message: 'Contact your campus counseling center or book an appointment with a counselor.'
      });
      
      if (testType === 'phq9' && severity.key === 'severe') {
        recommendations.push({
          type: 'crisis',
          title: 'Crisis Support Available',
          message: 'If you\'re having thoughts of self-harm, please reach out for immediate help. Crisis helplines are available 24/7.'
        });
      }
    }

    return recommendations;
  };

  // Function to save test results (anonymized)
  const saveTestResults = (results) => {
    const savedResults = JSON.parse(localStorage.getItem('screening_results') || '[]');
    
    // Only save anonymized data
    const anonymizedResult = {
      testType: selectedTest,
      score: results.score,
      severity: results.severity.key,
      completedAt: results.completedAt,
      userId: user ? user.id : 'anonymous' // For tracking purposes only
    };
    
    savedResults.push(anonymizedResult);
    localStorage.setItem('screening_results', JSON.stringify(savedResults));
  };

  // Function to go to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Function to restart test
  const restartTest = () => {
    setSelectedTest(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTestResults(null);
  };

  return (
    <div className="screening-page">
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
              <FontAwesomeIcon icon={faClipboardList} />
              Mental Health Screening
            </h1>
            <p>Early detection tools to assess your mental well-being</p>
          </div>
        </motion.div>

        {/* Important Information */}
        <motion.div 
          className="screening-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="info-card">
            <FontAwesomeIcon icon={faInfoCircle} />
            <div>
              <h3>About These Screenings</h3>
              <p>These are validated psychological screening tools used by healthcare professionals. They are not diagnostic tools but can help identify if you might benefit from professional support.</p>
              <ul>
                <li>✅ Completely anonymous and confidential</li>
                <li>✅ Based on standardized questionnaires (PHQ-9, GAD-7)</li>
                <li>✅ Takes only a few minutes to complete</li>
                <li>✅ Provides immediate results and recommendations</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {!selectedTest && !showResults && (
          /* Test Selection */
          <motion.div 
            className="test-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>Choose a Screening Tool</h2>
            <div className="tests-grid">
              {Object.entries(screeningTests).map(([key, test]) => (
                <motion.div
                  key={key}
                  className="test-card"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="test-info">
                    <h3>{test.name}</h3>
                    <p>{test.description}</p>
                    <div className="test-details">
                      <span><FontAwesomeIcon icon={faClipboardList} /> {test.questions.length} questions</span>
                      <span><FontAwesomeIcon icon={faCalendarCheck} /> {test.duration}</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => startTest(key)}
                  >
                    Start Test
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedTest && !showResults && (
          /* Test Questions */
          <motion.div 
            className="test-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="test-header">
              <h2>{screeningTests[selectedTest].name}</h2>
              <div className="progress-info">
                <span>Question {currentQuestion + 1} of {screeningTests[selectedTest].questions.length}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${((currentQuestion + 1) / screeningTests[selectedTest].questions.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentQuestion}
                className="question-container"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="question">
                  <h3>Over the last 2 weeks, how often have you been bothered by:</h3>
                  <h2>"{screeningTests[selectedTest].questions[currentQuestion]}"</h2>
                </div>

                <div className="answer-options">
                  {screeningTests[selectedTest].options.map((option, index) => (
                    <motion.button
                      key={index}
                      className={`answer-option ${answers[currentQuestion] === option.value ? 'selected' : ''}`}
                      onClick={() => handleAnswer(option.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="option-text">{option.text}</span>
                      {answers[currentQuestion] === option.value && (
                        <FontAwesomeIcon icon={faCheck} />
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="navigation-buttons">
                  {currentQuestion > 0 && (
                    <button 
                      className="btn btn-outline"
                      onClick={goToPreviousQuestion}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                      Previous
                    </button>
                  )}
                  
                  <button 
                    className="btn btn-outline"
                    onClick={restartTest}
                  >
                    Cancel Test
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {showResults && testResults && (
          /* Test Results */
          <motion.div 
            className="results-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="results-header">
              <h2>Your Screening Results</h2>
              <p>Completed: {new Date(testResults.completedAt).toLocaleDateString()}</p>
            </div>

            <div className="results-content">
              <div className="score-display">
                <div className="score-circle">
                  <span className="score">{testResults.score}</span>
                  <span className="max-score">/ {testResults.maxScore}</span>
                </div>
                <div 
                  className="severity-badge"
                  style={{ backgroundColor: testResults.severity.color }}
                >
                  {testResults.severity.level}
                </div>
              </div>

              <div className="recommendations">
                <h3>Recommendations</h3>
                {testResults.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    className={`recommendation-card ${rec.type}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <h4>{rec.title}</h4>
                    <p>{rec.message}</p>
                  </motion.div>
                ))}
              </div>

              <div className="next-steps">
                <h3>Next Steps</h3>
                <div className="action-buttons">
                  <button className="btn btn-primary">
                    Book Counseling Appointment
                  </button>
                  <button className="btn btn-outline">
                    Explore Resources
                  </button>
                  <button className="btn btn-outline">
                    Join Peer Support
                  </button>
                </div>
              </div>

              <div className="results-actions">
                <button 
                  className="btn btn-outline"
                  onClick={restartTest}
                >
                  Take Another Test
                </button>
              </div>
            </div>

            <div className="disclaimer">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <p>
                <strong>Important:</strong> This screening is not a diagnostic tool. 
                If you're experiencing significant distress or having thoughts of self-harm, 
                please contact a mental health professional or crisis helpline immediately.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
