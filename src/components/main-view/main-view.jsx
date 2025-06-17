import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { Link, useNavigate } from "react-router-dom"; 
import { Row, Col, Container, Form, Navbar, Nav, Button } from "react-bootstrap";
import PropTypes from 'prop-types'; // Import PropTypes

// Accept user, token, onUserUpdate, and onLoggedOut as props
export const MainView = ({ token, user, onUserUpdate, onLoggedOut }) => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) { 
            console.log("MainView: Token not found, redirecting to login.");
            navigate('/login');
            return;
        }
        //Fetch movies only if token exists
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

    // Filter movies based on search term
    const filteredMovies = movies.filter((movie) => {
        // Convert search term to lowercase for case-insensitive comparison
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // Check if title includes search term
        const matchesTitle = movie.title.toLowerCase().includes(lowerCaseSearchTerm);

        // Check if genre name includes search term (if genre exists)
        const matchesGenre = movie.genre && movie.genre.name.toLowerCase().includes(lowerCaseSearchTerm);

        // Check if director name includes search term (if director exists)
        const matchesDirector = movie.director && movie.director.name.toLowerCase().includes(lowerCaseSearchTerm);

        // Return true if any of the conditions are met
        return matchesTitle || matchesGenre || matchesDirector;
    });

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
            {/* Search Input Field with label and helper text*/}
            <Row className="mb-4 justify-content-center"> {/* Added justify-content-center for horizontal centering */}
                <Col xs={12} md={8} lg={6}> {/* Adjusted column size for better responsiveness */}
                     <Form.Group controlId="movieSearch">
                        <Form.Label className="text-white">Search:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by title, genre, or director..."
                            className="search-input bg-white text-dark rounded-pill shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            You can look up movies by title, genre, or director name.
                        </Form.Text>
                    </Form.Group>
                </Col>
            </Row>

            {filteredMovies.length === 0 && searchTerm !== "" ? (
                <Row className="justify-content-center mt-5">
                    <Col xs={12} className="text-center text-white">
                        No movies found matching your search.
                    </Col>
                </Row>
            ) : (
                <Row xs={1} md={3} lg={4} className="g-4">
                    {filteredMovies.map((movie, index) => {
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
            )}
        </Container>
    );
};

MainView.propTypes = {
    token: PropTypes.string,
    user: PropTypes.object,
    onUserUpdate: PropTypes.func.isRequired,
    onLoggedOut: PropTypes.func.isRequired,
};
