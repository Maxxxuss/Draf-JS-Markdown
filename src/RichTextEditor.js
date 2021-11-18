import React from "react";
import PropTypes from "prop-types";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { stateFromMarkdown } from "draft-js-import-markdown";
import { IsJsonString } from "../helper";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const RichTextEditor = (props) => {
  const { value = "", placeholder, onChange } = props;

  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const onEditorStateChange = (state) => {
    const stringifiedContent = JSON.stringify(
      convertToRaw(state.getCurrentContent())
    );
    onChange(stringifiedContent);
    setEditorState(state);
  };

  React.useEffect(() => {
    const stringifiedContent = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    console.log("newvaleu", stringifiedContent);
    console.log("value", value);
    if (value !== stringifiedContent) {
      if (IsJsonString(value)) {
        console.log("state");
        const state = convertFromRaw(JSON.parse(value));
        setEditorState(EditorState.createWithContent(state));
      } else {
        const state = stateFromMarkdown(value);
        setEditorState(EditorState.createWithContent(state));
      }
    }
  }, [value]);

  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.imgur.com/3/image");
      xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      placeholder={placeholder}
      editorStyle={{
        minHeight: 300,
        backgroundColor: "#fafafa",
        paddingLeft: 12,
        paddingRight: 12,
        borderBottom: "1px solid #ccc"
      }}
      toolbarStyle={{ padding: "8px 5px" }}
      toolbar={{
        options: [
          "blockType",
          "fontSize",
          "inline",
          "emoji",
          "image",
          "link",
          "list",
          "history"
        ],
        inline: { inDropdown: false },
        list: { inDropdown: false },
        link: { inDropdown: false },
        history: { inDropdown: false },
        image: {
          uploadCallback: uploadImageCallBack,
          alt: { present: true, mandatory: true }
        }
      }}
    />
  );
};

RichTextEditor.propTypes = {
  value: PropTypes.string.required,
  onChange: PropTypes.func.required,
  placeholder: PropTypes.string
};

const ReduxFormAdapter = (props) => {
  const {
    input,
    meta: { error, warning, submitFailed } = {},
    ...other
  } = props;
  const errorText = error || warning;
  const adaptedProps = {
    ...input,
    ...other
  };

  // Collect and pass redux-form errors from `meta` prop
  if (submitFailed && (error || warning)) {
    adaptedProps.error = Boolean(errorText);
    adaptedProps.helperText = errorText;
  }

  return (
    <div>
      <RichTextEditor {...adaptedProps} />
      {error && <span>{error}</span>}
    </div>
  );
};

export const ReduxFormTextEditor = ReduxFormAdapter;

export default RichTextEditor;
