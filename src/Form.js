import React from "react";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { ReduxFormTextEditor } from "./RichTextEditor";

const Form = ({ initialize, onSubmit, handleSubmit }) => {
  const [content] = React.useState(undefined);

  React.useEffect(() => {
    initialize({
      message: `### Title`
    });
  }, []);

  const handleFormSubmit = data => {
    // incase you want to throw an error on submission
    // throw new SubmissionError({
    //   message: "Contact message is required"
    // });
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <h2>Contact Form</h2>
      <Field name="message" component={ReduxFormTextEditor} />
      <br />
      <button type="submit">Submit</button>
      <h3>Submitted Content:</h3>
      <div>{content}</div>
    </form>
  );
};

export default reduxForm({ form: "ContactForm" })(Form);
