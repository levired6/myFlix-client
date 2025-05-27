import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { Link, useNavigate } from "react-router-dom"; 
import { Row, Col, Container } from "react-bootstrap";
import PropTypes from 'prop-types'; // Import PropTypes

// Accept user, token, onUserUpdate, and onLoggedOut as props
export const MainView = ({ token, user, onUserUpdate, onLoggedOut }) => {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) { 
            console.log("MainView: Token not found, redirecting to login.");
            navigate('/login');
            return;
        }

        fetch("https://oscars2025-f0070acec0c4.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` }, 
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) { // Handle unauthorized specifically
                        console.error("Unauthorized: Token expired or invalid during movie fetch in MainView.");
                        onLoggedOut(); // Use the prop to log out
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setMovies(data);
            })
            .catch((error) => {
                console.error("Error fetching movies in MainView:", error);
            });
    }, [token, navigate, onLoggedOut]); // Depend on token prop, navigate, and onLoggedOut

    if (movies.length === 0) {
        return (
            <Container className="mt-5">
                <Row>
                    <Col md={{ span: 6, offset: 3 }} className="text-center">
                        <div>Loading movies...</div>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row xs={1} md={3} lg={4} className="g-4">
                {movies.map((movie, index) => {
                    const keyProp = movie._id?.$oid || movie._id || index.toString();
                    return (
                        <Col key={keyProp}>
                            <MovieCard
                                movie={movie}
                                user={user}
                                token={token}
                                onUserUpdate={onUserUpdate} 
                            />
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
};

MainView.propTypes = {
    token: PropTypes.string, // Can be null initially if not logged in
    user: PropTypes.object, // Can be null initially if not logged in
    onUserUpdate: PropTypes.func.isRequired, // Now required as it's passed down
    onLoggedOut: PropTypes.func.isRequired, // Now required as it handles auth issues
};