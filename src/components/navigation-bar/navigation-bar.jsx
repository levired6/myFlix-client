import React from 'react';
import { Link } from 'react-router-dom'; 
import { Navbar, Nav, Button } from 'react-bootstrap';

// Receive onLogout and user props
export const NavigationBar = ({ onLogout, user }) => { 
    const loggedInUser = user; 

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand as={Link} to="/" className="ms-3">myFlix</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {loggedInUser ? ( // Check if loggedInUser exists
                        <>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                            <Button variant="outline-info" onClick={onLogout}  className="ms-auto">Logout</Button>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};