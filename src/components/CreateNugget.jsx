import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import MinimizeIcon from "@material-ui/icons/Minimize";

function CreateNugget(props) {
  const [newNugget, setNewNugget] = useState({
    content: "",
    title: ""
  });

  const [isExpanded, setIsExpanded] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setNewNugget(prevValues => {
      return {
        ...prevValues,
        [name]: value
      };
    });
  }

  function handleClick(event) {
    props.addNewNugget(newNugget);
    setNewNugget({
      content: "",
      title: ""
    });
    event.preventDefault();
  }

  return (
    <div>
      <form className="create-nugget">
        <Zoom in={isExpanded? true : false}>
          <MinimizeIcon id="minimize-icon" onClick={() => setIsExpanded(false)} />
        </Zoom>
        {isExpanded && (
          <input
            onChange={handleChange}
            value={newNugget.title}
            name="title"
            placeholder="Title"
            type="text"
          />
        )}
        <textarea
          onChange={handleChange}
          value={newNugget.content}
          name="content"
          placeholder="Create a new nugget..."
          rows={isExpanded ? 3 : 1}
          type="textarea"
          onClick={() => setIsExpanded(true)}
        />
        <Zoom in={isExpanded ? true : false}>
          <Fab onClick={handleClick}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateNugget;
