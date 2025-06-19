import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { MovieCard } from '../movie-card/movie-card';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://oscars2025-f0070acec0c4.herokuapp.com';

// Accept user, token, onUserUpdate, and onLoggedOut as props
export const ProfileView = ({ user, token, onUserUpdate, onLoggedOut }) => {
    // profileUser state is now strictly derived from the 'user' prop
    // This removes a potential layer of delayed updates.
    // However, we still use local state for form fields which can be edited.
    const [allMovies, setAllMovies] = useState([]); 
    const [favoriteMoviesDetails, setFavoriteMoviesDetails] = useState([]);

    // Form states for editing, initialized directly from 'user' prop
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(user?.email || '');
    const [birthday, setBirthday] = useState(user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ''); 
    const navigate = useNavigate();

    // Effect to keep form fields in sync with the 'user' prop (when user object changes)
    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setBirthday(user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '');
            // Do not reset password field here, it's for input only
        }
    }, [user]); // Depend on the 'user' prop from MyFlixApplication

    // Effect to fetch all movies
    useEffect(() => {
        if (!token) {
            console.log("ProfileView: Token not found, cannot fetch all movies. Redirecting to login.");
            onLoggedOut(); 
            return;
        }

        fetch(`${API_BASE_URL}/movies`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Unauthorized: Token expired or invalid during movie fetch in ProfileView.");
                    onLoggedOut();
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("ProfileView: All movies fetched successfully.");
            setAllMovies(data);
        })
        .catch((error) => console.error('Error fetching all movies in ProfileView:', error));
    }, [token, onLoggedOut]);

    // Effect to filter and prepare favorite movies details
    // This useEffect now directly uses the 'user' prop from the parent.
    useEffect(() => {
        console.log("ProfileView useEffect: Recalculating favorite movies details...");
        console.log("  Current 'user' prop:", user);
        console.log("  All Movies length:", allMovies.length);

        if (user && allMovies.length > 0 && user.favoriteMovies) {
            const favMoviesWithDetails = user.favoriteMovies
                .map(favEntry => {
                    // Defensive check for favEntry and favEntry.movieId
                    if (!favEntry || !favEntry.movieId) {
                        console.warn("Skipping malformed favorite entry:", favEntry);
                        return null;
                    }

                    // Normalize movieId to string for consistent comparison
                    // Handle both direct ID string and populated object IDs
                    const favMovieId = (favEntry.movieId._id && favEntry.movieId._id.toString()) || favEntry.movieId.toString(); 
                    
                    const movieData = allMovies.find(movie => 
                        (movie._id?.$oid || movie._id) === favMovieId
                    );

                    if (movieData) {
                        return { ...movieData, userComment: favEntry.comment || '' };
                    }
                    console.warn(`Movie data not found for favorite ID: ${favMovieId}`);
                    return null;
                })
                .filter(Boolean); // Remove any null entries

            console.log("ProfileView: Calculated favoriteMoviesDetails", favMoviesWithDetails);
            setFavoriteMoviesDetails(favMoviesWithDetails);
        } else {
            console.log("ProfileView: Clearing favoriteMoviesDetails (conditions not met or no favorites).");
            setFavoriteMoviesDetails([]);
        }
    }, [user, allMovies]); // IMPORTANT: Now directly depends on 'user' prop

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form fields to current user prop values
        setUsername(user.username);
        setEmail(user.email);
        setBirthday(user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '');
        setPassword('');
    };

    const handleUpdateUser = (event) => {
        event.preventDefault();

        if (!token || !user) {
          alert('User data or token missing. Please log in again.');
          onLoggedOut();
          return;
        }

       const updatedData = {
           username: username,
           email: email,
           birthday: birthday 
       };

       if (password) {
           updatedData.password = password;
       }
        
        fetch(`${API_BASE_URL}/users/${user.username}`, { // Use 'user.username' from prop
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(data => {
                    const errorMessage = data.errors ?
                                         data.errors.map(err => err.msg).join('\n') :
                                         data.message || `Update failed with status: ${response.status}`;
                    throw new Error(errorMessage);
                });
            }
            return response.json();
        })
        .then((updatedUser) => {
            // This is critical: Call onUserUpdate to update the parent state (MyFlixApplication)
            // which then re-propagates the new user object down to ProfileView.
            if (onUserUpdate) {
                onUserUpdate(updatedUser); 
            }
            setIsEditing(false);
            setPassword('');
            alert('Profile updated successfully!');
        })
        .catch((error) => {
            console.error('Error updating user:', error);
            alert(`Failed to update profile: ${error.message}`);
        });
    };

    const handleDeleteUser = () => {
        if (!token || !user) return; // Use 'user' prop directly

        if (window.confirm('Are you sure you want to deregister your account? This action cannot be undone.')) {
            fetch(`${API_BASE_URL}/users/${user.username}`, { // Use 'user.username' from prop
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                if (response.ok) {
                    alert('Your account has been successfully deregistered.');
                    if (onLoggedOut) {
                        onLoggedOut(); // Log out from the parent component
                    }
                } else {
                    return response.json().then(data => {
                        throw new Error(data.message || `Deregistration failed with status: ${response.status}`);
                    });
                }
            })
            .catch((error) => {
                console.error('Error deregistering user:', error);
                alert(`Failed to deregister account: ${error.message}`);
            });
        }
    };

    // Use 'user' prop directly for initial loading check
    if (!user) {
        return <Container>Loading profile data... If you're not logged in, please log in.</Container>;
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card>
                        <Card.Header>Your Profile</Card.Header>
                        <Card.Body>
                            {isEditing ? (
                                <Form onSubmit={handleUpdateUser}>
                                    <Form.Group className="mb-3" controlId="formUsername">
                                        <Form.Label>Username:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            minLength="3"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>New Password (optional):</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Form.Text className="text-muted">
                                            Leave blank to keep current password.
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBirthday">
                                        <Form.Label>Birthday:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={birthday}
                                            onChange={(e) => setBirthday(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="me-2">Save Changes</Button>
                                    <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                                </Form>
                            ) : (
                                <>
                                    <Card.Text><strong>Username:</strong> {user.username}</Card.Text> {/* Use 'user' prop */}
                                    <Card.Text><strong>Email:</strong> {user.email}</Card.Text> {/* Use 'user' prop */}
                                    <Card.Text><strong>Birthday:</strong> {user.birthday ? // Use 'user' prop
                                            new Date(user.birthday.split('T')[0] + 'T00:00:00').toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                timeZone: 'UTC' 
                                            })
                                            : 'N/A'
                                        }</Card.Text>
                                    <Button variant="primary" onClick={handleEditClick} className="me-2">Edit Profile</Button>
                                    <Button variant="danger" onClick={handleDeleteUser}>Deregister Account</Button>
                                </>
                            )}
                        </Card.Body>
                    </Card>

                    <h2 className="mt-4">Your Favorite Movies</h2>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {favoriteMoviesDetails.length === 0 ? (
                            <Col>No favorite movies added yet.</Col>
                        ) : (
                            favoriteMoviesDetails.map((movie) => (
                                <Col key={movie._id?.$oid || movie._id}>
                                    {/* Pass movie data (which now includes userComment) and user/token/onUserUpdate */}
                                    {/* Ensure MovieCard gets the LATEST 'user' prop */}
                                    <MovieCard movie={movie} user={user} token={token} onUserUpdate={onUserUpdate} />
                                    {/* Display the user's comment if it exists */}
                                    {movie.userComment && (
                                        <Card className="mt-2 text-center" style={{ backgroundColor: '#333', borderColor: '#444' }}>
                                            <Card.Body className="p-2">
                                                <small style={{ color: '#ccc' }}>Your Review:</small>
                                                <p className="mb-0" style={{ fontSize: '0.9rem' }}>{movie.userComment}</p>
                                            </Card.Body>
                                        </Card>
                                    )}
                                </Col>
                            ))
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

ProfileView.propTypes = {
    user: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    onUserUpdate: PropTypes.func.isRequired,
    onLoggedOut: PropTypes.func.isRequired,
};