import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export const MovieCard = ({ movie, onMovieClick }) => {
    return (
      <Card>
      <Card.Img variant="top" src={movie.imageURL} alt={movie.title} style={{ objectFit: 'cover', height: '200px' }} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>
          {movie.description && movie.description.substring(0, 100)}...
        </Card.Text>
        <Button variant="primary" onClick={() => onMovieClick(movie)}>Learn more</Button>
      </Card.Body>
    </Card>
  );
};

  MovieCard.propTypes = {
    movie: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      imageURL: PropTypes.string,
      // Add other properties as needed.
    }).isRequired,
    onMovieClick: PropTypes.func.isRequired,
  };