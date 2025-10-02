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
      //Satisfaction
      id: 1,
      category: "Satisfaction",
      question: "How in touch are you with your positive emotions?",
      options: ["Extremely in touch", "In touch", "Neutral", "Out of touch", "Extremely out of touch"]
    },
    {
      id: 2,
      category: "Satisfaction",
      question: "How much do you trust your skills and capabilities?",
      options: ["Full trust", "Lots of trust", "Neutral", "Little trust", "No trust"]
    },
    {
      id: 3,
      category: "Satisfaction",
      question: "How satisfied are you with the support you get from your friends?",
      options: ["Extremely satisfied", "Satisfied", "Neutral", "Dissatisfied", "Extremely dissatisfied"]
    },
    {
      id: 4,
      category: "Satisfaction",
      question: "How satisfied are you with the support you get from your family?",
      options: ["Extremely satisfied", "Satisfied", "Neutral", "Dissatisfied", "Extremely dissatisfied"]
    },
    {
      id: 5,
      category: "Satisfaction",
      question: "How often do you positively think of the future?",
      options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
    },

    //Self-Management
    {
      id: 6,
      category: "Self-Management",
      question: "How would you rate your ability to deal with personal problems?",
      options: ["Very good", "Good", "Fair", "Poor", "Very poor"]
    },
    {
      id: 7,
      category: "Self-Management",
      question: "How would you rate your ability to organize your thoughts?",
      options: ["Very good", "Good", "Fair", "Poor", "Very poor"]
    },
    {
      id: 8,
      category: "Self-Management",
      question: "How much control do you feel you have on important aspects of your life?",
      options: ["Full control", "Lots of control", "Neutral", "Little control", "No control"]
    },

    //Quality Rest
    {
      id: 9,
      category: "Quality Rest",
      question: "How in touch are you with your inner peace?",
      options: ["Extremely in touch", "In touch", "Neutral", "Out of touch", "Extremely out of touch"]
    },
    {
      id: 10,
      category: "Quality Rest",
      question: "How often do you sleep 7-9 hours a day?",
      options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
    },
    {
      id: 11,
      category: "Quality Rest",
      question: "How often are you able to focus or concentrate on something?",
      options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
    },
    {
      id: 12,
      category: "Quality Rest",
      question: "How often do you plan ahead to avoid stressful situations?",
      options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
    },
    {
      id: 13,
      category: "Quality Rest",
      question: "How often do you prioritize doing tasks, and thinking of a solution, instead of letting stress and emotions affect you?",
      options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
    },
    {
      id: 14,
      category: "Quality Rest",
      question: "How often do you take a much needed break, instead of letting stress and emotions affect you?",
      options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
    },

    //Productivity
    {
      id: 15,
      category: "Productivity",
      question: "How much do you enjoy your daily routine?",
      options: ["Extremely satisfied", "Satisfied", "Neutral", "Dissatisfied", "Extremely dissatisfied"]
    },
    {
      id: 16,
      category: "Productivity",
      question: "How much do you feel unbothered about daily challenges?",
      options: ["Extremely unbothered", "Unbothered", "Neutral", "Bothered", "Extremely bothered"]
    },
    {
      id: 17,
      category: "Productivity",
      question: "How much time do you spend on leisurely activities?",
      options: ["All the time", "Most of the time", "About half of the time", "Some of the time", "None of the time"]
    },
    {
      id: 18,
      category: "Productivity",
      question: "How much time do you spend on quality time with friends and family?",
      options: ["All the time", "Most of the time", "About half of the time", "Some of the time", "None of the time"]
    },
    {
      id: 19,
      category: "Productivity",
      question: "How often are you free from situations under time pressure?",
      options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
    },
    {
      id: 20,
      category: "Productivity",
      question: "How often do you feel unbothered about unexpected events?",
      options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
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