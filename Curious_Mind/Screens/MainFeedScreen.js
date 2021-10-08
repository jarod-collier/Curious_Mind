import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  RefreshControl,
  LayoutAnimation,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {styles} from '../assets/styles/styles';
import {db} from '../logic/DbLogic';
import {loadPostCards, preparePostsFromDB} from '../logic/helpers';
import {onValue, ref} from 'firebase/database';
import {getAuth} from 'firebase/auth';
export default class MainFeedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: [],
      posts: [],
      Loading: true,
      filteredDisplay: [],
      searchQuery: '',
    };
  }

  async componentDidMount() {
    await this.readFromDB();
  }

  filterPosts = async text => {
    return this.state.posts.filter(item => {
      return String(item.question.toLowerCase()).includes(text.toLowerCase());
    });
  };

  searchFilterFunction = async text => {
    if (text !== '') {
      var newData = await this.filterPosts(text);
      await loadPostCards(newData, true, this.props.navigation).then(posts => {
        this.state.display = posts;
        this.setState({searchQuery: text});
      });
    } else {
      await loadPostCards(this.state.posts, true, this.props.navigation).then(
        posts => {
          this.state.display = posts;
          this.setState({searchQuery: text});
        },
      );
      this.setState({searchQuery: text});
    }
  };

  async readFromDB() {
    let uid = getAuth().currentUser.uid;
    if (!this.state.Loading) {
      this.setState({Loading: true});
    }
    onValue(ref(db, 'posts/'), async snapshot => {
      console.log('onValue MainFeed');
      await preparePostsFromDB(snapshot, uid)
        .then(async postsFromDB => {
          this.state.posts = postsFromDB;
          await loadPostCards(postsFromDB, true, this.props.navigation).then(
            posts => (this.state.display = posts),
          );
        })
        .then(() => {
          this.setState({Loading: false});
        });
    });
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <SearchBar
          placeholder="Search"
          value={this.state.searchQuery}
          onChangeText={text => this.searchFilterFunction(text)}
          autoCorrect={false}
          containerStyle={styles.searchBarContainer}
          inputStyle={styles.searchBarInput}
          inputContainerStyle={styles.searchBarInputContainer}
          round
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.Loading}
              onRefresh={async () => {
                await this.readFromDB();
              }}
            />
          }>
          <View style={styles.container}>
            {!this.state.Loading ? (
              this.state.display.length > 0 ? (
                this.state.display
              ) : this.state.searchQuery === '' ? (
                <Text style={styles.generalText}>
                  No posts found. Please make a new post or try refreshing the
                  screen.
                </Text>
              ) : (
                <Text style={styles.generalText}>
                  Couldn't find any posts with your search text
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
