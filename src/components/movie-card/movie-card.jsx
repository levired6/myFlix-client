import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom'; // Import Link

export const MovieCard = ({ movie }) => {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={movie.imageURL} alt={movie.title} style={{ objectFit: 'cover', height: '200px' }} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>
          {movie.description && movie.description.substring(0, 100)}...
        </Card.Text>
        <Link to={`/movies/${movie._id.$oid || movie._id}`} className="btn btn-primary">Learn more</Link>
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
};