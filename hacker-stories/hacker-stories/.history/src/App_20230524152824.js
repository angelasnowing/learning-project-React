import React, { useState } from 'react';
import axios from 'axios'
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
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`)


  const handleInputChange = (event) => {
    // console.log("")
    setSearchTerm(event.target.value);
  };

  const handleRemoveItem = (item)=>{
    dispatchStories({type: "REMOVE_STORY", payload: item})
  }

  const handleSubmit = ((event)=>{
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  })
  React.useEffect(() => {
    localStorage.setItem('search', searchTerm)
  }, [searchTerm])

  const handleFetchStories = React.useCallback(async ()=>{

    console.log(url, '===url===')

    dispatchStories({type: "STORIES_FETCH_INIT"})

    try{
      const result = await axios.get(url)
      dispatchStories({type: "STORIES_FETCH_SUCCESS", payload: result.data.hits})
    }catch{
      dispatchStories({type: "STORIES_FETCH_FAILURE"})
    }
    
  }, [url])

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

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <SearchForm search={searchTerm} onInputChange={handleInputChange} onSubmit={handleSubmit} />
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading? <p>loading ...</p> :(<List list={stories.data} onRemoveItem={handleRemoveItem} />)}

    </div>
  )
};

const SearchForm = ({search, onInputChange, onSubmit}) => {
  return (
    <div>
      <form onSubmit={onSubmit}>

        <InputWithLabel id="search" type="text" value={search} onInputChange={onInputChange} isFocused>
          <strong>Search:</strong>
        </InputWithLabel>

        <button type="button" disabled={!search}>
          Submit
        </button>

      </form>
    </div>
    );    
}

const InputWithLabel = ({id, type="text", value, onInputChange, children, isFocused}) => {
  const inputRef = React.useRef()
  React.useEffect(()=>{
    if (isFocused && inputRef.current){
      inputRef.current.focus()
    }
  }, [isFocused])
  return (
    <>
    <label htmlFor={id}>{children}</label>
    <input id={id} type={type} ref={inputRef} value={value} onChange={onInputChange} />
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
