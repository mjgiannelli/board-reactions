import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { QUERY_USER } from '../utils/queries';
import { ADD_FRIEND, REMOVE_FRIEND } from '../utils/mutations';
import FriendList from '../components/FriendList';
import FavoriteGamesList from '../components/FavoriteGamesList';
import CommentList from '../components/CommentList';
import Auth from '../utils/auth';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import './profile.css';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const linkStyle = {
  margin: '1rem',
  textDecoration: 'none',
  color: 'blue',
};

const Profile = () => {
  const [message, setMessage] = useState(null);

  const [addFriend] = useMutation(ADD_FRIEND);
  const [deleteFriend] = useMutation(REMOVE_FRIEND);

  // get username of logged in user
  const loggedInUser = Auth.getLoggedInUsername();

  // check to see if user is logged in
  const loggedIn = Auth.loggedIn();

  //pull username from url
  const { username: userParam } = useParams();

  // query user data with username
  const { loading: profileUserLoading, data: profileUserData } = useQuery(
    QUERY_USER,
    {
      variables: {
        username: userParam,
      },
    },
  );

  //set data to variable user
  const user = profileUserData?.user || {};
  console.log('profile user: ', user);

  // query user data with username
  const { loading: loggedInUserLoading, data: loggedInUserData } = useQuery(
    QUERY_USER,
    {
      variables: {
        username: loggedInUser,
      },
    },
  );

  //set data to variable user
  const myUserData = loggedInUserData?.user || {};

  const isMyFriend = myUserData?.friends?.find(
    (friend) => friend._id === user._id,
  );

  const handleAddFriend = async (friendId) => {
    try {
      await addFriend({
        variables: { friendId: friendId },
      });

      setMessage('Friend Added!');

      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await deleteFriend({
        variables: { friendId: friendId },
      });
      setMessage('Friend Removed!');

      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  };

  // if data is still loading, display a loading div
  if (profileUserLoading) {
    return <div>Loading...</div>;
  }

  // if not loading and data is returned...
  if (!profileUserLoading) {
    //check if the user has games
    if (user.games) {
      let userFavoriteGames = [];
      let userCommentedGames = [];

      // create a variable called favoriteGames and filter out any games where favorite Count is 0;
      const favoriteGames = user.games.filter(
        (game) => game.favoritesCount !== 0,
      );

      // for all the games that have favorites, push only the games the current user favorited to userFavoriteGames array
      for (let i = 0; i < favoriteGames.length; i++) {
        for (let j = 0; j < favoriteGames[i].favorites.length; j++) {
          if (favoriteGames[i].favorites[j].username === userParam) {
            userFavoriteGames.push(favoriteGames[i]);
          }
        }
      }

      // create a variable called commentedGames and filter out any games where comment Count is 0;
      const commentedGames = user.games.filter(
        (game) => game.commentCount !== 0,
      );

      // for all the games that have comments, push only the games the current user commented on to usercommentedGames array
      for (let i = 0; i < commentedGames.length; i++) {
        for (let j = 0; j < commentedGames[i].comments.length; j++) {
          if (commentedGames[i].comments[j].username === userParam) {
            userCommentedGames.push(commentedGames[i]);
          }
        }
      }

      // check if user is loggedIn -- scenario: user has games and there is a logged in user
      if (loggedIn) {
        return (
          <div className="profile">
            {/* if logged in user = the username in the URL, display one header, if not, display another header and include add friend button */}
            {loggedInUser === userParam ? (
              <div className="profile-header-me">
                <h1>
                  Welcome to your profile,{' '}
                  <span className="username-style2">{loggedInUser}</span>!
                </h1>
                <Link style={linkStyle} to="/submitgame">
                  Didn't see a game you like listed on the all games page?
                  Submit A Game!
                </Link>
              </div>
            ) : (
              <div className="profile-header-not-me">
                <h1>Welcome to {userParam}'s profile!</h1>
                <div className="friend-btn">
                  {isMyFriend ? (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        handleRemoveFriend(user._id);
                      }}
                    >
                      + Remove Friend
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => {
                        handleAddFriend(user._id);
                      }}
                    >
                      + Add Friend
                    </Button>
                  )}
                  {message && (
                    <div>
                      <p>{message}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="profile-content">
              <div className="user-data">
                {user.friendCount > 0 ? (
                  <FriendList
                    username={user.username}
                    friendCount={user.friendCount}
                    friends={user.friends}
                  />
                ) : loggedInUser === userParam ? (
                  <p>{loggedInUser}, make some friends!</p>
                ) : (
                  <p>{userParam} has not added any friends!</p>
                )}
                {user.gamesCount > 0 ? (
                  <FavoriteGamesList
                    username={user.username}
                    games={userFavoriteGames}
                  />
                ) : loggedInUser === userParam ? (
                  <p>{loggedInUser}, go favorite some games!</p>
                ) : (
                  <p>{userParam} has not favorited any games!</p>
                )}
              </div>
              <div className="user-comments">
                {userCommentedGames && userCommentedGames.length > 0 ? (
                  <CommentList
                    username={user.username}
                    games={userCommentedGames}
                  />
                ) : loggedInUser === userParam ? (
                  <p>{loggedInUser}, go comment on some games!</p>
                ) : (
                  <p>{userParam} has not commented on any games!</p>
                )}
              </div>
            </div>
          </div>
        );
      } else {
        // if user is not logged in but there's data to display
        return (
          <div className="profile">
            <div className="profile-header-not-me">
              <h1>Welcome to {userParam}'s profile!</h1>
            </div>
            <div className="profile-content">
              <div className="user-data">
                {user.friendCount > 0 ? (
                  <FriendList
                    username={user.username}
                    friendCount={user.friendCount}
                    friends={user.friends}
                  />
                ) : (
                  <p>{userParam} has not added any friends!</p>
                )}
                {user.gamesCount > 0 ? (
                  <FavoriteGamesList
                    username={user.username}
                    games={userFavoriteGames}
                  />
                ) : (
                  <p>{userParam} has not favorited any games!</p>
                )}
              </div>
              {userCommentedGames && userCommentedGames.length > 0 ? (
                <div className="user-comments">
                  <CommentList
                    username={user.username}
                    games={userCommentedGames}
                  />
                </div>
              ) : (
                <div className="user-comments">
                  <p>{userParam} has not commented on any games!</p>
                </div>
              )}
            </div>
          </div>
        );
      }
    }
  }
};

export default Profile;
