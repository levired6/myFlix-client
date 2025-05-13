import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export const LoginView = ({ onLoggedIn }) =>{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    //this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
    };

    fetch('https://oscars2025-f0070acec0c4.herokuapp.com/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login response: ", data);
        if (data.token) {
          localStorage.setItem("token", data.token);  
          localStorage.setItem("user", JSON.stringify(data.user));
          onLoggedIn(data.user, data.token);
        } else {
          alert("Invalid username or password.");
        }
      })
      .catch((e) => {
        console.error('Login error:', error);
        alert("Something went wrong during login.");
      });
  };

    return (
        <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-white text-dark"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white text-dark"
        />
      </Form.Group>

      <Button type="submit" className="metallic-blue-button">Submit</Button>
    </Form>
  );
};
