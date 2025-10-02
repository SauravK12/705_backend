import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './QuestionnairePage.css';

function QuestionnairePage() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState({});
  const [showQuitModal, setShowQuitModal] = useState(false);
  const streamRef = useRef(null);
  
  // Mock data - REPLACE THIS WITH API CALL
  // TODO: Replace with useEffect API call like:
  // useEffect(() => {
  //   fetch('/api/questions')
  //     .then(res => res.json())
  //     .then(data => setQuestions(data))
  //     .catch(err => console.error('Error fetching questions:', err));
  // }, []);
  const [questions] = useState([
    {
      id: 1,
      category: "Academic Stress",
      question: "Over the last two weeks, how often have you felt overwhelmed by your academic workload?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Very often"]
    },
    {
      id: 2,
      category: "Sleep Quality",
      question: "How would you rate the quality of your sleep over the past two weeks?",
      options: ["Very poor", "Poor", "Fair", "Good", "Excellent"]
    },
    {
      id: 3,
      category: "Social Support",
      question: "How often do you feel you have adequate social support from friends and family?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      id: 4,
      category: "Anxiety",
      question: "Over the last two weeks, have you felt nervous, anxious, or on edge?",
      options: ["Not at all", "Rarely", "Sometimes", "Most of the time", "All the time"]
    },
    {
      id: 5,
      category: "Mood",
      question: "How often have you felt down, depressed, or hopeless during the past two weeks?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day", "Every day"]
    }
  ]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Initialize camera on mount
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        });
        streamRef.current = stream;
      } catch (error) {
        console.error('Camera access error:', error);
      }
    };

    initCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Load saved answer for current question
  useEffect(() => {
    const savedAnswer = answers[currentQuestion?.id] || '';
    setSelectedAnswer(savedAnswer);
  }, [currentQuestionIndex, answers, currentQuestion]);

  const handleAnswerChange = (value) => {
    setSelectedAnswer(value);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const submitSurvey = async (finalAnswers) => {
    // Stop the camera before submitting
    stopCamera();

    // TODO: Replace with actual API call
    // try {
    //   const response = await fetch('/api/survey/submit', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ answers: finalAnswers })
    //   });
    //   if (response.ok) {
    //     navigate('/completion');
    //   }
    // } catch (error) {
    //   console.error('Error submitting survey:', error);
    // }

    // For now, just log the answers and navigate
    console.log('Survey submitted with answers:', finalAnswers);
    navigate('/completion');
  };

  const handleNext = () => {
    // Save current answer
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: selectedAnswer
    };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Last question - submit survey
      submitSurvey(updatedAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const isAnswered = selectedAnswer !== '';
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleQuitClick = (e) => {
    e.preventDefault();
    setShowQuitModal(true);
  };

  const handleQuitConfirm = () => {
    stopCamera();
    navigate('/');
  };

  const handleQuitCancel = () => {
    setShowQuitModal(false);
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="questionnaire-page">
      <div className="questionnaire-container">
        
        {/* Header with Quit Survey */}
        <div className="questionnaire-header">
          <button onClick={handleQuitClick} className="quit-link">
            ← Quit Survey
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${progressPercentage}%`}}></div>
          </div>
        </div>

        {/* Question Section */}
        <div className="question-section">
          <div className="question-number">
            {currentQuestionIndex + 1}
          </div>
          <h2 className="question-title">Question {currentQuestionIndex + 1}: {currentQuestion.category}</h2>
          <p className="question-text">
            {currentQuestion.question}
          </p>
        </div>

        {/* Answer Options */}
        <div className="answer-section">
          <div className="radio-options">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="radio-container">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => handleAnswerChange(option)}
                  className="radio-input"
                />
                <div className="custom-radio"></div>
                <span className="radio-label">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-section">
          {currentQuestionIndex > 0 && (
            <button 
              onClick={handlePrevious}
              className="previous-button"
            >
              ← Previous
            </button>
          )}
          
          <button 
            onClick={handleNext}
            disabled={!isAnswered}
            className={`next-button ${isAnswered ? 'enabled' : 'disabled'}`}
          >
            {isLastQuestion ? 'Submit Survey' : 'Next →'}
          </button>
        </div>

      </div>

      {/* Quit Survey Modal */}
      {showQuitModal && (
        <div className="modal-overlay">
          <div className="quit-modal">
            <h3 className="modal-title">Quitting the Survey: Are you sure?</h3>
            <p className="modal-message">
              Once you quit, all your input data will be deleted everywhere. If you take this survey again, you will have to redo your answers.
            </p>
            <div className="modal-buttons">
              <button 
                onClick={handleQuitCancel}
                className="cancel-button"
              >
                Cancel
              </button>
              <button 
                onClick={handleQuitConfirm}
                className="quit-confirm-button"
              >
                Quit Survey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionnairePage;