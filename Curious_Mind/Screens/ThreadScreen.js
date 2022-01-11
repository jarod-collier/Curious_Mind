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
import {FloatingAction} from 'react-native-floating-action';

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
    this.floatingButtonActions = [
      {
        color: '#3c4498',
        text: 'Oldest First',
        icon: require('../assets/images/outline_swap_vert_white_24dp.png'),
        name: 'Oldest First',
        position: 1,
      },
      {
        color: '#3c4498',
        text: 'Most Recent',
        icon: require('../assets/images/outline_update_white_24dp.png'),
        name: 'Most Recent',
        position: 2,
      },
      {
        color: '#3c4498',
        text: 'Pastors First',
        icon: require('../assets/images/outline_psychology_black_24dp.png'),
        name: 'Pastors First',
        position: 3,
      },
    ];
  }

  async componentDidMount() {
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
      await prepareThreadScreen(snapshot, uid, postID, this.state.SortCommentsBy)
      .then(async post => {
        if (post.postItems.length > 0) {
          this.state.userCanComment = await canComment(post.postItems);
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
              overlayColor='rgba(0, 0, 0, 0.75)'
              animation='fade'
            />
            <View style={styles.container}>
              {this.state.display}
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
                      this.clearComment.current.clear();

                      // On my device, this seemed to make the spinner come up faster
                      this.state.Spinner = false;
                      this.setState({
                        comment: '',
                        ButtonDisabled: true
                      });
                    }}>
                    <Text style={styles.customBtnText}>Post</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
        <FloatingAction
          actions={this.floatingButtonActions}
          onPressItem={async name => {
            switch (name) {
              case 'Oldest First':
                this.state.SortCommentsBy = 'Oldest First';
                break;
              case 'Most Recent':
                this.state.SortCommentsBy = 'Most Recent';
                break;
              case 'Pastors First':
                this.state.SortCommentsBy = 'Pastors First';
                break;
            }
            this.readFromDB(this.state.postID);
          }}
          floatingIcon={require('../assets/images/outline_sort_white_24dp.png')}
          iconHeight={30}
          iconWidth={30}
          distanceToEdge={15}
          color="#3c4498"
          buttonSize={35}
        />
      </SafeAreaView>
    );
  }
}
