//@flow

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default () => (
  <View style={styles.container}>
    <Text style={styles.welcome}>
      YOU ARE VERIFIED!!!
    </Text>
    <Text style={styles.instructions}>
      How do you feel about that?
    </Text>
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
});
