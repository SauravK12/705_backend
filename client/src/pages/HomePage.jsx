import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>
      
      <div className="content-container">
        <main className="main-content">
          <h1 className="headline">
            Understanding Student Mental Health and Well-being
          </h1>
          
          <p className="subtext">
            Your participation in this research helps us better understand the mental health challenges 
            faced by students and contributes to developing better support systems.
          </p>
          
          <Link to="/summary" className="cta-link">
            <button className="cta-button" aria-label="Start the survey">
              Take the survey &gt;&gt;
            </button>
          </Link>
        </main>
      </div>
    </div>
  );
}

export default HomePage;