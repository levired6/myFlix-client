import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setmovies] = useState([
    {
        "_id":{"$oid":"67ca024f071a5bbf98fa421a"},
        "title":"Im Still Here",
        "description":"A mother is forced to reinvent herself when her family's life is shattered by an act of arbitrary violence during the tightening grip of a military dictatorship in Brazil, 1971.",
        "genre":{"name":"History, Drama",
        "description":"History a focus on a real-life event of historical significance. Drama should contain numerous consecutive scenes of characters portrayed to effect a serious narrative throughout the title, usually involving conflicts and emotions."},
        "director":{"name":"Jacques Audiard","bio":"Walter was born in Rio de Janero, Brazil in 1956.","birthYear":"1956"},
        "imageURL":"images/I'm Still Here.jpg",
        "featured":true,
        "releaseYear":{"$numberInt":"2024"},
        "rating":"PG-13"
    },
    {
        "_id":{"$oid":"67c9f2b6071a5bbf98fa4216"},
        "title":"A Complete Unknown",
        "description":"Set in the influental New York City music scene of the early 1960s, A Complete Unknown follows 19-year-old musician Bob Dylan's meteoric rise as a folk singer to concert halls and the top of the charts as his songs and his mystique become a worldwide sensation that culminates in his groundbreaking electric rock-and-roll performance at the Newport Folk Festival in 1965.",
        "genre":{"name":"Biography,Drama,Music",
        "description":"Biography primary focus in on the depiction of activities and personality of a real person, Music contains music elements without being a musical, Drama should contain numerous consecutive scenes of characters portrayed to effect a serious narrative throughout the title, usually involving conflicts and emotions."},
        "director":{"name":"James Mangold","bio":"James is an American film and television director, screenwriter and producer.","birthYear":"1963"},
        "imageURL":"images/A Complete Unknown.jpg",
        "featured":true,
        "releaseYear":{"$numberInt":"2024"},
        "rating":"R"   
    },
    {
        "_id":{"$oid":"67c9fb13071a5bbf98fa4218"},
        "title":"Dune Part 2",
        "description":"Paul Atreides unites with the Fremen while on a warpath of revenge aagainst the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.",
        "genre":{"name":"Action, Sci-Fi, Drama",
        "description":"Action contains numerous scenes where action is spectacular and usually destructive. Sci-Fi numerous scenes and background for the setting of the narrative based on speculative scientific discoveries or developments, environmental changes, space travel, or life on other planets. Drama should contain numerous consecutive scenes of characters portrayed to effect a serious narrative throughout the title, usually involving conflicts and emotions."},
        "director":{"name":"Denis Villeneuve","bio":"Denis is the Director of both films Dune Part One, and Dune Part Two. The French Canadian film Director and writer was born in Trois Rivieres, Quebec, Canada in 1967 and started his career as a filmmaker at the National Film Board of Canada.","birthYear":"1967"},
        "imageURL":"images/Dune2.jpg",
        "featured":true,
        "releaseYear":{"$numberInt":"2024"},
        "rating":"PG-13"    },
    {
        "_id":{"$oid":"67ca0589071a5bbf98fa421b"},
        "title":"Nickel Boys",
        "description":"Based on the Pulitzer Prize-winning novel by Colson Whitehead, Nickel Boys chronicles the powerful friendship between two young African-American men navigating the harrowing trials of reform school together in Florida.",
        "genre":{"name":"Drama",
        "description":"Drama should contain numerous consecutive scenes of characters portrayed to effect a serious narrative throughout the title, usually involving conflicts and emotions."},
        "director":{"name":"RaMell Ross","bio":"RaMell was born in Frankfurt Germany in 1982.He attended Georgetown University and Rhode Island School of Design and got his start as a photographer then professor ultimatly becoming a film Director.","birthYear":"1982"},
        "imageURL":"images/Nickel Boys.jpg",
        "featured":true,
        "releaseYear":{"$numberInt":"2024"},
        "rating":"PG-13"
    },
    {
        "_id":{"$oid":"67c9f269071a5bbf98fa4214"},
        "title":"Anora",
        "description":"A young escort from Brooklyn meets and impulsively marries the son of a Russian oligarch. Once the news reaches Russia, her fairytale is threatened as his parents set out for New York to get the marriage annulled.",
        "genre":{"name":"Drama",
        "description":"Drama should contain numerous consecutive scenes of characters portrayed to effect a serious narrative throughout the title, usually involving conflicts and emotions. This can be exaggerated upon to produce melodrama."},
        "director":{"name":"Sean Baker","bio":"Sean is a graduate of NYU Tisch School of the Arts. He is an award winning writer, director, producer","birthYear":"1971"},
        "imageURL":"images/Anora.jpg",
        "featured":true,
        "releaseYear":{"$numberInt":"2024"},
        "rating":"R"
    }
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return (
      <MovieView movies={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      {movies.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onBookClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
};