import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <Card>
      <Row className="g-0">
        <Col md={4}>
          <Card.Img src={movie.imageURL} alt={movie.title} style={{ objectFit: 'cover', height: '300px' }} />
        </Col>
        <Col md={8}>
          <Card.Body>
            <Card.Title>{movie.title}</Card.Title>
            <Card.Text>
              <strong>Description:</strong> {movie.description}
            </Card.Text>
            <Card.Text>
              <strong>Director:</strong> {movie.director ? movie.director.name : 'N/A'}
            </Card.Text>
            <Card.Text>
              <strong>Genre:</strong> {movie.genre ? movie.genre.name : 'N/A'}
            </Card.Text>
            <Card.Text>
              <strong>Rating:</strong> {movie.rating || 'N/A'}
            </Card.Text>
            <Button variant="outline-secondary" onClick={onBackClick}>Back</Button>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

MovieView.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired,
      bio: PropTypes.string,
      birthYear: PropTypes.number,
    }).isRequired,
    imageURL: PropTypes.string,
    rating: PropTypes.string,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};