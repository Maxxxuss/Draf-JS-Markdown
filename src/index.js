import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import ReactMarkdown from "react-markdown";
import Form from "./Form";
import { IsJsonString } from "./helper";
import { convertFromRaw } from "draft-js";
import { stateToMarkdown } from "draft-js-export-markdown";
const reducer = combineReducers({
  form: reduxFormReducer
});

const store = createStore(reducer);

const App = () => {
  const [content, setContent] = React.useState(undefined);

  const handleFormSubmit = data => {
    if (IsJsonString(data.message)) {
      const state = convertFromRaw(JSON.parse(data.message));
      const markdown = stateToMarkdown(state);
      setContent(markdown);
    } else {
      setContent(data.message);
    }
  };

  React.useEffect(() => {
    if (IsJsonString(content)) {
      const state = convertFromRaw(JSON.parse(content));
      const markdown = stateToMarkdown(state);
      setContent(markdown);
    }
  }, []);

  return (
    <Provider store={store}>
      <Form onSubmit={handleFormSubmit} />
      <ReactMarkdown source={content} />
    </Provider>
  );
};

render(<App />, document.getElementById("root"));
