import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {Card} from 'react-native-shadow-cards';
import {Button} from 'react-native-vector-icons/FontAwesome';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, update, remove} from "firebase/database";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  LayoutAnimation,
} from 'react-native';

export default class MainFeedScreen extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      display: [],
      Loading: true,
      initially_loaded_cards: false,
    };
  }

  async componentDidMount(){
    
    this._isMounted = true;
    // this.setState({Loading: true});
    // this.state.Loading = true;
    // console.log("loading: " + this.state.Loading);
    // this.readFromDB(this.props.navigation);
    // this.state.Loading = false;

    // this.setState({Loading: false});
    // this.state.initially_loaded_cards = true;
    

    if (!this.state.initially_loaded_cards) {
      console.log("inside component if");
      this.setState({Loading: true});
      // this.state.Loading = true
      this.readFromDB(this.props.navigation);
      this.setState({Loading: false});
      this.state.initially_loaded_cards = true;
      // this.setState({initially_loaded_cards: false});
      // this.forceUpdate(); 
      this.unsubscribe = this.props.navigation.addListener('focus', async () => {
        this.refreshScreen();
      });
    }   
  }

  componentWillUnmount(){
    this._isMounted = false;
    // this.unsubscribe();
  }

  makeDelay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  async likePost(key){
    let uid = getAuth().currentUser.uid;
    let likedBy = [];
    let likesCount;

    const db = getDatabase();
    const postRef = ref(db, 'posts/' + key);

    onValue(postRef, (snapshot) => {
      likedBy = snapshot.val().likedBy;
      likesCount = snapshot.val().likes;
    });
    
    if(!likedBy.includes(uid)){
      likedBy.push(uid);

      const updates = {};
      updates['/posts/' + key + '/likedBy'] = likedBy;
      updates['/posts/' + key + '/likes'] = likesCount + 1;
        
      update(ref(db), updates);
      this.refreshScreen();
    }else{
      Alert.alert('This post has already been liked.');
    }
  }

  async reportPost(key){
    let uid = getAuth().currentUser.uid;
    let reportedBy = [];
    let reportCount;
    let incAmount = 1; 
    let pastorReportWeight = 5;
    const db = getDatabase();
    const reportPostRef = ref(db, 'posts/' + key);
    const userInfoRef = ref(db, 'userInfo/' + uid);

    onValue(userInfoRef, (userInfo_snapshot) => {
      if (userInfo_snapshot.val().userType === 'pastor'){
        incAmount = pastorReportWeight;
      } 
      onValue(reportPostRef, (report_snapshot) => {
        reportedBy = report_snapshot.val().reportedBy;
        reportCount = report_snapshot.val().reports;

        if(!reportedBy.includes(uid)){
          Alert.alert('Report Post', 'Are you sure you want to report this post?',
            [
              {text: 'Cancel', onPress: () => {}},
              {text: 'REPORT', onPress: async () => {
                if((reportCount + incAmount) >= pastorReportWeight){
                  remove(reportPostRef);
                  this.refreshScreen();
                  Alert.alert('Post Removed', 'The report count exceeded the limit. This post will be deleted now. Please refresh the screen.');
                }else{
                  reportedBy.push(uid);
    
                  const report_updates = {};
                  report_updates['posts/' + key + '/reportedBy'] =  reportedBy;
                  report_updates['posts/' + key + '/reports'] =  (reportCount + incAmount);
                  update(ref(db), report_updates);
    
                  this.refreshScreen();
                  Alert.alert('This post was reported.\nThank you.');
                }
              }, style: {color: 'red'}}
            ],
            {cancelable: true}
          )
        }else{
          Alert.alert('You already reported this post.');
        } 
      });
    });  

    
    
  }

  async loadPostCards(navigation){
    this.state.display = this.state.posts.map(postData => {
      return(
        <View key={postData.key}>
          <Button
            style={{backgroundColor: 'silver'}}
            onPress = {()=> navigation.navigate('Thread', {ID: postData.key})}
          >
            <Card style={{ padding: 15, alignSelf: 'center', elevation: 3}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>{postData.question}</Text>
              <Text style={{marginTop: 3}}>{postData.desc}</Text>
              <View style={{flexDirection: 'row', alignSelf: 'flex-end', opacity: 0.5}}>
                <Text>Posted</Text>
                { !postData.anon && <Text> by: {postData.username}</Text>}
                <Text> on {postData.date}</Text>
              </View>
              <View style={{flexDirection:'row', alignItems: 'stretch'}}>
                <Button
                  style={{backgroundColor: 'white'}}
                  color='black'
                  name='comment'
                  onPress={()=> navigation.navigate('Thread', {ID: postData.key})} />
                <Button
                  style={{backgroundColor: 'white'}}
                  color='black'
                  name='language'
                  onPress={()=> Alert.alert('Translate')} />
                <Button
                  style={{backgroundColor: 'white'}}
                  color= {postData.likeColor}
                  name='thumbs-up'
                  onPress={() => this.likePost(postData.key)}
                  />
                  {postData.likes > 0 &&
                  <Text
                    style={{marginTop: 9, opacity: .5, marginLeft: -10}}
                  >{postData.likes}</Text>}
                <Button
                  style={{backgroundColor: 'white'}}
                  color={postData.reportColor}
                  name='exclamation-triangle'
                  onPress={async ()=> await this.reportPost(postData.key)} />
                  {postData.reports > 0 &&
                  <Text
                    style={{marginTop: 9, opacity: .5, marginLeft: -10}}
                  >{postData.reports}</Text>}
              </View>
            </Card>
          </Button>
        </View>
      )
    });
  }

  async refreshScreen (){
    console.log("inside refresh screen");
    this.setState({Loading: true});
    // this.state.Loading = true;
    await this.readFromDB(this.props.navigation);
    this.makeDelay(500).then(()=> this.setState({Loading: false}));
  }

  async readFromDB(navigation){
    // console.log("inside read from db");
    let uid = getAuth().currentUser.uid;

    const db = getDatabase();
    const postRef = ref(db, 'posts/');

    onValue(postRef, (snapshot) => {
      let postItems = [];
      snapshot.forEach((child) => {
        var alreadyLikedpost = 'black';
        var alreadyReportedpost = 'black';
        if (child.val().likedBy.includes(uid)) {
          alreadyLikedpost = 'blue';
        }

        if (child.val().reportedBy.includes(uid)) {
          alreadyReportedpost = 'orange';
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
      })

      // Using this.state makes the cards load right away
      this.state.posts = postItems.reverse();
      // this.setState({posts: postItems.reverse()});

      
    }, {
      onlyOnce: true,
    });
    await this.loadPostCards(navigation); 
  }

  render() {
    LayoutAnimation.easeInEaseOut(); 
    // if (!this.state.initially_loaded_cards) {
    //   console.log("inside render if");
    //   this.readFromDB(this.props.navigation);

    // }
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.Loading}
              onRefresh={async () => {this.refreshScreen();}}
            />
          }
        >
          <View style={styles.container}>
            {this.state.display.length > 0 ?
              this.state.display
              :
              <Text style={styles.generalText}>
                No posts found. Please make a new post or try refreshing the screen.
              </Text>
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  generalText: {
    padding: 15, 
    color: 'black', 
    alignSelf: 'center', 
    marginTop: 15, 
    fontSize: 30
  }
});
