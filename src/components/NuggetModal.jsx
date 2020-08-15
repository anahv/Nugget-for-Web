import React from "react";
import Modal from "react-bootstrap/Modal";

export default function NuggetModal(props) {

  const backgroundColor = {
    background: props.backgroundColor,
    border: "0px"
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      dialogClassName="modal-80w"
      aria-labelledby="example"
      centered
      size="lg"
    >
      <Modal.Header closeButton style={backgroundColor}>
        <Modal.Title id="example">{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={backgroundColor}>
        <p>{props.content}</p>
      </Modal.Body>
    </Modal>
  );
}
