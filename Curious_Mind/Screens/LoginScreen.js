import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {logInUser} from '../logic/DbLogic';
import {
  ScrollView,
  SafeAreaView,
  Text,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  Image,
} from 'react-native';
import {styles} from '../assets/styles/styles';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      Password: '',
      Loading: false,
      loginDisabled: true,
    };
    this.clearEmail = React.createRef();
    this.clearPassword = React.createRef();
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
              styles.marginBottom15,
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
                e.replace(/ /g, '') === '' ||
                this.state.Password.replace(/ /g, '') === ''
                  ? (this.state.loginDisabled = true)
                  : (this.state.loginDisabled = false);
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
                e.replace(/ /g, '') === '' ||
                this.state.Email.replace(/ /g, '') === ''
                  ? (this.state.loginDisabled = true)
                  : (this.state.loginDisabled = false);
                this.setState({Password: e});
              }}
              ref={this.clearPassword}
            />
            <TouchableOpacity
              style={[
                this.state.loginDisabled
                  ? styles.disabledButtons
                  : styles.Buttons,
              ]}
              disabled={this.state.loginDisabled}
              onPress={async () =>
                logInUser(
                  this.state.Email,
                  this.state.Password,
                  this.props.navigation,
                ).then(() => {
                  this.setState({Email: '', Password: ''});
                })
              }>
              <Text
                style={[
                  this.state.loginDisabled
                    ? styles.disabledBtnText
                    : styles.customBtnText,
                ]}>
                Log In
              </Text>
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
