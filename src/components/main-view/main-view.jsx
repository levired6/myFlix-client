import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { Row, Col, Container, Button } from "react-bootstrap"; // Import Bootstrap components

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showSignup, setShowSignup] = useState(false); // State to control which auth view is shown

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setShowSignup(false); // Reset to login view on logout
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("https://oscars2025-f0070acec0c4.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, [token]);

  if (!user) {
    return (
      <Container className="mt-5 bg-dark text-white p-4 rounded">
        <Row className="justify-content-md-center">
          <Col md={6}>
            {!showSignup ? (
              <LoginView
                onLoggedIn={(user, newToken) => {
                  setUser(user);
                  setToken(newToken);
                }}
              />
            ) : (
              <SignupView />
            )}
            <p className="mt-3 text-center">
              {!showSignup ? (
                <>
                  Not a user? <Button variant="link" onClick={() => setShowSignup(true)}>Sign up</Button>
                </>
              ) : (
                <>
                  Already a user? <Button variant="link" onClick={() => setShowSignup(false)}>Log in</Button>
                </>
              )}
            </p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (selectedMovie) {
    return (
      <Container className="mt-5">
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <Button variant="outline-secondary" onClick={handleLogout} className="mb-3">Logout</Button>
            <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
          </Col>
        </Row>
      </Container>
    );
  }

  if (movies.length === 0) {
    return (
      <Container className="mt-5">
        <Row>
          <Col md={{ span: 6, offset: 3 }} className="text-center">
            <Button variant="outline-secondary" onClick={handleLogout} className="mb-3">Logout</Button>
            <div>Loading movies...</div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" onClick={handleLogout} className="mb-3">Logout</Button>
      <Row xs={1} md={3} lg={4} className="g-4">
        {movies.map((movie, index) => {
          const keyProp = movie._id?.$oid || index.toString();
          return (
            <Col key={keyProp}>
              <MovieCard
                movie={movie}
                onMovieClick={setSelectedMovie}
              />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

MainView.propTypes = {};