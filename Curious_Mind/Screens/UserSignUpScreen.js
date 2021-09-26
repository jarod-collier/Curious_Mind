import 'react-native-gesture-handler';
import React, {Component} from 'react';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {getDatabase, ref, set, onValue} from 'firebase/database';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {styles} from '../assets/styles/styles';

export default class UserSignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstName: '',
      LastName: '',
      Username: '',
      Password1: '',
      Password2: '',
      Email: '',
    };
    this.clearFirstName = React.createRef();
    this.clearLastName = React.createRef();
    this.clearUsername = React.createRef();
    this.clearPassword = React.createRef();
    this.clearEmail = React.createRef();
  }

  async handleSignUp(navigation) {
    const validUserName = await this.checkUsername();
    if ( validUserName ) {
      let UserId;

      const auth = getAuth();

      // Password are not empty
      if ( this.state.Password1 !== '' && this.state.Password2 !== '' ) {

        // Passwords match
        if (this.state.Password1 === this.state.Password2) {

          // Passwords are greater than length 6
          if (this.state.Password1.length >= 6 && this.state.Password2.length >= 6 ) {

            createUserWithEmailAndPassword(auth, this.state.Email, this.state.Password1)
            .then(userCredential => {
              // Signed in
              console.log('successfully created user account');
              UserId = userCredential.user.uid;
            })
            .catch(error => {
              console.log('failure creating account');
              const errorMessage = error.message;
              console.log('error message: ' + errorMessage);
            })
            .then(() => {
              const db = getDatabase();
              set(ref(db, 'userInfo/' + UserId), {
                First: '' + this.state.FirstName,
                Last: '' + this.state.LastName,
                Username: '' + this.state.Username,
                uid: UserId,
                postNum: 0,
                commentNum: 0,
                AddintionalInfo: '',
                score: 0,
                userType: 'user',
                Email: this.state.Email,
              });
            })
            .catch(error => {
              console.log('failure setting data');
            })
            .then(() =>
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              }),
            );
         } 
          else {
            
            //new passwords less than 6 characters
            Alert.alert(
              'New password needs to be at least 6 characters long',
            );
          }
        } else {
          //passwords dont match
          Alert.alert("New passwords don't match");
        }
      } else {
        //empty new password
        Alert.alert('Please fill all fields');
      
      }
    }
  }

  async checkUsername() {
    let usernames = [];
    const db = getDatabase();
    const dbRef = ref(db, 'userInfo/');
    onValue(dbRef, snapshot => {
      snapshot.forEach(child => {
        usernames.push(child.val().Username);
      });
    });
    if (usernames.includes(this.state.Username)) {
      Alert.alert(
        'Username Error',
        'The username "' +
          this.state.Username +
          '" is already in use. Please try a different username.',
      );
      return false;
    } else {
      return true;
    }
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <View style={styles.backButtonContainer}>
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
            extraHeight={100}>
            <Image
              style={styles.logo}
              source={require('../assets/images/CM_logo02.png')}
            />
            <Text style={styles.infoHereText}>* Denotes Required Fields</Text>
            <View style={styles.rowCenter}>
              <TextInput
                style={styles.namesInput}
                placeholder="First name"
                placeholderTextColor="black"
                blurOnSubmit={true}
                onChangeText={e => {
                  this.setState({FirstName: e});
                }}
                ref={this.clearFirstName}
              />
              <TextInput
                style={styles.namesInput}
                placeholder="Last name"
                placeholderTextColor="black"
                blurOnSubmit={true}
                onChangeText={e => {
                  this.setState({LastName: e});
                }}
                ref={this.clearLastName}
              />
            </View>
            <TextInput
              style={[styles.inputBox, styles.width300]}
              placeholder="Username*"
              placeholderTextColor="black"
              blurOnSubmit={true}
              onChangeText={e => {
                this.setState({Username: e});
              }}
              ref={this.clearUsername}
            />
            <TextInput
              style={[styles.inputBox, styles.width300]}
              placeholder="Email*"
              placeholderTextColor="black"
              keyboardType="email-address"
              blurOnSubmit={true}
              onChangeText={e => {
                this.setState({Email: e});
              }}
              ref={this.clearEmail}
            />
            <TextInput
              style={[styles.inputBox, styles.width300]}
              placeholder="Password*"
              secureTextEntry={true}
              placeholderTextColor="black"
              blurOnSubmit={true}
              onChangeText={e => {
                this.setState({Password: e});
              }}
              ref={this.clearPassword}
            />
            <TextInput
              style={[styles.inputBox, styles.width300]}
              placeholder="Confirm Password*"
              secureTextEntry={true}
              placeholderTextColor="black"
              blurOnSubmit={true}
              onChangeText={e => {
                this.setState({Password: e});
              }}
              ref={this.clearPassword}
            />
            <View style={[styles.marginBottom30, styles.marginTop35]}>
              <TouchableOpacity
                style={styles.Buttons}
                onPress={() => this.handleSignUp(this.props.navigation)}>
                <Text style={styles.customBtnText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
