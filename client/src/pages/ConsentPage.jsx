import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ConsentPage.css';

function ConsentPage() {
  const navigate = useNavigate();
  const [consents, setConsents] = useState({
    termsAccepted: false,
    dataConsent: false
  });

  const handleConsentChange = (consentType) => {
    const newConsents = {
      ...consents,
      [consentType]: !consents[consentType]
    };
    setConsents(newConsents);
  };

  const handleStartSurvey = () => {
    const isFormValid = consents.termsAccepted && consents.dataConsent;
    if (isFormValid) {
      navigate('/questionnaire');
    }
  };

  return (
    <div className="consent-page">
      <div className="consent-container">
        <Link to="/" className="back-link">
          ← Back to "About this survey..."
        </Link>
        
        <h1 className="consent-title">Consent Form</h1>
        
        <div className="consent-content">
          <div className="terms-section">
            <p className="terms-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
              laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
              voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            
            <p className="terms-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
              laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
              voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>



          <div className="consent-checkboxes">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={consents.termsAccepted}
                onChange={() => handleConsentChange('termsAccepted')}
                className="consent-checkbox"
              />
              <div className="custom-checkbox"></div>
              <span className="checkbox-text">
                I have read and understood the terms and conditions specified above.
              </span>
            </label>

            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={consents.dataConsent}
                onChange={() => handleConsentChange('dataConsent')}
                className="consent-checkbox"
              />
              <div className="custom-checkbox"></div>
              <span className="checkbox-text">
                I agree to provide my consent for my data to be used in accordance with specifications.
              </span>
            </label>
          </div>

          <button 
            onClick={handleStartSurvey}
            disabled={!(consents.termsAccepted && consents.dataConsent)}
            className={`start-survey-btn ${(consents.termsAccepted && consents.dataConsent) ? 'enabled' : 'disabled'}`}
          >
            Start Survey
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConsentPage;