import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

function ProfilePosts() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await Axios.get(`/profile/${username}/posts`);
        // console.log(res.data);
        setPosts(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(`There was a problem, see: ${error}`);
      }
    }
    fetchPosts();
  }, []);

  if (isLoading) return <LoadingIcon />;

  return (
    <div className="list-group">
      {posts.map(post => {
        const date = new Date(post.createdDate);
        const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return (
          <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action" id="user-profile-post" data-cy="user-profile-post">
            <img className="avatar-tiny" src={post.author.avatar} />{" "}
            <strong data-cy="post-tile-text" id="post-tile-text">
              {post.title}
            </strong>{" "}
            <span className="text-muted small">on {dateFormatted} </span>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfilePosts;
