import {Link} from 'react-router-dom';

function CompletionPage() {
  return (
    <div>
        <h1>Completion Page</h1>
        <Link to="/">
            <button>
                go home
            </button>
        </Link>
    </div>
  );
}

export default CompletionPage;