import { useEffect, useState } from 'react';
import Auth from '../utils/auth';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { QUERY_GAMES } from '../utils/queries';
import { useQuery } from '@apollo/react-hooks';

const Home = () => {
  const [loadingLogin, setLoadingLogin] = useState(true);

  const { loading, data } = useQuery(QUERY_GAMES);
  const allGames = data?.games || {};
  const loggedIn = Auth.loggedIn();
  const loggedInUsername = Auth.getLoggedInUsername();

  useEffect(() => {
    if (loggedIn) {
      if (loggedInUsername) {
        window.location.assign(`/profile/${loggedInUsername}`);
      }
    } else {
      setLoadingLogin(false);
    }
  }, [loggedIn, loggedInUsername]);

  const HandleImgClick = (game) => {
    window.location.assign(`/games/${game._id}`);
  };

  return (
    <div style={{width: "90%", margin: "auto"}}>
      <h1 className="homepageTitle">BOARD REACTIONS!</h1>
      <Box>
        {loading || loadingLogin ? (
          <div>Loading...</div>
        ) : (
          <Grid
            container
            spacing={0}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {allGames.map((game, i) => (
              <Grid i xs={1} key={game.game_name}>
                <img
                  className="game-img"
                  src={require(`../assets/${game.image}.jpg`).default}
                  alt={game.game_name}
                  loading="lazy"
                  width="100%"
                  height="100%"
                  onClick={() => HandleImgClick(game)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </div>
  );
};

export default Home;
