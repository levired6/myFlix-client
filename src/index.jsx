import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import "./index.scss";
import { MainView } from './components/main-view/main-view';
import { LoginView } from './components/login-view/login-view';
import { SignupView } from './components/signup-view/signup-view';
import { MovieView } from './components/movie-view/movie-view';
import { ProfileView } from './components/profile-view/profile-view';
import { NavigationBar } from './components/navigation-bar/navigation-bar';

const MyFlixApplication = () => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    
    const navigate = useNavigate();

    const handleLogin = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        // localStorage.setItem for user and token are already handled in LoginView before this callback.
        // Navigation is also handled by LoginView.
    };

    // New function to update user state from child components
    const handleUserUpdate = (updatedUserData) => {
        setUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData)); // Keep localStorage in sync
    };

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            <NavigationBar onLogout={handleLogout} user={user} />
            <Container className="my-flix">
                <Routes>
                    <Route path="/login" element={<LoginView onLoggedIn={handleLogin} />} />
                    <Route path="/signup" element={<SignupView />} />

                    {/* Conditional rendering based on `token` state from MyFlixApplication */}
                    <Route
                        path="/"
                        element={token ? (
                            <MainView
                                user={user}
                                token={token}
                                onUserUpdate={handleUserUpdate} // Pass onUserUpdate
                                onLoggedOut={handleLogout}     // Pass onLoggedOut
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )}
                    />
                    <Route
                        path="/movies/:movieId"
                        // Pass the handleUserUpdate function to MovieView
                        element={token ? (
                            <MovieView
                                user={user}
                                token={token}
                                onUserUpdate={handleUserUpdate}
                                onLoggedOut={handleLogout} // Also pass onLoggedOut to MovieView for consistency (e.g., if it has its own fetch that could trigger a 401)
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )}
                    />
                    <Route
                        path="/profile"
                        // Pass the handleUserUpdate function to ProfileView as well
                        element={token ? (
                            <ProfileView
                                user={user}
                                token={token}
                                onUserUpdate={handleUserUpdate}
                                onLoggedOut={handleLogout}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )}
                    />
                </Routes>
            </Container>
        </>
    );
};

const container = document.querySelector("#root");
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <MyFlixApplication />
    </BrowserRouter>
);