import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>IBM Demo React Application</h1>
        <p>
          Welcome to the IBM Demo React.js Package!
        </p>
        <p>
          This is a simple React application created as part of the IBM demo project.
        </p>
        <div className="App-features">
          <h2>Features:</h2>
          <ul>
            <li>React 18 with hooks</li>
            <li>Modern ES6+ JavaScript</li>
            <li>Webpack configuration</li>
            <li>Hot reload development server</li>
            <li>Production build optimization</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;