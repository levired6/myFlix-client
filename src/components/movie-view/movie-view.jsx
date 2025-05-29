import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link, useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://oscars2025-f0070acec0c4.herokuapp.com';

// Accept user, token, AND onUserUpdate as props
export const MovieView = ({ user, token, onUserUpdate }) => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

    // Effect to fetch movie details when movieId or token changes
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (!movieId) {
            console.error("Movie ID is missing in URL parameters.");
            return;
        }

        fetch(`${API_BASE_URL}/movies/${movieId}`, { // Using API_BASE_URL for movie fetch
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Unauthorized: Token expired or invalid.");
                    navigate('/login');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setMovie(data);
            // After fetching movie, check if it's a favorite
            if (user && user.favoriteMovies && data) {
                setIsFavorite(user.favoriteMovies.includes(data._id?.$oid || data._id));
            }
        })
        .catch((error) => {
            console.error("Error fetching movie details:", error);
        });
    }, [movieId, token, user, navigate]); // Depend on movieId, token, user, and navigate

    // Handler for adding/removing a movie from favorites
    const handleToggleFavorite = () => {
        if (!token || !user || !movie) {
            console.error("Missing token, user, or movie data for favorite action.");
            return;
        }

        const method = isFavorite ? 'DELETE' : 'POST';
        const url = `https://oscars2025-f0070acec0c4.herokuapp.com/users/${user.Username}/favorites/${movie._id?.$oid || movie._id}`;

        fetch(url, {
            method: method,
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || `Failed to update favorites with status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then((updatedUser) => {
            
            // Instead of just localStorage.setItem, also call the prop to update parent state
            localStorage.setItem('user', JSON.stringify(updatedUser));
            if (onUserUpdate) { // Only call if the prop is provided
                onUserUpdate(updatedUser);
            }
            setIsFavorite(!isFavorite);
            alert(`Movie ${isFavorite ? 'removed from' : 'added to'} favorites!`);
        })
        .catch((error) => {
            console.error('Error updating favorites:', error);
            alert(`Failed to update favorites: ${error.message}`);
        });
    };

    if (!movie) {
        return <p>Loading movie details...</p>;
    }

    return (
        <Card className="mt-4">
            <Row className="g-0">
                <Col md={4}>
                    <Card.Img
                        src={`${API_BASE_URL}/${movie.imageURL}`} // Construct the full URL for the image
                        alt={movie.title}
                        style={{ objectFit: 'cover', height: '300px' }}
                    />
                </Col>
                <Col md={8}>
                    <Card.Body>
                        <Card.Title>{movie.title}</Card.Title>
                        <Card.Text>
                            <strong>Description:</strong> {movie.description}
                        </Card.Text>
                        <Card.Text>
                            <strong>Director:</strong> {movie.director ? movie.director.name : 'N/A'}
                        </Card.Text>
                        <Card.Text>
                            <strong>Genre:</strong> {movie.genre ? movie.genre.name : 'N/A'}
                        </Card.Text>
                        <Card.Text>
                            <strong>Rating:</strong> {movie.rating || 'N/A'}
                        </Card.Text>
                        <Link to="/" className="btn btn-outline-secondary me-2">Back</Link>
                        <Button
                            variant={isFavorite ? 'danger' : 'outline-danger'}
                            onClick={handleToggleFavorite}
                        >
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </Button>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
};

MovieView.propTypes = {
    user: PropTypes.object,
    token: PropTypes.string,
    onUserUpdate: PropTypes.func,
};