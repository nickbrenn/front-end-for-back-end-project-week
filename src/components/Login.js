import React, { Component } from "react";
import axios from "axios";
import { Button, Container, Col, Row, Form, Input } from "reactstrap";
import { Link } from "react-router-dom";

import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  login = event => {
    event.preventDefault();
    const userData = {
      username: this.state.username.toLowerCase(),
      password: this.state.password
    };
    axios
      .post("http://localhost:3333/login", userData)
      .then(response => {
        const newToken = {
          token: response.data.token
        };
        const requestOptions = {
          headers: {
            Authorization: response.data.token
          }
        };
        axios
          .put(
            `http://localhost:3333/users/${response.data.userData.id}`,
            newToken,
            requestOptions
          )
          .then(response => {
            localStorage.setItem("username", userData.username.toLowerCase());
            localStorage.setItem("token", newToken.token);
            this.props.submitPassword(userData.username);
          })
          .catch(error => {
            console.log("response from ERROR putting user", newToken);
            alert("could not put it");
          });
      })
      .catch(error => {
        console.log(error);
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
      <div className="login">
        <Container>
          <Row>
            <Col>
              <h4 className="mt-5">Login: </h4>
              <Form onSubmit={this.login}>
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
                <Link to={"/register"}>
                  <Button color="info">Register</Button>
                </Link>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
