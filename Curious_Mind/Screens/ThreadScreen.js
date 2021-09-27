import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  LayoutAnimation,
} from 'react-native';
import {styles} from '../assets/styles/styles';
import {ScrollView} from 'react-native-gesture-handler';
import {
  canComment,
  loadThreadPostFromDB,
  addCommentToPost,
} from '../logic/DbLogic';
import {loadPostCards, loadCommentCards} from '../logic/helpers';
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
    };
  }

  async componentDidMount() {
    this.state.postID = this.props.route.params.ID;
    await this.readFromDB(this.state.postID);

    this.focused = false;
    this.clearComment = React.createRef();
  }

  async readFromDB(postID) {
    this.setState({Loading: true});
    await loadThreadPostFromDB(postID).then(async post => {
      this.state.userCanComment = canComment(post.posterUsername);
      await loadPostCards(post.postItems, false, this.props.navigation).then(
        postCard => (this.state.display = postCard),
      );
      await loadCommentCards(post.postItems, post.commentItems).then(
        commentCards => (this.state.comments = commentCards),
      );
    });
    this.setState({Loading: false});
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
                /**THIS IS NOT REFRESHING */
                onRefresh={async () => {
                  this.setState({Loading: true});
                  await this.readFromDB(this.state.postID);
                  this.setState({Loading: false});
                }}
              />
            }>
            {this.state.display}
            {this.state.comments}
            {this.state.userCanComment && (
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
                    await addCommentToPost(
                      this.state.postID,
                      this.state.comment,
                    );
                    // this.refreshScreen(this.state.postID);
                    this.clearComment.current.clear();
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
