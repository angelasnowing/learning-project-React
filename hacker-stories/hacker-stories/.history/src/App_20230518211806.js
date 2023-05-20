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
  )
};

export default App;
