import React, { useContext } from "react";
import Page from "./Page";
import StateContext from "../StateContext";

function Home() {
  const appState = useContext(StateContext);

  return (
    <Page>
      <div data-cy="logged-in-feed">
        <h2 id="logged-in-feed-header" className="text-center" data-cy="logged-in-feed-header">
          Hello {appState.user.username}, your feed is empty.
        </h2>
        <p id="feed-content-body" className="lead text-muted text-center" data-cy="logged-in-feed-content-body">
          Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.
        </p>
      </div>
    </Page>
  );
}

export default Home;
