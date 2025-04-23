export const MovieView = ({ movies, onBackClick }) => {
    return (
      <div>
        <div>
          <img src={movies.imageURL} />
        </div>
        <div>
          <span>Title: </span>
          <span>{movies.title}</span>
        </div>
        <div>
          <span>director: </span>
          <span>{movies.director.name}</span>
        </div>
        <button onClick={onBackClick}>Back</button>
      </div>
    );
  };