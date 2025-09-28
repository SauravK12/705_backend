import { Outlet } from 'react-router-dom';

function Root() {
  return (
    <div>
      <header>
        <h1>root layout stuff to go here</h1>
      </header>
      
      <div id="detail">
        <Outlet /> {/* Child routes render here */}
      </div>
    </div>
  );
}

export default Root;