import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import { useParams, Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import LoadingIcon from "./LoadingIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function ViewSinglePost() {
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const res = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token });
        console.log(res.data);
        setPost(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(`There was a problem, see: ${error}`);
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, [id]);

  if (!isLoading && !post) {
    <NotFound />;
  }

  if (isLoading)
    return (
      <Page>
        <LoadingIcon />
      </Page>
    );
  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username;
    }
    return false;
  }

  async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this post?");
    if (areYouSure) {
      try {
        const res = await Axios.delete(`/post/${id}`, {
          data: {
            token: appState.user.token
          }
        });
        if (res.data === "Success") {
          appDispatch({ type: "flashMessage", value: "Post was deleted successfully." });
          navigate(`/profile/${appState.user.username}`);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2 id="post-title">{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} id="edit-post-btn" data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip"></ReactTooltip>{" "}
            <a className="delete-post-button text-danger" onClick={deleteHandler} data-tip="Delete" data-for="delete">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip"></ReactTooltip>
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown id="post-content-body" children={post.body} />
      </div>
    </Page>
  );
}

export default ViewSinglePost;
