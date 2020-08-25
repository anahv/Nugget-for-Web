import React, { useState, useContext } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import MinimizeIcon from "@material-ui/icons/Minimize";
import AppContext from "../libs/contextLib";

import api from "../api/api";

function CreateNugget(props) {
  const [newNugget, setNewNugget] = useState({
    title: "",
    content: "",
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const { userId } = useContext(AppContext);

  function handleChange(event) {
    const { name, value } = event.target;
    setNewNugget(prevValues => {
      return {
        ...prevValues,
        [name]: value
      };
    });
  }

  async function handleIncludeNugget() {

    // Get random increment between 3 and 12 months
    const randomIncrement = Math.floor(Math.random() * (9 - 3) + 3)
    const currentDate = new Date()
    const reminderDate = new Date(currentDate.setMonth(currentDate.getMonth() + randomIncrement))
    const reminderMinute = reminderDate.getMinutes()
    const reminderHour = reminderDate.getHours()
    const reminderDay = reminderDate.getDate()
    const reminderMonth = reminderDate.getMonth()
    const reminderYear = reminderDate.getFullYear()

    const { title, content } = newNugget;
    // const payload = { title, content };
    const payload = { title, content, reminderMinute, reminderHour, reminderDay,
    reminderMonth, reminderYear}

    await api.addUserNugget(userId, payload).then(res=>{
      const {id, date} = res.data;
      newNugget._id = id;
      newNugget.date = date;
      props.addNewNugget(newNugget);
      setNewNugget({
        content: "",
        title: "",
      });
    })
    setIsExpanded(false)
  }

  return (
    <div>
      <form className="create-nugget">
        <Zoom in={isExpanded ? true : false}>
          <MinimizeIcon
            id="minimize-icon"
            onClick={() => setIsExpanded(false)}
          />
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
          <Fab onClick={handleIncludeNugget}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateNugget;
