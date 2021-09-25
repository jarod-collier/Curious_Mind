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
  LayoutAnimation,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {styles} from '../assets/styles/styles';

export default class PastorSignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstName: '',
      LastName: '',
      Username: '',
      Password: '',
      Email: '',
      preach: '',
      seminary: '',
      addintionalInfo: '',
    };
    this.clearFirstName = React.createRef();
    this.clearLastName = React.createRef();
    this.clearUsername = React.createRef();
    this.clearPassword = React.createRef();
    this.clearEmail = React.createRef();
    this.clearPreach = React.createRef();
    this.clearSeminary = React.createRef();
    this.clearAdditionalInfo = React.createRef();
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
          console.log('successfully created pastor account');
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
            Email: '' + this.state.Email,
            Preach: '' + this.state.preach,
            Seminary: '' + this.state.seminary,
            AddintionalInfo: '' + this.state.addintionalInfo,
            pastorCode:
              '' +
              (Math.random().toString(16).substring(2, 6) +
                Math.random().toString(16).substring(2, 6)),
            uid: UserId,
            commentNum: 0,
            postNum: 0,
            score: 0,
            userType: 'pastor',
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
              styles={styles.logo}
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
              placeholder="  Church preaching at"
              placeholderTextColor="black"
              blurOnSubmit={true}
              onChangeText={e => {
                this.setState({preach: e});
              }}
              ref={this.clearPreach}
            />
            <TextInput
              style={[styles.inputBox, styles.width300]}
              placeholder="Where did you attend Seminary?"
              placeholderTextColor="black"
              blurOnSubmit={true}
              onChangeText={e => {
                this.setState({seminary: e});
              }}
              ref={this.clearSeminary}
            />
            <TextInput
              style={styles.multiline}
              placeholder="Any additional information you would like to share"
              placeholderTextColor="black"
              multiline={true}
              numberOfLines={10}
              blurOnSubmit={true}
              returnKeyType="done"
              onChangeText={e => {
                this.setState({addintionalInfo: e});
              }}
              ref={this.clearAdditionalInfo}
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
//     backgroundColor: '#f7f2f1',
//     alignItems: 'center',
//   },
//   logo: {
//     marginHorizontal: 100,
//     // marginTop: 50,
//     marginBottom: 10,
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
//     textAlign: 'left',
//     marginTop: 10,
//     margin: 10,
//     paddingHorizontal: 10,
//   },
//   multiline: {
//     borderRadius: 15,
//     borderColor: 'black',
//     backgroundColor: 'white',
//     borderWidth: 1,
//     width: 320,
//     height: 100,
//     textAlign: 'left',
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
