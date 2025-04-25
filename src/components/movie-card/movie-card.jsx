import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

export const MovieCard = ({ movie, onMovieClick }) => {
    return (
      <div
        onClick={() => 
          onMovieClick(movie)}>
            {movie.title}
            </div>
    );
  };

  MovieCard.propTypes = {
    movie: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      // Add other expected properties based on your API response
    }).isRequired,
    onMovieClick: PropTypes.func.isRequired,
  };