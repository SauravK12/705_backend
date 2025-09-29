import { Link } from 'react-router-dom';
import './CompletionPage.css';

function CompletionPage() {
  return (
    <div className="completion-page">
      <div className="completion-container">
        <h1 className="completion-title">Thank you for participating in our research.</h1>
        
        <p className="completion-message">
          Your responses have been successfully recorded and will contribute to important research on student mental 
          health and well-being. We deeply appreciate the time you've taken to share your experiences with us. 
          Your participation helps us better understand the challenges students face and will inform the development 
          of improved support services. All data will be kept confidential and used solely for research purposes 
          as outlined in the consent form.
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