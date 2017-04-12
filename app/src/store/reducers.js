import { combineReducers } from 'redux'
import locationReducer from './location'
import { reducer as userReducer } from './user'
import { reducer as projectReducer } from './project'
import { reducer as socketReducer } from './socket'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    user: userReducer,
    project: projectReducer,
    ws: socketReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
