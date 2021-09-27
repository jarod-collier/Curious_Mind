import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {styles} from '../assets/styles/styles';

export default class UserTypeScreen extends Component {
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
        <ScrollView style={styles.container}>
          <View style={[styles.logo, styles.aligItemsCenter]}>
            <Image source={require('../assets/images/CM_logo02.png')} />
          </View>
          <View>
            <Text style={styles.iAmUserTypeText}>
              Please choose{'\n'}user type
            </Text>
          </View>
          <View style={styles.rowSpaceAround}>
            <TouchableOpacity
              style={[styles.Buttons, styles.userTypeButtons]}
              onPress={() => this.props.navigation.navigate('Security Code')}>
              <Text style={styles.customBtnText}>Pastor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.Buttons, styles.userTypeButtons]}
              onPress={() => this.props.navigation.navigate('User SignUp')}>
              <Text style={styles.customBtnText}>Normal user</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
