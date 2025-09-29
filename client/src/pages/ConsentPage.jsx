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
        <Link to="/summary" className="back-link">
          ← Back to "About this survey..."
        </Link>
        
        <h1 className="consent-title">Consent Form</h1>
        
        <div className="consent-content">
          <div className="terms-section">
            <p className="terms-text">
              By participating in this research study, you agree to share information about your mental health 
              and well-being experiences as a university student. Your participation is entirely voluntary, and 
              you may withdraw from the study at any time without penalty. All data collected will be kept 
              strictly confidential and will only be accessible to authorized research personnel.
            </p>
            
            <p className="terms-text">
              The information you provide will be used to better understand student mental health patterns and 
              to inform the development of support services. Your responses will be anonymized and aggregated 
              with other participants' data for analysis. No individual responses will be identifiable in any 
              publications or reports resulting from this research. If you have any questions about this study, 
              please contact the research team using the information provided in your participant materials.
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
                I have read and understood the research information and consent terms specified above.
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
                I voluntarily agree to participate in this research study and consent to the use of my anonymized data for research purposes.
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