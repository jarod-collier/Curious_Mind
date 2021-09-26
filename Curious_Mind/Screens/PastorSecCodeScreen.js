import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {getDatabase, ref, onValue} from 'firebase/database';
import {
  SafeAreaView,
  View,
  LayoutAnimation,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {styles} from '../assets/styles/styles';

export default class PastorSecCodeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Code: '',
    };
    this.clearCode = React.createRef();
  }

  async readFromDB() {
    let found = false;

    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/');

    onValue(userInfoRef, snapshot => {
      snapshot.forEach(child => {
        if (child.val().userType === 'pastor') {
          if (child.val().pastorCode === this.state.Code) {
            found = true;
          }
        }
      });
    });
    return found;
  }

  async validateCode(navigation) {
    var valid = await this.readFromDB();
    if (valid) {
      navigation.navigate('Pastor SignUp');
    } else {
      Alert.alert(
        'The code you entered of "' +
          this.state.Code +
          '" is not a valid security code.',
      );
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
            extraHeight={100}
            keyboardShouldPersistTaps="handled">
            <Image
              style={styles.logo}
              source={require('../assets/images/CM_logo02.png')}
            />
            <Text style={styles.securityCodeText}>
              Please enter a Pastor's{'\n'}Security Code*
            </Text>
            <Text style={styles.securityCodeAsterisk}>
              *To sign up as a pastor, you must get a security code from a
              pastor that already has an account.
              {'\n\n'}Security codes can be found on the pastor's profile
              screen.
            </Text>
            <TextInput
              style={[styles.inputBox, styles.noBorderInput]}
              placeholder="Enter Code Here"
              placeholderTextColor="black"
              onChangeText={e => {
                this.setState({Code: e});
              }}
              ref={this.clearCode}
            />
            <TouchableOpacity
              style={styles.Buttons}
              onPress={() => this.validateCode(this.props.navigation)}>
              <Text style={styles.customBtnText}>Confirm</Text>
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
//     backgroundColor: 'silver',
//     alignItems: 'center',
//   },
//   logo: {
//     marginHorizontal: 100,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   inputBox: {
//     borderBottomWidth: 1.0,
//     width: 250,
//     textAlign: 'center',
//     marginTop: 50,
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
//     marginVertical: 40,
//   },
//   customBtnText: {
//     fontSize: 28,
//     fontWeight: '400',
//     color: 'white',
//     textAlign: 'center',
//   },
//   securityCodeText: {
//     fontSize: 35,
//     fontWeight: '400',
//     color: 'black',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   securityCodeAsterisk: {
//     fontSize: 20,
//     color: 'black',
//     textAlign: 'center',
//     marginHorizontal: 50,
//     marginTop: 10,
//   },
// });
