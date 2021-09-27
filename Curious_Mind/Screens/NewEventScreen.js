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
      showDate: false,
      showTime: false,
    };
    this.clearTitle = React.createRef();
    this.clearDescription = React.createRef();
    this.clearLocation = React.createRef();
  }

  onChangeDate = (event, selectedDate) => {
    if (event.type === 'set') {
      let currentDate = selectedDate || this.state.date;
      this.state.chosenDate = currentDate.toString().substring(0, 16);
      this.setState({showDate: false});
      this.setState({date: currentDate});
    } else {
      this.setState({showDate: false});
    }
  };

  onChangeTime = (event, selectedTime) => {
    if (event.type === 'set') {
      const currentTime = selectedTime || this.state.time;
      let hours24 = currentTime.getHours();
      let mins = currentTime.getMinutes();
      if (mins < 10) {
        mins = '0' + mins;
      }
      let period = hours24 > 12 ? 'PM' : 'AM';
      let hours12 = (currentTime.getHours() + 24) % 12 || 12;
      this.state.chosenTime = '' + hours12 + ':' + mins + ' ' + period;
      this.setState({showTime: false});
      this.setState({time: currentTime});
    } else {
      this.setState({showTime: false});
    }
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <ScrollView>
          <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={styles.container}
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
              <Text
                style={[
                  styles.marginTop15,
                  styles.fontSize20,
                  styles.marginHorizontal15,
                ]}>
                {this.state.chosenDate}
              </Text>
              {this.state.showDate ? (
                <DateTimePicker
                  style={[styles.width120, styles.marginTop15]}
                  value={this.state.date}
                  mode={'date'}
                  onChange={this.onChangeDate}
                />
              ) : (
                <TouchableOpacity
                  style={[styles.actionButtons, styles.marginTop15]}
                  onPress={() => {
                    this.setState({showDate: !this.state.showDate});
                  }}>
                  <Text style={styles.fontSize16}>Set Date</Text>
                </TouchableOpacity>
              )}
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
              <Text
                style={[
                  styles.marginTop15,
                  styles.fontSize20,
                  styles.marginHorizontal15,
                ]}>
                {this.state.chosenTime}
              </Text>
              {this.state.showTime ? (
                <DateTimePicker
                  style={[styles.width120, styles.marginTop15]}
                  value={this.state.time}
                  mode={'time'}
                  onChange={this.onChangeTime}
                />
              ) : (
                <TouchableOpacity
                  style={[styles.actionButtons, styles.marginTop15]}
                  onPress={() => {
                    this.setState({showTime: !this.state.showTime});
                  }}>
                  <Text style={styles.fontSize16}>Set Time</Text>
                </TouchableOpacity>
              )}
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
