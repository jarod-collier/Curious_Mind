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
import Spinner from 'react-native-loading-spinner-overlay';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      Password: '',
      Loading: false,
      loginDisabled: true,
      Spinner: false
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
            keyboardShouldPersistTaps={'handled'}
          >
            <Spinner
              visible={this.state.Spinner}
              textContent={'Logging in...'}
              textStyle={styles.spinnerTextStyle}
              cancelable={true}
            />
            <Image
              style={styles.logo}
              source={require('../assets/images/CM_logo02.png')}
            />
            <TextInput
              style={[styles.inputBox, styles.width300]}
              placeholder="Enter your Email"
              value={this.state.Email || null}
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
              value={this.state.Password || null}
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
              // *************************************************************************************************
              // RE ENABLE ME BEFORE PUBLISHING
              // disabled={this.state.loginDisabled}
              // RE ENABLE ME BEFORE PUBLISHING
              // *************************************************************************************************
              onPress={async () => {
                this.setState({Spinner: true});
                await logInUser(
                  this.state.Email,
                  this.state.Password,
                  this.props.navigation,
                );
                this.state.Spinner = false;
                this.setState({Email: '', Password: ''});
              }}>
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
