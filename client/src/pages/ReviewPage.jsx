import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './ReviewPage.css';

function ReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the answers and questions from the navigation state
  const answers = useMemo(() => location.state?.answers || {}, [location.state]);
  const questions = useMemo(() => location.state?.questions || [], [location.state]);
  
  // If no data is provided, redirect back to questionnaire
  useEffect(() => {
    if (!location.state || Object.keys(answers).length === 0) {
      navigate('/questionnaire');
    }
  }, [location.state, answers, navigate]);

  const handleSubmit = async () => {
    // Try to get sessionId from any answer object (if present)
    let sessionId = null;
    if (answers.sessionId) {
      sessionId = answers.sessionId;
    } else if (location.state?.sessionId) {
      sessionId = location.state.sessionId;
    }
    try {
      const response = await fetch('http://localhost:5000/api/save-survey-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          answers: answers
        })
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Survey answers saved:', result);
        navigate('/completion');
      } else {
        const error = await response.json();
        alert('Error submitting survey: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey: ' + error.message);
    }
  };

  const handleEditClick = () => {
    // Navigate back to questionnaire with current answers
    navigate('/questionnaire', { state: { answers, questions } });
  };

  // Get answered questions
  const answeredQuestions = questions.filter(q => answers[q.id]);

  if (answeredQuestions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="review-page">
      <div className="review-container">

        {/* Header */}
        <div className="review-header">
          <button onClick={handleEditClick} className="back-link">
            ← Back to Survey
          </button>
        </div>

        {/* Review Card */}
        <div className="review-card">
          <div className="card-header">
            <div className="table-header">
              <div className="header-question">Question</div>
              <div className="header-answer">Your Answer</div>
            </div>
          </div>

          <div className="answers-table">
            <div className="table-body">
              {answeredQuestions.map((question, index) => (
                <div key={question.id} className="table-row">
                  <div className="question-cell">
                    <div className="question-number-badge">{index + 1}</div>
                    <div className="question-content">
                      <div className="question-category">{question.category}</div>
                      <div className="question-preview">
                        {question.question.length > 80
                          ? `${question.question.substring(0, 80)}...`
                          : question.question}
                      </div>
                    </div>
                  </div>
                  <div className="answer-cell">
                    <span className="answer-text">{answers[question.id]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-actions">
            <button 
              onClick={handleSubmit}
              className="submit-button"
            >
              Submit Survey
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ReviewPage;