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
    // TODO: Replace with actual API call
    // try {
    //   const response = await fetch('/api/survey/submit', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ answers: answers })
    //   });
    //   if (response.ok) {
    //     navigate('/completion');
    //   }
    // } catch (error) {
    //   console.error('Error submitting survey:', error);
    // }

    // For now, just log the answers and navigate
    console.log('Survey submitted with answers:', answers);
    navigate('/completion');
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