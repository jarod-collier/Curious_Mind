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

export default class ResetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      errorCounter: 0,
      OldPasswordEmpty: true,
      NewPassword1Empty: true,
      NewPassword2Empty: true,
    };
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
            keyboardShouldPersistTaps="handled">
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
                placeholderTextColor="black"
                secureTextEntry={true}
                onChangeText={e => {
                  (e === '') ? this.state.OldPasswordEmpty = true : this.state.OldPasswordEmpty = false;
                  this.setState({oldPassword: e});
                }}
              />
              <TextInput
                style={[styles.inputBox, styles.width300]}
                placeholder="Enter new password*"
                placeholderTextColor="black"
                secureTextEntry={true}
                onChangeText={e => {
                  (e === '') ? this.state.NewPassword1Empty = true : this.state.NewPassword1Empty = false;
                  this.setState({newPassword1: e});
                }}
              />
              <TextInput
                style={[styles.inputBox, styles.width300]}
                placeholder="Enter new password again*"
                placeholderTextColor="black"
                secureTextEntry={true}
                onChangeText={e => {
                  (e === '') ? this.state.NewPassword2Empty = true : this.state.NewPassword2Empty = false;
                  this.setState({newPassword2: e});
                }}
              />
              <TouchableOpacity
                style={[
                  styles.Buttons,
                  styles.marginBottom30,
                  styles.marginTop35,
                  styles.alignSelfCenter,
                  (this.state.OldPasswordEmpty || this.state.NewPassword2Empty || this.state.NewPassword2Empty) ? {backgroundColor: '#ded9d8'} : null
                ]}
                disabled={this.state.OldPasswordEmpty || this.state.NewPassword2Empty || this.state.NewPassword2Empty}
                onPress={async () => {
                  Keyboard.dismiss;
                  resetPassword(this.state, this.props.navigation).then(
                    counter => (this.state.errorCounter = counter),
                  );
                  this.setState({
                    oldPassword: '',
                    newPassword1: '',
                    newPassword2: '',
                    errorCounter: 0,
                    OldPasswordEmpty: true,
                    NewPassword1Empty: true,
                    NewPassword2Empty: true,
                  });
                }}>
                <Text style={styles.customBtnText}>Reset Password</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
