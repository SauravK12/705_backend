import { Link } from 'react-router-dom';
import './CompletionPage.css';

function CompletionPage() {
  return (
    <div className="completion-page">
      <div className="completion-container">
        <h1 className="completion-title">Thank you for answering the survey.</h1>
        
        <p className="completion-message">
          Thank you for partaking in this study. We highly appreciate the time and effort you allotted to help us meet 
          our objectives. Rest assured, the collected data will be strictly utilized according to the specifications in 
          the consent form.
        </p>
        
        <Link to="/" className="home-link">
          <button className="home-button">
            Go back to Home Page &gt;&gt;
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CompletionPage;