import React, { Component } from "react";
import { Container, Input, Button } from "reactstrap";

import NoteCard from "./NoteCard";
import "./NoteList.css";

class NoteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      sortType: "alphabetical",
      currentPage: 1,
      notesPerPage: 9
    };
  }

  handlePageTurn = e => {
    this.setState({ currentPage: Number(e.target.id) });
  };

  handleSearchInput = e => {
    this.setState({ searchInput: e.target.value });
  };

  changeSortType = sortBy => {
    this.setState({ sortType: sortBy });
  };

  render() {
    console.log("console log of notelist.js note state", this.props.notes);
    let sortedNotes = this.props.notes;
    if (this.state.sortType === "alphabetical") {
      sortedNotes = sortedNotes.sort(function(a, b) {
        let titleA = a.title.toLowerCase();
        let titleB = b.title.toLowerCase();
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }
        return 0;
      });
    }
    if (this.state.sortType === "contentLength") {
      sortedNotes = sortedNotes.sort(function(a, b) {
        return b.content.length - a.content.length;
      });
    }
    if (this.state.sortType === "default") {
      sortedNotes = sortedNotes.sort(function(a, b) {
        return a.id - b.id;
      });
    }

    const { currentPage, notesPerPage } = this.state;

    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = sortedNotes.slice(indexOfFirstNote, indexOfLastNote);

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(this.props.notes.length / notesPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    return (
      <div>
        <Input
          className="searchbar"
          type="text"
          placeholder="search by title or content"
          onChange={this.handleSearchInput}
          value={this.state.searchInput}
        />
        <Button
          className="sort-button"
          color="info"
          onClick={() => this.changeSortType("default")}
        >
          Sort by Last Modified (Default)
        </Button>
        <Button
          className="sort-button"
          color="info"
          onClick={() => this.changeSortType("alphabetical")}
        >
          Sort by Alphabet
        </Button>
        <Button
          className="sort-button"
          color="info"
          onClick={() => this.changeSortType("contentLength")}
        >
          Sorty by Size
        </Button>
        <h3 id="your-notes">Your Notes (page {currentPage}): </h3>
        <Container className="note-list">
          {currentNotes.map((note, index) => {
            if (this.state.searchInput === "") {
              return <NoteCard key={note._id} note={note} />;
            } else if (
              note.title
                .toLowerCase()
                .includes(this.state.searchInput.toLowerCase()) ||
              note.content
                .toLowerCase()
                .includes(this.state.searchInput.toLowerCase())
            ) {
              return <NoteCard key={note._id} note={note} />;
            } else {
              return null;
            }
          })}
        </Container>
        <div id="page-numbers">
          {pageNumbers.map(number => {
            return (
              <li key={number} id={number} onClick={this.handlePageTurn}>
                {number}
              </li>
            );
          })}
        </div>
      </div>
    );
  }
}

export default NoteList;
