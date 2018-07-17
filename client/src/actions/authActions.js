import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register User

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('api/users/register/', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Login - Get User Token

export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      // Save To Local Storage
      const { token } = res.data;
      // Set token to local storage
      localStorage.setItem('jwtToken', token);
      // Set Token To Auth Header
      setAuthToken(token);
      // Decode Token To Get User Data
      const decoded = jwt_decode(token);
      // Set Current User
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Set Logged In User
export const setCurrentUser = decoded => ({
    type: SET_CURRENT_USER,
    payload: decoded
  });
