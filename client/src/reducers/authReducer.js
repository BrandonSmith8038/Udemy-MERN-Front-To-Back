import { SET_CURRENT_USER } from '../actions/types';
import isEmpty from '../validation/is-empty';

const initialState = {
  isAuthenticated: false,
  user: {},
};

const initialTestingState = {
  isAuthenticated: true,
  user: {
    id: '5b4e5d16d299be518d62f331',
    name: 'Amber Cahill',
    avatar: '//www.gravatar.com/avatar/460eab596f0644714e233a1f8dc39499?s=200&r=pg&d=mm',
    iat: 1531867882,
    exp: 1531871482,
  },
};

export default function(state = initialTestingState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    default:
      return state;
  }
}
