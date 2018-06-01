import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import axios from "axios";

import NoteList from "./components/NoteList";
import NoteView from "./components/NoteView";
import CreateNote from "./components/CreateNote";
import Menu from "./components/Menu";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";

let username = localStorage.getItem("username");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
  }

  componentDidMount() {
    if (username !== null) {
      this.fetchNotes();
    }
  }

  fetchNotes() {
    const requestOptions = {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
    console.log("requestOptions", requestOptions);
    axios
      .get("https://radiant-stream-89164.herokuapp.com/notes", requestOptions)
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
        this.props.history.push("/");
      });
  }

  submitPassword = user => {
    username = user.toLowerCase();
    this.fetchNotes();
  };

  logOut = () => {
    this.setState({ notes: [] });
    username = null;
  };

  addNote = newNote => {
    newNote.username = username;
    console.log("addnote is run", newNote);
    const requestOptions = {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
    axios
      .post(
        "https://radiant-stream-89164.herokuapp.com/notes",
        newNote,
        requestOptions
      )
      .then(response => {
        this.fetchNotes();
      })
      .catch(error => {
        console.error("Server Error: Error adding note", error);
      });
  };

  editNote = (editedNote, id) => {
    const requestOptions = {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
    axios
      .put(
        `https://radiant-stream-89164.herokuapp.com/notes/${id}`,
        editedNote,
        requestOptions
      )
      .then(response => {
        console.log("we UPDATED a note", response.data);
        this.fetchNotes();
      })
      .catch(error => {
        console.error("Server Error: Error putting note", error);
      });
  };

  deleteNote = id => {
    const requestOptions = {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
    axios
      .delete(
        `https://radiant-stream-89164.herokuapp.com/notes/${id}`,
        requestOptions
      )
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
    if (username !== null) {
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
                        username={username}
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
        <div>
          <Route
            exact
            path="/"
            render={props => {
              return <Login submitPassword={this.submitPassword} />;
            }}
          />
          <Route
            exact
            path="/register"
            render={props => {
              return <Register />;
            }}
          />
        </div>
      );
    }
  }
}

export default App;
