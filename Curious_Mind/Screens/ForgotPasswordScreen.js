import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {Button} from 'react-native-vector-icons/FontAwesome';
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
import {sendForgotPasswordEmail} from '../logic/DbLogic';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      buttonDisabled: true,
      Spinner: false,
    };
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
            keyboardShouldPersistTaps="handled"
          >
            <Spinner
              visible={this.state.Spinner}
              textContent={'Sending Email...'}
              textStyle={styles.spinnerTextStyle}
              cancelable={true}
            />
            <Image
              style={styles.logo}
              source={require('../assets/images/CM_logo02.png')}
            />
            <Text style={styles.generalText}>
              Please enter the email address for your account. You will then get
              an email from "noreply@curios-mind-82101.firebaseapp.com".
              {'\n\n'}Follow the instructions in the email to reset your
              password.
            </Text>
            <TextInput
              style={[styles.inputBox, styles.width300]}
              placeholder="Enter your email"
              value={this.state.Email || null}
              placeholderTextColor="grey"
              returnKeyType="done"
              onChangeText={e => {
                e.replace(/ /g, '') === ''
                  ? (this.state.buttonDisabled = true)
                  : (this.state.buttonDisabled = false);
                this.setState({Email: e});
              }}
            />
            <TouchableOpacity
              disabled={this.state.buttonDisabled}
              style={[
                this.state.buttonDisabled
                  ? styles.disabledButtons
                  : styles.Buttons,
                styles.marginBottom30,
                styles.marginTop35,
              ]}
              onPress={async () => {
                this.setState({Spinner: true});
                await sendForgotPasswordEmail(this.props.navigation, this.state.Email);
                this.setState({Spinner: false});
              }}>
              <Text
                style={[
                  this.state.buttonDisabled
                    ? styles.disabledBtnText
                    : styles.customBtnText,
                ]}>
                Send Email
              </Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
