import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  LayoutAnimation,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {styles} from '../assets/styles/styles';
import {validatePastorCode} from '../logic/DbLogic';

export default class PastorSecCodeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Code: '',
      buttonDisabled: true,
    };
    this.clearCode = React.createRef();
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
                e.replace(/ /g, '') === ''
                  ? (this.state.buttonDisabled = true)
                  : (this.state.buttonDisabled = false);
                this.setState({Code: e});
              }}
              ref={this.clearCode}
            />
            <TouchableOpacity
              style={[
                this.state.buttonDisabled
                  ? styles.disabledButtons
                  : styles.Buttons,
              ]}
              disabled={this.state.buttonDisabled}
              onPress={() =>
                validatePastorCode(this.state.Code, this.props.navigation)
              }>
              <Text
                style={[
                  this.state.buttonDisabled
                    ? styles.disabledBtnText
                    : styles.customBtnText,
                ]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
