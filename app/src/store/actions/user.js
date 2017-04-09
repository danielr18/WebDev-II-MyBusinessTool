import { stringify as qs } from 'qs'

import axios from 'utils/axios'
import { UserTypes } from '../user'

export const login = (email, password) => (dispatch, getState) => {
  dispatch({ type: UserTypes.LOGIN })
  return axios.post('api/login', qs({ email, password }))
    .then(({ data: { data } }) => {
      dispatch({
        type: UserTypes.LOGIN_SUCCESS,
        user: data
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: UserTypes.LOGIN_ERROR,
        error: data
      })
    })
}

export const signout = () => (dispatch, getState) => {
  dispatch({ type: UserTypes.SIGNOUT })
  return axios.post('api/logout', {})
    .then(() => {
      dispatch({
        type: UserTypes.SIGNOUT_SUCCESS
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: UserTypes.SIGNOUT_ERROR,
        error: data
      })
    })
}
