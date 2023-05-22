import React from 'react';
import './App.css';

const App = () => {
  // const initialStories = [{
  //     title: 'React',
  //     url: 'https://reactjs.org/',
  //     author: 'Jordan Walke',
  //     num_comments: 3,
  //     points: 4,
  //     objectID: 0,
  //   },{
  //     title: 'Redux',
  //     url: 'https://redux.js.org/',
  //     author: 'Dan Abramov, Andrew Clark',
  //     num_comments: 2,
  //     points: 5,
  //     objectID: 1,
  // }];
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') ?? '');
  const storiesReducer = (state, action) => {
    switch(action.type){
      case "STORIES_FETCH_INIT": return {...state, isLoading: true, isError: false}
      case "STORIES_FETCH_SUCCESS": return {...state, data: action.payload, isLoading: false, isError: false}
      case "STORIES_FETCH_FAILURE": return {...state, isLoading: false, isError: true}
      case "REMOVE_STORY": return {...state, data: state.data.filter( story => story.objectID !== action.payload.objectID)}
      default: throw new Error()
    }
  }
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {data: [], isError: false, isLoading: false})
  const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query="


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveItem = (item)=>{
    dispatchStories({type: "REMOVE_STORY", payload: item})
  }
  React.useEffect(() => {
    localStorage.setItem('search', searchTerm)
  }, [searchTerm])

  const handleFetchStories = React.useCallback(()=>{
    if (searchTerm === '') return 
    dispatchStories({type: "STORIES_FETCH_INIT"})
    
    fetch(`${API_ENDPOINT}${searchTerm}`)
    .then(response => response.json())
    .then(result => {
      dispatchStories({type: "STORIES_FETCH_SUCCESS", payload: result.hits})
    }).catch(()=>{
      dispatchStories({type: "STORIES_FETCH_FAILURE"})
    })
  }, [searchTerm])

  React.useEffect(()=>{
    handleFetchStories()
  }, [handleFetchStories])

  // React.useEffect(()=>{

  //   if (searchTerm === '') return 
  //   dispatchStories({type: "STORIES_FETCH_INIT"})
    
  //   fetch(`${API_ENDPOINT}${searchTerm}`)
  //   .then(response => response.json())
  //   .then(result => {
  //     dispatchStories({type: "STORIES_FETCH_SUCCESS", payload: result.hits})
  //   }).catch(()=>{
  //     dispatchStories({type: "STORIES_FETCH_FAILURE"})
  //   })

  // }, [searchTerm])

  const handleSearchSubmit = ()=>{

  }

  const handleSearchInput = ()=>{

  }

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading? <p>loading ...</p> :(<List list={stories.data} onRemoveItem={handleRemoveItem} />)}

      <button
        type="button"
        disabled={!searchTerm}
        onClick={handleSearchSubmit}>
        Submit
      </button>
    </div>
  )
};

const Search = ({search, handleSearchInput}) => {
  return (
    <div>
      
      <InputWithLabel id="search" type="text" value={search} onInputChange={handleSearchInput} isFocused>
        <strong>Search:</strong>
      </InputWithLabel>
      
    </div>
    );    
}

const InputWithLabel = ({id, type="text", value, children, isFocused, onInputChange}) => {
  const inputRef = React.useRef()
  React.useEffect(()=>{
    if (isFocused && inputRef.current){
      inputRef.current.focus()
    }
  }, [isFocused])
  return (
    <>
    <label htmlFor={id}>{children}</label>
    <input id={id} type={type} ref={inputRef} value={value} onInputChange={onInputChange} />
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
