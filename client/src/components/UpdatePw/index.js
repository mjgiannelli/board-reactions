import { useMutation } from '@apollo/client';
import { useState } from 'react';

import { UPDATE_PASSWORD } from '../../utils/mutations';

const UpdatePw = (props) => {
  const [formState, setFormState] = useState({
    password: '',
  });

  const [updatePassword, { error }] = useMutation(UPDATE_PASSWORD);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const mutationResponse = await updatePassword({
        variables: {
          username: props.username,
          password: formState.password,
        },
      });
      window.location.assign('/login');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          marginTop: '1rem'
        }}
      >
        <label htmlFor="password-update">
          Please enter your new password:{' '}
        </label>
        <input
          name="password"
          type="password"
          id="password-update"
          placeholder="New Password"
          onChange={handleChange}
        />
      </div>
      <div style={{textAlign: 'center', marginTop: '1rem'}}>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default UpdatePw;
