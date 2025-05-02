import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

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
      <div>
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
        {!showSignup ? (
          <p>
            Not a user? <button onClick={() => setShowSignup(true)}>Sign up</button>
          </p>
        ) : (
          <p>
            Already a user? <button onClick={() => setShowSignup(false)}>Log in</button>
          </p>
        )}
      </div>
    );
  }

  if (selectedMovie) {
    return (
      <div>
        <button onClick={handleLogout}>Logout</button>
        <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div>
        <button onClick={handleLogout}>Logout</button>
        <div>Loading movies...</div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      {movies.map((movie, index) => {
        const keyProp = movie._id?.$oid || index.toString();
        return (
          <MovieCard
            key={keyProp}
            movie={movie}
            onMovieClick={setSelectedMovie}
          />
        );
      })}
    </div>
  );
};

MainView.propTypes = {};