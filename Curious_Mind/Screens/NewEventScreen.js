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
  Image,
} from 'react-native';
import {styles} from '../assets/styles/styles';
import {createEvent} from '../logic/DbLogic';
import {validateEventInputs, cleanUsersInput} from '../logic/helpers';
import Spinner from 'react-native-loading-spinner-overlay';

export default class NewEventScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Title: '',
      Description: '',
      location: '',
      date: new Date(),
      buttonDisabled: true,
      // ShowDate: Platform.OS === 'ios',
      ShowDate: false,
      ShowTime: false,
      Month: '',
      Day: '',
      Year: '',
      Hour: '',
      Minute: '',
      AM_or_PM: '',
      chosenDate: '',
      chosenTime: '',
      AddToCalendarDate: '',
    };
    this.clearTitle = React.createRef();
    this.clearDescription = React.createRef();
    this.clearLocation = React.createRef();

    this.clearMonth = React.createRef();
    this.clearDay = React.createRef();
    this.clearYear = React.createRef();
    this.clearHour = React.createRef();
    this.clearMinute = React.createRef();
    this.clearAMorPM = React.createRef();
  }

  onChangeDate = async (event, selectedDate) => {
    let currentDate = selectedDate || this.state.date;
    await this.determineEventDate(currentDate);
    this.state.ShowDate = false;
    this.state.ShowTime = false;
    this.setState({date: currentDate});
  };

  determineEventDate = async date_info => {
    let date_values = date_info.toString().split(' ');
    const DAY_OF_WEEK = 0;
    const MONTH = 1;
    const DAY = 2;
    const YEAR = 3;
    const TIME = 4;
    const TIME_ZONE = 6;
    const HOUR = 0;
    const MINUTE = 1;
    let hours_and_minutes = date_values[TIME].split(':');
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    this.state.Month = (months.indexOf(date_values[MONTH]) + 1).toString();
    this.state.Day = date_values[DAY].toString();
    this.state.Year = date_values[YEAR].toString();
    this.state.Hour = (
      hours_and_minutes[HOUR] > 12
        ? hours_and_minutes[HOUR] - 12
        : hours_and_minutes[HOUR]
    ).toString();
    this.state.Minute = hours_and_minutes[MINUTE].toString();
    this.state.AM_or_PM = hours_and_minutes[HOUR] > 11 ? 'PM' : 'AM';
    this.state.chosenDate = `${date_values[DAY_OF_WEEK]} ${date_values[MONTH]} ${date_values[DAY]} ${date_values[YEAR]} ${date_values[TIME_ZONE]}`;
    this.state.chosenTime = `${this.state.Hour}:${this.state.Minute} ${this.state.AM_or_PM}`;
  };

  getChosenDateAndTime = async () => {
    // To make the AddToCalendar function work, we need the date to look like this: Wed Jan 05 2022 19:25:42 GMT-0500 (EST)
    let t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];

    let y = parseInt(this.state.Year);
    let m = parseInt(this.state.Month);
    let d = parseInt(this.state.Day);
    y -= m < 3 ? 1 : 0;
    let dayOfWeek = (y + y / 4 - y / 100 + y / 400 + t[m - 1] + d) % 7;
    let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    let calculatedDay = daysOfWeek[Math.round(dayOfWeek)];
    let phoneDate = new Date().toString().split(' ');
    let standardTime = phoneDate[5];
    let timeZone = phoneDate[6];
    this.state.AddToCalendarDate =
      `${calculatedDay} ${months[this.state.Month - 1]} ${this.state.Day} ${
        this.state.Year
      } ` +
      `${this.state.Hour}:${this.state.Minute}:00 ${standardTime} ${timeZone}`;
    this.state.chosenDate = `${this.state.Month}/${this.state.Day}/${this.state.Year} ${timeZone}`;
    this.state.AM_or_PM = this.state.Hour > 11 ? 'PM' : 'AM';
    this.setState({
      chosenTime: `${this.state.Hour}:${this.state.Minute} ${this.state.AM_or_PM}`,
    });
  };

  selectDate = async () => {
    this.setState({ShowDate: true});
  };

  selectTime = async () => {
    this.setState({ShowTime: true});
  };

  checkEventInputForBadWords = async () => {
    await cleanUsersInput(this.state.Title).then(
      val => (this.state.Title = val),
    );
    await cleanUsersInput(this.state.Description).then(
      val => (this.state.Description = val),
    );
    await cleanUsersInput(this.state.location).then(
      val => this.setState({location: val}),
    );
  };

  shouldButtonBeDisbled() {
    let oneOrTwoNums = new RegExp('\\d{1,2}');
    let fourNums = new RegExp('\\d{4}');
    if (
      this.state.Title.replace(/ /g, '') !== '' &&
      this.state.location.replace(/ /g, '') !== '' &&
      this.state.AM_or_PM.replace(/ /g, '') !== '' &&
      oneOrTwoNums.test(this.state.Day) &&
      oneOrTwoNums.test(this.state.Month) &&
      fourNums.test(this.state.Year) &&
      oneOrTwoNums.test(this.state.Hour) &&
      oneOrTwoNums.test(this.state.Minute)
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
            contentContainerStyle={[
              styles.container,
              styles.marginHorizontal15,
              styles.marginBottom15,
            ]}
            scrollEnabled={true}
            extraHeight={100}
            keyboardShouldPersistTaps="handled">
            <Spinner
              visible={this.state.Spinner}
              textContent={'Adding Event...'}
              textStyle={styles.spinnerTextStyle}
              cancelable={true}
              overlayColor='rgba(0, 0, 0, 0.75)'
              animation='fade'
            />
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
              <Text style={[styles.fontSize28, styles.marginHorizontal15]}>
                Date:
              </Text>
              <TextInput
                style={[styles.eventInputBox, styles.widthMonth]}
                placeholder="MM"
                value={this.state.Month || null}
                keyboardType="numeric"
                placeholderTextColor="grey"
                maxLength={2}
                onChangeText={e => {
                  this.setState({Month: e});
                }}
                ref={this.clearMonth}
              />
              <Text style={[styles.fontSize28]}>/</Text>
              <TextInput
                style={[styles.eventInputBox, styles.widthDay]}
                placeholder="DD"
                value={this.state.Day || null}
                keyboardType="numeric"
                placeholderTextColor="grey"
                maxLength={2}
                onChangeText={e => {
                  this.setState({Day: e});
                }}
                ref={this.clearDay}
              />
              <Text style={[styles.fontSize28]}>/</Text>
              <TextInput
                style={[styles.eventInputBox, styles.widthYear]}
                placeholder="YYYY"
                value={this.state.Year || null}
                keyboardType="numeric"
                placeholderTextColor="grey"
                maxLength={4}
                onChangeText={e => {
                  this.setState({Year: e});
                }}
                ref={this.clearYear}
              />
              <TouchableOpacity onPress={this.selectDate}>
                <Image
                  style={styles.defaultButtonColor}
                  source={require('../assets/images/calendar_icon.png')}
                />
              </TouchableOpacity>
              {this.state.ShowDate && (
                <DateTimePicker
                  value={this.state.date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'compact' : 'calendar'}
                  onChange={this.onChangeDate}
                />
              )}
            </View>
            <View style={[styles.row, styles.aligItemsCenter]}>
              <Text style={[styles.fontSize28, styles.marginHorizontal15]}>
                Time:
              </Text>
              <TextInput
                style={[styles.eventInputBox, styles.widthHour]}
                placeholder="Hour"
                value={this.state.Hour || null}
                keyboardType="numeric"
                placeholderTextColor="grey"
                maxLength={2}
                onChangeText={e => {
                  this.setState({Hour: e});
                }}
                ref={this.clearHour}
              />
              <Text style={[styles.fontSize28]}>:</Text>
              <TextInput
                style={[styles.eventInputBox, styles.widthMinute]}
                placeholder="Minutes"
                value={this.state.Minute || null}
                keyboardType="numeric"
                placeholderTextColor="grey"
                maxLength={2}
                onChangeText={e => {
                  this.setState({Minute: e});
                }}
                ref={this.clearMinute}
              />
              <TextInput
                style={[styles.eventInputBox, styles.widthAMorPM]}
                placeholder="AM/PM"
                value={this.state.AM_or_PM || null}
                keyboardType="default"
                placeholderTextColor="grey"
                maxLength={2}
                onChangeText={e => {
                  this.setState({AM_or_PM: e.toUpperCase()});
                }}
                ref={this.clearAMorPM}
              />
              <TouchableOpacity onPress={this.selectTime}>
                <Image
                  style={styles.defaultButtonColor}
                  source={require('../assets/images/clock.png')}
                />
              </TouchableOpacity>
              {this.state.ShowTime && (
                <DateTimePicker
                  style={[styles.width120, styles.marginTop15]}
                  value={this.state.date}
                  mode={'time'}
                  display={Platform.OS === 'ios' ? 'compact' : 'clock'}
                  onChange={this.onChangeDate}
                />
              )}
            </View>
            <Text style={[styles.fontSize28, styles.marginHorizontal15]}>
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
              disabled={this.shouldButtonBeDisbled()}
              style={[
                this.state.buttonDisabled
                  ? styles.disabledButtons
                  : styles.Buttons,
                styles.alignSelfCenter,
              ]}
              onPress={async () => {
                this.setState({Spinner: true});
                let valid_inputs = await validateEventInputs(this.state);
                if (valid_inputs) {
                  await this.getChosenDateAndTime();
                  await this.checkEventInputForBadWords();
                  await createEvent(this.state).then(
                    async () =>
                      await this.props.navigation.navigate('Event Feed'),
                  );
                }
                this.setState({Spinner: false});
              }}>
              <Text
                style={
                  this.state.buttonDisabled
                    ? styles.disabledBtnText
                    : styles.customBtnText
                }>
                Add Event
              </Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
