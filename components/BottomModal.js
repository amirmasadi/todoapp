import React from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import OptionsItm from './OptionsItm';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

const WHITE = '#f4f4f8';
const BG = '#1A2744';

const BottomModal = ({
  setPriFilter,
  priFilter,
  setInputVal,
  inputVal,
  setRadioVal,
  radioVal,
  options,
  todoInput,
  addHandeler,
  focusedTask,
  delTask,
  editHandler,
  gestureHandler,
  modalBottom,
  openAddMenu,
  closeAddMenu,
}) => {
  const WIDTH = Dimensions.get('window').width;
  const HEIGHT = Dimensions.get('window').height;
  const prioritys = [{pri: 'High'}, {pri: 'Normal'}, {pri: 'Low'}];
  const filters = [{pri: 'All'}, {pri: 'High'}, {pri: 'Normal'}, {pri: 'Low'}];

  // --------------------------- reanimated animations --------------------------
  //filter optons opacity animation
  const filterT = useSharedValue(0);
  const filterO = useSharedValue(1);
  const rFilter = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(filterT.value, {
            stiffness: 100,
          }),
        },
      ],
      opacity: withTiming(filterO.value, {
        stiffness: 100,
      }),
    };
  });
  //options(delete & edit) opacity animation
  const optionsT = useSharedValue(0);
  const optionsO = useSharedValue(0);
  const rOptions = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(optionsT.value, {
            stiffness: 100,
          }),
        },
      ],
      opacity: withTiming(optionsO.value, {
        stiffness: 100,
      }),
    };
  });
  //add and edit menu
  const addT = useSharedValue(0);
  const addO = useSharedValue(1);
  const rAdd = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(addT.value, {
            stiffness: 100,
          }),
        },
      ],
      opacity: withSpring(addO.value, {
        stiffness: 100,
      }),
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          styles.header,
          // animatedStyles,
          modalBottom,
          // addMenu
          //   ? (headerH.value = HEIGHT / 2.5)
          //   : (headerH.value = HEIGHT / 2.5),
        ]}>
        <View style={{height: '40%', justifyContent: 'space-between'}}>
          {/* --------- filter by priority ------- */}
          <Animated.View
            style={[
              styles.filter,
              rFilter,
              options
                ? ((filterT.value = -70), (filterO.value = 0))
                : ((filterT.value = 40), (filterO.value = 1)),
            ]}>
            {filters.map((fil, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setPriFilter(fil.pri);
                }}>
                <Text
                  style={[
                    styles.filterBtn,
                    priFilter === fil.pri && styles.active,
                  ]}>
                  {fil.pri}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* --------- edit & delete btns ------- */}
          <Animated.View
            style={[
              styles.options,
              rOptions,
              options
                ? ((optionsT.value = -3), (optionsO.value = 1))
                : ((optionsT.value = 50), (optionsO.value = 0)),
            ]}>
            <OptionsItm
              title="edit"
              icon="edit"
              func={() => {
                editHandler(focusedTask);
                openAddMenu();
              }}
            />
            <OptionsItm
              title="remove"
              icon="delete"
              func={() => delTask(focusedTask)}
            />
          </Animated.View>

          {/* ------- add task menu -------*/}
          <Animated.View
            style={[
              {
                marginTop: 20,
                height: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              rAdd,
              // addMenu
              //   ? ((addT.value = -10), (addO.value = 1))
              //   : ((addT.value = -550), (addO.value = 0)),
            ]}>
            <View
              style={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                value={inputVal}
                style={styles.Input}
                color={WHITE}
                onChangeText={val => setInputVal(val)}
                placeholder="Your Task..."
                ref={todoInput}
              />
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-around',
                  marginTop: 20,
                }}>
                {prioritys.map((pris, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setRadioVal(pris.pri)}
                    style={[
                      styles.pris,
                      pris.pri == radioVal
                        ? {borderColor: WHITE}
                        : {borderColor: 'transparent'},
                    ]}>
                    <Text style={{fontFamily: 'Montserrat-Medium'}}>
                      {pris.pri}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>

          {/*-------- add task btn ---------*/}
          <Pressable
            style={styles.addBtn}
            onPress={() => {
              addHandeler(inputVal, radioVal, focusedTask);
              inputVal != '' && closeAddMenu();
            }}
            style={({pressed}) => [
              styles.addBtn,
              {borderColor: pressed ? '#c2c2c2' : '#ffffff50'},
              {backgroundColor: pressed ? BG : '#ffffff10'},
            ]}>
            <Text style={{fontFamily: 'Montserrat-Medium'}}>add</Text>
          </Pressable>
        </View>

        {/* up indicator */}
        <TouchableOpacity onPress={() => openAddMenu()} style={styles.handle}>
          <Ionicons
            name={'md-chevron-up-outline'}
            color={'#ffffff70'}
            size={30}
          />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  header: {
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#455781',
    overflow: 'hidden',
    position: 'absolute',
    justifyContent: 'flex-start',
    right: 0,
    left: 0,
    zIndex: 40,
    elevation: 5,
    height: 400,
  },
  Input: {
    width: '90%',
    fontSize: 20,
    backgroundColor: BG,
    height: 60,
    borderRadius: 20,
    fontFamily: 'Montserrat-Medium',
  },
  bottomfade: {
    position: 'absolute',
    width: '100%',
    height: 20,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  filterBtn: {
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
  },
  active: {
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  options: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 16,
    maxWidth: '100%',
    color: WHITE,
    fontFamily: 'Montserrat-Medium',
  },
  addBtn: {
    borderRadius: 15,
    width: '30%',
    height: 55,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  add: {
    backgroundColor: BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pris: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
  },
  handle: {
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
    borderRadius: 10,
  },
});

export default BottomModal;
