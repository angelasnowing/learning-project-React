import React, { useState } from "react";
import axios from "axios";
import "./App.css";

type StoriesState = {
  isLoading: Boolean;
  isError: Boolean;
  data: Array<Story>;
};

interface StoriesFetchInitAction {
  type: "STORIES_FETCH_INIT";
}
interface StoriesFetchSuccessAction {
  type: "STORIES_FETCH_SUCCESS";
  payload: Array<Story>;
}
interface StoriesFetchFailureAction {
  type: "STORIES_FETCH_FAILURE";
}
interface StoriesRemoveAction {
  type: "REMOVE_STORY";
  payload: Story;
}
type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;
const App = () => {
  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem("search") ?? ""
  );
  const storiesReducer = (state: StoriesState, action: StoriesAction) => {
    switch (action.type) {
      case "STORIES_FETCH_INIT":
        return { ...state, isLoading: true, isError: false };
      case "STORIES_FETCH_SUCCESS":
        return {
          ...state,
          data: action.payload,
          isLoading: false,
          isError: false,
        };
      case "STORIES_FETCH_FAILURE":
        return { ...state, isLoading: false, isError: true };
      case "REMOVE_STORY":
        return {
          ...state,
          data: state.data.filter(
            (story) => story.objectID !== action.payload.objectID
          ),
        };
      default:
        throw new Error();
    }
  };
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isError: false,
    isLoading: false,
  });
  const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveItem = (item: Story) => {
    dispatchStories({ type: "REMOVE_STORY", payload: item });
  };

  const handleSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const handleFetchStories = React.useCallback(async () => {
    console.log(url, "===url===");

    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const result = await axios.get(url);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  React.useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <SearchForm
        search={searchTerm}
        onInputChange={handleInputChange}
        onSearchSubmit={handleSubmit}
      />
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveItem} />
      )}
    </div>
  );
};

const SearchForm = ({ search, onInputChange, onSearchSubmit }) => {
  return (
    <div>
      <form onSubmit={onSearchSubmit}>
        <InputWithLabel
          id="search"
          type="text"
          value={search}
          onInputChange={onInputChange}
          isFocused
        >
          <strong>Search:</strong>
        </InputWithLabel>

        <button type="submit" disabled={!search}>
          Submit
        </button>
      </form>
    </div>
  );
};

const InputWithLabel = ({
  id,
  type = "text",
  value,
  onInputChange,
  children,
  isFocused,
}) => {
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        id={id}
        type={type}
        ref={inputRef}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

type ListProp = {
  list: Array<Story>;
  onRemoveItem: (item: Story) => void;
};

const List = ({ list, onRemoveItem }: ListProp) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}></Item>
    ))}
  </ul>
);

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type ItemProp = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

const Item = ({ item, onRemoveItem }: ItemProp) => (
  <li>
    <span>
      <a href={item.url}>{item.title} </a>
    </span>
    <span> {item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <button type="button" onClick={() => onRemoveItem(item)}>
      Dismiss
    </button>
  </li>
);

export default App;
