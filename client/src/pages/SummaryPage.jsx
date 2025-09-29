import { Link } from 'react-router-dom';
import './SummaryPage.css';

function SummaryPage() {
  return (
    <div className="summary-page">
      <div className="summary-container">
        
        <Link to="/" className="back-link">
          ← Back to Home Page
        </Link>
        
        <h1 className="summary-title">About this survey...</h1>
        
        <p className="summary-text">
          This survey is designed to understand the mental health and well-being of university students. 
          Your responses will help researchers identify patterns in student mental health experiences and 
          contribute to the development of better support services on campus. The survey takes approximately 
          10-15 minutes to complete and covers topics related to anxiety, stress, academic pressure, and 
          general well-being. All responses are completely confidential and will be used solely for research purposes.
        </p>
        
        <Link to="/consent" className="proceed-link">
          <button className="proceed-button">
            Proceed to Consent Form &gt;&gt;
          </button>
        </Link>
        
      </div>
    </div>
  );
}

export default SummaryPage;