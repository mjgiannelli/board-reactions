import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import Auth from '../utils/auth';
import { ADD_USER } from '../utils/mutations';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { validateEmail } from '../utils/helpers';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Signup = () => {
  const [message, setMessage] = useState('');
  const [addUser] = useMutation(ADD_USER);

  const securityQuestions = [
    'In what city were you born?',
    'What is the name of your favorite pet?',
    "What is your mother's maiden name?",
    'What high school did you attend?',
    'What was the make of your first car?',
  ];

  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    questionOne: '',
    answerOne: '',
    questionTwo: '',
    answerTwo: '',
  });

  // collect user inputs
  const handleChange = (event) => {
    setMessage('');
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // collect questions user selects for security questions
  const handleSelection = (event) => {
    setMessage('');
    const { id, value } = event.target;

    setFormState({
      ...formState,
      [id]: value,
    });
  };

  // submit the collected data from user to create a new user and add them to the db
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (formState.password.length < 6) {
      setMessage('Password needs to be at least 6 characters.');
      return;
    }
    if (
      formState.answerOne === '' ||
      formState.answerTwo === '' ||
      formState.email === '' ||
      formState.questionOne === '' ||
      formState.questionTwo === '' ||
      formState.username === ''
    ) {
      setMessage('Please make sure all fields are filled out.');
      return;
    }
    if (!validateEmail(formState.email)) {
      setMessage('Please enter a valid email');
      return;
    }
    const mutationResponse = await addUser({
      variables: {
        email: formState.email,
        username: formState.username,
        password: formState.password,
        questionOne: formState.questionOne,
        answerOne: formState.answerOne,
        questionTwo: formState.questionTwo,
        answerTwo: formState.answerTwo,
      },
    });

    const username = formState.username;
    const token = mutationResponse.data.addUser.token;
    Auth.login(token, username);
  };

  return (
    <section>
      <Box component="form" sx={{ flexGrow: 1, borderBottom: 'none' }}>
        <Grid
          container
          spacing={0}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <h5>
            <Link to="/login">
              <Grid item xs={12} m=".5rem">
                ← Go to Login
              </Grid>
            </Link>
          </h5>
          <Grid item xs={12}>
            <h1>Sign Up</h1>
          </Grid>

          <Grid item xs={12}>
            <form onSubmit={handleFormSubmit}>
              <Item>
                <TextField
                  id="username"
                  label="Username"
                  placeholder="Username"
                  variant="filled"
                  onChange={handleChange}
                  name="username"
                  htmlFor="username"
                />
              </Item>

              <Item>
                <TextField
                  id="email"
                  label="Email"
                  placeholder="Email"
                  variant="filled"
                  onChange={handleChange}
                  name="email"
                  htmlFor="email"
                />
              </Item>

              <Item>
                <TextField
                  id="password"
                  label="Password"
                  placeholder="Password"
                  variant="filled"
                  onChange={handleChange}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                />
              </Item>

              <Item>
                <FormControl sx={{ m: 2, width: 275 }}>
                  <InputLabel value="select" sx={{ m: 1 }}>
                    Select Security Question 1
                  </InputLabel>
                  <select
                    sx={{ fontSize: 11, fontWeight: 'medium' }}
                    id="questionOne"
                    onChange={handleSelection}
                  >
                    <option value={''}>---</option>
                    {securityQuestions
                      .filter((q) => formState.questionTwo !== q)
                      .map((question, index) => {
                        return (
                          <option
                            sx={{ fontSize: 15 }}
                            value={question}
                            key={index}
                            id={index}
                          >
                            {question}
                          </option>
                        );
                      })}
                  </select>
                </FormControl>
              </Item>
              <Item>
                <TextField
                  id="answerOne"
                  label="Answer 1"
                  placeholder="Answer 1"
                  variant="filled"
                  onChange={handleChange}
                  name="answerOne"
                  htmlFor="answerOne"
                />
              </Item>

              <Item>
                <FormControl sx={{ m: 2, width: 275 }}>
                  <InputLabel
                    sx={{ m: 1, verticalAlign: 'center' }}
                    value="select"
                  >
                    Select Security Question 2
                  </InputLabel>
                  <select
                    sx={{ fontSize: 11, fontWeight: 'medium' }}
                    id="questionTwo"
                    onChange={handleSelection}
                  >
                    <option value={''}>---</option>
                    {securityQuestions
                      .filter((q) => formState.questionOne !== q)
                      .map((question, index) => {
                        return (
                          <option
                            sx={{ fontSize: 15 }}
                            value={question}
                            key={index}
                          >
                            {question}
                          </option>
                        );
                      })}
                  </select>
                </FormControl>
              </Item>
              <Item>
                <TextField
                  id="answerTwo"
                  label="Answer 2"
                  placeholder="Answer 2"
                  variant="filled"
                  onChange={handleChange}
                  name="answerTwo"
                  htmlFor="answerOne"
                />
              </Item>
              {message ? (
                <p
                  style={{
                    color: 'red',
                    textAlign: 'center',
                    marginTop: '1rem',
                  }}
                >
                  {message}
                </p>
              ) : null}
              <Item>
                <Button
                  sx={{ width: 200 }}
                  onClick={handleFormSubmit}
                  variant="contained"
                  color="success"
                >
                  Signup
                </Button>
              </Item>
            </form>
          </Grid>
        </Grid>
      </Box>
    </section>
  );
};

export default Signup;
