import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'; // Import useNavigate in LoginView

export const LoginView = ({ onLoggedIn }) =>{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false); // New state for password visibility
  const navigate = useNavigate(); // Get navigate in LoginView

// Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

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
        // Use Container, Row, Col to center the form and control its width
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}> {/* Responsive column sizing */}
                    <h2 className="text-center mb-4">Login</h2> {/* Centered title */}
                    <Form onSubmit={handleSubmit} className="text-center"> {/* Centered form content */}
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="bg-white text-dark mx-auto" // mx-auto for horizontal centering of control
                                style={{ maxWidth: '300px' }} // Optional: limit width for tighter look
                            />
                            {/* Helper text below input */}
                            <Form.Text className="text-muted">
                                Enter your registered username.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password:</Form.Label>
                           {/* InputGroup for password visibility toggle */}
                            <InputGroup className="mx-auto" style={{ maxWidth: '300px' }}>
                                <Form.Control
                                    type={passwordShown ? "text" : "password"} // Toggle type
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-white text-dark" // Removed mx-auto here as InputGroup handles centering
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={togglePasswordVisibility}
                                    className="text-white" // Keep button icon/text visible on dark background
                                >
                                    {/* Font Awesome Eye Icon - ensure Font Awesome is linked in index.html */}
                                    <i className={passwordShown ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                                    {/* Or use a simple text toggle if Font Awesome is not preferred: {passwordShown ? "Hide" : "Show"} */}
                                </Button>
                            </InputGroup>
                            <Form.Text className="text-muted">
                                Enter your password.
                            </Form.Text>
                        </Form.Group>

                        <Button type="submit" className="metallic-blue-button mt-3">Submit</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};
