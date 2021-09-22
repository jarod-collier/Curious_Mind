
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import { Image, Text, View, StyleSheet, TouchableOpacity, Alert, SafeAreaView, StatusBar, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import {Button} from 'react-native-vector-icons/FontAwesome';

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

import { signOut, getAuth } from 'firebase/auth';
import './Firebase/config'


import { LogBox } from 'react-native';
LogBox.ignoreLogs(['AsyncStorage', 'Require cycle']); // Ignore log notification by message
//-------------------------- YOU ARE WELCOME XD----------------------------------------------

const Tab = createBottomTabNavigator();

function Main_Screen() {

  return (
    <Tab.Navigator
      initialRouteName="Home Tab"
      screenOptions={{
        "tabBarActiveTintColor": 'dodgerblue',
        "tabBarInactiveTintColor": 'black',
        "tabBarActiveBackgroundColor": 'white',
        "tabBarInactiveBackgroundColor": 'dodgerblue',
        "tabBarstyle": [{
          "display": "flex"
          },
          null]
      }}
    >
      <Tab.Screen
        name="Home Tab"
        component={Nested_Main}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarLabelStyle: styles.tabText,
          tabBarIcon: ({ color}) => (
            <MaterialCommunityIcons name="home" color={color} size={30} />
          ),
        }} />
      <Tab.Screen
        name="Post"
        component={NewPostScreen}
        options={{
          tabBarLabel: 'Post',
          headerShown: false,
          tabBarLabelStyle: styles.tabText,
          tabBarIcon: ({ color }) => ( 
            <MaterialCommunityIcons name="chat-plus" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventScreen}
        options={{
          tabBarLabel: 'Events',
          headerShown: false,
          tabBarLabelStyle: styles.tabText,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-text" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarLabelStyle: styles.tabText,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const Nested_Stack = createStackNavigator();
function Nested_Main(){
  return (
    <Nested_Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'dodgerblue',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerStatusBarHeight: 5,
      }}
    >
      <Nested_Stack.Screen
        name="Main Feed"
        component={MainFeedScreen}
        options={({ route }) => ({
          headerShown: false
        })}
      />
      <Nested_Stack.Screen
        name="Thread"
        component={ThreadScreen}
        options={({ route, navigation }) => ({
          headerTitle: "Thread",
          headerLeft: () => (
            <TouchableOpacity
              style={styles.Buttons}
              onPress={()=> navigation.navigate("Main Feed")}>
              <Text style={styles.customBtnText}>Back</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Nested_Stack.Screen
        name="Add Event"
        component={NewEventScreen}
        options={({ route, navigation }) => ({
          headerTitle: "Add Event",
          headerLeft: () => (
            <TouchableOpacity
              style={styles.Buttons}
              onPress={()=> navigation.navigate("Events")}>
              <Text style={styles.customBtnText}>Back</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Nested_Stack.Screen
        name="Reset Password"
        component={ResetPasswordScreen}
        options={({ route, navigation }) => ({
          headerTitle: "Reset Password",
          headerLeft: () => (
            <TouchableOpacity
              style={styles.Buttons}
              onPress={()=> navigation.navigate("Profile")}>
              <Text style={styles.customBtnText}>Back</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Nested_Stack.Navigator>
  )
}
const delay = ms => new Promise(res=>setTimeout(res,ms));
function signUserOut(navigation){
  const auth = getAuth();
  signOut(auth)
  .then(() => delay(500), navigation.reset({
    index: 0,
    routes: [{ name: 'Login'}],
  }))
  .catch(error => Alert.alert(error.message));
}
const Stack = createStackNavigator();
const MyTheme = {
  dark: false,
  colors: {
    primary: 'orange',
    background: 'silver',
    card: 'green',
    text: 'red',
    // border: 'red',
  },
};

function AppContainer() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'dodgerblue',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      >
        {/* Do we need to add more back buttons for ios??? */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="User Type" component={UserTypeScreen} />
        <Stack.Screen name="Thread" component={ThreadScreen} />
        <Stack.Screen name="Security Code" component={PastorSecCodeScreen} />
        <Stack.Screen name="Pastor SignUp" component={PastorSignUpScreen} />
        <Stack.Screen name="User SignUp" component={UserSignUpScreen} />
        <Stack.Screen 
          name="Forgot Password" 
          component={ForgotPasswordScreen}
          options={({ navigation, route }) => ({
            headerLeft: () => (
              <TouchableOpacity
                style={styles.Buttons}
                onPress={()=> navigation.navigate("Login")}>
                <Text style={styles.customBtnText}>Back</Text>
              </TouchableOpacity>
          ),
          })}
        />
        <Stack.Screen
          name="Home"
          component={Main_Screen}
          options={({ navigation, route }) => ({
            headerTitle: props => <Image source={require('./images/CM_logo02_header.png')}/>,
            headerRight: () => (
              <TouchableOpacity
                style={styles.Buttons}
                onPress={()=> signUserOut(navigation)}>
                <Text style={styles.customBtnText}>Log Out</Text>
              </TouchableOpacity>
          ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  tabText: {
    fontSize: 15,
  },
  logoutText: {
    // fontSize: 20,
    // fontWeight: '400',
    color: "black",
    textAlign: "center",
    marginHorizontal: 7
  },
  Buttons: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 2, width: 2}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 4, // Android
    backgroundColor: 'silver',
    justifyContent: 'center',
    borderRadius: 25,
    width: 100,
    height: 30,
    marginVertical: 10,
    margin: 10
  },
  customBtnText: {
    fontSize: 20,
    fontWeight: '400',
    color: "white",
    textAlign: "center"
  },
});

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
