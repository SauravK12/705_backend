import {Link} from 'react-router-dom';

function QuestionnairePage() {
  return (
    <div>
        <h1>Questionnaire</h1>
        <Link to="/completion">
            <button>
                to completion page
            </button>
        </Link>
    </div>
  );
}

export default QuestionnairePage;