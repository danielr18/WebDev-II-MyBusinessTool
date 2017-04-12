import { stringify as qs } from 'qs'

import axios from 'utils/axios'
import { ProjectTypes } from '../project'

export const getProjects = () => (dispatch, getState) => {
  dispatch({ type: ProjectTypes.GET_PROJECTS })
  return axios.get('api/project')
    .then(({ data: { data } }) => {
      dispatch({
        type: ProjectTypes.GET_PROJECTS_SUCCESS,
        projects: data
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: ProjectTypes.GET_PROJECTS_ERROR,
        error: data
      })
    })
}

//eslint-disable-next-line
export const getProject = (id_project) => (dispatch, getState) => {
  dispatch({ type: ProjectTypes.GET_PROJECT, id_project })
  return axios.get('api/project', { params: { id_project } })
    .then(({ data: { data } }) => {
      dispatch({
        type: ProjectTypes.GET_PROJECT_SUCCESS,
        project: data
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: ProjectTypes.GET_PROJECT_ERROR,
        error: data
      })
    })
}

//eslint-disable-next-line
export const getTasks = (id_project) => (dispatch, getState) => {
  dispatch({ type: ProjectTypes.GET_TASKS, id_project })
  return axios.get('api/task', { params: { id_project } })
    .then(({ data: { data } }) => {
      dispatch({
        type: ProjectTypes.GET_TASKS_SUCCESS,
        tasks: data
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: ProjectTypes.GET_TASKS_ERROR,
        error: data
      })
    })
}

export const createProject = (project) => (dispatch, getState) => {
  dispatch({ type: ProjectTypes.CREATE_PROJECT })
  return axios.post('api/project', qs(project))
    .then(({ data: { data } }) => {
      dispatch({
        type: ProjectTypes.CREATE_PROJECT_SUCCESS,
        project: data
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: ProjectTypes.CREATE_PROJECT_ERROR,
        error: data
      })
    })
}

//eslint-disable-next-line
export const createTask = (id_project, task, assigned_users) => (dispatch, getState) => {
  dispatch({ type: ProjectTypes.CREATE_TASK })
  //eslint-disable-next-line
  return axios.post('api/task', qs({id_project, ...task}))
    .then(({ data: { data } }) => {
      axios.post('api/task-edit', qs({
        id_task: data.id_task,
        assigned_users: assigned_users.join(',')
      }))
      .then(({ data: { data } }) => {
        dispatch({
          type: ProjectTypes.CREATE_TASK_SUCCESS,
          task: data
        })
      })
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: ProjectTypes.CREATE_TASK_ERROR,
        error: err
      })
    })
}
