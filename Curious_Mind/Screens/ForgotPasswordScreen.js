import 'react-native-gesture-handler';
import {Alert} from 'react-native';
import React, {Component} from 'react';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import {getDatabase, ref, onValue} from 'firebase/database';
import {Button} from 'react-native-vector-icons/FontAwesome';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {styles} from '../assets/styles/styles';
export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
    };
  }

  resetPassword(navigation) {
    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/');
    let allUserEmails = [];
    onValue(userInfoRef, snapshot => {
      snapshot.forEach(element => {
        allUserEmails.push(element.val().Email);
      });

      if (allUserEmails.includes(this.state.Email)) {
        const auth = getAuth();
        sendPasswordResetEmail(auth, this.state.Email)
          .then(() => {
            // Password reset email sent!
            Alert.alert(
              'Reset Password',
              'Your password has been reset.\nPlease check your email to finish the process',
              [{text: 'OK', onPress: () => navigation.goBack()}],
              {cancelable: false},
            );
          })
          .catch(error => {
            const errorMessage = error.message;
            console.log('error sending reset password email: ' + errorMessage);
          });
      } else {
        Alert.alert(
          'Incorrect Email',
          `The email you provided is: "${this.state.Email}". This does not exist in our database. Please try a different email.`,
        );
      }
    });
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <View style={styles.alignSelfStart}>
          <Button
            style={styles.backButton}
            color="black"
            name="arrow-left"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
        <ScrollView>
          <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={[styles.container, styles.aligItemsCenter]}
            scrollEnabled={true}
            extraHeight={100}
            keyboardShouldPersistTaps="handled">
            <Image
              style={styles.logo}
              source={require('../assets/images/CM_logo02.png')}
            />
            <Text style={styles.generalText}>
              Please enter the email address for your account. You will then get
              an email from "noreply@curios-mind-82101.firebaseapp.com".
              {'\n\n'}Follow the instructions in the email to reset your
              password.
            </Text>
            <TextInput
              style={[styles.inputBox, styles.width300]}
              placeholder="Enter your email"
              placeholderTextColor="grey"
              returnKeyType="done"
              onChangeText={e => this.setState({Email: e})}
            />
            <TouchableOpacity
              style={[
                styles.Buttons,
                styles.marginBottom30,
                styles.marginTop35,
              ]}
              onPress={() => this.resetPassword(this.props.navigation)}>
              <Text style={styles.customBtnText}>Send Email</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f7f2f1',
//     alignItems: 'center',
//     justifyContent: 'space-evenly',
//     padding: 10,
//     alignSelf: 'center',
//   },
//   logo: {
//     // marginHorizontal: 100,
//     // marginTop: 50,
//     // marginBottom: 10,
//   },
//   inputBox: {
//     borderRadius: 15,
//     borderColor: 'black',
//     backgroundColor: 'white',
//     borderWidth: 1,
//     width: 250,
//     textAlign: 'center',
//     alignSelf: 'center',
//     padding: 8,
//     marginVertical: 10,
//   },
//   Buttons: {
//     shadowColor: 'rgba(0,0,0, .4)', // IOS
//     shadowOffset: {height: 3, width: 3}, // IOS
//     shadowOpacity: 1, // IOS
//     shadowRadius: 1, //IOS
//     elevation: 4, // Android
//     borderWidth: 1,
//     backgroundColor: '#3c4498',
//     justifyContent: 'center',
//     alignSelf: 'center',
//     borderColor: '#3c4498',
//     borderRadius: 25,
//     width: 250,
//     height: 35,
//     marginVertical: 10,
//   },
//   customBtnText: {
//     fontSize: 20,
//     fontWeight: '400',
//     color: 'white',
//     textAlign: 'center',
//   },
//   generalText: {
//     padding: 15,
//     color: 'black',
//     alignSelf: 'center',
//     fontSize: 20,
//     textAlign: 'center',
//   },
// });
