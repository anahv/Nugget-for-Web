import React from "react";
import DeleteIcon from '@material-ui/icons/Delete';

function Nugget(props) {
  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={() => props.deleteNugget(props.id)}><DeleteIcon/></button>
    </div>
  );
}

export default Nugget;
