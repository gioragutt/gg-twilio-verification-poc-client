// @flow
import React from 'react'
import { Provider, connect } from 'react-redux'
import { addNavigationHelpers, NavigationActions } from 'react-navigation'
import Navigator from './Navigator'
import configureStore from '../store/configureStore'

const initialState = Navigator.router.getStateForAction(NavigationActions.init())

export const navigation = (state = initialState, action) => {
  const nextState = Navigator.router.getStateForAction(action, state)
  return nextState || state
}

const store = configureStore(navigation)

const enhance = connect(({ navigation }) => ({ navigation }))
const ConnectedNavigator = enhance(({ dispatch, navigation: state }) => (
  <Navigator navigation={addNavigationHelpers({ dispatch, state })} />
))

const App = () => (
  <Provider {...{store}} >
    <ConnectedNavigator/>
  </Provider>
)

export default App