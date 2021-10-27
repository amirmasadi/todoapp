import AsyncStorage from '@react-native-async-storage/async-storage';
import MasonryList from '@react-native-seoul/masonry-list';
import LottieView from 'lottie-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, SafeAreaView, StatusBar} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import DoubleTapToClose from './components/DoubleTapToClose';
import RenderItem from './components/RenderItem';

import BottomModal from './components/BottomModal';
import {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import RNBootSplash from 'react-native-bootsplash';

const WHITE = '#f4f4f8';
const BG = '#1A2744';
const MAIN = '#fdb095';
const MAIN2 = '#e5958e';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function App() {
  changeNavigationBarColor('#455781');
  let [TODOS, setTODOS] = useState([
    {
      title: 'task',
      priority: 'High',
      status: true,
      id: Math.random().toString(),
    },
  ]);
  const [options, setOptions] = useState(false);
  const [focusedTask, setFocusedTask] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [radioVal, setRadioVal] = useState('Normal');
  const [editMenu, setEditMenu] = useState(false);
  const [priFilter, setPriFilter] = useState('All');
  const todoInput = useRef();

  // --------------------------- async storage --------------------------
  const storeTasks = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('storageTasks', jsonValue);
    } catch (e) {
      console.log(e);
    }
  };
  const getTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('storageTasks');
      return jsonValue != null ? setTODOS(JSON.parse(jsonValue)) : null;
    } catch (e) {
      console.log(e);
    }
  };

  // --------------------------- other funcs --------------------------
  useEffect(() => {
    RNBootSplash.hide({fade: true}); // fade
    getTasks();
  }, []);

  //----check tasks
  function checkToggle(i) {
    TODOS[i].status = !TODOS[i].status;
    setTODOS(TODOS);
    AsyncStorage.removeItem('storageTasks');
    storeTasks(TODOS);
  }

  //----open edit and remove options
  function toggleOption(id) {
    id !== null && setOptions(true);
    setFocusedTask(id);
  }
  //edit and remove option opener
  function closeOption() {
    setOptions(false);
  }

  //----delete tasks
  function delTask(id) {
    const otherTasks = TODOS.filter(itms => itms.id != id);
    setTODOS(otherTasks);
    closeOption();
    AsyncStorage.removeItem('storageTasks');
    storeTasks(otherTasks);
  }

  //----edit task
  function editHandler(id) {
    //opens edit menu with holded tasks values in it
    closeOption();
    setEditMenu(true);
    const holded = TODOS.filter(itms => itms.id == id);
    setInputVal(holded[0].title);
    setRadioVal(holded[0].priority);
  }

  //----add tasks
  function addHandeler(task, pri, id) {
    if (editMenu) {
      //for edit
      const newTodos = [...TODOS];
      const todoIndex = TODOS.findIndex(todo => todo.id === id);
      const holded = TODOS.filter(itms => itms.id == id);
      holded[0].title = inputVal;
      holded[0].priority = radioVal;
      newTodos.splice(todoIndex, 1, holded[0]);
      setTODOS(newTodos);
      storeTasks(TODOS);
      setInputVal('');
      setRadioVal('Normal');
      setEditMenu(false);
      Top.value = HEIGHT / 1.13;
    } else {
      //for add
      if (inputVal !== '') {
        TODOS = [
          ...TODOS,
          {
            title: task,
            priority: pri,
            status: true,
            id: Math.random().toString(),
          },
        ];
        setTODOS(TODOS);
        storeTasks(TODOS);
        setInputVal('');
        setRadioVal('Normal');
        setEditMenu(false);
        Top.value = HEIGHT / 1.13;
      } else {
        todoInput.current.focus();
      }
    }
  }
  // -------------------------- gesture Handler & reanimated ------------------------
  const Top = useSharedValue(HEIGHT / 1.12);
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startBottom = Top.value;
    },
    onActive: (event, context) => {
      if (event.translationY + context.startBottom < HEIGHT / 1.5) {
        Top.value = HEIGHT / 2;
        // Top.value = event.translationY + context.startBottom
      }
      if (
        Top.value === HEIGHT / 2 &&
        event.translationY + context.startBottom > HEIGHT / 1.5
      ) {
        // Top.value = event.translationY + context.startBottom;
        Top.value = HEIGHT / 1.13;
      }
    },
  });
  const modalBottom = useAnimatedStyle(() => {
    return {
      top: withSpring(Top.value, {
        stiffness: 150,
        damping: 15,
      }),
    };
  });

  function openAddMenu() {
    Top.value = HEIGHT / 2;
  }
  function closeAddMenu() {
    Top.value = HEIGHT / 1.13;
  }

  const renderData =
    priFilter === 'High'
      ? TODOS.filter(item => item.priority === 'High')
      : priFilter === 'Normal'
      ? TODOS.filter(item => item.priority === 'Normal')
      : priFilter === 'Low'
      ? TODOS.filter(item => item.priority === 'Low')
      : TODOS;

  // --------------------------- J S X -----------------------------------------
  return (
    <SafeAreaView style={{backgroundColor: BG, flex: 1, position: 'relative'}}>
      <StatusBar backgroundColor={BG} barStyle="light-content" />
      <DoubleTapToClose />

      {TODOS.length === 0 || null ? (
        // ---------- if there is no task show this -----------
        <LottieView
          source={require('./assets/empty_folder.json')}
          autoPlay
          loop
          style={{width: '100%'}}
        />
      ) : (
        // ---------- flatlist -----------
        <MasonryList
          style={{
            flex: 1,
          }}
          refreshing={false}
          numColumns={2}
          data={renderData}
          renderItem={({item}) => (
            <RenderItem
              item={item}
              checkToggle={checkToggle}
              TODOS={TODOS}
              toggleOption={toggleOption}
              closeOption={closeOption}
              focusedTask={focusedTask}
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/*-------- bottom sheet ----------*/}
      <BottomModal
        setPriFilter={setPriFilter}
        priFilter={priFilter}
        setInputVal={setInputVal}
        inputVal={inputVal}
        setRadioVal={setRadioVal}
        radioVal={radioVal}
        options={options}
        todoInput={todoInput}
        addHandeler={addHandeler}
        focusedTask={focusedTask}
        delTask={delTask}
        editHandler={editHandler}
        gestureHandler={gestureHandler}
        modalBottom={modalBottom}
        openAddMenu={openAddMenu}
        closeAddMenu={closeAddMenu}
      />
    </SafeAreaView>
  );
}
