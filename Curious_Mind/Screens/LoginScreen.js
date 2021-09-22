import 'react-native-gesture-handler';
import React, {Component, useState} from 'react';
import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';

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
    signOut(auth).then(() => {
      console.log("signed out from opening app");
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.log("couldn't sign out");
    });
  }

  logInUser(navigation) {
    const auth = getAuth();
    // signInWithEmailAndPassword(auth, this.state.Email, this.state.Password)
    // signInWithEmailAndPassword(auth, "collierj@mail.gvsu.edu", "Admin703")
    signInWithEmailAndPassword(auth, "jarod.collier@yahoo.com", "User703")
      .then((userCredential) => {
        console.log("signed in");

        this.setState({Email: '', Password: ''});
        //navigate to Main screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home'}],
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log("error code:");
        console.log(errorCode);
        //user doesn't exist
        if (errorCode === "auth/user-not-found"){
          Alert.alert('Incorrect username or password. \nPlease try again');
        } else if(errorCode === "auth/invalid-email"){
          Alert.alert('Invalid email', 'Please enter a correct email. You entered: "' + this.state.Email + '"');
        } else if(errorCode === "auth/wrong-password"){
          Alert.alert("Invalid Entry", "Invalid email-password combination. If you're seeing this error, " +
          "it is likely that the password entered does not match the email you provided, but the email does exist in " +
          " our database.\n\nPlease try again.");
        
        } else if (this.state.Password === '') {
          Alert.alert("Please enter a password.");
        } else {
          Alert.alert(errorCode + ": " + errorMessage);
        }
      }
    );
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            extraHeight={100}
          >
          <View style={styles.container}>
            <View style={styles.logo}>
              <Image source={require('../images/CM_logo02.png')}/>
            </View>
            <View>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter your Email"
                keyboardType='email-address'
                placeholderTextColor="black"
                onChangeText={e => {this.setState({Email: e});}}
                ref={this.clearEmail}
              />
              <TextInput
                style={styles.inputBox}
                placeholder="Password"
                placeholderTextColor="black"
                secureTextEntry={true}
                onChangeText={e => {this.setState({Password: e});}}
                ref={this.clearPassword}
              />
              <View>
                <TouchableOpacity
                  style={styles.Buttons}
                  onPress={async ()=> this.logInUser(this.props.navigation)}>
                  <Text style={styles.customBtnText}>Log In</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.Buttons}
                  onPress={() => 
                    this.props.navigation.navigate('Forgot Password')}
                >
                  <Text style={styles.customBtnText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <Text
                style={styles.customBtnText}>
                Don't have an account yet?
              </Text>
              <TouchableOpacity
                style={styles.Buttons}
                onPress={()=> 
                  this.props.navigation.navigate('User Type')}
              >
                <Text style={styles.customBtnText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'silver',
    alignItems: 'center',
    justifyContent: "space-evenly",
    padding: 10,
  },
  logo: {
    marginTop: 50,
    marginBottom: 30,
  },
  inputBox: {
    borderRadius: 15,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    width: 250,
    textAlign: 'center',
    padding: 8,
    marginVertical: 10
  },
  Buttons: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 3, width: 3}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 4, // Android
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
    borderRadius: 25,
    width: 250,
    height: 30,
    marginVertical: 10,
  },
  customBtnText: {
    fontSize: 20,
    fontWeight: '400',
    color: "black",
    textAlign: "center"
  },
});
