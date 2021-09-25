import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import {getAuth} from 'firebase/auth';
import {getDatabase, ref, set} from 'firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Alert,
} from 'react-native';
import {styles} from '../assets/styles/styles';

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

  async createEvent() {
    let uid = getAuth().currentUser.uid;

    const db = getDatabase();
    set(ref(db, 'events/' + uid + this.state.Title), {
      title: this.state.Title,
      desc: this.state.Description,
      date: this.state.chosenDate,
      time: this.state.chosenTime,
      location: this.state.location,
    }).catch(error => {
      Alert.alert('error ', error);
    });
    Alert.alert('Event added successfully');
  }

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
            {/* <View style={styles.container}> */}
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
              onPress={async () => {
                await this.createEvent();
                console.log('pressed button');
                this.props.navigation.navigate('Events');
              }}>
              <Text style={styles.customBtnText}>Add Event</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f7f2f1',
//   },
//   inputBox: {
//     alignItems: 'stretch',
//     backgroundColor: 'white',
//     borderRadius: 15,
//     borderColor: 'black',
//     borderWidth: 1,
//     textAlign: 'left',
//     padding: 10,
//     margin: 15,
//   },
//   Buttons: {
//     shadowColor: 'rgba(0,0,0, .4)', // IOS
//     shadowOffset: {height: 3, width: 3}, // IOS
//     shadowOpacity: 1, // IOS
//     shadowRadius: 1, //IOS
//     elevation: 4, // Android
//     borderWidth: 1,
//     backgroundColor: '#3c4498',
//     justifyContent: 'center',
//     alignSelf: 'stretch',
//     borderRadius: 15,
//     borderColor: '#3c4498',
//     height: 40,
//     marginHorizontal: 15,
//     marginBottom: 35,
//   },
//   multiline: {
//     borderRadius: 15,
//     borderColor: 'black',
//     backgroundColor: 'white',
//     borderWidth: 1,
//     alignItems: 'stretch',
//     height: 150,
//     textAlign: 'left',
//     margin: 15,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     paddingTop: 15,
//   },
//   setButtons: {
//     shadowColor: 'rgba(0,0,0, .4)', // IOS
//     shadowOffset: {height: 3, width: 3}, // IOS
//     shadowOpacity: 1, // IOS
//     shadowRadius: 1, //IOS
//     elevation: 3, // Android
//     backgroundColor: '#B2ACAC',
//     borderColor: '#B2ACAC',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//     width: 90,
//     marginHorizontal: 15,
//     marginTop: 25,
//   },
//   customBtnText: {
//     fontSize: 20,
//     fontWeight: '400',
//     color: 'white',
//     textAlign: 'center',
//   },
// });
