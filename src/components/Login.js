import React, { Component } from "react";
import axios from "axios";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

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
      username: this.state.username,
      password: this.state.password
    };
    axios
      .post("https://radiant-stream-89164.herokuapp.com/login", userData)
      .then(response => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        this.props.submitPassword();
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
      <div className="Login">
        <form onSubmit={this.login}>
          <input
            onChange={this.handleInputChange}
            placeholder="username"
            value={this.state.username}
            name="username"
          />
          <input
            onChange={this.handleInputChange}
            placeholder="password"
            value={this.state.password}
            name="password"
          />
          <button type="submit">Login this user</button>
        </form>
        <Link to={"/register"}>
          <Button color="info">Register</Button>
        </Link>
      </div>
    );
  }
}

export default Login;
