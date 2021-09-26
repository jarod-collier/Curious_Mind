import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {Card} from 'react-native-shadow-cards';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {getAuth} from 'firebase/auth';
import {getDatabase, ref, onValue, update, remove} from 'firebase/database';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  LayoutAnimation,
} from 'react-native';
import {styles} from '../assets/styles/styles';
import { thisTypeAnnotation } from '@babel/types';

export default class MainFeedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      display: [],
      Loading: true,
    };
  }

  async componentDidMount() {
    await this.readFromDB(this.props.navigation);
  }

  componentWillUnmount() {
    // this.unsubscribe();
  }

  makeDelay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  async likePost(key) {
    let uid = getAuth().currentUser.uid;
    let likedBy = [];
    let likesCount;

    const db = getDatabase();
    const postRef = ref(db, 'posts/' + key);

    onValue(postRef, snapshot => {
      likedBy = snapshot.val().likedBy;
      likesCount = snapshot.val().likes;
    });

    if (!likedBy.includes(uid)) {
      likedBy.push(uid);

      const updates = {};
      updates['/posts/' + key + '/likedBy'] = likedBy;
      updates['/posts/' + key + '/likes'] = likesCount + 1;

      update(ref(db), updates);
      this.refreshScreen();
    } else {
      Alert.alert('This post has already been liked.');
    }
  }

  async reportPost(key) {
    let uid = getAuth().currentUser.uid;
    let reportedBy = [];
    let reportCount;
    let incAmount = 1;
    let pastorReportWeight = 5;
    const db = getDatabase();
    const reportPostRef = ref(db, 'posts/' + key);
    const userInfoRef = ref(db, 'userInfo/' + uid);

    onValue(userInfoRef, userInfo_snapshot => {
      if (userInfo_snapshot.val().userType === 'pastor') {
        incAmount = pastorReportWeight;
      }
      onValue(reportPostRef, report_snapshot => {
        reportedBy = report_snapshot.val().reportedBy;
        reportCount = report_snapshot.val().reports;

        if (!reportedBy.includes(uid)) {
          Alert.alert(
            'Report Post',
            'Are you sure you want to report this post?',
            [
              {text: 'Cancel', onPress: () => {}},
              {
                text: 'REPORT',
                onPress: async () => {
                  if (reportCount + incAmount >= pastorReportWeight) {
                    remove(reportPostRef);
                    this.refreshScreen();
                    Alert.alert(
                      'Post Removed',
                      'The report count exceeded the limit. This post will be deleted now. Please refresh the screen.',
                    );
                  } else {
                    reportedBy.push(uid);

                    const report_updates = {};
                    report_updates['posts/' + key + '/reportedBy'] = reportedBy;
                    report_updates['posts/' + key + '/reports'] =
                      reportCount + incAmount;
                    update(ref(db), report_updates);

                    this.refreshScreen();
                    Alert.alert('This post was reported.\nThank you.');
                  }
                },
                style: {color: 'red'},
              },
            ],
            {cancelable: true},
          );
        } else {
          Alert.alert('You already reported this post.');
        }
      });
    });
  }

  async loadPostCards(navigation) {
    var posts = this.state.posts.map(postData => {
      
      return (
        <View key={postData.key}>
          <Button
            style={styles.defaultBackground}
            onPress={() => navigation.navigate('Thread', {ID: postData.key})}>
            <Card style={styles.defualtCardStyles}>
              <Text style={styles.cardTitle}>{postData.question}</Text>
              <Text style={styles.cardDesc}>{postData.desc}</Text>
              <View style={styles.cardDateAndBy}>
                <Text>Posted</Text>
                {!postData.anon && 
                <Text onPress={()=> navigation.navigate('View Profile', {uid: "" + postData.key.substring(0, 28)})}> by: {postData.username}</Text>}
                <Text> on {postData.date}</Text>
              </View>
              <View style={styles.row}>
                <Button
                  style={styles.whiteBackground}
                  color="#cac5c4"
                  name="comment"
                  onPress={() =>
                    navigation.navigate('Thread', {ID: postData.key})
                  }
                />
                <Button
                  style={styles.whiteBackground}
                  color={postData.likeColor}
                  name="thumbs-up"
                  onPress={() => this.likePost(postData.key)}
                />
                {postData.likes > 0 && (
                  <Text style={styles.iconBadge}>{postData.likes}</Text>
                )}
                <Button
                  style={styles.whiteBackground}
                  color={postData.reportColor}
                  name="exclamation-triangle"
                  onPress={async () => await this.reportPost(postData.key)}
                />
                {postData.reports > 0 && (
                  <Text style={styles.iconBadge}>{postData.reports}</Text>
                )}
              </View>
            </Card>
          </Button>
        </View>
      );
    });
    this.setState({Loading: false, display: posts});
  }

  async refreshScreen() {
    this.setState({Loading: true});
    await this.readFromDB(this.props.navigation);
  }

  async readFromDB(navigation) {
    let uid = getAuth().currentUser.uid;

    const db = getDatabase();
    const postRef = ref(db, 'posts/');

    onValue(postRef, snapshot => {
      let postItems = [];
      snapshot.forEach(child => {
        var alreadyLikedpost = '#cac5c4';
        var alreadyReportedpost = '#cac5c4';
        if (child.val().likedBy.includes(uid)) {
          alreadyLikedpost = '#588dea';
        }

        if (child.val().reportedBy.includes(uid)) {
          alreadyReportedpost = '#f3b725';
        }

        postItems.push({
          key: child.key,
          username: child.val().username,
          date: child.val().date,
          question: child.val().question,
          likes: child.val().likes,
          desc: child.val().desc,
          reports: child.val().reports,
          anon: child.val().Anon,
          pastorOnly: child.val().PastorOnly,
          likeColor: alreadyLikedpost,
          reportColor: alreadyReportedpost,
        });
      });
      this.state.posts = postItems.reverse();
      this.loadPostCards(navigation);
    });
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    console.log('render');
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.Loading}
              onRefresh={async () => {
                await this.refreshScreen();
              }}
            />
          }>
          <View style={styles.container}>
            {!this.state.Loading ? (
              this.state.display.length > 0 ? (
                this.state.display
              ) : (
                <Text style={styles.generalText}>
                  No posts found. Please make a new post or try refreshing the
                  screen.
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
