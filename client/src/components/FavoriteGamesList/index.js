import { Link } from 'react-router-dom';

const FavoriteGamesList = ({ username, games }) => {
    if (!games.favorites || !games.favorites.length) {
      return <p>{username}, go favorite some games!</p>;
    }
  
    return (
      <div>
        <h5>
          {username}'s {games.favoritesCount} {games.favoritesCount === 1 ? 'favorite game' : 'favorite games'}
        </h5>
        {games.map(game => (
          <button key={game._id}>
            <Link to={`/games/${game.game_name}`}>{game.game_name}</Link>
          </button>
        ))}
      </div>
    );
  };

  export default FavoriteGamesList;