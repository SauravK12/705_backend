import {Link} from 'react-router-dom';

function SummaryPage() {
  return (
    <div>
        <h1>Summary Page</h1>
        <Link to="/consent">
            <button>
                to consent
            </button>
        </Link>
    </div>
  );
}

export default SummaryPage;