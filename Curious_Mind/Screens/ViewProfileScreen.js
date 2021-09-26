import React, {Component} from 'react';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {getAuth, deleteUser} from 'firebase/auth';
import {getDatabase, ref, onValue, remove, update} from 'firebase/database';
import {
  View,
  Text,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {styles} from '../assets/styles/styles';

export default class ViewProfileScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      aboutMe: '',
      fName: '',
      lName: '',
      commentNum: 0,
      postNum: 0,
      score: 0,
      Loading: true,
      pastorUser: false,
      preach: '',
      seminary: '',
      editing: false,
    };
  }

  makeDelay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  async componentDidMount() {
    // this.setState({Loading: true});
    await this.getUserInfo(this.props.route.params.uid);
    // this.unsubscribe = this.props.navigation.addListener('focus', async e => {
    //   this.setState({Loading: true});
    //   await this.getUserInfo();
    //   this.setState({Loading: false});
    // });
  }

  componentWillUnmount() {
    // this.unsubscribe.remove();
  }

  async getUserInfo(uid) {
    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/' + uid);
    // this.setState({Loading: true});
    onValue(userInfoRef, snapshot => {
      this.state.fName = snapshot.val().First;
      this.state.lName = snapshot.val().Last;
      this.state.username = snapshot.val().Username;
      this.state.commentNum = snapshot.val().commentNum;
      this.state.postNum = snapshot.val().postNum;
      this.state.score = this.state.postNum * 2 + this.state.commentNum;
      this.state.aboutMe = snapshot.val().AddintionalInfo;
      if (snapshot.val().userType === 'pastor') {
        this.state.pastorUser = true;
        this.state.preach = snapshot.val().Preach;
        this.state.seminary = snapshot.val().Seminary;
      }

      this.setState({Loading: false});
    });
    
  }

  async refreshScreen() {
    this.setState({Loading: true});
    await this.getUserInfo(this.props.route.params.uid);
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.Loading}
              onRefresh={async () => {
                await this.refreshScreen();
              }}
            />
          }>
          <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={[styles.container, styles.marginTop25]}
            scrollEnabled={true}
            extraHeight={100}>
            <View style={styles.backButtonContainer}>
                <Button
                    style={styles.backButton}
                    color="black"
                    name="arrow-left"
                    onPress={() => this.props.navigation.goBack()}
                />
            </View>
            { !this.state.Loading ? (
              <>
              <View style={styles.profileTopView}>
                <View style={[styles.column, styles.justifyCenter, styles.flex1]}>
                  <Text style={styles.profileTitle}>
                    {this.state.fName} {this.state.lName}
                </Text>
                <View style={styles.rowSpaceAround}>
                  <Text style={[styles.profileCounters, styles.flex1, styles.italic]}>
                    Posts{'\n'}written
                  </Text>
                  <Text style={[styles.profileCounters, styles.flex1,styles.italic]}>
                    Posts{'\n'}commented on
                  </Text>
                  <Text style={[styles.profileCounters, styles.flex1, styles.italic]}>
                    {'\n'}Score
                  </Text>
                </View>
                {/*numbers line */}
                <View style={[styles.rowSpaceAround, styles.marginTop15]}>
                  <Text style={[styles.profileCounters, styles.flex1]}>
                    {this.state.postNum}
                  </Text>
                  <Text style={[styles.profileCounters, styles.flex1]}>
                    {this.state.commentNum}
                  </Text>
                  <Text style={[styles.profileCounters, styles.flex1]}>
                    {this.state.score}
                  </Text>
                </View>
              </View>
              </View>
              <View style={styles.flex4}>
                {/*about me section*/}
                <Text style={styles.profileInfoTitle}>About {this.state.fName} {this.state.lname}</Text>
                <Text
                  style={[
                    styles.fontSize18,
                    styles.marginTop25,
                    styles.paddHorizontal20,
                  ]}>
                  {this.state.aboutMe}
                </Text>
                {/*username line*/}
                <View
                  style={[
                    styles.row,
                    styles.paddHorizontal20,
                    styles.marginTop15,
                    styles.aligItemsCenter,
                  ]}>
                    <Text style={styles.profileInfoTitle}>Username:</Text>
                    <Text style={[styles.fontSize18, styles.marginHorizontal15]}>
                        {this.state.username}
                    </Text>
                </View>
                {this.state.pastorUser && (
                    <View>
                        {/* Preach line */}
                        <View
                            style={[
                                styles.row,
                                styles.paddHorizontal20,
                                styles.marginTop15,
                                styles.aligItemsCenter,
                            ]}>
                            <Text style={styles.profileInfoTitle}>Preach:</Text>
                            <Text
                                style={[styles.fontSize18, styles.marginHorizontal15]}>
                                {this.state.preach}
                            </Text>
                        </View>
                        {/* seminary line */}
                        <View
                            style={[
                                styles.row,
                                styles.paddHorizontal20,
                                styles.marginTop15,
                                styles.aligItemsCenter,
                            ]}>
                            <Text style={styles.profileInfoTitle}>Seminary:</Text>
                            <Text
                                style={[styles.fontSize18, styles.marginHorizontal15]}>
                                {this.state.seminary}
                            </Text>
                        </View>
                    </View>
                )}
                            </View></>
            ):(
              <Text style={styles.generalText}>Loading ...</Text>
            )
            }
            
          </KeyboardAwareScrollView>
        </ScrollView>
      </View>
    );
  }
}
