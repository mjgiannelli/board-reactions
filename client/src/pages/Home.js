import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { QUERY_GAMES } from "../utils/queries";
import { useQuery } from "@apollo/react-hooks";

const Home = () => {

  const { loading, data } = useQuery(QUERY_GAMES);
  const allGames = data?.games || {};

    return(
        <div>
          <h1 className="homepageTitle">BOARD REACTIONS!</h1>
        <Box>
        {loading ? (
            <div>Loading...</div>
          ) : (
        <Grid container spacing={0} direction="row" justifyContent="center" alignItems="center">
        {allGames.map((game, i) => (
          <Grid i xs={1} key={game.game_name} >
            <img
              src={require(`../assets/${game.image}.jpg`).default}
              alt={game.game_name}
              loading="lazy"
              width="100%"
              height="100%"
            />
          </Grid>
        ))}
     </Grid>
          )}

     </Box>
     </div>
    )
}

export default Home;