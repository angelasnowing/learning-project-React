import { useState } from "react";
import React from "react";
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveItem = (item: Story) => {
    dispatchStories({ type: "REMOVE_STORY", payload: item });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>

      <SearchForm
        search={searchTerm}
        onInputChange={handleInputChange}
        onSearchSubmit={handleSubmit}
      />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveItem} />
      )}
    </div>
  );
};

type SearchFormProps = {
  search: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};
const SearchForm = ({
  search,
  onInputChange,
  onSearchSubmit,
}: SearchFormProps) => {
  return (
    <div>
      <form onSubmit={onSearchSubmit} className="search-form">
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

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: Boolean;
  children: React.ReactNode;
};

const InputWithLabel = ({
  id,
  type = "text",
  value,
  onInputChange,
  children,
  isFocused,
}: InputWithLabelProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null!);
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
  <li className="item">
    <span style={{ width: "40%" }}>
      <a href={item.url}>{item.title} </a>
    </span>
    <span style={{ width: "30%" }}> {item.author}</span>
    <span style={{ width: "10%" }}>{item.num_comments}</span>
    <span style={{ width: "10%" }}>{item.points}</span>
    <span style={{ width: "10%" }}>
      <button
        className="button button_small"
        type="button"
        onClick={() => onRemoveItem(item)}
      >
        Dismiss
      </button>
    </span>
  </li>
);

export default App;
