import { Outlet } from 'react-router-dom';
import './Root.css';

function Root() {
  return (
    <div className="app-shell">
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Root;