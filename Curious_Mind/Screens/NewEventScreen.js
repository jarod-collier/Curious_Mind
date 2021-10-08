import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
} from 'react-native';
import {styles} from '../assets/styles/styles';
import {createEvent} from '../logic/DbLogic';

export default class NewEventScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Title: '',
      Description: '',
      location: '',
      chosenDate: '',
      chosenTime: '',
      date: new Date(),
      time: new Date(),
    };
    this.clearTitle = React.createRef();
    this.clearDescription = React.createRef();
    this.clearLocation = React.createRef();
  }

  onChangeDate = (event, selectedDate) => {
    let currentDate = selectedDate || this.state.date;
    this.state.chosenDate = currentDate.toString().substring(0, 16);
    this.setState({date: currentDate});
  };

  onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || this.state.time;
    let hours24 = currentTime.getHours();
    let mins = currentTime.getMinutes();
    if (mins < 10) {
      mins = '0' + mins;
    }
    let period = hours24 > 12 ? 'PM' : 'AM';
    let hours12 = (currentTime.getHours() + 24) % 12 || 12;
    this.state.chosenTime = '' + hours12 + ':' + mins + ' ' + period;
    this.setState({time: currentTime});
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <ScrollView>
          <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={[styles.container, styles.marginHorizontal15, styles.marginBottom15]}
            scrollEnabled={true}
            extraHeight={100}
            keyboardShouldPersistTaps="handled">
            <Text
              style={[
                styles.marginTop35,
                styles.fontSize28,
                styles.marginHorizontal15,
              ]}>
              Event Title
            </Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Type event title here"
              placeholderTextColor="black"
              onChangeText={e => {
                this.setState({Title: e});
              }}
              ref={this.clearTitle}
            />
            <Text
              style={[
                styles.marginTop15,
                styles.fontSize28,
                styles.marginHorizontal15,
              ]}>
              Description
            </Text>
            <TextInput
              style={styles.multiline}
              placeholder="Type event description here"
              placeholderTextColor="black"
              multiline={true}
              numberOfLines={10}
              returnKeyType="done"
              blurOnSubmit={true}
              onChangeText={e => {
                this.setState({Description: e});
              }}
              ref={this.clearDescription}
            />

            <View style={[styles.row, styles.aligItemsCenter]}>
              <Text
                style={[
                  styles.marginTop15,
                  styles.fontSize28,
                  styles.marginHorizontal15,
                ]}>
                Date:
              </Text>
              <DateTimePicker
                style={[styles.width120, styles.marginTop15]}
                value={this.state.date}
                display={Platform.OS === 'ios' ? 'compact' : 'calendar'}
                mode={'date'}
                onChange={this.onChangeDate}
              />
            </View>
            <View style={[styles.row, styles.aligItemsCenter]}>
              <Text
                style={[
                  styles.marginTop15,
                  styles.fontSize28,
                  styles.marginHorizontal15,
                ]}>
                Time:
              </Text>
              <DateTimePicker
                style={[styles.width120, styles.marginTop15]}
                value={this.state.time}
                mode={'time'}
                display={Platform.OS === 'ios' ? 'compact' : 'clock'}
                onChange={this.onChangeTime}
              />
            </View>
            <Text
              style={[
                styles.marginTop15,
                styles.fontSize28,
                styles.marginHorizontal15,
              ]}>
              Location:
            </Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Type event location here"
              placeholderTextColor="black"
              onChangeText={e => {
                this.setState({location: e});
              }}
              ref={this.clearLocation}
            />
            <TouchableOpacity
              style={[styles.Buttons, styles.alignSelfCenter]}
              onPress={() => {
                createEvent(this.state).then(() =>
                  this.props.navigation.navigate('Events'),
                );
              }}>
              <Text style={styles.customBtnText}>Add Event</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
