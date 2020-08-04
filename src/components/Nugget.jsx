import React, { useState } from "react";
import api from "../api/api";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import Zoom from "@material-ui/core/Zoom";
import Button from "@material-ui/core/Button";
import TextareaAutosize from 'react-textarea-autosize';

// function Nugget(props) {
//   return (
//     <div className="note">
//       <h1>{props.title}</h1>
//       <p>{props.content}</p>
//       <button onClick={() => props.deleteNugget(props.id)}>
//         <DeleteIcon />
//       </button>
//       <button onClick={() => props.editNugget(props.id)}>
//         <EditIcon />
//       </button>
//     </div>
//   );
// }

function Nugget2(props) {
  const [editedNugget, setEditedNugget] = useState(props.nugget);
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setEditedNugget(prevValues => {
      return {
        ...prevValues,
        [name]: value
      };
    });
  }

  async function handleUpdateNugget(event) {
    const { title, content } = editedNugget;
    const payload = { title, content };
    await api.updateNuggetById(editedNugget._id, payload).then(res => {
      console.log("Nugget updated in the database!");
      setIsBeingEdited(false)
    });
  }

  return (
    <div className="note">
      <form>
        <input
          onChange={handleChange}
          value={editedNugget.title}
          key={props.id}
          name="title"
          type="text"
          disabled={isBeingEdited ? null : "disabled"}
        />
        <TextareaAutosize
          onChange={handleChange}
          value={editedNugget.content}
          name="content"
          key={props.id + "a"}
          type="textarea"
          disabled={isBeingEdited ? false : true}
        />
      </form>
      <button onClick={() => props.deleteNugget(editedNugget._id)}>
        <DeleteIcon />
      </button>
      <button onClick={() => setIsBeingEdited(!isBeingEdited)}>
        <EditIcon />
      </button>
      <Zoom in={isBeingEdited ? true : false}>
        <Button id="save-button" onClick={handleUpdateNugget}>
          Save
        </Button>
      </Zoom>
    </div>
  );
}

export default Nugget2;
