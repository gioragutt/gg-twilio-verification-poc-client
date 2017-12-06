//@flow

import React from 'react'
import CountryPickerModal from 'react-native-country-picker-modal'
import {StyleSheet} from 'react-native'

const CountryPicker = ({onChange, cca2, translation = 'eng'} = {}) => (
  <CountryPickerModal
    closeable
    style={styles.countryPicker}
    {...{onChange, cca2, translation}}
  />
)

export default CountryPicker

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})
