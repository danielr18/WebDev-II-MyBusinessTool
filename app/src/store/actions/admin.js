import { stringify as qs } from 'qs'

import axios from 'utils/axios'
import { AdminTypes } from '../admin'

export const getUsers = () => (dispatch, getState) => {
  dispatch({ type: AdminTypes.GET_USERS })
  return axios.get('api/user')
    .then(({ data: { data } }) => {
      dispatch({
        type: AdminTypes.GET_USERS_SUCCESS,
        users: data
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: AdminTypes.GET_USERS_ERROR,
        error: data
      })
    })
}

export const addUser = (user) => (dispatch, getState) => {
  dispatch({ type: AdminTypes.ADD_USER })
  return axios.post('api/user', qs(user))
    .then(({ data: { data } }) => {
      dispatch({
        type: AdminTypes.ADD_USER_SUCCESS,
        user: data
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: AdminTypes.ADD_USER_ERROR,
        error: data
      })
    })
}

export const editUser = (user) => (dispatch, getState) => {
  dispatch({ type: AdminTypes.EDIT_USER })
  return axios.post('api/user/edit', qs(user))
    .then(({ data: { data } }) => {
      dispatch({
        type: AdminTypes.EDIT_USER_SUCCESS,
        user: data
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: AdminTypes.EDIT_USER_ERROR,
        error: data
      })
    })
}

export const deleteUser = (id_user) => (dispatch, getState) => {
  dispatch({ type: AdminTypes.DELETE_USER })
  return axios.delete('api/user', { params: { id_user } })
    .then(({ data: { data } }) => {
      dispatch({
        type: AdminTypes.DELETE_USER_SUCCESS,
        id_user: data.id_user
      })
    })
    .catch(error => {
      dispatch({
        type: AdminTypes.DELETE_USER_ERROR,
        error: error
      })
    })
}
