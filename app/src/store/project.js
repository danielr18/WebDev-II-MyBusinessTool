import { createReducer, createActions } from 'reduxsauce'
import * as actions from './actions/project'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getProject: actions.getProject,
  getProjectSuccess: ['project'],
  getProjectError: ['error'],
  getProjects: actions.getProjects,
  getProjectsSuccess: ['projects'],
  getProjectsError: ['error'],
  getTasks: actions.getTasks,
  getTasksSuccess: ['tasks'],
  getTasksError: ['error'],
  createProject: actions.createProject,
  createProjectSuccess: ['project'],
  createProjectError: ['error'],
  createTask: actions.createTask,
  createTaskSuccess: ['task'],
  createTaskError: ['error'],
  projectReset: []
})

export const ProjectTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  fetching: false,
  projects: [],
  project: null,
  tasks: [],
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

export const getTasksSuccess = (state, { tasks }) => Object.assign({}, state, {
  tasks,
  fetching: false,
  error: null
})

export const getProjectSuccess = (state, { project }) => Object.assign({}, state, {
  project,
  fetching: false,
  error: null
})

export const createProjectSuccess = (state, { project }) => Object.assign({}, state, {
  projects: [...state.projects, project],
  fetching: false,
  error: null
})

export const createTaskSuccess = (state, { task }) => Object.assign({}, state, {
  tasks: [...state.tasks, task],
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
  [Types.GET_TASKS]: request,
  [Types.GET_TASKS_SUCCESS]: getTasksSuccess,
  [Types.GET_TASKS_ERROR]: error,
  [Types.GET_PROJECT]: request,
  [Types.GET_PROJECT_SUCCESS]: getProjectSuccess,
  [Types.GET_PROJECT_ERROR]: error,
  [Types.CREATE_PROJECT]: request,
  [Types.CREATE_PROJECT_SUCCESS]: createProjectSuccess,
  [Types.CREATE_PROJECT_ERROR]: error,
  [Types.CREATE_TASK]: request,
  [Types.CREATE_TASK_SUCCESS]: createTaskSuccess,
  [Types.CREATE_TASK_ERROR]: error,
  [Types.PROJECT_RESET]: reset
})
