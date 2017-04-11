import { createReducer, createActions } from 'reduxsauce'
import * as actions from './actions/project'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getProjects: actions.getProjects,
  getProjectsSuccess: ['projects'],
  getProjectsError: ['error'],
  createProject: actions.createProject,
  createProjectSuccess: ['project'],
  createProjectError: ['error'],
  projectReset: []
})

export const ProjectTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  fetching: false,
  projects: [],
  error: null
}

/* ------------- Reducers ------------- */

export const request = (state) => Object.assign({}, state, {
  fetching: true,
  error: null
})

export const getProjectsSuccess = (state, { projects }) => Object.assign({}, state, {
  projects,
  fetching: false,
  error: null
})

export const createProjectSuccess = (state, { project }) => Object.assign({}, state, {
  projects: [...state.projects, project],
  fetching: false,
  error: null
})

export const error = (state, { error }) => Object.assign({}, state, {
  error,
  fetching: false
})

export const reset = () => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_PROJECTS]: request,
  [Types.GET_PROJECTS_SUCCESS]: getProjectsSuccess,
  [Types.GET_PROJECTS_ERROR]: error,
  [Types.CREATE_PROJECT]: request,
  [Types.CREATE_PROJECT_SUCCESS]: createProjectSuccess,
  [Types.CREATE_PROJECT_ERROR]: error,
  [Types.PROJECT_RESET]: reset
})
