import { stringify as qs } from 'qs'

import axios from 'utils/axios'
import { DocumentTypes } from '../document'

export const getDocuments = (id_task) => (dispatch, getState) => {
  dispatch({ type: DocumentTypes.GET_DOCUMENTS })
  return axios.post('api/task/docs', qs({ id_task}))
    .then(({ data: { data } }) => {
      console.log(data);
      dispatch({
        type: DocumentTypes.GET_DOCUMENTS_SUCCESS,
        documents: data
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: DocumentTypes.GET_DOCUMENTS_ERROR,
        error: data
      })
    })
}

export const createDocument = (document) => (dispatch, getState) => {
  dispatch({ type: DocumentTypes.CREATE_DOCUMENT })
  console.log(document);
  return axios.post('api/task/docs', document)
    .then(({data : data}) => {
      dispatch({
        type: DocumentTypes.CREATE_DOCUMENT_SUCCESS,
        document : data
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: DocumentTypes.CREATE_DOCUMENT_ERROR,
        error: data
      })
    })
}
