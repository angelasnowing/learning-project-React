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
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') ?? '');
  const handleSearch = (event) => {
    // console.log("=== searchTerm ===", searchTerm)
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    console.log("=== useEffect searchTerm ===", searchTerm)
    localStorage.setItem('search', searchTerm)
  }, [])

  const searchedStories = stories.filter(story => {
    // console.log("=== story searchTerm ===", searchTerm)
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const useSemiPersistence = (key, initialState) => {
    const [value, setValue] = React.useState(localStorage.getItem('value') || initialState)

    React.useEffect(() => {
      localStorage.setItem(key, value)
    }, [value, key])

    return [value, setValue];
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />
      <List list={searchedStories} />
    </div>
  )
};

const Search = ({search, onSearch}) => {
  return (
    <div>
      
      <InputWithLabel id="search" type="text" value={search} onSearch={onSearch}>
        <strong>Search:</strong>
      </InputWithLabel>
      
    </div>
    );    
}

const InputWithLabel = ({id, type="text", value, onSearch, children}) => (
  <>
    <label htmlFor={id}>{children}</label>
    <input id={id} type={type} value={value} onChange={onSearch} />
  </>
)

const List = ({list}) => (
  <ul>{list.map(item => (
    <Item key={item.objectID} item={item}></Item>
  ))}</ul>
)

const Item = ({item})=>(
  <li>
    <span>
      <a href={item.url}>{item.title} </a>
    </span>
    <span> {item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
)

export default App;
