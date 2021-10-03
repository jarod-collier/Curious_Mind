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
      Loading: true,
    };
  }

  async componentDidMount() {
    await this.readFromDB();
  }

  async readFromDB() {
    let uid = getAuth().currentUser.uid;
    this.setState({Loading: true});
    onValue(ref(db, 'posts/'), async snapshot => {
      await preparePostsFromDB(snapshot, uid).then(postsFromDB =>
        loadPostCards(postsFromDB, true, this.props.navigation).then(
          posts => (this.state.display = posts),
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
              onRefresh={async () => {
                await this.readFromDB();
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
