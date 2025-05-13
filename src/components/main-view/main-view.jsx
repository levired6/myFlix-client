import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Container, Button } from "react-bootstrap"; // Import Bootstrap components

export const MainView = () => {
  const storedToken = localStorage.getItem("token");
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!storedToken) {
      navigate('/login'); //redirect to login if no token
      return;
    }

    fetch("https://oscars2025-f0070acec0c4.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${storedToken}` },
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
  }, [storedToken, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate('/login');
  };

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
              />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}; 

MainView.propTypes = {};