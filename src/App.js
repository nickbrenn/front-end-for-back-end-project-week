import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Row, Col, Container, Input, Button } from "reactstrap";
import axios from "axios";

import NoteList from "./components/NoteList";
import NoteView from "./components/NoteView";
import CreateNote from "./components/CreateNote";
import Menu from "./components/Menu";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      password: "password",
      inputtedPassword: "",
      access: true
    };
  }

  componentDidMount() {
    this.fetchNotes();
  }

  fetchNotes() {
    axios
      .get("https://radiant-stream-89164.herokuapp.com/notes")
      .then(response => {
        console.log("we got the notes", response.data);
        let sortedNotes = response.data.sort(function(a, b) {
          if (a.updatedAt > b.updatedAt) {
            return -1;
          }
          if (a.updatedAt < b.updatedAt) {
            return 1;
          }
          return 0;
        });
        this.setState(() => ({ notes: sortedNotes }));
      })
      .catch(error => {
        console.error("Server Error", error);
      });
  }

  handlePasswordInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitPassword = () => {
    if (this.state.inputtedPassword === this.state.password) {
      this.setState({ access: true });
    } else {
      alert("This password is incorrect.");
      this.setState({ inputtedPassword: "" });
    }
  };

  logOut = () => {
    this.setState({ inputtedPassword: "", access: false });
  };

  addNote = newNote => {
    console.log("addnote is run", newNote);
    const addedNote = {
      title: newNote.title,
      content: newNote.content
    };
    axios
      .post("https://radiant-stream-89164.herokuapp.com/notes", addedNote)
      .then(response => {
        this.fetchNotes();
      })
      .catch(error => {
        console.error("Server Error: Error adding note", error);
      });
  };

  editNote = (editedNote, id) => {
    axios
      .put(`https://radiant-stream-89164.herokuapp.com/notes/${id}`, editedNote)
      .then(response => {
        console.log("we UPDATED a note", response.data);
        this.fetchNotes();
      })
      .catch(error => {
        console.error("Server Error: Error putting note", error);
      });
  };

  deleteNote = id => {
    axios
      .delete(`https://radiant-stream-89164.herokuapp.com/notes/${id}`)
      .then(response => {
        console.log("we DELETED a note", response.data);
        this.fetchNotes();
      })
      .catch(error => {
        console.error("Server Error: Error deleting note", error);
      });
  };

  render() {
    console.log("app state notes", this.state.notes);
    if (this.state.access === true) {
      return (
        <div className="App">
          <Container>
            <Row>
              <Col sm="3">
                <Route
                  path="/"
                  render={props => {
                    return (
                      <Menu notes={this.state.notes} logOut={this.logOut} />
                    );
                  }}
                />
              </Col>
              <Col sm="9">
                <Route
                  exact
                  path="/"
                  render={props => {
                    return <NoteList notes={this.state.notes} />;
                  }}
                />
                <Route
                  exact
                  path="/note/:id"
                  render={props => {
                    return (
                      <NoteView
                        {...props}
                        notes={this.state.notes}
                        editNote={this.editNote}
                        deleteNote={this.deleteNote}
                      />
                    );
                  }}
                />
                <Route
                  path="/create"
                  render={props => {
                    return (
                      <CreateNote
                        notes={this.state.notes}
                        addNote={this.addNote}
                      />
                    );
                  }}
                />
              </Col>
            </Row>
          </Container>
        </div>
      );
    } else {
      return (
        <Register />
        // <div className="App">
        //   <Container>
        //     <Row>
        //       <Col>
        //         <h4 className="mt-5">Login: </h4>
        //         <Input
        //           className="password-input mt-5"
        //           type="text"
        //           name="inputtedPassword"
        //           placeholder="Type the password for access"
        //           onChange={this.handlePasswordInput}
        //           value={this.state.inputtedPassword}
        //         />
        //         <Button color="info" onClick={this.submitPassword}>
        //           Login
        //         </Button>
        //         <Button
        //           color="info"
        //           onClick={() =>
        //             alert(`The password is "${this.state.password}"`)
        //           }
        //         >
        //           Hint
        //         </Button>
        //       </Col>
        //     </Row>
        //   </Container>
        // </div>
      );
    }
  }
}

export default App;
