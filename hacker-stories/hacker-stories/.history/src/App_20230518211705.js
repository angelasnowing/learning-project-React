import './App.css';
import React from 'react';

const App = () => {
  const stories = [ ... ];
  const [searchTerm, setSearchTerm] = React.useState('');
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(function (story) {
  return story.title.includes(searchTerm);
  });

  return (
  <div>
  Fundamentals of React 53

  <h1>My Hacker Stories</h1>
  <Search onSearch={handleSearch} />
  <hr />

  <List list={searchedStories} />

  </div>
  );
  };
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
