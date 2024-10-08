import React from 'react';
import { Link } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Auth from '../../utils/auth';

const GameCommentList = ({ allComments }) => {
  const loggedIn = Auth.loggedIn();

  if (!allComments.length) {
    return <h3>No Comments Yet</h3>;
  }

  return (
    <div>
      {allComments &&
        allComments.map((comment, i) => {
          return (
            <List
              sx={{
                width: '100%',
                maxWidth: 700,
                bgcolor: 'background.paper',
              }}
              key={i}
            >
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="" />
                </ListItemAvatar>
                <ListItemText
                  primary={loggedIn ? null : null}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        <Link to={`/profile/${comment.username}`}>
                          {' '}
                          {comment.username}
                        </Link>
                      </Typography>

                      <Typography>"{comment.commentText}</Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          );
        })}
    </div>
  );
};

export default GameCommentList;
