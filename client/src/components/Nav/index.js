import { Link } from 'react-router-dom';
import './index.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import Auth from '../../utils/auth';
import { grey } from '@mui/material/colors';
import React from 'react';

const Nav = () => {
  const loggedIn = Auth.loggedIn();
  console.log(loggedIn);

  const loggedInUsername = Auth.getLoggedInUsername();
  return (
    <div>
      <ul className="navigation-menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          {loggedIn ? (
            <Link to="/" onClick={() => Auth.logout()}>
              Logout
            </Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
        <li>
          <Link to="/games">Games</Link>
        </li>
        {loggedIn ? (
          <>
            <li>
              {/* we will set this to logged in user eventually */}
              <Link to={`/profile/${loggedInUsername}`}>Profile</Link>
            </li>
            <li>
              <Link to="/submitgame">Add Game</Link>
            </li>
            <li>
              <Link to="/donate">Donations</Link>
            </li>
          </>
        ) : null}
      </ul>
    </div>
  );
};

export default Nav;
