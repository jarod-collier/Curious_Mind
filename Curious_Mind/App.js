import React from 'react';
import {NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Image, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from './Screens/LoginScreen';
import UserTypeScreen from './Screens/UserTypeScreen';
import PastorSecCodeScreen from './Screens/PastorSecCodeScreen';
import UserSignUpScreen from './Screens/UserSignUpScreen';
import PastorSignUpScreen from './Screens/PastorSignUpScreen';
import MainFeedScreen from './Screens/MainFeedScreen';
import NewPostScreen from './Screens/NewPostScreen';
import EventScreen from './Screens/EventScreen';
import ProfileScreen from './Screens/ProfileScreen';
import NewEventScreen from './Screens/NewEventScreen';
import ThreadScreen from './Screens/ThreadScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import ViewProfileScreen from './Screens/ViewProfileScreen';

import {signOut, getAuth} from 'firebase/auth';
import './Firebase/config';

import {styles} from './assets/styles/styles';

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['AsyncStorage', 'Require cycle']); // Ignore log notification by message

const Tab = createBottomTabNavigator();

function Main_Screen() {
  return (
    <Tab.Navigator
      initialRouteName="Home Tab"
      screenOptions={{
        tabBarActiveTintColor: '#3c4498',
        tabBarInactiveTintColor: 'black',
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: '#f7f2f1',
        tabBarInactiveBackgroundColor: '#f7f2f1',
        tabBarstyle: [
          {display: 'flex', elevation: 0, borderTopColor: 'transparent'},
          null,
        ],
        headerStyle: {backgroundColor: "#f7f2f1", borderBottomWidth: 0}
      }}>
      <Tab.Screen
        name="Home Tab"
        component={Nested_Main}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: props => (
            <Image source={require('./assets/images/CM_logo02_header.png')} />
          ),
   
          tabBarLabel: 'Home',
          tabBarLabelStyle: styles.tabText,
          tabBarIcon: ({color, focused}) =>
            focused ? (
              <MaterialCommunityIcons name="home" color={color} size={30} />
            ) : (
              <MaterialCommunityIcons
                name="home-outline"
                color={color}
                size={30}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={NewPostScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitle: props => (
            <Image source={require('./assets/images/CM_logo02_header.png')} />
          ),
          headerShown: true,
          tabBarLabelStyle: styles.tabText,
          tabBarIcon: ({color, focused}) =>
            focused ? (
              <MaterialCommunityIcons
                name="chat-plus"
                color={color}
                size={30}
              />
            ) : (
              <MaterialCommunityIcons
                name="chat-plus-outline"
                color={color}
                size={30}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventScreen}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: props => (
            <Image source={require('./assets/images/CM_logo02_header.png')} />
          ),
          tabBarLabelStyle: styles.tabText,
          tabBarIcon: ({color, focused}) =>
            focused ? (
              <MaterialCommunityIcons
                name="calendar-text"
                color={color}
                size={30}
              />
            ) : (
              <MaterialCommunityIcons
                name="calendar-text-outline"
                color={color}
                size={30}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: props => (
            <Image source={require('./assets/images/CM_logo02_header.png')} />
          ),
           headerRight: () => (
              <TouchableOpacity
                style={styles.logoutButtons}
                onPress={() => signUserOut() }>
                <Text style={styles.customBtnText}>Log Out</Text>
              </TouchableOpacity>
            ),
          tabBarLabelStyle: styles.tabText,
          tabBarIcon: ({color, focused}) =>
            focused ? (
              <MaterialCommunityIcons name="account" color={color} size={30} />
            ) : (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={30}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
}
const Nested_Stack = createStackNavigator();
function Nested_Main() {
  return (
    <Nested_Stack.Navigator
      screenOptions={{ headerShown: false, }}>
      <Nested_Stack.Screen name="Main Feed" component={MainFeedScreen} />
      <Nested_Stack.Screen name="Thread" component={ThreadScreen} />
      <Nested_Stack.Screen name="Add Event" component={NewEventScreen} />
      <Nested_Stack.Screen name="Reset Password" component={ResetPasswordScreen} />
    </Nested_Stack.Navigator>
  );
}

const delay = ms => new Promise(res => setTimeout(res, ms));
function signUserOut() {
  console.log("inside sing user out");
  // const resetAction = NavigationActions.reset({
  //   index: 0,
  //   actions: [
  //     NavigationActions.navigate({ routeName: 'HomeScreen'})
  //   ] });
  const auth = getAuth();
  signOut(auth)
    .then(
      () => delay(500),
      // this.props.navigation.dispatch(resetAction)
    )
    .catch(error => Alert.alert(error.message));
}
const Stack = createStackNavigator();

function AppContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="User Type" component={UserTypeScreen} options= {{headerShown: false}} />
        <Stack.Screen name="Thread" component={ThreadScreen} />
        <Stack.Screen name="Security Code" component={PastorSecCodeScreen} options= {{headerShown: false}} />
        <Stack.Screen name="Pastor SignUp" component={PastorSignUpScreen} options= {{headerShown: false}} />
        <Stack.Screen name="User SignUp" component={UserSignUpScreen} options= {{headerShown: false}} />
        <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} options= {{headerShown: false}} />
        <Stack.Screen name="Home" component={Main_Screen} />
        <Stack.Screen name="View Profile" component={ViewProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
