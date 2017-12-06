/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert
} from 'react-native'

import Spinner from 'react-native-loading-spinner-overlay'
import Form from 'react-native-form'
import CountryPicker from 'react-native-country-picker-modal'

const baseUrl = 'http://10.0.2.2:3000/api/v1'

const postRequest = (url, body) => fetch(`${baseUrl}${url}`, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}).then(res => res.json())

const MAX_LENGTH_CODE = 6
const MAX_LENGTH_NUMBER = 20

// if you want to customize the country picker
const countryPickerCustomStyles = {}

// your brand's theme primary color
const brandColor = '#744BAC'

export default class PhoneVerification extends Component {

  constructor(props) {
    super(props)
    this.state = {
      phone: null,
      sentCode: false,
      spinner: false,
      country: {
        cca2: 'IL',
        callingCode: '972'
      }
    }
  }

  _getCode = () => {

    this.setState({ spinner: true, phone: null })

    setTimeout(async () => {

      try {

        const body = {
          phone: this.refs.form.getValues().phone,
          countryCode: this.state.country.callingCode
        }

        const res = await postRequest('/sendCode', body)

        if (res.err) throw res.err

        this.setState({
          phone: body,
          spinner: false,
          enterCode: true,
          verification: res.body
        })
        this.refs.form.refs.textInput.setNativeProps({ text: '' })

        setTimeout(() => {
          Alert.alert('Sent!', "We've sent you a verification code", [{
            text: 'OK',
            onPress: () => this.refs.form.refs.textInput.focus()
          }])
        }, 100)

      } catch (err) {
        // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        this.setState({ spinner: false })
        setTimeout(() => {
          Alert.alert('Oops!', err.message)
        }, 100)
      }

    }, 100)

  }

  _verifyCode = () => {

    this.setState({ spinner: true })

    setTimeout(async () => {

      try {
        const body = {
          code: this.refs.form.getValues().code,
          ...this.state.phone
        }

        const res = await postRequest('/verifyCode', body)

        if (res.err) throw res.err

        this.refs.form.refs.textInput.blur()
        // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        this.setState({ spinner: false })
        setTimeout(() => {
          Alert.alert('Success!', 'You have successfully verified your phone number')
        }, 100)

      } catch (err) {
        // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        this.setState({ spinner: false })
        setTimeout(() => {
          Alert.alert('Oops!', err.message)
        }, 100)
      }

    }, 100)

  }

  _onChangeText = (val) => {
    if (!this.state.sentCode) return
    if (val.length === MAX_LENGTH_CODE)
    this._verifyCode()
  }

  _tryAgain = () => {
    this.refs.form.refs.textInput.setNativeProps({ text: '' })
    this.refs.form.refs.textInput.focus()
    this.setState({ enterCode: false })
  }

  _getSubmitAction = () => {
    this.state.sentCode ? this._verifyCode() : this._getCode()
  }

  _changeCountry = (country) => {
    this.setState({ country })
    this.refs.form.refs.textInput.focus()
  }

  _renderFooter = () => {

    if (this.state.sentCode)
      return (
        <View>
          <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
            Enter the wrong number or need a new code?
          </Text>
        </View>
      )

    return (
      <View>
        <Text style={styles.disclaimerText}>By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp data rates may apply.</Text>
      </View>
    )

  }

  _renderCountryPicker = () => {

    if (this.state.sentCode)
      return (
        <View />
      )

    return (
      <CountryPicker
        ref={'countryPicker'}
        closeable
        style={styles.countryPicker}
        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        styles={countryPickerCustomStyles}
        translation='eng'/>
    )

  }

  _renderCallingCode = () => {

    if (this.state.sentCode)
      return (
        <View />
      )

    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    )

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

            {this._renderCountryPicker()}
            {this._renderCallingCode()}

            <TextInput
              ref={'textInput'}
              name={this.state.sentCode ? 'code' : 'phone' }
              type={'TextInput'}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={this._onChangeText}
              placeholder={this.state.sentCode ? '_ _ _ _ _ _' : 'Phone Number'}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              style={[ styles.textInput, textStyle ]}
              returnKeyType='go'
              autoFocus
              placeholderTextColor={brandColor}
              selectionColor={brandColor}
              maxLength={this.state.sentCode ? 6 : 20}
              onSubmitEditing={this._getSubmitAction} />

          </View>

          <TouchableOpacity style={styles.button} onPress={this._getSubmitAction}>
            <Text style={styles.buttonText}>{ buttonText }</Text>
          </TouchableOpacity>

          {this._renderFooter()}

        </Form>

        <Spinner
          visible={this.state.spinner}
          textContent={'One moment...'}
          textStyle={{ color: '#fff' }} />

      </View>

    )
  }
}

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
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
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    fontSize: 20,
    color: brandColor,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10
  }
})