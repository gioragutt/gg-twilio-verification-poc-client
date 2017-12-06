/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

import PhoneVerification from './PhoneVerification'

const Input = ({title, placeholder, onPress, onChangeText}) => (
  <View style={styles.fullWidth}>
    <View style={{flexDirection: 'row'}}>
      <TextInput {...{placeholder, onChangeText}} style={{flex: 1}}/>
    </View>
    <Button {...{title, onPress}} style={{flex: 1}}/>
  </View>
)

export default class App extends Component<{}> {
  // state = {
  //   phone: '',
  //   code: '',
  //   codeSent: false
  // }

  // onPhoneChange = phone => this.setState({phone})
  // onCodeChange = code => this.setState({code})
  // sendCode = () => console.warn('Send Code') || this.setState({codeSent: true})
  // verifyCode = () => console.warn('Verify Code')

  // renderInput = () => !this.state.codeSent
  //   ? <Input title="Send Code" placeholder="Enter phone" onChangeText={this.onPhoneChange} onPress={this.sendCode}/>
  //   : <Input title="Verify Code" placeholder="Enter code" onChangeText={this.onCodeChange} onPress={this.verifyCode}/>

  render() {
    return (
      <View style={styles.container}>
        {/* {this.renderInput()} */}
        <PhoneVerification/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  fullWidth: {
    flex: 1,
    padding: 20,
  },
});
