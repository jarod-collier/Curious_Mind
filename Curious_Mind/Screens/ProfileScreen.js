import React, {Component, useCallback, useState} from 'react';
import {Button} from 'react-native-vector-icons/FontAwesome';
import { getAuth, deleteUser } from 'firebase/auth';
import { getDatabase, ref, onValue, remove, update} from "firebase/database";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class ProfileScreen extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state= {
      username: '',
      email: '',
      aboutMe: '',
      fName: '',
      lName: '',
      commentNum: 0,
      postNum: 0,
      score: 0,
      Loading: true,
      pastorUser: false,
      preach: '',
      seminary: '',
      pastorCode: '',
      editing: false,
    };

  }

  makeDelay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  async componentDidMount(){
    this._isMounted = true;
    this.setState({Loading: true});
    await this.getUserInfo();
    this.setState({Loading: false});
    this.unsubscribe = this.props.navigation.addListener('focus', async e => {
      this.setState({Loading: true});
      await this.getUserInfo();
      this.setState({Loading: false});
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.unsubscribe.remove();
  }

  async delUser(navigation){
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {text: 'Cancel', onPress: () => {}},
        {text: 'DELETE', onPress: async () => {
          let uid = getAuth().currentUser.uid;
          const db = getDatabase();
          const userInfoRef = ref(db, 'userInfo/' + uid);
          remove(userInfoRef);
          
          this.makeDelay(500);
          var user = getAuth().currentUser;
          deleteUser(user).then(() => navigation.reset({
            index: 0,
            routes: [{ name: 'Login'}],
          }))
          .catch(error => Alert.alert(error.message));
        }, style: {color: 'red'}}
      ],
      {cancelable: true}
    )
  }

  async updateAboutMe(){
    let uid = getAuth().currentUser.uid;
    const db = getDatabase();

    const updates = {};
    updates['userInfo/' + uid + '/AddintionalInfo'] =  this.state.aboutMe;

    //update the value.
    update(ref(db), updates);
  }

  async getUserInfo(){
    let uid = getAuth().currentUser.uid;
    const db = getDatabase();
    const userInfoRef = ref(db, 'userInfo/' + uid);

    onValue(userInfoRef, (snapshot) => {
      this.state.fName = snapshot.val().First;
      this.state.lName = snapshot.val().Last;
      this.state.email = snapshot.val().Email;
      this.state.username = snapshot.val().Username;
      this.state.commentNum = snapshot.val().commentNum;
      this.state.postNum = snapshot.val().postNum;
      this.state.score = (this.state.postNum * 2) + this.state.commentNum;
      this.state.aboutMe = snapshot.val().AddintionalInfo;
      if(snapshot.val().userType === 'pastor'){
        this.state.pastorUser = true;
        this.state.preach = snapshot.val().Preach;
        this.state.seminary = snapshot.val().Seminary;
        this.state.pastorCode = snapshot.val().pastorCode;
      }
    });
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return(
     <View style={styles.container}>
       <ScrollView>
        <KeyboardAwareScrollView
          resetScrollToCoords={{x: 0, y: 0}}
          contentContainerStyle={styles.container}
          scrollEnabled={true}
          extraHeight={100}
        >
          <View style={{flex:2, flexDirection: 'row', borderBottomColor: 'black', borderBottomWidth: 3}}>
            {/* image view */}
            <View style={{justifyContent: 'center'}}>
              <TouchableOpacity
                style={styles.image}
                onPress={()=> Alert.alert('Add')}
              >
                <Button
                  style={{backgroundColor: '#A59F9F'}}
                  color='white'
                  name='user'
                  size={50}
                />
              </TouchableOpacity>
            </View>
            {/* text view */}
            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
              {/*name line */}
              <View>
                <Text style={{fontSize: 34, fontWeight: 'bold', marginLeft: 10, marginBottom: 20, marginTop: 20}}>
                  {this.state.fName} {this.state.lName}
                </Text>
              </View>
              {/*posts line */}
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{fontSize: 18, marginLeft: 10}}> Posts{'\n'}written</Text>
                <Text style={{fontSize: 18, marginLeft: 10}}>      Posts{'\n'}commented{'\n'}        on</Text>
                <Text style={{fontSize: 18, marginLeft: 10}}>{'\n'}Score</Text>
              </View>
              {/*numbers line */}
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 18, margin: 10, marginLeft: 30}}> {this.state.postNum}</Text>
                <Text style={{fontSize: 18, margin: 10, marginLeft: 60}}> {this.state.commentNum}</Text>
                <Text style={{fontSize: 18, margin: 10, marginLeft: 60}}> {this.state.score}</Text>
              </View>
            </View>
          </View>
          <View style={{flex:4}}>
            {/*about me section*/}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 20, marginLeft: 20}}>About me:</Text>
              <TouchableOpacity
                style={styles.Buttons}
                onPress={() => this.setState({editing: !this.state.editing})}
              >
                <Text style={styles.customBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View>
              {this.state.editing ?
                <TextInput
                  defaultValue={this.state.aboutMe}
                  style={{fontSize: 18, marginTop: 20, marginHorizontal: 20}}
                  onChangeText={e => {this.setState({aboutMe: e});}}
                  autoFocus
                  multiline={true}
                  maxLength={175}
                  blurOnSubmit={true}
                  returnKeyType='done'
                  onSubmitEditing={async() => {await this.updateAboutMe(), this.setState({editing: false})}}
                /> :
                <Text style={{fontSize: 18, marginTop: 20, marginHorizontal: 20}}>{this.state.aboutMe}</Text>
              }
            </View>
            {/*username line*/}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 20, marginLeft: 20}}>Username:</Text>
              <Text style={{fontSize: 18, marginTop: 20}}>    {this.state.username}</Text>
            </View>
            {/*email line*/}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20}}>Email:</Text>
              <Text style={{fontSize: 18, marginTop: 20}}>              {this.state.email}</Text>
            </View>
            {/*password line*/}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20}}>Password:</Text>
              <TouchableOpacity
                style={styles.Buttons}
                onPress={() => this.props.navigation.navigate('Reset Password')}
              >
                <Text style={styles.customBtnText}>Reset password</Text>
              </TouchableOpacity>
            </View>
            {this.state.pastorUser &&
              <View>
                {/* Preach line */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20}}>Preach:</Text>
                  <Text style={{fontSize: 18, marginTop: 20}}>           {this.state.preach}</Text>
                </View>
                {/* seminary line */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20}}>Seminary:</Text>
                  <Text style={{fontSize: 18, marginTop: 20}}>       {this.state.seminary}</Text>
                </View>
                {/* pastor code line */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20}}>Pastor code:</Text>
                  <Text style={{fontSize: 18, marginTop: 20, fontStyle: 'italic'}}>   {this.state.pastorCode}</Text>
                </View>
              </View>
            }
            {/** delete button */}
            <TouchableOpacity
              style={styles.Delete}
              onPress={() => this.delUser(this.props.navigation)}
            >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.customBtnText}>Delete Account</Text>
                <Button
                  style={{backgroundColor: 'red'}}
                  name="trash"
                  color="black" />
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
   );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'silver',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A59F9F',
    width: 125,
    height: 125,
    borderRadius: 65,
    margin: 15,
  },
  Delete: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 3, width: 3}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 4, // Android
    borderWidth: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    borderColor: 'red',
    borderRadius: 10,
    width: 250,
    marginVertical: 15,
    bottom: 0, 
    // position: 'absolute', 
    justifyContent: 'center', 
    alignSelf: 'center',
  },
  Buttons: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 2, width: 2}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 4, // Android
    borderWidth: 1,
    backgroundColor: '#B2ACAC',
    justifyContent: 'center',
    borderColor: '#B2ACAC',
    borderRadius: 10,
    height: 25,
    marginTop: 20,
    marginHorizontal: 20,
  },
  multiline: {
    borderRadius: 15,
    borderColor: 'white',
    borderWidth: 1,
    alignItems: 'stretch',
    height: 150,
    textAlign: 'left',
    margin: 15,
  },
  customBtnText: {
    color: "black",
    textAlign: "center",
    marginHorizontal: 7
  },
});
