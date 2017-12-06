/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react'

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert
} from 'react-native'

import {times, noop} from 'lodash'

import Spinner from 'react-native-loading-spinner-overlay'
import Form from 'react-native-form'
import {api, auth} from 'shared/services'
import CountryPicker from './CountryPicker'
import CountryCode from './CountryCode'

const MAX_LENGTH_CODE = 4
const CODE_PLACEHOLDER = times(MAX_LENGTH_CODE).map(_ => '_').join(' ')
const MAX_LENGTH_NUMBER = 20

// your brand's theme primary color
const brandColor = '#744BAC'

export default class PhoneVerification extends Component {
  state = {
    phone: null,
    sentCode: false,
    spinner: false,
    country: {
      cca2: 'IL',
      countryCode: '972'
    }
  }

  get textInput() {
    return this.refs.form.refs.textInput
  }

  get formValues() {
    return this.refs.form.getValues()
  }

  asyncOperation = (state, fn) => () => {
    this.setState(state)
    setTimeout(fn, 100)
  }

  getCode = this.asyncOperation({spinner: true, phone: null}, async () => {
    try {
      const body = {
        phone: this.formValues.phone,
        countryCode: this.state.country.countryCode
      }

      const res = await api.api('/sendCode', {body})

      this.setState({phone: body, sentCode: true})

      this.textInput.setNativeProps({text: ''})
      this.showAlert('Sent!', res.message, [{
        text: 'OK',
        onPress: () => this.textInput.focus()
      }])
    } catch (err) {
      this.showAlert('Oops!', err.message)
    }
  })

  showAlert = (...props) => {
    // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
    this.setState({ spinner: false })
    setTimeout(() => {
      Alert.alert(...props)
    }, 100)
  }

  onSuccessfulVerification = async () => {
    await auth.setToken('some token')
    this.props.navigation.navigate('SomePage')
  }

  verifyCode = this.asyncOperation({spinner: true}, async () => {
    try {
      const res = await api.api('/verifyCode', {body: {
        code: this.formValues.code,
        ...this.state.phone
      }})

      this.textInput.blur()
      this.showAlert('Success!', 'You have successfully verified your phone number', [{
        text: 'Continue',
        onPress: this.onSuccessfulVerification
      }])
    } catch (err) {
      this.showAlert('Oops!', err.message)
    }
  })

  tryAgain = () => {
    this.textInput.setNativeProps({text: ''})
    this.textInput.focus()
    this.setState({sentCode: false})
  }

  onSubmit = () => this.state.sentCode ? this.verifyCode() : this.getCode()

  changeCountry = (country) => {
    this.setState({country: {
      cca2: country.cca2,
      countryCode: country.callingCode
    }})
    this.textInput.focus()
  }
    
  _renderFooter = () => {
    return this.state.sentCode ? (
      <Text style={styles.wrongNumberText} onPress={this.tryAgain}>
        Enter the wrong number or need a new code?
      </Text>
    ) : (
      <Text style={styles.disclaimerText}>
        By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message & data rates may apply.
      </Text>
    )
  }

  renderCountryPicker = () => {
    const {sentCode, country: {cca2, countryCode}} = this.state
    return sentCode ? <View/> : [
      <CountryPicker {...{onChange: this.changeCountry, cca2, key: 'picker'}}/>,
      <CountryCode {...{countryCode, key: 'code'}}/>
    ]
  }

  render() {
    const {sentCode} = this.state

    const headerText = `What's your ${sentCode ? 'verification code' : 'phone number'}?`
    const buttonText = sentCode ? 'Verify confirmation code' : 'Send confirmation code'
    const textStyle = sentCode && styles.codeTextInput
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{headerText}</Text>
        <Form ref={'form'} style={styles.form}>
          <View style={{ flexDirection: 'row' }}>
            {this.renderCountryPicker()}
            <TextInput
              ref={'textInput'}
              name={sentCode ? 'code' : 'phone' }
              type={'TextInput'}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              autoCorrect={false}
              placeholder={sentCode ? CODE_PLACEHOLDER : 'Phone Number'}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              style={[styles.textInput, textStyle]}
              returnKeyType='go'
              autoFocus
              placeholderTextColor={brandColor}
              selectionColor={brandColor}
              maxLength={sentCode ? 6 : 20}
              onSubmitEditing={this.onSubmit}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={this.onSubmit}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
          {this._renderFooter()}
        </Form>
        <Spinner
          visible={this.state.spinner}
          textContent={'One moment...'}
          textStyle={{ color: '#fff' }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 22,
    margin: 20,
    color: '#4A4A4A',
  },
  form: {
    margin: 20
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: brandColor
  },
  codeTextInput: {
    height: 50,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Courier'
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey'
  },
})