import React from 'react';
import './App.css';

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
  return (

    <div>
    <label htmlFor="search">Search: </label>
    <input id="search" type="text" />
    </div>
    
    );
    
}

const List = () => {

}

export default App;
