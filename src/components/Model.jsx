import React from "react";
import AutorenewIcon from "@material-ui/icons/Autorenew";

function Model(props) {
  return (
    <div className="note" id="model">
      <h1>Mental model of the day</h1>
      <h2>{props.title}</h2>
      <p>{props.content}</p>
      {props.example && <p>e.g. {props.example}</p>}
      <button onClick={() => props.fetchModel()}>
        <AutorenewIcon />
      </button>
    </div>
  );
}

export default Model;
