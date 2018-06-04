import React, { Component } from "react";
import axios from "axios";
import { Button, Container, Col, Row, Form, Input } from "reactstrap";
import { Link } from "react-router-dom";

import "./Register.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  register = event => {
    event.preventDefault();
    const newUser = {
      username: this.state.username,
      password: this.state.password
    };
    axios
      .post("http://localhost:3333/register", newUser)
      .then(response => {
        console.log(response);
        this.props.history.push("/");
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });

    this.setState({
      username: "",
      password: ""
    });
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="register">
        <Container>
          <Row>
            <Col>
              <h4 className="mt-5">Registration: </h4>
              <Form onSubmit={this.register}>
                <Input
                  onChange={this.handleInputChange}
                  placeholder="username"
                  value={this.state.username}
                  name="username"
                />
                <Input
                  onChange={this.handleInputChange}
                  placeholder="password"
                  value={this.state.password}
                  name="password"
                />
                <Button color="info" type="submit">
                  Submit
                </Button>
                <Link to={"/"}>
                  <Button color="info">Login</Button>
                </Link>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
