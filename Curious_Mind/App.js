import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Image, Text, TouchableOpacity, Alert} from 'react-native';
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
import {Button} from 'react-native-vector-icons/FontAwesome';
import {signOut, getAuth} from 'firebase/auth';
import './Firebase/config';

import {styles} from './assets/styles/styles';

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['AsyncStorage', 'Require cycle']); // Ignore log notification by message

const Tab = createBottomTabNavigator();

function Main_Screen({navigation}) {
  return (
    <Tab.Navigator
      initialRouteName="Home Tab"
      screenOptions={{
        tabBarActiveTintColor: '#3c4498',
        tabBarInactiveTintColor: 'black',
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: '#f7f2f1',
        tabBarInactiveBackgroundColor: '#f7f2f1',
        headerTitle: () => (
          <Image source={require('./assets/images/CM_logo02_header.png')} />
        ),
        headerTitleAlign: 'center',
        tabBarstyle: [
          {
            display: 'flex',
            elevation: 0,
            backgroundColor: '#f7f2f1',
          },
          null,
        ],
        headerStyle: {
          backgroundColor: '#f7f2f1',
          borderBottomWidth: 0,
        },
      }}>
      <Tab.Screen
        name="Home Tab"
        component={Nested_Main}
        options={{
          headerShown: false,
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
        component={Nested_Event}
        options={{
          headerShown: false,
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
        component={Nested_Profile}
        options={{
          headerShown: false,
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

const Nested_Stack_Main = createStackNavigator();
function Nested_Main({navigation}) {
  return (
    <Nested_Stack_Main.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <Image source={require('./assets/images/CM_logo02_header.png')} />
        ),
        headerTitleAlign: 'center'
      }}>
      <Nested_Stack_Main.Screen name="Main Feed" component={MainFeedScreen} />
      <Nested_Stack_Main.Screen 
        name="Thread"
        component={ThreadScreen}
        options={{
          headerBackImage: () => (
            <Button
              style={styles.backButton}
              color="black"
              name="arrow-left"
              onPress={() => navigation.navigate("Main Feed")}
            />
          ),
          headerBackTitle: '',
        }}
      />
      <Nested_Stack_Main.Screen
        name="View Profile"
        component={ViewProfileScreen}
        options={{
          headerBackImage: () => (
            <Button
              style={styles.backButton}
              color="black"
              name="arrow-left"
              onPress={() => navigation.navigate("Main Feed")}
            />
          ),
          headerBackTitle: '',
        }}
      />
    </Nested_Stack_Main.Navigator>
  );
}

const Nested_Stack_Event = createStackNavigator();
function Nested_Event({navigation}) {
  return (
    <Nested_Stack_Event.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <Image source={require('./assets/images/CM_logo02_header.png')} />
        ),
        headerTitleAlign: 'center'
      }}>
      <Nested_Stack_Event.Screen name="Event Feed" component={EventScreen} />
      <Nested_Stack_Event.Screen 
        name="Add Event" 
        component={NewEventScreen} 
        options={{
          headerBackImage: () => (
            <Button
              style={styles.backButton}
              color="black"
              name="arrow-left"
              onPress={() => navigation.navigate("Event Feed")}
            />
          ),
        }}
      />
    </Nested_Stack_Event.Navigator>
  );
}

const Nested_Stack_Profile = createStackNavigator();
function Nested_Profile({navigation}) {
  return (
    <Nested_Stack_Profile.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <Image source={require('./assets/images/CM_logo02_header.png')} />
        ),
        headerTitleAlign: 'center'
      }}>
      <Nested_Stack_Profile.Screen 
        name="Profile Screen" 
        component={ProfileScreen} 
        options={{
          headerRight: props => (
            <TouchableOpacity
              style={styles.logoutButtons}
              onPress={() => signUserOut(navigation)}>
              <Text style={styles.customBtnText}>Log Out</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Nested_Stack_Profile.Screen
        name="Reset Password"
        component={ResetPasswordScreen}
        options={{
          headerBackImage: () => (
            <Button
              style={styles.backButton}
              color="black"
              name="arrow-left"
              onPress={() => navigation.navigate("Profile Screen")}
            />
          ),
        }}
      />
    </Nested_Stack_Profile.Navigator>
  );
}

function signUserOut(navigation) {
  const auth = getAuth();
  signOut(auth)
    .then(navigation.navigate('Login'))
    .catch(error => Alert.alert(error.message));
}
const Stack = createStackNavigator();

const MyTheme = {
  colors: {
    background: '#f7f2f1',
    border: 'transparent',
  },
};

function AppContainer() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="User Type" component={UserTypeScreen} />
        <Stack.Screen name="Security Code" component={PastorSecCodeScreen} />
        <Stack.Screen name="Pastor SignUp" component={PastorSignUpScreen} />
        <Stack.Screen name="User SignUp" component={UserSignUpScreen} />
        <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={Main_Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
