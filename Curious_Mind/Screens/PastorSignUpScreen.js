import React, {Component} from 'react';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  LayoutAnimation,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {styles} from '../assets/styles/styles';
import {handleSignUp} from '../logic/DbLogic';
export default class PastorSignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstName: '',
      LastName: '',
      Username: '',
      Password1: '',
      Password2: '',
      Email: '',
      preach: '',
      seminary: '',
      addintionalInfo: '',
      buttonDisabled: true,
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

  shouldButtonBeDisabled() {
    console.log('checking');
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

  render() {
    console.log('rebuild');
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
                disabled={this.shouldButtonBeDisabled()}
                style={[
                  this.state.buttonDisabled
                    ? styles.disabledButtons
                    : styles.Buttons,
                ]}
                onPress={() =>
                  handleSignUp(false, this.state, this.props.navigation)
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
