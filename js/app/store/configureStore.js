import { combineReducers, createStore } from 'redux'

export default function configureStore(navigation) {
  const rootReducer = combineReducers({
    navigation,
  })

  const store = createStore(rootReducer)
  return store
}