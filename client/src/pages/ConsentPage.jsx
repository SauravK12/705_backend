import { Link } from 'react-router-dom';

function ConsentPage() {
  return (
    <div>
        <h1>Consent Page</h1>
        <Link to="/questionnaire">
            <button>
                to questions
            </button>
        </Link>
    </div>
  );
}

export default ConsentPage;