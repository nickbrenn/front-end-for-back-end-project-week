import React from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle, CardHeader, CardBody, CardText } from "reactstrap";
import "./NoteCard.css";

const NoteCard = props => {
  console.log(props);
  return (
    <Card className="note-card">
      <CardHeader>
        <Link to={`note/${props.note.id}`}>{props.note.title}</Link>
      </CardHeader>
      <CardBody>
        <CardText>{props.note.content}</CardText>
      </CardBody>
    </Card>
  );
};

export default NoteCard;
