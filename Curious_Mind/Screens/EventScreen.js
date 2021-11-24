import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {Button} from 'react-native-vector-icons/FontAwesome';
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
import {loadEventCards, prepareEventsFromDB} from '../logic/helpers';
import {canAddEvent, db} from '../logic/DbLogic';
import {onValue, ref} from 'firebase/database';
import {getAuth} from 'firebase/auth';

export default class EventScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      display: [],
      canAdd: false,
      Loading: true,
    };
  }

  async componentDidMount() {
    this.state.canAdd = canAddEvent();
    await this.readFromDB();
  }

  async readFromDB() {
    let uid = getAuth().currentUser.uid;
    this.setState({Loading: true});
    onValue(ref(db, 'events/'), async snapshot => {
      await prepareEventsFromDB(snapshot, uid).then(events =>
        loadEventCards(events).then(
          eventCards => (this.state.display = eventCards),
        ),
      );
      this.setState({Loading: false});
    });
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
                this.readFromDB();
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
                  No events found. Please make a new event.
                </Text>
              ) : (
                <Text style={styles.generalText}>
                  No events found. Please check again later.
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
