import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
      Password: '',
      Email: '',
    };
    this.clearFirstName = React.createRef();
    this.clearLastName = React.createRef();
    this.clearUsername = React.createRef();
    this.clearPassword = React.createRef();
    this.clearEmail = React.createRef();
  }

  async handleSignUp(navigation) {
    const valid = await this.checkUsername();
    if (valid) {
      let UserId;

      const auth = getAuth();
      createUserWithEmailAndPassword(
        auth,
        this.state.Email,
        this.state.Password,
      )
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f7f2f1',
//     alignItems: 'center',
//   },
//   logo: {
//     marginHorizontal: 100,
//     // marginTop: 100,
//     marginBottom: 50,
//   },
//   namesInput: {
//     borderRadius: 15,
//     borderColor: 'black',
//     backgroundColor: 'white',
//     borderWidth: 1,
//     width: 150,
//     height: 40,
//     textAlign: 'left',
//     marginTop: 10,
//     margin: 10,
//     paddingHorizontal: 10,
//   },
//   inputBox: {
//     borderRadius: 15,
//     borderColor: 'black',
//     backgroundColor: 'white',
//     borderWidth: 1,
//     width: 320,
//     height: 40,
//     marginTop: 10,
//     margin: 10,
//     paddingHorizontal: 10,
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
//   infoHereText: {
//     fontSize: 16,
//     fontWeight: '400',
//     color: 'red',
//     textAlign: 'center',
//   },
// });
