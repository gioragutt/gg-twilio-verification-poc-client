import { AppRegistry } from 'react-native';
import App from './js/app';
import CodePush from 'react-native-code-push'

const CodePushedApp = CodePush(App)

AppRegistry.registerComponent('twilioVerifyPoc', () => CodePushedApp);
