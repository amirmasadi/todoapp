import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Text, Pressable} from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const WHITE = '#f4f4f8';
const BG = '#1A2744';
const MAIN = '#fdb095';
const MAIN2 = '#e5958e';

export default function RenderItem({
  item,
  checkToggle,
  TODOS,
  toggleOption,
  closeOption,
  focusedTask,
}) {
  const [relode, setRelode] = useState(false);

  const index = TODOS.findIndex(x => x.id === item.id);

  // --------------------------- reanimated animations --------------------------
  const rScale = useSharedValue(1);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: withSpring(rScale.value, {
        stiffness: 200,
      })}],
    };
  });

  return (
    <Animated.View
      style={[
        rStyle,
        focusedTask == item.id ? (rScale.value = 0.9) : (rScale.value = 1),
      ]}>
      <Pressable
        onPress={() => {
          checkToggle(index);
          setRelode(!relode);
          closeOption();
          toggleOption(null);
        }}
        android_ripple={{color: BG}}
        onLongPress={() => {
          toggleOption(item.id);
        }}
        style={({pressed}) => [
          styles.item,
          item.status
            ? {backgroundColor: pressed ? '#c2c2c2' : '#ffffff10'}
            : {backgroundColor: pressed ? '#c3c3c3' : '#ffffff40'},
        ]}>
        {item.status ? (
          item.priority === 'High' && item.status ? (
            <LottieView
              source={require('../assets/fire-loop.json')}
              {...(item.status ? 'loop' : 'loop={false}')}
              autoPlay
              style={styles.fire}
            />
          ) : (
            <View
              style={[
                styles.priority,
                item.priority === 'High' && {backgroundColor: '#FF3A2F'},
                item.priority === 'Normal' && {backgroundColor: '#FF9511'},
                item.priority === 'Low' && {backgroundColor: '#32C759'},
              ]}
            />
          )
        ) : (
          <View style={[styles.priority, {backgroundColor: '#c1c1c1'}]} />
        )}
        <View style={styles.content}>
          <View></View>
          <Text
            style={[
              styles.num,
              !item.status && {
                textDecorationLine: 'line-through',
                color: '#c1c1c1',
              },
            ]}>
            {index < 10 && 0}
            {index}
          </Text>
          {focusedTask == item.id && (
            <LottieView
              source={require('../assets/tick.json')}
              autoPlay
              loop={false}
              style={styles.tick}
              speed={2}
            />
          )}
          <Text
            style={[
              styles.title,
              !item.status && {
                textDecorationLine: 'line-through',
                color: '#c1c1c1',
              },
            ]}>
            {item.title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: WIDTH / 3.5,
    width: WIDTH / 2.2,
    borderRadius: 25,
    marginTop: 15,
    marginHorizontal: 10,
    position: 'relative',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: -1,
  },
  fire: {
    width: 80,
    height: 50,
    transform: [{translateX: -11}],
    position: 'absolute',
    top: -12,
    right: -25,
  },
  title: {
    fontSize: 16,
    maxWidth: '100%',
    color: WHITE,
    fontFamily: 'Montserrat-Medium'
  },
  priority: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 10,
    right: 8,
  },
  num: {
    color: WHITE,
    fontSize: 40,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff80',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  tick: {
    width: 30,
    height: 30,
    transform: [{translateX: -11}],
    position: 'absolute',
    top: -3,
    right: -18,
  },
});
