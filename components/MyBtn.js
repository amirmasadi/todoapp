/* eslint-disable prettier/prettier */
import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function MyBtn({text, outline, handler}) {
  return (
    <View>
      <TouchableOpacity
        onPress={handler}
        style={[
          styles.btn,
          outline && {backgroundColor: 'transparent', borderColor: '#c1c1c1'},
        ]}>
        <Text style={[styles.text, outline && {color: '#c1c1c1'}]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: '#fff',
    width: 120,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
    fontFamily: 'Montserrat-Medium',
  },
});
