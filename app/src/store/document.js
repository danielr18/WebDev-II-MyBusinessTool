import { createReducer, createActions } from 'reduxsauce'
import * as actions from './actions/document'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getDocuments: actions.getDocuments,
  getDocumentsSuccess: ['documents'],
  getDocumentsError: ['error'],
  createDocument: actions.createDocument,
  createDocumentSuccess: ['document'],
  createDocumentError: ['error']
})

export const DocumentTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  document: null,
  documents: [],
  fetching: false,
  error: null
}

/* ------------- Reducers ------------- */

export const request = (state) => Object.assign({}, state, {
  fetching: true,
  error: null
})

export const getDocumentsSuccess = (state, { documents }) => Object.assign({}, state, {
  documents,
  fetching: false,
  error: null
})


export const createDocumentSuccess = (state, { document }) => Object.assign({}, state, {
  documents : [...state, document],
  fetching: false,
  error: null
})

export const error = (state, { error }) => Object.assign({}, state, {
  error,
  fetching: false
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_DOCUMENTS]: request,
  [Types.GET_DOCUMENTS_SUCCESS]: loginSuccess,
  [Types.GET_DOCUMENTS_ERROR]: error,
  [Types.CREATE_DOCUMENT]: request,
  [Types.CREATE_DOCUMENT_SUCCESS]: signoutSuccess,
  [Types.CREATE_DOCUMENT_ERROR]: error
})
