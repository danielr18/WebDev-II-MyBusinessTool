import { createReducer, createActions } from 'reduxsauce'
import uuid from 'uuid/v4'
import _ from 'lodash'
import * as actions from './actions/socket'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  wsConnect: ['url'],
  wsDisconnect: [],
  connected: [],
  connecting: [],
  disconnected: [],
  notificationReceived: ['notification'],
  markNotificationAsRead: ['id'],
  sessionIdReceived: actions.sessionIdReceived,
  sessionIdSavedSuccess: [],
  sessionIdSavedError: ['error']
})

export const SocketTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  status: null,
  notifications: {}
}

/* ------------- Reducers ------------- */

export const connected = (state) => Object.assign({}, state, { status: 'connected' })

export const disconnected = (state) => Object.assign({}, state, { status: 'disconnected' })

export const connecting = (state) => Object.assign({}, state, { status: 'connecting' })

export const notificationReceived = (state, { notification }) => Object.assign({}, state, {
  notifications: Object.assign({}, state.notifications, { [uuid()]: notification })
})

export const removeNotification = (state, { id }) => Object.assign({}, state, {
  notifications: _.omit(state.notifications, [id])
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONNECTED]: connected,
  [Types.CONNECTING]: connecting,
  [Types.DISCONNECTED]: disconnected,
  [Types.NOTIFICATION_RECEIVED]: notificationReceived,
  [Types.MARK_NOTIFICATION_AS_READ]: removeNotification
})
