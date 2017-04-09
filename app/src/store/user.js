import { createReducer, createActions } from 'reduxsauce'
import * as actions from './actions/user'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  login: actions.login,
  loginSuccess: ['user'],
  loginError: ['error'],
  signout: actions.signout,
  signoutSuccess: [],
  signoutError: ['error']
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  user: null,
  fetching: false,
  error: null
}

/* ------------- Reducers ------------- */

export const request = (state) => Object.assign({}, state, {
  fetching: true,
  error: null
})

export const loginSuccess = (state, { user }) => Object.assign({}, state, {
  user,
  fetching: false,
  error: null
})

export const signoutSuccess = state => INITIAL_STATE

export const error = (state, { error }) => Object.assign({}, state, {
  error,
  fetching: false
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN]: request,
  [Types.LOGIN_SUCCESS]: loginSuccess,
  [Types.LOGIN_ERROR]: error,
  [Types.SIGNOUT]: request,
  [Types.SIGNOUT_SUCCESS]: signoutSuccess,
  [Types.SIGNOUT_ERROR]: error
})
