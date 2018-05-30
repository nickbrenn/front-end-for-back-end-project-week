import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Row, Col, Container, Input, Button } from "reactstrap";
import axios from "axios";

import NoteList from "./components/NoteList";
import NoteView from "./components/NoteView";
import CreateNote from "./components/CreateNote";
import Menu from "./components/Menu";
import "./App.css";

const placeholderText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const initialNotes = [
  {
    id: 1,
    title: "First Note NOTENOTENOTENOTENOTENOTENOTENOTE",
    content: placeholderText
  },
  { id: 2, title: "AAA Second Note", content: placeholderText },
  {
    id: 3,
    title: "Third Note (Biggest size)",
    content: placeholderText + placeholderText + placeholderText
  },
  {
    id: 4,
    title: "Fourth Note (2nd biggest)",
    content: placeholderText + placeholderText
  },
  { id: 5, title: "ZZZ Fifth Note", content: placeholderText },
  { id: 6, title: "Sixth Note", content: "shortest content" },
  { id: 7, title: "Seventh Note", content: "2nd shortest content" }
];

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
    axios
      .get("https://radiant-stream-89164.herokuapp.com/notes")
      .then(response => {
        console.log("we got the notes", response.data);
        this.setState(() => ({ notes: response.data }));
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
        console.log("we got a new note", response.data);
        this.setState(() => ({ notes: [...this.state.notes, response.data] }));
      })
      .catch(error => {
        console.error("Server Error", error);
      });
  };

  editNote = (editedNote, id) => {
    axios
      .put(`https://radiant-stream-89164.herokuapp.com/notes/${id}`, editedNote)
      .then(response => {
        console.log("we UPDATED a note", response.data);
      })
      .catch(error => {
        console.error("Server Error", error);
      });

    const newNotes = this.state.notes.map((note, index) => {
      if (id === note._id) {
        note.title = editedNote.title;
        note.content = editedNote.content;
      }
      return note;
    });
    this.setState({ notes: newNotes });
  };

  deleteNote = deleteId => {
    const newNotes = this.state.notes.filter(note => {
      return note.id !== deleteId;
    });
    this.setState({ notes: newNotes });
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
        <div className="App">
          <Container>
            <Row>
              <Col>
                <h4 className="mt-5">Login: </h4>
                <Input
                  className="password-input mt-5"
                  type="text"
                  name="inputtedPassword"
                  placeholder="Type the password for access"
                  onChange={this.handlePasswordInput}
                  value={this.state.inputtedPassword}
                />
                <Button color="info" onClick={this.submitPassword}>
                  Login
                </Button>
                <Button
                  color="info"
                  onClick={() =>
                    alert(`The password is "${this.state.password}"`)
                  }
                >
                  Hint
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}

export default App;
