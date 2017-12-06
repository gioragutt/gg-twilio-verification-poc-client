// @flow
import {TabNavigator} from 'react-navigation'
import {auth} from 'shared/services'
import PhoneVerification from 'phoneVerification'
import SomePage from './SomePage'

const Initial = (props) => {
  auth.getToken().then(token => {
    props.navigation.navigate(token ? 'SomePage' : 'PhoneVerification')
  })
  return null 
}

const Navigator = TabNavigator(
  {
    Initial: { screen: Initial },
    PhoneVerification: { screen: PhoneVerification },
    SomePage: { screen: SomePage },
  },
  {
    initialRouteName: 'Initial',
    swipeEnabled: false,
    animationEnabled: false,
    lazy: true,
    tabBarComponent: () => null,
  },
)

export default Navigator
