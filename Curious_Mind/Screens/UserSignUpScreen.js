import 'react-native-gesture-handler'; // is this needed?
import React, {Component} from 'react';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {styles} from '../assets/styles/styles';
import {handleSignUp} from '../logic/DbLogic';

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
      buttonDisabled: true,
    };
    this.clearFirstName = React.createRef();
    this.clearLastName = React.createRef();
    this.clearUsername = React.createRef();
    this.clearPassword = React.createRef();
    this.clearEmail = React.createRef();
  }

  shouldButtonBeDisabled() {
    if (
      this.state.Username.replace(/ /g, '') !== '' &&
      this.state.Password1.replace(/ /g, '') !== '' &&
      this.state.Password2.replace(/ /g, '') !== '' &&
      this.state.Email.replace(/ /g, '') !== ''
    ) {
      this.state.buttonDisabled = false;
      return false;
    } else {
      this.state.buttonDisabled = true;
      return true;
    }
  }

  //needs a loading widget while creating account
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
                this.setState({Password1: e});
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
                this.setState({Password2: e});
              }}
              ref={this.clearPassword}
            />
            <View style={[styles.marginBottom30, styles.marginTop35]}>
              <TouchableOpacity
                disabled={this.shouldButtonBeDisabled}
                style={
                  this.state.buttonDisabled
                    ? styles.disabledButtons
                    : styles.Buttons
                }
                onPress={() =>
                  handleSignUp(true, this.state, this.props.navigation)
                }>
                <Text
                  style={[
                    this.state.buttonDisabled
                      ? styles.disabledBtnText
                      : styles.customBtnText,
                  ]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
