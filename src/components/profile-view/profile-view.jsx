import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { MovieCard } from '../movie-card/movie-card';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://oscars2025-f0070acec0c4.herokuapp.com';

// Accept user, token, onUserUpdate, and onLoggedOut as props
export const ProfileView = ({ user, token, onUserUpdate, onLoggedOut }) => {
    // Renamed local state to profileUser to avoid confusion with the prop 'user'
    const [profileUser, setProfileUser] = useState(user);
    const [allMovies, setAllMovies] = useState([]); // Fetched all movies within ProfileView
    // favoriteMovies will now store objects that combine movie data and the user's comment
    const [favoriteMovies, setFavoriteMovies] = useState([]); 
    const [isEditing, setIsEditing] = useState(false);

    // Initialize form fields directly from the 'user' prop
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(user?.email || '');
    // Convert birthday to YYYY-MM-DD format for date input
    const [birthday, setBirthday] = useState(user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ''); 
    const navigate = useNavigate();

    // Effect to set initial form values and *re-sync* if 'user' prop changes
    useEffect(() => {
        if (user) {
            setProfileUser(user);
            setUsername(user.username);
            setEmail(user.email);
            setBirthday(user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '');
        }
    }, [user]); // Depend on the 'user' prop from MyFlixApplication

    // Effect to fetch all movies (This part is mostly correct, just for context)
    useEffect(() => {
        if (!token) {
            console.log("ProfileView: Token not found, cannot fetch all movies. Redirecting to login.");
            navigate('/login'); // Redirect if no token
            return;
        }
        fetch(`${API_BASE_URL}/movies`, { // Use API_BASE_URL variable
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Unauthorized: Token expired or invalid during movie fetch in ProfileView.");
                    onLoggedOut(); // Use the prop to log out
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setAllMovies(data);
        })
        .catch((error) => console.error('Error fetching all movies in ProfileView:', error));
    }, [token, navigate, onLoggedOut]); // Added onLoggedOut to dependency array

    // Effect to filter favorite movies and attach comments (depends on profileUser and allMovies state)
    // IMPORTANT: This now maps over profileUser.favoriteMovies (which includes comments)
    // and finds the full movie object from allMovies, then combines them.
    useEffect(() => {
        if (profileUser && allMovies.length > 0 && profileUser.favoriteMovies) {
            const favMoviesWithComments = profileUser.favoriteMovies
                .map(favEntry => {
                    const movieId = favEntry.movieId?.$oid || favEntry.movieId; // Handle both direct ID and $oid
                    const movieData = allMovies.find(movie => 
                        (movie._id?.$oid || movie._id) === movieId
                    );
                    if (movieData) {
                        // Return a new object that combines movie data with the user's comment
                        return { ...movieData, userComment: favEntry.comment };
                    }
                    return null; // Handle case where movie data isn't found in allMovies (e.g., deleted movie)
                })
                .filter(Boolean); // Remove any null entries from the map

            setFavoriteMovies(favMoviesWithComments);
        } else {
            setFavoriteMovies([]);
        }
    }, [profileUser, allMovies]); // Re-run when profileUser or allMovies change


    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form fields to current profileUser state values
        setUsername(profileUser.username);
        setEmail(profileUser.email);
        setBirthday(profileUser.birthday ? new Date(profileUser.birthday).toISOString().split('T')[0] : '');
        setPassword('');
    };

    const handleUpdateUser = (event) => {
        event.preventDefault();

        if (!token || !profileUser) {
          alert('User data or token missing. Please log in again.');
          onLoggedOut(); // Attempt to log out if essential data is missing
          return;
        }

       // Always include username, email, and birthday, as they are either required
       // or part of the standard profile data. Password is optional.
       const updatedData = {
           username: username,
           email: email,
           birthday: birthday // This will be an empty string if not set, which is fine for optional.
       };

       // Only include password if it's not empty, as backend allows it to be optional.
       if (password) {
           updatedData.password = password;
       }
        
        fetch(`${API_BASE_URL}/users/${profileUser.username}`, { // Use API_BASE_URL
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Unauthorized: Token expired or invalid during profile update.");
                    onLoggedOut();
                    return;
                }
                 // Parse JSON error response from backend for 400/422 status codes
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
            setProfileUser(updatedUser);// Update local state
            if (onUserUpdate) {
                onUserUpdate(updatedUser);// Update parent state (MyFlixApplication)
            }
            setIsEditing(false);
            setPassword('');// Clear password field after successful update
            alert('Profile updated successfully!');
             // If username changed, consider navigating to the new profile URL to reflect the change
            // This is robust, but for a simple profile update, it might not be strictly necessary if the parent handles user state.
            // if (updatedData.username && updatedData.username !== profileUser.username) {
            //     navigate(`/users/${updatedData.username}`); // Navigate to new username's profile
            // }
        })
        .catch((error) => {
            console.error('Error updating user:', error);
            alert(`Failed to update profile: ${error.message}`);
        });
    };

    const handleDeleteUser = () => {
        if (!token || !profileUser) return;

        if (window.confirm('Are you sure you want to deregister your account? This action cannot be undone.')) {
            fetch(`${API_BASE_URL}/users/${profileUser.username}`, { // Use API_BASE_URL
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                if (response.ok) {
                    alert('Your account has been successfully deregistered.');
                    if (onLoggedOut) {
                        onLoggedOut();
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

    // Render a loading state if 'user' prop is null initially
    if (!user) {
        return <Container>Loading profile data... If you're not logged in, please log in.</Container>;
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={8}> {/* Increased column size for better layout */}
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
                                            // minLength="8" // Consider adding password length validation
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
                                            // required // Birthday might not be strictly required.
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="me-2">Save Changes</Button>
                                    <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                                </Form>
                            ) : (
                                <>
                                    <Card.Text><strong>Username:</strong> {profileUser.username}</Card.Text>
                                    <Card.Text><strong>Email:</strong> {profileUser.email}</Card.Text>
                                    <Card.Text><strong>Birthday:</strong> {profileUser.birthday ?
                                            new Date(profileUser.birthday.split('T')[0] + 'T00:00:00').toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                timeZone: 'UTC' // Crucially, tell it to format as if it's UTC
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
                        {favoriteMovies.length === 0 ? (
                            <Col>No favorite movies added yet.</Col>
                        ) : (
                            favoriteMovies.map((movie) => (
                                <Col key={movie._id?.$oid || movie._id}>
                                    {/* Pass user, token, and onUserUpdate to MovieCard for favorite toggling within profile */}
                                    <MovieCard movie={movie} user={profileUser} token={token} onUserUpdate={onUserUpdate} />
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