import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

const WHITE = '#f4f4f8';

export default function OptionsItm({title, icon, func}) {
  return (
    <Pressable
      android_ripple={{color: 'gray', borderless: true}}
      onPress={() => {
        func();
      }}
      style={({pressed}) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 20,
          padding: 10,
        },
        {backgroundColor: pressed ? '#c2c2c2' : '#ffffff00'},
      ]}>
      {icon === 'edit' && <Feather name="edit" color="#fff" size={25} />}
      {icon === 'delete' && (
        <MaterialCommunityIcons name="delete-outline" color="#fff" size={25} />
      )}
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    maxWidth: '100%',
    color: WHITE,
  },
});
