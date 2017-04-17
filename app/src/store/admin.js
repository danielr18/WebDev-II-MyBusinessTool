import { createReducer, createActions } from 'reduxsauce'
import * as actions from './actions/admin'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getUsers: actions.getUsers,
  getUsersSuccess: ['users'],
  getUsersError: ['error'],
  addUser: actions.addUser,
  addUserSuccess: ['user'],
  addUserError: ['error'],
  editUser: actions.editUser,
  editUserSuccess: ['user'],
  editUserError: ['error'],
  deleteUser: actions.deleteUser,
  deleteUserSuccess: ['id_user'],
  deleteUserError: ['error']
})

export const AdminTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  users: [],
  fetching: false,
  error: null
}

/* ------------- Reducers ------------- */

export const request = (state) => Object.assign({}, state, {
  fetching: true,
  error: null
})

export const getUsersSuccess = (state, { users }) => Object.assign({}, state, {
  users,
  fetching: false,
  error: null
})

export const deleteUserSuccess = (state, { id_user }) => Object.assign({}, state, {
  users: state.users.filter(user => user.id_user !== id_user),
  fetching: false,
  error: null
})

export const addUserSuccess = (state, { user }) => Object.assign({}, state, {
  users: state.users.concat(user),
  fetching: false,
  error: null
})

export const editUserSuccess = (state, { user }) => Object.assign({}, state, {
  users: state.users.filter(store_user => store_user.id_user !== user.id_user).concat(user),
  fetching: false,
  error: null
})

export const error = (state, { error }) => Object.assign({}, state, {
  error,
  fetching: false
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_USERS]: request,
  [Types.GET_USERS_SUCCESS]: getUsersSuccess,
  [Types.GET_USERS_ERROR]: error,
  [Types.ADD_USER]: request,
  [Types.ADD_USER_SUCCESS]: addUserSuccess,
  [Types.ADD_USER_ERROR]: error,
  [Types.EDIT_USER]: request,
  [Types.EDIT_USER_SUCCESS]: editUserSuccess,
  [Types.EDIT_USER_ERROR]: error,
  [Types.DELETE_USER]: request,
  [Types.DELETE_USER_SUCCESS]: deleteUserSuccess,
  [Types.DELETE_USER_ERROR]: error,
})
