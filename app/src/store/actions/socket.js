import { stringify as qs } from 'qs'

import axios from 'utils/axios'
import { SocketTypes } from '../socket'

export const sessionIdReceived = (session_id) => (dispatch, getState) => {
  dispatch({ type: SocketTypes.SESSION_ID_RECEIVED, session_id })
  return axios.post('api/notification-socket-session', qs({ session_id }))
    .then(({ data: { data } }) => {
      dispatch({
        type: SocketTypes.SESSION_ID_SAVED_SUCCESS
      })
    })
    .catch(({ response: { data } }) => {
      dispatch({
        type: SocketTypes.SESSION_ID_SAVED_ERROR,
        error: data
      })
    })
}
