import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {CheckBox} from 'react-native-elements';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { TextInput } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

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

  async updateProfile(){
    let uid = getAuth().currentUser.uid;
    let numberOfPosts = 0;
    var userRef;

    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/');

    // Get the current value
    onValue(userInfoRef, (snapshot) => {
      snapshot.forEach((child) => {
          if(child.val().uid === uid){
            numberOfPosts = child.val().postNum;
            userRef = child;
          }
      })
    });

    numberOfPosts = numberOfPosts + 1;

    const updates = {};
    updates['userInfo/' + uid + '/postNum'] =  numberOfPosts;

    //update the value.
    update(ref(db), updates);
  }

  async createPost(){
    let uid = getAuth().currentUser.uid;

    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/' + uid);

    let post_question = this.state.Question;
    let post_description = this.state.Description;
    let post_anon = this.state.Anon;
    let post_pastor_only = this.state.pastorOnly;

    // Get the current value
    onValue(userInfoRef, (snapshot) => {
      set(ref(db, 'posts/' + uid + post_question), {
        username: "" + snapshot.val().Username,
        date: "" + new Date().toLocaleDateString(),
        question: "" + post_question,
        desc: "" + post_description,
        likes: 0,
        likedBy: [""],
        reports: 0,
        reportedBy: [""],
        Anon: post_anon,
        PastorOnly: post_pastor_only,
      }).catch((error)=>{
        Alert.alert('error ', error)
      })
      Alert.alert('Post added successfully.');
    });
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <KeyboardAvoidingView>
            <View style={styles.container}>
              <View>
                <Text style={{
                  marginTop: 40,
                  marginLeft: 15,
                  fontSize: 24,
                }}>
                  Your Question
                </Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Type your question here"
                  value={this.state.Question}
                  placeholderTextColor="black"
                  onChangeText={e => {this.setState({Question: e});}}
                  ref={this.clearQuestion}
                />
              </View>
              <View>
                <Text style={{
                  marginTop: 20,
                  marginLeft: 15,
                  fontSize: 24,
                }}>
                  Description
                </Text>
                <TextInput
                  style={styles.multiline}
                  placeholder="Type your description here"
                  value={this.state.Description}
                  placeholderTextColor="black"
                  multiline={true}
                  numberOfLines={10}
                  blurOnSubmit={true}
                  returnKeyType='done'
                  onChangeText={e => {this.setState({Description: e});}}
                  ref={this.clearDescription}
                />
              </View>
              <View>
                <Text style={{
                  marginTop: 20,
                  marginLeft: 15,
                  fontSize: 24,
                }}>
                  Options:
                </Text>
                <View style={{ flexDirection: 'row'}}>
                  <CheckBox
                    checked={this.state.Anon}
                    checkedColor='dodgerblue'
                    uncheckedColor='black'
                    onPress={()=> {this.setState({Anon: !this.state.Anon})}}
                  />
                  <Text style={{marginTop: 15, fontSize: 18}}>Post Anonymously</Text>
                </View>
                <View style={{ flexDirection: 'row'}}>
                  <CheckBox
                    checked={this.state.pastorOnly}
                    checkedColor='dodgerblue'
                    uncheckedColor='black'
                    onPress={() => {this.setState({pastorOnly: !this.state.pastorOnly})}}
                  />
                  <Text style={{marginTop: 15, fontSize: 18}}>Only Allow Pastors to Respond</Text>
                </View>
              </View>
              <View style={{bottom: 0, justifyContent: 'center', alignSelf: 'center'}}>
                <TouchableOpacity
                  style={styles.Buttons}
                  onPress={async () => {
                    await this.createPost(); 
                    await this.updateProfile(); 
                    this.setState({
                      Question: '',
                      Description: '',
                      Anon: false,
                      pastorOnly: false,
                    });
                    this.props.navigation.navigate('Home Tab')}
                  }
                >
                  <Text style={styles.customBtnText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'silver',
  },
  inputBox: {
    alignItems:'stretch',
    borderRadius: 15,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    textAlign: 'left',
    padding: 10,
    margin: 15,
  },
  Buttons: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 3, width: 3}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 4, // Android
    borderWidth: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignSelf: 'stretch',
    borderColor: 'green',
    borderRadius: 15,
    height: 40,
    width: 350,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  multiline: {
    borderRadius: 15,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    alignItems: 'stretch',
    height: 150,
    textAlign: 'left',
    margin: 15,
  },
  customBtnText: {
    fontSize: 20,
    fontWeight: '400',
    color: "black",
    textAlign: "center"
  },
});
