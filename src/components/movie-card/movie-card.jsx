import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://oscars2025-f0070acec0c4.herokuapp.com';

export const MovieCard = ({ movie, user, token, onUserUpdate }) => {
    // Determine if the movie is currently a favorite for the logged-in user
    const [isFavorite, setIsFavorite] = useState(
        user && user.favoriteMovies && movie && movie._id ?
        user.favoriteMovies.some(fav => fav.movieId === (movie._id?.$oid || movie._id)) :
        false
    );

    // State to hold the comment for this movie
    const [commentText, setCommentText] = useState('');

    // Effect to set the initial comment text if the movie is already a favorite
    useEffect(() => {
        if (user && user.favoriteMovies && movie && movie._id) {
            const favoriteEntry = user.favoriteMovies.find(fav => fav.movieId === (movie._id?.$oid || movie._id));
            if (favoriteEntry) {
                setCommentText(favoriteEntry.comment || ''); // Set existing comment or empty string
                setIsFavorite(true);
            } else {
                setIsFavorite(false);
                setCommentText(''); // Clear comment if not a favorite
            }
        }
    }, [user, movie]); // Re-run when user or movie props change

    // Handler for adding/removing a movie from favorites
    const handleToggleFavorite = () => {
        if (!token || !user || !movie || !movie._id) {
            console.error("Missing token, user, or movie data for favorite action.");
            return;
        }

        const movieId = movie._id?.$oid || movie._id;
        const username = user.username;
        const method = isFavorite ? 'DELETE' : 'POST';
        const url = `${API_BASE_URL}/users/${username}/movies/${movieId}`;

        // Prepare request body for POST (add favorite)
        const requestBody = method === 'POST' ? JSON.stringify({ comment: commentText }) : undefined;

        fetch(url, {
            method: method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' // Important for sending JSON body
            },
            body: requestBody // Only include body for POST requests
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
                // Update local storage and parent component's user state
                localStorage.setItem('user', JSON.stringify(updatedUser));
                if (onUserUpdate) {
                    onUserUpdate(updatedUser);
                }
                // Update favorite status and comment text based on response
                setIsFavorite(!isFavorite); // Toggle favorite status
                
                // If it was added, ensure comment is set from input; if removed, clear it.
                if (!isFavorite) { // If it was just added
                    const newFavEntry = updatedUser.favoriteMovies.find(fav => fav.movieId === movieId);
                    setCommentText(newFavEntry ? newFavEntry.comment : '');
                    alert(`Movie "${movie.title}" added to favorites with your comment!`);
                } else { // If it was just removed
                    setCommentText(''); // Clear comment field
                    alert(`Movie "${movie.title}" removed from favorites!`);
                }
            })
            .catch((error) => {
                console.error('Error updating favorites:', error);
                alert(`Failed to update favorites: ${error.message}`);
            });
    };

    return (
        <Card className="h-100 movie-card">
            <Link to={`/movies/${movie._id?.$oid || movie._id}`}>
                <Card.Img
                    variant="top"
                    src={`${API_BASE_URL}/${movie.imageURL}`}
                    alt={movie.title}
                    // Styling for movie card image to fit properly
                    style={{ height: '300px', objectFit: 'cover', width: '100%' }}
                />
            </Link>
            <Card.Body className="d-flex flex-column">
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text className="flex-grow-1">{movie.director.name}</Card.Text>

                {/* Comment Input and Favorite Button */}
                <div className="mt-auto">
                    {/* Conditional rendering for comment input field */}
                    {!isFavorite && ( // Show input only when NOT a favorite (i.e., when user is about to add)
                        <Form.Group className="mb-2">
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Add your personal review (optional)"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                style={{ fontSize: '0.85rem' }}
                            />
                        </Form.Group>
                    )}
                    
                    {/* Favorite toggle button */}
                    <Button
                        variant={isFavorite ? 'danger' : 'outline-danger'}
                        onClick={handleToggleFavorite}
                        className="favorite-toggle-button w-100" // Ensure button takes full width
                    >
                        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        imageURL: PropTypes.string.isRequired,
        director: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
        genre: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
        rating: PropTypes.string,
    }).isRequired,
    user: PropTypes.object,
    token: PropTypes.string,
    onUserUpdate: PropTypes.func.isRequired,
};