import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {Card} from 'react-native-shadow-cards';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {getAuth} from 'firebase/auth';
import {
  getDatabase,
  ref,
  onValue,
  update,
  remove,
  set,
} from 'firebase/database';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  LayoutAnimation,
} from 'react-native';
import {styles} from '../assets/styles/styles';
import {ScrollView} from 'react-native-gesture-handler';

export default class ThreadScreen extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      display: [],
      comments: [],
      Loading: true,
      comment: '',
      PastorOnly: false,
      posterUser: '',
      userCanComment: true,
      postID: '',
    };
  }

  makeDelay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  async componentDidMount() {
    this._isMounted = true;
    this.setState({Loading: true});
    this.state.postID = this.props.route.params.ID;
    await this.readFromDB(this.state.postID);
    this.setState({Loading: false});
    this.focused = false;
    this.clearComment = React.createRef();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async refreshScreen() {
    this.setState({Loading: true});
    await this.readFromDB(this.state.postID);
    this.makeDelay(500).then(() => this.setState({Loading: false}));
  }

  async profileComment() {
    let uid = getAuth().currentUser.uid;
    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/' + uid);
    // var commentNumber;

    //get the current value.
    onValue(
      userInfoRef,
      snapshot => {
        // commentNumber = snapshot.val().commentNum;
        //update the value.
        const updates = {};
        updates['userInfo/' + uid + '/commentNum'] =
          snapshot.val().commentNum + 1;
        update(ref(db), updates);
      },
      {
        onlyOnce: true,
      },
    );
  }

  async addComment(postID) {
    var username;
    let uid = getAuth().currentUser.uid;
    var userRef;

    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/' + uid);

    onValue(
      userInfoRef,
      snapshot => {
        username = snapshot.val().Username;

        let unique_id = Math.random().toString(16).substring(2, 12);
        let comment_id = uid + '_' + unique_id;
        set(ref(db, 'posts/' + postID + '/comments/' + comment_id), {
          comment: this.state.comment,
          username: username,
          date: '' + new Date().toLocaleDateString(),
          reportedBy: [''],
          reports: 0,
          key: comment_id,
        }).catch(error => {
          Alert.alert('error ', error);
        });
      },
      {
        onlyOnce: true,
      },
    );

    await this.profileComment(userRef);

    Alert.alert('Comment added successfully.');
    this.refreshScreen();
    this.clearComment.current.clear();
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

  async canComment() {
    let uid = getAuth().currentUser.uid;
    let userCan = true;

    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/' + uid);

    if (this.state.PastorOnly) {
      onValue(userInfoRef, snapshot => {
        if (
          snapshot.val().userType !== 'pastor' &&
          snapshot.val().Username !== this.state.posterUser
        ) {
          userCan = false;
        }
        this.state.userCanComment = userCan;
      });
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
                    Alert.alert(
                      'Post Removed',
                      'The report count exceeded the limit. This post will be deleted now. Please refresh the screen.',
                    );
                    this.props.navigation.navigate('Home');
                  } else {
                    reportedBy.push(uid);

                    const report_updates = {};
                    report_updates['posts/' + key + '/reportedBy'] = reportedBy;
                    report_updates['posts/' + key + '/reports'] =
                      reportCount + incAmount;
                    update(ref(db), report_updates);

                    Alert.alert('This post was reported.\nThank you.');
                    this.refreshScreen(this.state.postID);
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

  async reportComment(commentId) {
    let uid = getAuth().currentUser.uid;
    let reportedBy = [];
    let reportCount;
    let incAmount = 1;
    let pastorReportWeight = 5;
    const db = getDatabase();
    const reportCommentRef = ref(
      db,
      'posts/' + this.state.postID + '/comments/' + commentId,
    );
    const userInfoRef = ref(db, 'userInfo/' + uid);

    onValue(userInfoRef, userInfo_snapshot => {
      if (userInfo_snapshot.val().userType === 'pastor') {
        incAmount = pastorReportWeight;
      }
      onValue(reportCommentRef, report_snapshot => {
        reportedBy = report_snapshot.val().reportedBy;
        reportCount = report_snapshot.val().reports;

        if (!reportedBy.includes(uid)) {
          Alert.alert(
            'Report Comment',
            'Are you sure you want to report this comment?',
            [
              {text: 'Cancel', onPress: () => {}},
              {
                text: 'REPORT',
                onPress: async () => {
                  if (reportCount + incAmount >= 5) {
                    remove(reportCommentRef);
                    Alert.alert(
                      'Comment Removed.',
                      'The comment report count exceeded the allowed limit. This comment will be deleted now.',
                    );
                    this.refreshScreen(this.state.postID);
                  } else {
                    reportedBy.push(uid);

                    const report_updates = {};
                    report_updates[
                      'posts/' +
                        this.state.postID +
                        '/comments/' +
                        commentId +
                        '/reportedBy'
                    ] = reportedBy;
                    report_updates[
                      'posts/' +
                        this.state.postID +
                        '/comments/' +
                        commentId +
                        '/reports'
                    ] = reportCount + incAmount;
                    update(ref(db), report_updates);

                    Alert.alert('This comment was reported.', 'Thank you.');
                    this.refreshScreen(this.state.postID);
                  }
                },
                style: {color: 'red'},
              },
            ],
            {cancelable: true},
          );
        } else {
          Alert.alert('You already reported this comment.');
        }
      });
    });
  }

  async readFromDB(postID) {
    let uid = getAuth().currentUser.uid;
    let commentItems = [];
    let postItems = [];

    const db = getDatabase();
    const postRef = ref(db, 'posts/' + postID);

    onValue(postRef, snapshot => {
      var alreadyLikedpost = '#cac5c4';
      var alreadyReportedpost = '#cac5c4';

      snapshot.child('comments').forEach(comment => {
        var alreadyReportedcomment = '#cac5c4';

        if (comment.val().reportedBy.includes(uid)) {
          alreadyReportedcomment = '#cac5c4';
        }

        commentItems.push({
          key: comment.key,
          comment: comment.val().comment,
          date: comment.val().date,
          username: comment.val().username,
          ReportColor: alreadyReportedcomment,
          ReportCount: comment.val().reports,
        });
      });

      if (snapshot.val().likedBy.includes(uid)) {
        alreadyLikedpost = '#588dea';
      }

      if (snapshot.val().reportedBy.includes(uid)) {
        alreadyReportedpost = '#f3b725';
      }

      postItems.push({
        key: postID,
        question: snapshot.val().question,
        username: snapshot.val().username,
        date: snapshot.val().date,
        desc: snapshot.val().desc,
        likes: snapshot.val().likes,
        reports: snapshot.val().reports,
        anon: snapshot.val().Anon,
        pastorOnly: snapshot.val().PastorOnly,
        likeColor: alreadyLikedpost,
        reportColor: alreadyReportedpost,
      });
      this.state.PastorOnly = snapshot.val().PastorOnly;
      this.state.posterUser = snapshot.val().username;
    });
    await this.canComment();
    await this.loadCommentCards(commentItems);
    await this.loadPostCards(postItems);
  }

  async loadCommentCards(commentItems) {
    this.setState({
      comments: commentItems.map(commentData => {
        return (
          <View
            key={commentData.key}
            style={[styles.defaultBackground, styles.marginTop15]}>
            <Card style={styles.defualtCardStyles}>
              <Text style={styles.cardTitle}>{commentData.comment}</Text>
              <View style={styles.cardDateAndBy}>
                <Text>By: {commentData.username} </Text>
                <Text>on {commentData.date}</Text>
              </View>
              <View style={styles.row}>
                <Button
                  style={styles.whiteBackground}
                  color={commentData.ReportColor}
                  name="exclamation-triangle"
                  onPress={async () =>
                    await this.reportComment(commentData.key)
                  }
                />
                {commentData.ReportCount > 0 && (
                  <Text style={styles.iconBadge}>
                    {commentData.ReportCount}
                  </Text>
                )}
              </View>
            </Card>
          </View>
        );
      }),
    });
  }

  async loadPostCards(postItems) {
    // this.setState({display:
    this.setState({
      display: postItems.map(postData => {
        return (
          <View
            key={postData.key}
            style={[styles.defaultBackground, styles.marginTop15]}>
            <Card style={styles.defualtCardStyles}>
              <Text style={styles.cardTitle}>{postData.question}</Text>
              <Text style={styles.cardDesc}>{postData.desc}</Text>
              <View style={styles.cardDateAndBy}>
                {!postData.anon && <Text>Posted by: {postData.username} </Text>}
                <Text> on {postData.date}</Text>
              </View>
              <View style={styles.row}>
                <Button
                  style={styles.whiteBackground}
                  color={postData.likeColor}
                  name="thumbs-up"
                  onPress={async () => await this.likePost(postData.key)}
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
          </View>
        );
      }),
    });
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <ScrollView>
          <KeyboardAwareScrollView
            contentContainerStyle={[styles.container, styles.aligItemsCenter]}
            refreshControl={
              <RefreshControl
                refreshing={this.state.Loading}
                onRefresh={async () => {
                  this.refreshScreen();
                }}
              />
            }>
            {/* <View style={styles.container}> */}
            {this.state.display}
            {this.state.comments}
            {this.state.userCanComment && (
              //  {/* <Text style={{marginTop: 20, marginLeft: 18, fontSize: 24}}>
              //   Add comment:
              // </Text> */}
              <>
                <TextInput
                  style={[
                    styles.multiline,
                    styles.width300,
                    styles.marginTop15,
                  ]}
                  multiline={true}
                  numberOfLines={10}
                  placeholder="Add new comment here"
                  placeholderTextColor="grey"
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onChangeText={e => {
                    this.setState({comment: e});
                  }}
                  ref={this.clearComment}
                />
                <TouchableOpacity
                  style={styles.Buttons}
                  onPress={async () => {
                    await this.addComment(this.state.postID);
                    this.refreshScreen(this.state.postID);
                  }}>
                  <Text style={styles.customBtnText}>Post</Text>
                </TouchableOpacity>
              </>
            )}
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
//   Buttons: {
//     // shadowColor: 'rgba(0,0,0, .4)', // IOS
//     // shadowOffset: {height: 3, width: 3}, // IOS
//     // shadowOpacity: 1, // IOS
//     // shadowRadius: 1, //IOS
//     // elevation: 4, // Android
//     backgroundColor: '#3c4498',
//     justifyContent: 'center',
//     alignSelf: 'flex-end',
//     borderRadius: 10,
//     paddingHorizontal: 30,
//     height: 30,
//     marginHorizontal: 15,
//     marginBottom: 20,
//   },
//   multiline: {
//     shadowColor: 'rgba(0,0,0, .4)', // IOS
//     shadowOffset: {height: 3, width: 3}, // IOS
//     shadowOpacity: 1, // IOS
//     shadowRadius: 1, //IOS
//     elevation: 4, // Andro
//     borderRadius: 10,
//     backgroundColor: 'white',
//     borderColor: 'black',
//     borderWidth: 0,
//     alignItems: 'stretch',
//     height: 100,
//     textAlign: 'left',
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     paddingTop: 15,
//     margin: 10,
//     marginHorizontal: 18,
//   },
//   customBtnText: {
//     fontSize: 20,
//     fontWeight: '400',
//     color: 'white',
//     textAlign: 'center',
//   },
// });
