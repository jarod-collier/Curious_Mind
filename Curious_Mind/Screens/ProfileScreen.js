import React, {Component} from 'react';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {styles} from '../assets/styles/styles';
import {delUser, updateAboutMe, db} from '../logic/DbLogic';
import {getAuth} from 'firebase/auth';
import {ref, onValue} from 'firebase/database';
import DialogInput from 'react-native-dialog-input';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      showDeleteAccountTextInput: false,
    };
  }

  async componentDidMount() {
    await this.getUserProfile();
  }
  async getUserProfile() {
    let uid = getAuth().currentUser.uid;
    this.setState({Loading: true});
    onValue(ref(db, 'userInfo/' + uid), snapshot => {
      if (snapshot.exists()) {

        this.state.fName = snapshot.val().First;
        this.state.lName = snapshot.val().Last;
        this.state.email = snapshot.val().Email;
        this.state.username = snapshot.val().Username;
        this.state.commentNum = snapshot.val().commentNum;
        this.state.postNum = snapshot.val().postNum;
        this.state.score = this.state.postNum * 2 + this.state.commentNum;
        this.state.aboutMe = snapshot.val().AddintionalInfo;
        if (snapshot.val().userType === 'pastor') {
          this.state.pastorUser = true;
          this.state.preach = snapshot.val().Preach;
          this.state.seminary = snapshot.val().Seminary;
          this.state.pastorCode = snapshot.val().pastorCode;
        }
        this.setState({Loading: false});
      }
    });
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.Loading}
              onRefresh={async () => {
                await this.getUserProfile();
              }}
            />
          }>
          <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={[styles.container, styles.marginTop25, styles.marginBottom15]}
            scrollEnabled={true}
            extraHeight={100}>
            {!this.state.Loading ? (
              <>
                <View style={styles.profileTopView}>
                  <View
                    style={[styles.column, styles.justifyCenter, styles.flex1]}>
                    <Text style={styles.profileTitle}>
                      {this.state.fName} {this.state.lName}
                    </Text>
                    <View style={styles.rowSpaceAround}>
                      <Text
                        style={[
                          styles.profileCounters,
                          styles.flex1,
                          styles.italic,
                        ]}>
                        Posts{'\n'}written
                      </Text>
                      <Text
                        style={[
                          styles.profileCounters,
                          styles.flex1,
                          styles.italic,
                        ]}>
                        Posts{'\n'}commented on
                      </Text>
                      <Text
                        style={[
                          styles.profileCounters,
                          styles.flex1,
                          styles.italic,
                        ]}>
                        {'\n'}Score
                      </Text>
                    </View>
                    {/*numbers line */}
                    <View style={[styles.rowSpaceAround, styles.marginTop15]}>
                      <Text style={[styles.profileCounters, styles.flex1]}>
                        {this.state.postNum}
                      </Text>
                      <Text style={[styles.profileCounters, styles.flex1]}>
                        {this.state.commentNum}
                      </Text>
                      <Text style={[styles.profileCounters, styles.flex1]}>
                        {this.state.score}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.flex4}>
                  {/*about me section*/}
                  <View style={[styles.row, styles.paddHorizontal20]}>
                    <Text style={styles.profileInfoTitle}>About me:</Text>
                    <TouchableOpacity
                      style={[styles.actionButtons, styles.marginHorizontal15]}
                      onPress={() =>
                        this.setState({editing: !this.state.editing})
                      }>
                      <Text style={styles.fontSize16}>Edit</Text>
                    </TouchableOpacity>
                  </View>

                  {this.state.editing ? (
                    <TextInput
                      defaultValue={this.state.aboutMe}
                      style={[
                        styles.fontSize18,
                        styles.paddHorizontal20,
                        styles.aligItemsCenter,
                      ]}
                      onChangeText={e => {
                        this.setState({aboutMe: e});
                      }}
                      autoFocus
                      multiline={true}
                      maxLength={175}
                      blurOnSubmit={true}
                      returnKeyType="done"
                      onSubmitEditing={async () => {
                        await updateAboutMe(this.state.aboutMe);
                        this.setState({editing: false});
                      }}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.fontSize18,
                        styles.marginTop25,
                        styles.paddHorizontal20,
                      ]}>
                      {this.state.aboutMe}
                    </Text>
                  )}

                  {/*username line*/}
                  <View
                    style={[
                      styles.row,
                      styles.paddHorizontal20,
                      styles.marginTop15,
                      styles.aligItemsCenter,
                    ]}>
                    <Text style={styles.profileInfoTitle}>Username:</Text>
                    <Text
                      style={[styles.fontSize18, styles.marginHorizontal15]}>
                      {this.state.username}
                    </Text>
                  </View>
                  {/*email line*/}
                  <View
                    style={[
                      styles.row,
                      styles.paddHorizontal20,
                      styles.marginTop15,
                      styles.aligItemsCenter,
                    ]}>
                    <Text style={styles.profileInfoTitle}>Email:</Text>
                    <Text
                      style={[styles.fontSize18, styles.marginHorizontal15]}>
                      {this.state.email}
                    </Text>
                  </View>
                  {/*password line*/}
                  <View
                    style={[
                      styles.row,
                      styles.paddHorizontal20,
                      styles.marginTop15,
                      styles.aligItemsCenter,
                    ]}>
                    <Text style={styles.profileInfoTitle}>Password:</Text>
                    <TouchableOpacity
                      style={[
                        styles.actionButtons,
                        styles.marginHorizontal15,
                        styles.width140,
                      ]}
                      onPress={() =>
                        this.props.navigation.navigate('Reset Password')
                      }>
                      <Text style={styles.fontSize16}>Reset password</Text>
                    </TouchableOpacity>
                  </View>
                  {this.state.pastorUser && (
                    <View>
                      {/* Preach line */}
                      <View
                        style={[
                          styles.row,
                          styles.paddHorizontal20,
                          styles.marginTop15,
                          styles.aligItemsCenter,
                        ]}>
                        <Text style={styles.profileInfoTitle}>Preach:</Text>
                        <Text
                          style={[
                            styles.fontSize18,
                            styles.marginHorizontal15,
                          ]}>
                          {this.state.preach}
                        </Text>
                      </View>
                      {/* seminary line */}
                      <View
                        style={[
                          styles.row,
                          styles.paddHorizontal20,
                          styles.marginTop15,
                          styles.aligItemsCenter,
                        ]}>
                        <Text style={styles.profileInfoTitle}>Seminary:</Text>
                        <Text
                          style={[
                            styles.fontSize18,
                            styles.marginHorizontal15,
                          ]}>
                          {this.state.seminary}
                        </Text>
                      </View>
                      {/* pastor code line */}
                      <View
                        style={[
                          styles.row,
                          styles.paddHorizontal20,
                          styles.marginTop15,
                          styles.aligItemsCenter,
                        ]}>
                        <Text style={styles.profileInfoTitle}>
                          Pastor code:
                        </Text>
                        <Text
                          style={[
                            styles.fontSize18,
                            styles.marginHorizontal15,
                            styles.italic,
                          ]}>
                          {this.state.pastorCode}
                        </Text>
                      </View>
                    </View>
                  )}
                  {/** delete button */}
                  <TouchableOpacity
                    style={[
                      styles.Buttons,
                      styles.row,
                      styles.aligItemsCenter,
                      styles.marginTop35,
                      styles.alignSelfCenter,
                      styles.redBackground,
                    ]}
                    onPress={async () => { 
                      this.setState({showDeleteAccountTextInput: true});
                    }}>
                    <DialogInput 
                      isDialogVisible={this.state.showDeleteAccountTextInput}
                      title={"Please Provide Your Password To Delete Your Account"}
                      message={"You need to input your password to verify your intentions to delete your account."}
                      hintInput ={"Password"}
                      submitInput={ async (inputText) => {{
                        this.setState({showDeleteAccountTextInput: false});
                        await delUser(this.props.navigation, inputText);
                      }}}
                      closeDialog={ () => {
                        this.setState({showDeleteAccountTextInput: false})
                      }}>
                    </DialogInput>
                    <Text style={styles.customBtnText}>Delete Account</Text>
                    <Button
                      style={styles.redBackground}
                      name="trash"
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text style={styles.generalText}>Loading ...</Text>
            )}
          </KeyboardAwareScrollView>
        </ScrollView>
      </View>
    );
  }
}
