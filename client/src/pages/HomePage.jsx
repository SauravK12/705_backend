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
            Quote about student mental well-being.
          </h1>
          
          <p className="subtext">
            Also with subtle consideration to reference bias and educational policy making.
          </p>
          
          <Link to="/consent" className="cta-link">
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