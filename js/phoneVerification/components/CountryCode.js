//@flow

import React from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

export const CountryCode = ({countryCode}) => (
  <View style={styles.callingCodeView}>
    <Text style={styles.text}>+{countryCode}</Text>
  </View>
)

export default CountryCode

const brandColor = '#744BAC'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: brandColor,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10,
    marginLeft: 10,
  },
})