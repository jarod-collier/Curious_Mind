import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  RefreshControl,
  LayoutAnimation,
  Alert,
} from 'react-native';
import {styles} from '../assets/styles/styles';
import {ScrollView} from 'react-native-gesture-handler';
import {canComment, addCommentToPost, db} from '../logic/DbLogic';
import {
  loadPostCards,
  prepareThreadScreen,
  loadCommentCards,
  cleanUsersInput,
} from '../logic/helpers';
import {onValue, ref} from 'firebase/database';
import {getAuth} from 'firebase/auth';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ThreadScreen extends Component {
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
      ButtonDisabled: true,
      SortCommentsBy: "Oldest First",
    };
  }

  async componentDidMount() {
    console.log('component DidMount Thread');
    this.state.postID = this.props.route.params.ID;
    await this.readFromDB(this.state.postID);

    this.clearComment = React.createRef();
  }


  AsyncAlert = async () => new Promise((resolve) => {
    Alert.alert(
      'Sort Questions',
      'How would you like to sort the comments that you see?',
      [
        {
          text: 'Oldest First', onPress: async () => {
            this.state.SortCommentsBy = "Oldest First";
            resolve('YES');
          },
        },
        {
          text: 'Most Recent', onPress: () => {
            this.state.SortCommentsBy = "Most Recent";
            resolve('YES');
          }
        },
        {
          text: 'Pastors First', onPress: async () => {
            this.state.SortCommentsBy = "Pastors First";
            resolve('YES');
          },
        },
      ],
      {cancelable: true},
    );
  });

  async sortComments() {
    await this.AsyncAlert();    
    await this.readFromDB(this.state.postID);
  }

  async readFromDB(postID) {
    let uid = getAuth().currentUser.uid;
    if (!this.state.Loading) {
      this.setState({Loading: true});
    }
    onValue(ref(db, 'posts/' + postID), async snapshot => {
      console.log('onValue Thread');
      await prepareThreadScreen(snapshot, uid, postID, this.state.SortCommentsBy)
      .then(async post => {
        if (post.postItems.length > 0) {
          this.state.userCanComment = canComment(post.posterUsername);
          await loadPostCards(
            post.postItems,
            false,
            this.props.navigation,
          ).then(postCard => (this.state.display = postCard));
          await loadCommentCards(post.postItems, post.commentItems)
            .then(commentCards => (this.state.comments = commentCards))
            .then(() => {
              this.setState({Loading: false});
            });
        } else {
          this.setState({Loading: false});
        }
      });
    });
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <KeyboardAwareScrollView>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.Loading}
                onRefresh={async () => {
                  await this.readFromDB(this.state.postID);
                }}
              />
            }>
            <Spinner
              visible={this.state.Spinner}
              textContent={'Posting...'}
              textStyle={styles.spinnerTextStyle}
              cancelable={true}
            />
            <View style={styles.container}>
              {this.state.display}
              <TouchableOpacity
                style={[styles.Buttons, styles.alignSelfCenter]}
                onPress={async () =>  this.sortComments()}>
                <Text style={styles.customBtnText}>Sort Comments</Text>
              </TouchableOpacity>
              {this.state.comments}
              {this.state.userCanComment && (
                <View style={styles.aligItemsCenter}>
                  <TextInput
                    style={[
                      styles.multiline,
                      styles.width300,
                      styles.marginTop15,
                    ]}
                    multiline={true}
                    numberOfLines={10}
                    placeholder="Add new comment here"
                    value={this.state.comment || null}
                    placeholderTextColor="grey"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onChangeText={e => {
                      e.replace(/ /g, '') === ''
                        ? (this.state.ButtonDisabled = true)
                        : (this.state.ButtonDisabled = false);
                      this.setState({comment: e});
                    }}
                    ref={this.clearComment}
                  />
                  <TouchableOpacity
                    style={[
                      styles.alignSelfCenter,
                      this.state.ButtonDisabled
                        ? styles.disabledButtons
                        : styles.Buttons,
                    ]}
                    disabled={this.state.ButtonDisabled}
                    onPress={async () => {
                      this.setState({Spinner: true});
                      await cleanUsersInput(this.state.comment).then(
                        val => (this.state.comment = val),
                      );
                      await addCommentToPost(
                        this.state.postID,
                        this.state.comment,
                      );
                      // this.refreshScreen(this.state.postID);
                      this.clearComment.current.clear();
                      this.setState({Spinner: false});
                    }}>
                    <Text style={styles.customBtnText}>Post</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}
