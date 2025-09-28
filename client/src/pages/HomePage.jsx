import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
        <h1>Home Page</h1>
        <Link to="/summary">
            <button>
                to summary
            </button>
        </Link>
    </div>
  );
}

export default HomePage;