import React, { Component } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Input, Modal, ModalBody } from "reactstrap";

import "./NoteView.css";

class NoteView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: null,
      id: this.props.match.params.id,
      title: "",
      content: "",
      editing: false,
      deleting: false
    };
  }

  componentDidMount = () => {
    if (
      this.props.notes !== null &&
      this.props.notes !== undefined &&
      this.state.editing === false
    ) {
      this.displayNote();
    }
  };

  displayNote = () => {
    // const displayedNote = this.props.notes.filter((note, index) => {
    //   this.state.id == note._id;
    // });
    // console.log("the notes for noteview", this.props.notes);
    const id = this.props.match.params.id;
    axios
      .get(`https://radiant-stream-89164.herokuapp.com/notes/${id}`)
      .then(response => {
        this.setState(() => ({
          note: response.data,
          title: response.data.title,
          content: response.data.content
        }));
      })
      .catch(error => {
        console.error("Server Error", error);
      });
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  editToggle = () => {
    this.setState({
      editing: !this.state.editing
    });
  };

  deleteToggle = () => {
    this.setState({
      deleting: !this.state.deleting
    });
  };

  handleEditNote = () => {
    if (this.state.title !== "" && this.state.content !== "") {
      const editedNote = {
        title: this.state.title,
        content: this.state.content
      };
      const id = this.state.id;
      this.props.editNote(editedNote, id);
      this.setState({
        editing: !this.state.editing
      });
    } else alert("Fill out all inputs to submit");
  };

  handleDeleteNote = () => {
    this.props.deleteNote(this.state.id);
    this.setState({
      editing: false,
      note: null
    });
  };

  render() {
    if (this.state.editing === false && this.state.note !== null) {
      return (
        <div className="note-view mt-1 mb-5">
          <div className="modify-links">
            <b onClick={this.editToggle}>edit</b>
            <b onClick={this.deleteToggle}>delete</b>
          </div>
          <Modal isOpen={this.state.deleting} toggle={this.deleteToggle}>
            <ModalBody>Are you sure you want to delete this?</ModalBody>
            <div className="modal-buttons">
              <Button color="danger" onClick={this.handleDeleteNote}>
                <b>Delete</b>
              </Button>
              <Button color="info" onClick={this.deleteToggle}>
                <b>No</b>
              </Button>
            </div>
          </Modal>
          <h3 className="note-title">{this.state.title}</h3>
          <div className="note-content">{this.state.content}</div>
        </div>
      );
    } else if (this.state.editing === true) {
      return (
        <Form>
          <h3>Edit Note:</h3>
          <FormGroup>
            <Input
              type="textarea"
              name="title"
              placeholder="Note Title"
              value={this.state.title}
              onChange={this.handleInput}
              className="title-input"
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="textarea"
              name="content"
              placeholder="Note Content"
              value={this.state.content}
              onChange={this.handleInput}
              className="content-input"
            />
          </FormGroup>
          <Button color="info" onClick={this.handleEditNote}>
            <b>Update</b>
          </Button>
        </Form>
      );
    } else return <div className="mt-5">There is no note with that id!</div>;
  }
}

export default NoteView;
