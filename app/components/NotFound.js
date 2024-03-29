import React from "react";
import Page from "./Page";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Page title="Not found">
      <div className="textcenter">
        <h2>Whoops, we cannot find that page.</h2>
        <p className="lead text-muted">
          {" "}
          You can alwasy visit the <Link to="/">homepage</Link> to get a fresh start.
        </p>
      </div>
    </Page>
  );
}

export default NotFound;
