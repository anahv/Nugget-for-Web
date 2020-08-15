import React, { useState, useContext, useEffect, useRef } from "react";
import { updateUserNugget } from "../api/api";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
// import LabelIcon from '@material-ui/icons/Label';
import Zoom from "@material-ui/core/Zoom";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "react-textarea-autosize";
import AppContext from "../libs/contextLib";
import { CirclePicker } from "react-color";
import PaletteIcon from "@material-ui/icons/Palette";

function Nugget(props) {
  const [editedNugget, setEditedNugget] = useState(props.nugget);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const { userId } = useContext(AppContext);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, [])

  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowColorPicker(false);
    }
  };

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
    const { title, content, color, _id } = editedNugget;
    const payload = { title, content, color, _id };
    await updateUserNugget(userId, payload).then(res => {
      setIsBeingEdited(false);
    });
  }

  function handleChangeColor(color) {
    const newColor = color.hex;
    setColor(newColor);
    setEditedNugget(prevValues => {
      return {
        ...prevValues,
        color: newColor
      };
    });
    setShowColorPicker(false);
  }

  useEffect(
    () => {
      handleUpdateNugget();
    },
    [color]
  );

  return (
    <div
      className="note"
      style={{
        backgroundColor: editedNugget.color
      }}
    >
      {/* <div onClick={() => props.handleOpenModal(editedNugget)}>*/}
        <div id="date">{props.date}</div>
        <form>
          {editedNugget.title || isBeingEdited ? (
            <TextareaAutosize
              className="note-title"
              onChange={handleChange}
              value={editedNugget.title}
              placeholder="Title"
              key={props.id}
              name="title"
              type="text"
              disabled={isBeingEdited ? null : "disabled"}
            />
          ) : null}
          <TextareaAutosize
            onChange={handleChange}
            value={editedNugget.content}
            name="content"
            key={props.id + "a"}
            type="textarea"
            disabled={isBeingEdited ? false : true}
          />
        </form>
      {/*</div>*/}
      <button onClick={() => props.deleteNugget(editedNugget._id)}>
        <DeleteIcon />
      </button>
      {!isBeingEdited &&
      <button onClick={() => setIsBeingEdited(!isBeingEdited)}>
        <EditIcon />
      </button>}
      <div ref={wrapperRef}>
      <button onClick={()=> setShowColorPicker(!showColorPicker)}>
        <PaletteIcon />
      </button>
      <Zoom in={showColorPicker ? true : false}>
        <div id="color-picker" >
          <CirclePicker
            onChange={handleChangeColor}
            width={"140px"}
            circleSpacing={6}
            circleSize={20}
            colors={["#FDCFE8", "#FDFAAB", "#BAEFB4", "#C3EEFD", "#fff"]}
          />
        </div>
      </Zoom>
      </div>
      <Zoom in={isBeingEdited ? true : false}>
        <Button id="save-button" onClick={handleUpdateNugget}>
          Save
        </Button>
      </Zoom>
    </div>
  );
}

export default Nugget;
