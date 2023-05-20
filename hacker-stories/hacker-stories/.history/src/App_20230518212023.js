import './App.css';
import React from 'react';

const App = () => {
  const stories = [{
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },{
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    }];
  const [searchTerm, setSearchTerm] = React.useState('');
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(function (story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
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

const Search = () => {

}

const List = () => {

}

export default App;
