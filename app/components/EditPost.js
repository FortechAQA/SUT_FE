import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import { useParams, Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import LoadingIcon from "./LoadingIcon";
import { useImmerReducer } from "use-immer";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NotFound from "./NotFound";

function EditPost() {
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  };
  function OurReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case "titleChange":
        draft.title.value = action.value;
        draft.title.hasErrors = false;
        return;
      case "bodyChange":
        draft.body.value = action.value;
        draft.body.hasErrors = false;
        return;
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestFinished":
        draft.isSaving = false;
        return;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "You must provide a title.";
        }
        return;
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "You must provide a body content.";
        }
        return;
      case "notFound":
        draft.notFound = true;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(OurReducer, originalState);

  function submitHandler(e) {
    e.preventDefault();
    dispatch({ title: "titleRules", value: state.title.value });
    dispatch({ title: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const res = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token });
        console.log(res.data);
        if (res.data) {
          dispatch({ type: "fetchComplete", value: res.data });
          if (appState.user.username != res.data.author.username) {
            appDispatch({ type: "flashMessage", value: "You do not have permission to edit this post!" });
            navigate("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (error) {
        console.log(`There was a problem, see: ${error}`);
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const ourRequest = Axios.CancelToken.source();

      async function fetchPost() {
        try {
          const res = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token
            },
            { cancelToken: ourRequest.token }
          );
          console.log(res.data);
          dispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Post was successfully updated." });
        } catch (error) {
          console.log(`There was a problem, see: ${error}`);
        }
      }
      fetchPost();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);
  if (state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching)
    return (
      <Page>
        <LoadingIcon />
      </Page>
    );

  return (
    <Page title="Edit Post">
      <Link className="small font-weight bold" to={`/post/${state.id}`}>
        {" "}
        &laquo; Back to post
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title-text" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            value={state.title.value}
            onBlur={e => {
              dispatch({ type: "titleRules", value: e.target.value });
            }}
            onChange={e => dispatch({ type: "titleChange", value: e.target.value })}
            autoFocus
            name="title"
            id="edit-post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onBlur={e => {
              dispatch({ type: "bodyRules", value: e.target.value });
            }}
            onChange={e => dispatch({ type: "bodyChange", value: e.target.value })}
            value={state.body.value}
            name="body"
            id="edit-post-body"
            className="body-content tall-textarea form-control"
            type="text"
          />
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button disabled={state.isSaving} id="submit-post" className="btn btn-primary">
          Edit Post
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
