import { useState, useEffect } from "react";
import PropTypes from 'prop-types'; // Import PropTypes
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setmovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetch("https://oscars2025-f0070acec0c4.herokuapp.com/movies")
      .then(response => {
        if (response.ok) {// Logic error: response.ok is true for successful responses
          throw new Error("HTTP error! status: ${response.status}");
        }
        return response.json();
      })
      .then(data => {
        setMovies(data);
      })
      .catch(error => {
        console.error("Error fetching movies:", error);
      });
    }, []);// Empty dependency array means this effect runs once after the initial render

  if (selectedMovie) {
    return (
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (movies.length === 0) {
    return <div>Loading movies...</div>;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie._id.$oid}
          movie={movie}
          onMovieClick={setSelectedMovie}
          />        
      ))}
    </div>
  );
};

MainView.propTypes = {};