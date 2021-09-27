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
import {loadPostsFromDB} from '../logic/DbLogic';
import {loadPostCards} from '../logic/helpers';
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
    this.setState({Loading: true});
    await loadPostsFromDB().then(postsFromDB =>
      loadPostCards(postsFromDB, true, this.props.navigation).then(
        posts => (this.state.display = posts),
      ),
    );
    this.setState({Loading: false});
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
