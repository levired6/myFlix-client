export const MovieView = ({ movie, onBackClick }) => {
    return (
      <div>
        <div>
          <img src={movie.imageURL} alt={movie.title} /> {/*Add alt attribute */}
        </div>
        <div>
          <span>Title: </span>
          <span>{movie.title}</span>
        </div>
        <div>
          <span>Director: </span>
          <span>{movie.director.name}</span>
        </div>
        <div>
            <span>Genre: </span>
            <span>{movie.genre.name}</span>
        </div>
        <div>
            <span>Description: </span>
            <span>{movie.description}</span>
        </div>
        <div>
            <span>Rating: </span>
            <span>{movie.rating}</span>
        </div>
        <button onClick={onBackClick}>Back</button>
      </div>
    );
  };