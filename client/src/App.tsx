import "./App.css";
import { useQuery, gql } from "@apollo/client";

function App() {
  const GET_GAMES = gql`
    query GetGames {
      games {
        title
        reviews {
          rating
          author {
            name
          }
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_GAMES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  return (
    <div>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*@ts-ignore*/}
      {data.games.map((game) => (
        <div>
          <h1>{game.title}</h1>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/*@ts-ignore*/}
          <span>{game.reviews.map((r) => r.rating)}</span>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/*@ts-ignore*/}
          <span>{game.reviews.map((r) => r.author.name)}</span>
        </div>
      ))}
    </div>
  );
}

export default App;
