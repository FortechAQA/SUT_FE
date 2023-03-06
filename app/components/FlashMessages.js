import React, { useEffect } from "react";

function FlashMessages(props) {
  return (
    <div className="floating-alerts" id="post-success-toast">
      {props.messages.map((msg, index) => {
        return (
          <div id="confirmation-alert" key={index} className="alert alert-success text-center floating-alert shadow-sm">
            {msg}
          </div>
        );
      })}
    </div>
  );
}

export default FlashMessages;
