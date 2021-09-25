import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {Card} from 'react-native-shadow-cards';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {getAuth} from 'firebase/auth';
import {getDatabase, ref, onValue} from 'firebase/database';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  LayoutAnimation,
} from 'react-native';
import {styles} from '../assets/styles/styles';

export default class EventScreen extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      display: [],
      canAdd: false,
      Loading: true,
    };
  }

  makeDelay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  async componentDidMount() {
    this._isMounted = true;
    await this.readFromDB(this.props.navigation);
  }

  componentWillUnmount() {
    this._isMounted = false;
    // this.unsubscribe.remove();
  }

  async refreshScreen() {
    this.setState({Loading: true});
    await this.readFromDB(this.props.navigation);
  }

  addToCalendar(title, date, time, location, notes) {
    date = date.split(' ');
    time = time.split(' ');
    var startDate = new Date(
      '' +
        date[1] +
        ' ' +
        date[2] +
        ', ' +
        date[3] +
        ' ' +
        time[0] +
        ':00 ' +
        time[1],
    ).toISOString();
    const eventConfig = {
      title,
      startDate,
      location,
      notes,
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig);
  }

  async canAddEvent() {
    let uid = getAuth().currentUser.uid;
    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/' + uid);
    onValue(userInfoRef, snapshot => {
      if (snapshot.val().userType === 'pastor') {
        this.state.canAdd = true;
      }
    });
  }

  async readFromDB() {
    const db = getDatabase();
    const eventsRef = ref(db, 'events/');
    this.canAddEvent();
    onValue(eventsRef, snapshot => {
      let postItems = [];
      snapshot.forEach(child => {
        postItems.push({
          title: child.val().title,
          desc: child.val().desc,
          date: child.val().date,
          time: child.val().time,
          location: child.val().location,
        });
      });
      this.state.events = postItems.reverse();
      this.loadEventCards();
    });
  }

  async loadEventCards() {
    var events = this.state.events.map(eventData => {
      return (
        <View key={eventData.title} style={styles.defaultBackground}>
          <Card style={styles.defualtCardStyles}>
            <Text style={styles.cardTitle}>{eventData.title}</Text>
            <Text style={styles.cardDesc}>{eventData.desc}</Text>
            <Text>Date: {eventData.date}</Text>
            <Text>Time: {eventData.time}</Text>
            <Text>Where: {eventData.location}</Text>
            <TouchableOpacity
              style={[styles.Buttons, styles.alignSelfCenter]}
              onPress={() =>
                this.addToCalendar(
                  eventData.title,
                  eventData.date,
                  eventData.time,
                  eventData.location,
                  eventData.desc,
                )
              }>
              <View style={[styles.rowCenter, styles.aligItemsCenter]}>
                <Text style={styles.customBtnText}>Add event to calendar</Text>
                <Button
                  style={styles.defaultButtonColor}
                  name="calendar"
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </Card>
        </View>
      );
    });
    this.setState({Loading: false, display: events});
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.Loading}
              onRefresh={() => {
                this.refreshScreen();
              }}
            />
          }>
          <View style={[styles.container, styles.aligItemsCenter]}>
            {this.state.canAdd && (
              <TouchableOpacity
                style={styles.Buttons}
                onPress={() => this.props.navigation.navigate('Add Event')}>
                <View style={[styles.rowCenter, styles.aligItemsCenter]}>
                  <Text style={styles.customBtnText}>Add New Event</Text>
                  <Button
                    style={styles.defaultButtonColor}
                    name="calendar"
                    color="white"
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={[
              styles.container,
              styles.aligItemsCenter,
              styles.marginTop15,
            ]}>
            {!this.state.Loading ? (
              this.state.display.length > 0 ? (
                this.state.display
              ) : this.state.canAdd ? (
                <Text style={styles.generalText}>
                  No events found. Please make a new event
                </Text>
              ) : (
                <Text style={styles.generalText}>
                  No events found. Please check again later
                </Text>
              )
            ) : (
              <Text style={styles.generalText}>Loading ...</Text>
            )}
          </View>
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
//     borderColor: '#3c4498',
//     borderRadius: 15,
//     height: 40,
//     marginHorizontal: 15,
//     marginVertical: 15,
//   },
//   customBtnText: {
//     fontSize: 20,
//     fontWeight: '400',
//     color: 'white',
//     textAlign: 'center',
//   },
//   generalText: {
//     padding: 15,
//     color: 'black',
//     alignSelf: 'center',
//     marginTop: 15,
//     fontSize: 30,
//   },
// });
