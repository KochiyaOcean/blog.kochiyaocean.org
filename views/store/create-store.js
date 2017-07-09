import { createStore, combineReducers, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import reducer from './reducer'

export const history = createHistory()

const router = routerMiddleware(history)

export const store = createStore(
  combineReducers({
    blog: reducer,
    router: routerReducer,
  }),
  applyMiddleware(router, thunk)
)

window.store = store
