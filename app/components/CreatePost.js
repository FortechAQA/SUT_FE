import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Page from "./Page";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function CreatePost() {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-post", { title, body, token: appState.user.token });
      //   redirect to new post url
      appDispatch({ type: "flashMessage", value: "Congratulations! New post created!" });
      if (response.data[0] === "You must provide a title." || response.data[0] === "You must provide post content.") {
        appDispatch({ type: "flashMessage", value: `Following errors occurred: ${response.data}` });
      } else {
        navigate(`/post/${response.data}`);
      }

      console.log(`New post created successfully: ${response.data}`);
    } catch (e) {
      console.log(response.data);
    }
  }

  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" data-cy="post-title" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={e => setBody(e.target.value)} name="body" data-cy="post-body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button id="submit-post-btn" data-cy="submit-post-btn" className="btn btn-primary">
          Save New Post
        </button>
      </form>
    </Page>
  );
}

export default CreatePost;
