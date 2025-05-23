import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export const MovieCard = ({ movie, user, token, onUserUpdate }) => {
    // Initialize isFavorite safely.
    // FIX 1: Change user.FavoriteMovies to user.favoriteMovies (lowercase 'f')
    const [isFavorite, setIsFavorite] = useState(
        user && user.favoriteMovies && Array.isArray(user.favoriteMovies) &&
        user.favoriteMovies.includes(movie._id.$oid || movie._id)
    );

    // Update isFavorite whenever the 'user' prop or 'movie._id' changes
    useEffect(() => {
        // FIX 2: Change user.FavoriteMovies to user.favoriteMovies (lowercase 'f')
        if (user && user.favoriteMovies && Array.isArray(user.favoriteMovies)) {
            setIsFavorite(user.favoriteMovies.includes(movie._id.$oid || movie._id));
        } else {
            setIsFavorite(false);
        }
    }, [user, movie._id]);

    const handleFavoriteClick = (event) => {
        event.stopPropagation();

        if (!token || !user) {
            alert("You must be logged in to favorite movies!");
            return;
        }

        const method = isFavorite ? 'DELETE' : 'POST';
        // FIX 3: Change user.Username to user.username (lowercase 'u')
        const url = `https://oscars2025-f0070acec0c4.herokuapp.com/users/${user.username}/movies/${movie._id.$oid || movie._id}`; // FIX: Changed `favorites` to `movies` in URL

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
            if (onUserUpdate) {
                onUserUpdate(updatedUser);
            }
            alert(`Movie ${isFavorite ? 'removed from' : 'added to'} favorites!`);
        })
        .catch((error) => {
            console.error('Error updating favorites:', error);
            alert(`Failed to update favorites: ${error.message}`);
        });
    };

    return (
        <Card className="h-100">
            <Card.Img variant="top" src={movie.imageURL} alt={movie.title} style={{ objectFit: 'cover', height: '200px' }} />
            <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>
                    {movie.description && movie.description.substring(0, 100)}...
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                    {/* Link to movie details - no casing issues here as _id is from API response */}
                    <Link to={`/movies/${movie._id.$oid || movie._id}`} className="btn btn-primary">Learn more</Link>
                    {user && token ? (
                        <Button
                            variant={isFavorite ? 'danger' : 'outline-danger'}
                            onClick={handleFavoriteClick}
                            size="sm"
                        >
                            {isFavorite ? 'Remove' : 'Favorite'}
                        </Button>
                    ) : (
                        <Button variant="outline-secondary" size="sm" disabled>Login to Favorite</Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        imageURL: PropTypes.string,
    }).isRequired,
    user: PropTypes.object,
    token: PropTypes.string,
    onUserUpdate: PropTypes.func.isRequired,
};