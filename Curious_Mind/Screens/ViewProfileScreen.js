import React, {Component} from 'react';
import {
  View,
  Text,
  LayoutAnimation,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {styles} from '../assets/styles/styles';
import {db} from '../logic/DbLogic';
import {ref, onValue} from 'firebase/database';

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
    this.getUserProfile();
  }

  async getUserProfile() {
    this.setState({Loading: true});
    onValue(ref(db, 'userInfo/' + this.props.route.params.uid), snapshot => {
      if (snapshot.exists()) {
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
      }
      else {
        this.state.fName = "User No Longer Exists";
        this.state.lName = "";
        this.state.username = "Unknown";
        this.state.commentNum = "0";
        this.state.postNum = "0";
        this.state.score = "0"; 
        this.state.aboutMe = "Unknown"; 
        this.setState({Loading: false});
      }
    });
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
                this.setState({Loading: true});
                await this.getUserProfile();
              }}
            />
          }>
          <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={[styles.container, styles.marginTop25]}
            scrollEnabled={true}
            extraHeight={100}>
            {!this.state.Loading ? (
              <>
                <View style={styles.profileTopView}>
                  <View
                    style={[styles.column, styles.justifyCenter, styles.flex1]}>
                    <Text style={styles.profileTitle}>
                      {this.state.fName} {this.state.lName}
                    </Text>
                    <View style={styles.rowSpaceAround}>
                      <Text
                        style={[
                          styles.profileCounters,
                          styles.flex1,
                          styles.italic,
                        ]}>
                        Posts{'\n'}written
                      </Text>
                      <Text
                        style={[
                          styles.profileCounters,
                          styles.flex1,
                          styles.italic,
                        ]}>
                        Posts{'\n'}commented on
                      </Text>
                      <Text
                        style={[
                          styles.profileCounters,
                          styles.flex1,
                          styles.italic,
                        ]}>
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
                  <View
                    style={[
                      styles.paddHorizontal20,
                      styles.marginTop15,
                      styles.aligItemsStart,
                    ]}>
                    <Text style={styles.profileInfoTitle}>
                      About {this.state.fName} {this.state.lname}
                    </Text>
                    <Text
                      style={[
                        styles.fontSize18,
                        styles.marginTop10,
                        styles.paddHorizontal20,
                      ]}>
                      {this.state.aboutMe}
                    </Text>
                  </View>
                  {/*username line*/}
                  <View
                    style={[
                      styles.row,
                      styles.paddHorizontal20,
                      styles.marginTop15,
                      styles.aligItemsCenter,
                    ]}>
                    <Text style={styles.profileInfoTitle}>Username:</Text>
                    <Text
                      style={[styles.fontSize18, styles.marginHorizontal15]}>
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
                          style={[
                            styles.fontSize18,
                            styles.marginHorizontal15,
                          ]}>
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
                          style={[
                            styles.fontSize18,
                            styles.marginHorizontal15,
                          ]}>
                          {this.state.seminary}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <Text style={styles.generalText}>Loading ...</Text>
            )}
          </KeyboardAwareScrollView>
        </ScrollView>
      </View>
    );
  }
}
