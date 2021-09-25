import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {CheckBox} from 'react-native-elements';
import {getAuth} from 'firebase/auth';
import {getDatabase, ref, set, onValue, update} from 'firebase/database';
import {TextInput} from 'react-native-gesture-handler';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Alert,
  ScrollView,
} from 'react-native';
import {styles} from '../assets/styles/styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class ResetPasswordScreen extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      checked: {},
      Question: '',
      Description: '',
      Anon: false,
      pastorOnly: false,
      username: '',
    };
    this.clearQuestion = React.createRef();
    this.clearDescription = React.createRef();
  }

  async updateProfile() {
    let uid = getAuth().currentUser.uid;
    let numberOfPosts = 0;

    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/');

    // Get the current value
    onValue(userInfoRef, snapshot => {
      snapshot.forEach(child => {
        if (child.val().uid === uid) {
          numberOfPosts = child.val().postNum;
        }
      });
    });

    numberOfPosts = numberOfPosts + 1;

    const updates = {};
    updates['userInfo/' + uid + '/postNum'] = numberOfPosts;

    //update the value.
    update(ref(db), updates);
  }

  async createPost() {
    let uid = getAuth().currentUser.uid;

    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/' + uid);

    let post_question = this.state.Question;
    let post_description = this.state.Description;
    let post_anon = this.state.Anon;
    let post_pastor_only = this.state.pastorOnly;

    // Get the current value
    onValue(userInfoRef, snapshot => {
      set(ref(db, 'posts/' + uid + post_question), {
        username: '' + snapshot.val().Username,
        date: '' + new Date().toLocaleDateString(),
        question: '' + post_question,
        desc: '' + post_description,
        likes: 0,
        likedBy: [''],
        reports: 0,
        reportedBy: [''],
        Anon: post_anon,
        PastorOnly: post_pastor_only,
      }).catch(error => {
        Alert.alert('error ', error);
      });
      Alert.alert('Post added successfully.');
    });
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.safeAreaStyle}>
        <ScrollView>
          <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={[
              styles.container,
              styles.aligItemsStart,
              styles.marginHorizontal15,
            ]}
            scrollEnabled={true}
            extraHeight={100}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <Text
                style={[
                  styles.paddHorizontal15,
                  styles.fontSize28,
                  styles.marginTop35,
                  styles.alignSelfStart,
                ]}>
                Your Question
              </Text>
              <TextInput
                style={[styles.inputBox, styles.width320]}
                placeholder="Type your question here"
                value={this.state.Question}
                placeholderTextColor="black"
                onChangeText={e => {
                  this.setState({Question: e});
                }}
                ref={this.clearQuestion}
              />
              <Text
                style={[
                  styles.paddHorizontal15,
                  styles.fontSize28,
                  styles.marginTop15,
                ]}>
                Description
              </Text>
              <TextInput
                style={[styles.multiline]}
                placeholder="Type your description here"
                value={this.state.Description}
                placeholderTextColor="black"
                multiline={true}
                numberOfLines={10}
                blurOnSubmit={true}
                returnKeyType="done"
                onChangeText={e => {
                  this.setState({Description: e});
                }}
                ref={this.clearDescription}
              />

              <Text
                style={[
                  styles.paddHorizontal15,
                  styles.marginTop15,
                  styles.fontSize28,
                ]}>
                Options:
              </Text>
              <View style={styles.row}>
                <CheckBox
                  checked={this.state.Anon}
                  checkedColor="#3c4498"
                  uncheckedColor="black"
                  onPress={() => {
                    this.setState({Anon: !this.state.Anon});
                  }}
                />
                <Text style={[styles.marginTop15, styles.fontSize18]}>
                  Post Anonymously
                </Text>
              </View>
              <View style={styles.row}>
                <CheckBox
                  checked={this.state.pastorOnly}
                  checkedColor="#3c4498"
                  uncheckedColor="black"
                  onPress={() => {
                    this.setState({pastorOnly: !this.state.pastorOnly});
                  }}
                />
                <Text style={[styles.marginTop15, styles.fontSize18]}>
                  Only Allow Pastors to Respond
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.Buttons, styles.alignSelfCenter]}
                onPress={async () => {
                  await this.createPost();
                  await this.updateProfile();
                  this.setState({
                    Question: '',
                    Description: '',
                    Anon: false,
                    pastorOnly: false,
                  });
                  this.props.navigation.navigate('Home Tab');
                }}>
                <Text style={styles.customBtnText}>Post</Text>
              </TouchableOpacity>
            </View>
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
//   inputBox: {
//     alignItems: 'stretch',
//     borderRadius: 15,
//     borderColor: 'black',
//     backgroundColor: 'white',
//     borderWidth: 1,
//     textAlign: 'left',
//     padding: 10,
//     margin: 15,
//   },
//   Buttons: {
//     shadowColor: 'rgba(0,0,0, .4)', // IOS
//     shadowOffset: {height: 3, width: 3}, // IOS
//     shadowOpacity: 1, // IOS
//     shadowRadius: 1, //IOS
//     elevation: 4, // Android
//     borderWidth: 0,
//     backgroundColor: '#3c4498',
//     justifyContent: 'center',
//     alignSelf: 'stretch',
//     borderRadius: 15,
//     height: 40,
//     width: 350,
//     marginHorizontal: 15,
//     marginBottom: 15,
//   },
//   multiline: {
//     borderRadius: 15,
//     borderColor: 'black',
//     backgroundColor: 'white',
//     borderWidth: 1,
//     alignItems: 'stretch',
//     height: 150,
//     textAlign: 'left',
//     margin: 15,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     paddingTop: 15,
//   },
//   customBtnText: {
//     fontSize: 20,
//     fontWeight: '400',
//     color: 'white',
//     textAlign: 'center',
//   },
// });
