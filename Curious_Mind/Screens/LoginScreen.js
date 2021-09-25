import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {getAuth, signOut, signInWithEmailAndPassword} from 'firebase/auth';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';

import {
  ScrollView,
  SafeAreaView,
  Text,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {styles} from '../assets/styles/styles';
// import {ScrollView} from 'react-native-gesture-handler';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      Password: '',
      Loading: false,
    };
    this.clearEmail = React.createRef();
    this.clearPassword = React.createRef();

    const auth = getAuth();

    /*TODO: IF WE WANT USERS TO STAY LOGGED IN WE CAN'T DO THIS */
    signOut(auth)
      .then(() => {
        console.log('signed out from opening app');
        // Sign-out successful.
      })
      .catch(error => {
        // An error happened.
        console.log("couldn't sign out");
      });
  }

  logInUser(navigation) {
    const auth = getAuth();
    // signInWithEmailAndPassword(auth, this.state.Email, this.state.Password)
    signInWithEmailAndPassword(auth, 'collierj@mail.gvsu.edu', 'Admin703')
      // signInWithEmailAndPassword(auth, "jarod.collier@yahoo.com", "User703")
      .then(userCredential => {
        console.log('signed in');

        this.setState({Email: '', Password: ''});
        //navigate to Main screen
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log('error code:');
        console.log(errorCode);
        //user doesn't exist
        if (errorCode === 'auth/user-not-found') {
          Alert.alert('Incorrect username or password. \nPlease try again');
        } else if (errorCode === 'auth/invalid-email') {
          Alert.alert(
            'Invalid email',
            'Please enter a correct email. You entered: "' +
              this.state.Email +
              '"',
          );
        } else if (errorCode === 'auth/wrong-password') {
          Alert.alert(
            'Invalid Entry',
            "Invalid email-password combination. If you're seeing this error, " +
              'it is likely that the password entered does not match the email you provided, but the email does exist in ' +
              ' our database.\n\nPlease try again.',
          );
        } else if (this.state.Password === '') {
          Alert.alert('Please enter a password.');
        } else {
          Alert.alert(errorCode + ': ' + errorMessage);
        }
      });
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <ScrollView>
          <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            enableResetScrollToCoords={false}
            contentContainerStyle={[
              styles.container,
              styles.aligItemsCenter,
              styles.marginTop35,
            ]}
            scrollEnabled={true}
            enableOnAndroid={true}
            keyboardShouldPersistTaps={'handled'}>
            <Image
              style={styles.logo}
              source={require('../assets/images/CM_logo02.png')}
            />
            <TextInput
              style={[styles.inputBox, styles.width300]}
              placeholder="Enter your Email"
              keyboardType="email-address"
              placeholderTextColor="grey"
              onChangeText={e => {
                this.setState({Email: e});
              }}
              ref={this.clearEmail}
            />
            <TextInput
              style={[styles.inputBox, styles.width300]}
              placeholder="Password"
              placeholderTextColor="grey"
              secureTextEntry={true}
              onChangeText={e => {
                this.setState({Password: e});
              }}
              ref={this.clearPassword}
            />
            <TouchableOpacity
              style={styles.Buttons}
              onPress={async () => this.logInUser(this.props.navigation)}>
              <Text style={styles.customBtnText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Buttons}
              onPress={() => this.props.navigation.navigate('Forgot Password')}>
              <Text style={styles.customBtnText}>Forgot Password?</Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.customBtnText,
                styles.colorBlack,
                styles.marginTop35,
              ]}>
              Don't have an account yet?
            </Text>
            <TouchableOpacity
              style={styles.Buttons}
              onPress={() => this.props.navigation.navigate('User Type')}>
              <Text style={styles.customBtnText}>Sign Up</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
