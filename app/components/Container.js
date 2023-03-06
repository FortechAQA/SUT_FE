import React, { useEffect } from "react";

function Container(props) {
  return (
    <div id="logged-in-feed" className={"container container py-md-5 " + (props.wide ? "" : "container--narrow")}>
      {props.children}
    </div>
  );
}

export default Container;
