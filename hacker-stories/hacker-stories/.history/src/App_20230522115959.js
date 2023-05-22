import React, { useRef } from 'react';
import './App.css';

const App = () => {
  const initialStories = [{
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
  const [searchStories, setSearchStories] = React.useState([])
  const handleSearch = (event) => {
    // console.log("=== searchTerm ===", searchTerm)
    setSearchTerm(event.target.value);
  };

  const handleRemoveItem = (item)=>{
   let newStories = searchStories.filter(story => story.objectID != item.objectID)
   setSearchStories(newStories)
  }
  React.useEffect(() => {
    console.log("=== useEffect searchTerm ===", searchTerm)
    localStorage.setItem('search', searchTerm)
  }, [searchTerm])

  const getAsyncStories = ()=>{
    new Promise(resolve => {
        setTimeout(() => {
          resolve({data: {stories: initialStories}})
        }, 2000);
    })
  }

  React.useEffect(()=>{
    console.log(getAsyncStories, "=== getAsyncStories ===")
    // getAsyncStories.then(result => {
    //   setSearchStories(result.data.stories)
    // })
  }, [])
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />
      <List list={searchStories} onRemoveItem={handleRemoveItem} />
    </div>
  )
};

const Search = ({search, onSearch}) => {
  return (
    <div>
      
      <InputWithLabel id="search" type="text" value={search} onSearch={onSearch} isFocused>
        <strong>Search:</strong>
      </InputWithLabel>
      
    </div>
    );    
}

const InputWithLabel = ({id, type="text", value, onSearch, children, isFocused}) => {
  const inputRef = React.useRef()
  React.useEffect(()=>{
    if (isFocused && inputRef.current){
      inputRef.current.focus()
    }
  }, [isFocused])
  return (
    <>
    <label htmlFor={id}>{children}</label>
    <input id={id} type={type} ref={inputRef} value={value} onChange={onSearch} />
  </>
  )
}


const List = ({list, onRemoveItem}) => (
  <ul>{list.map(item => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}></Item>
  ))}</ul>
)

const Item = ({item, onRemoveItem})=>(
  <li>
    <span>
      <a href={item.url}>{item.title} </a>
    </span>
    <span> {item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <button type="button" onClick={()=>onRemoveItem(item)}>Dismiss</button>
  </li>
)

export default App;
