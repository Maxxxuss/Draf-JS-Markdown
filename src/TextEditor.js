import React from "react";
import PropTypes from "prop-types";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";

const toolbarStyle = { padding: "8px 5px" };

function TextEditor(props) {
  const { value = "", placeholder, onChange } = props;
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  React.useEffect(() => {
    const newValue = stateToMarkdown(editorState.getCurrentContent());
    if (value !== newValue) {
      const state = EditorState.createWithContent(stateFromMarkdown(value));
      setEditorState(state);
    }
  }, [value]);

  const onEditorStateChange = state => {
    // const newValue = stateToMarkdown(state.getCurrentContent());
    // if (value !== newValue) {
    //   onChange(newValue);
    // }
    // setEditorState(state);
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      placeholder={placeholder}
      editorStyle={editorStyle}
      toolbarStyle={toolbarStyle}
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
        link: { inDropdown: true },
        history: { inDropdown: false },
        image: {
          alt: { present: true, mandatory: true }
        }
      }}
    />
  );
}

TextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.any
};

export default TextEditor;
