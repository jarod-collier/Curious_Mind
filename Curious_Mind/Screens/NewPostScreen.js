import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {CheckBox} from 'react-native-elements';
import {TextInput} from 'react-native-gesture-handler';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import {styles} from '../assets/styles/styles';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {createPost, updateUserPostCount} from '../logic/DbLogic';

export default class ResetPasswordScreen extends Component {
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
                style={[styles.inputBox, styles.width320, styles.justifyStart]}
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
                  await createPost(this.state);
                  await updateUserPostCount();
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
