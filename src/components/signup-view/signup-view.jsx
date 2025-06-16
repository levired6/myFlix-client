import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

export const SignupView = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState(""); 
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const userData = {
            username: username,
            password: password, 
            email: email,      
            birthday: birthday, 
        };

        fetch('https://oscars2025-f0070acec0c4.herokuapp.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.errors ? JSON.stringify(data.errors) : `Signup failed with status: ${response.status}`);
                    });
                }
            })
            .then((data) => {
                console.log('Signup successful:', data);
                alert('Signup successful! You can now log in.');
                navigate('/login');
            })
            .catch((error) => {
                console.error('Signup error:', error);
                alert(`Signup failed: ${error.message}`);
            });
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}> {/* Responsive column sizing */}
                    <h2 className="text-center mb-4">Signup</h2> {/* Centered title */}
                    <Form onSubmit={handleSubmit} className="text-center"> 
                        <Form.Group className="mb-3" controlId="signUpFormUsername">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                minLength="5" // Added minlength validation
                                className="bg-white text-dark mx-auto"
                                style={{ maxWidth: '300px' }}
                            />
                            <Form.Text className="text-muted">
                                Must be 5 or more characters.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="signUpFormPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white text-dark mx-auto"
                                style={{ maxWidth: '300px' }}
                            />
                            <Form.Text className="text-muted">
                                Must be 5 or more characters, including uppercase, lowercase, numbers, and special characters (!@#$%^&*-=_+).
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="signUpFormEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white text-dark mx-auto"
                                style={{ maxWidth: '300px' }}
                            />
                            <Form.Text className="text-muted">
                                Enter a valid email address.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="signUpFormBirthday">
                            <Form.Label>Birthday:</Form.Label>
                            <Form.Control
                                type="date"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                required
                                className="bg-white text-dark mx-auto"
                                style={{ maxWidth: '300px' }}
                            />
                            <Form.Text className="text-muted">
                                Optional: Your date of birth (MM/DD/YYYY).
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="metallic-blue-button mt-3">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};