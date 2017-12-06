//@flow

import React from 'react'
import {StyleSheet, Text, View, Button} from 'react-native'
import {auth} from 'shared/services'

export default ({navigation}) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>
      YOU ARE VERIFIED!!!
    </Text>
    <Text style={styles.instructions}>
      How do you feel about that?
    </Text>
    <View style={styles.clearTokenButton}>
      <Button
        title="Remove verification"
        onPress={() => {
          auth.clearToken()
          navigation.navigate('PhoneVerification')
        }}
      />
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  clearTokenButton: {
    backgroundColor: 'gray',
    padding: 20,
    margin: 10,
  },
})
