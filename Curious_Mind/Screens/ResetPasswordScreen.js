import 'react-native-gesture-handler';
import {Keyboard} from 'react-native';
import React, {Component} from 'react';
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
import {resetPassword} from '../logic/DbLogic';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ResetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      Password1: '',
      Password2: '',
      errorCounter: 0,
      buttonDisabled: true,
      Spinner: false,
    };

    this.clearOldPassword = React.createRef();
    this.clearPassword1 = React.createRef();
    this.clearPassword2 = React.createRef();
  }

  shouldButtonBeDisabled() {
    if (
      this.state.oldPassword.replace(/ /g, '') !== '' &&
      this.state.Password1.replace(/ /g, '') !== '' &&
      this.state.Password2.replace(/ /g, '') !== ''
    ) {
      this.state.buttonDisabled = false;
      return false;
    } else {
      this.state.buttonDisabled = true;
      return true;
    }
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <ScrollView>
          <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={[styles.container, styles.aligItemsCenter]}
            scrollEnabled={true}
            extraHeight={100}
            keyboardShouldPersistTaps="handled"
          >
            <Spinner
              visible={this.state.Spinner}
              textContent={'Resetting Password...'}
              textStyle={styles.spinnerTextStyle}
              cancelable={true}
            />
            <View style={styles.logo}>
              <Image source={require('../assets/images/CM_logo02.png')} />
            </View>
            <View>
              <Text style={[styles.italicCenter, styles.marginBottom30]}>
                * New password needs to be at least {'\n'}6 characters long
              </Text>
              <TextInput
                style={[styles.inputBox, styles.width300]}
                placeholder="Enter old password"
                value={this.state.oldPassword || null}
                placeholderTextColor="black"
                secureTextEntry={true}
                onChangeText={e => {
                  this.setState({oldPassword: e});
                }}
                ref={this.clearOldPassword}
              />
              <TextInput
                style={[styles.inputBox, styles.width300]}
                placeholder="Enter new password*"
                value={this.state.Password1 || null}
                placeholderTextColor="black"
                secureTextEntry={true}
                onChangeText={e => {
                  this.setState({Password1: e});
                }}
                ref={this.clearPassword1}
              />
              <TextInput
                style={[styles.inputBox, styles.width300]}
                placeholder="Enter new password again*"
                value={this.state.Password2 || null}
                placeholderTextColor="black"
                secureTextEntry={true}
                onChangeText={e => {
                  this.setState({Password2: e});
                }}
                ref={this.clearPassword2}
              />
              <TouchableOpacity
                disabled={this.shouldButtonBeDisabled()}
                style={[
                  styles.marginBottom30,
                  styles.marginTop35,
                  styles.alignSelfCenter,
                  this.state.buttonDisabled
                    ? styles.disabledButtons
                    : styles.Buttons,
                ]}
                onPress={async () => {
                  this.setState({Spinner: true});
                  await resetPassword(this.state, this.props.navigation).then(
                    counter => (this.state.errorCounter = counter),
                  );
                  
                  // For whatever reason, the spinner state being set like this seems to trigger the spinner sooner
                  this.state.Spinner = false;
                  this.setState({
                    oldPassword: '',
                    Password1: '',
                    Password2: '',
                  });

                  // need to double check that this works for iOS as well
                  this.clearOldPassword.current.clear();
                  this.clearPassword1.current.clear();
                  this.clearPassword2.current.clear();
                }}>
                <Text
                  style={[
                    this.state.buttonDisabled
                      ? styles.disabledBtnText
                      : styles.customBtnText,
                  ]}>
                  Reset Password
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
