import React, { useState, useEffect } from 'react'; // CORRECTED: Changed '=>' to 'from'
import PropTypes from 'prop-types';
import { Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://oscars2025-f0070acec0c4.herokuapp.com';

export const MovieCard = ({ movie, user, token, onUserUpdate }) => {
    // Determine if the movie is currently a favorite for the logged-in user
    // Initialize based on the user prop's favoriteMovies structure
    const [isFavorite, setIsFavorite] = useState(false);
    const [commentText, setCommentText] = useState('');

    // Effect to synchronize isFavorite and commentText with the 'user' prop
    useEffect(() => {
        if (user && user.favoriteMovies && movie && movie._id) {
            const movieId = movie._id?.$oid || movie._id;
            const favoriteEntry = user.favoriteMovies.find(fav => 
                fav.movieId && ((fav.movieId._id && fav.movieId._id.toString()) === movieId || fav.movieId === movieId)
            );

            if (favoriteEntry) {
                setIsFavorite(true);
                setCommentText(favoriteEntry.comment || ''); 
            } else {
                setIsFavorite(false);
                setCommentText(''); 
            }
        } else {
            setIsFavorite(false);
            setCommentText('');
        }
    }, [user, movie]); // Re-run when user or movie props change

    const handleToggleFavorite = () => {
        if (!token || !user || !movie || !movie._id) {
            console.error("Missing token, user, or movie data for favorite action.");
            alert("Please log in to add/remove favorites."); // User-friendly alert
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
                'Content-Type': 'application/json' 
            },
            body: requestBody 
        })
            .then((response) => {
                // IMPORTANT: Check response.ok BEFORE trying to parse JSON
                if (!response.ok) {
                    // Try to parse JSON error message, but handle if it's not JSON
                    return response.text().then(text => { // Use .text() to read raw response
                        try {
                            const errorData = JSON.parse(text);
                            throw new Error(errorData.message || `API Error: ${response.status}`);
                        } catch (e) {
                            // If parsing fails, use the raw text or a generic message
                            throw new Error(`Non-JSON API Error: ${text || response.statusText || response.status}`);
                        }
                    });
                }
                return response.json(); // Only parse as JSON if response.ok is true
            })
            .then((updatedUser) => {
                // Update local storage and parent component's user state
                localStorage.setItem('user', JSON.stringify(updatedUser));
                if (onUserUpdate) {
                    onUserUpdate(updatedUser); // This is crucial for ProfileView to re-render
                }

                // Update local state based on the action performed
                if (method === 'POST') {
                    setIsFavorite(true);
                    // Find the newly added favorite entry in the updatedUser object
                    const newFavEntry = updatedUser.favoriteMovies.find(fav => 
                        fav.movieId && ((fav.movieId._id && fav.movieId._id.toString()) === movieId || fav.movieId === movieId)
                    );
                    setCommentText(newFavEntry ? newFavEntry.comment : '');
                    alert(`Movie "${movie.title}" added to favorites with your comment!`);
                } else { // method === 'DELETE'
                    setIsFavorite(false);
                    setCommentText(''); // Clear comment field when removed
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
                    style={{ height: '300px', objectFit: 'cover', width: '100%' }}
                />
            </Link>
            <Card.Body className="d-flex flex-column">
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text className="flex-grow-1">{movie.director.name}</Card.Text>

                <div className="mt-auto">
                    {/* Conditional rendering for comment input field */}
                    {/* Show input if NOT a favorite, or if it IS a favorite AND has a comment (for editing existing comments later if desired) */}
                    {(!isFavorite || (isFavorite && commentText)) && (
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
                        className="favorite-toggle-button w-100"
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