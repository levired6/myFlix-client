import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'; // Import useNavigate in LoginView

export const LoginView = ({ onLoggedIn }) =>{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Get navigate in LoginView

  const handleSubmit = (event) => {
    //this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

const data = {
  username: username, 
  password: password, 
};

    fetch('https://oscars2025-f0070acec0c4.herokuapp.com/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login response:", data);
        if (data.user && data.token) {
          // Store token and user in localStorage here, so MyFlixApplication can pick them up
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          
          onLoggedIn(data.user, data.token); // Call onLoggedIn to update state in MyFlixApplication
          
          navigate('/'); // Navigate after successful login
        } else {
          alert("No such user or incorrect password!");
        }
      })
      .catch((e) => {
        console.error('Login error:', e);
        alert(`Something went wrong during login: ${e.message}`);
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
