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
