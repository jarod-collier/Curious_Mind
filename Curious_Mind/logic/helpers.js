import {styles} from '../assets/styles/styles';
import {View, Text, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {likePost, reportPost, reportComment, deleteEvent} from './DbLogic';
import React from 'react';
import {Card} from 'react-native-shadow-cards';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {Alert} from 'react-native';

// Using strings to filter common words for readability and maintability
// I tried to make it so each row is similar (but then I found a huge list of possible words)
// The spacing before/after a word is used to make sure we don't match parts of a larger word
// I am putting this up here so that we can use it on various places where a user inputs text.
// We'll probably want to at some point add regex to account for symbols in words: f$ck
const wordsToFilter = [
  'fuck',
  'fuc',
  'fuk',
  'f u c k',
  'fukc',
  'fvck',
  'fxck',
  'damn it',
  'damnit',
  'dammit',
  'shit',
  'bitch',
  'nigger',
  'nigga',
  'chink',
  'gringo',
  ' kike ',
  ' spick ',
  ' spic ',
  'cunt',
  'pussy',
  'dick',
  'penis',
  'vagina',
  'anal',
  'areola',
  'areole',
  'cock',
  ' ass ',
  ' asshole',
  'tits',
  'tit',
  'boob',
  'blow job',
  'blowjob',
  'bukkake',
  ' clit',
  'bastard',
  ' cum ',
  'cumming',
  'slut',
  'dildo',
  'douche',
  'dumbass',
  'ejaculate',
  'faggot',
  ' fag ',
  'fellatio',
  'handjob',
  'horny',
  'hump',
  'jackass',
  'jerkoff',
  ' jizz ',
  'kinky',
  'masterbat',
  'masturbat',
  'orgasm',
  'orgies',
  'orgy',
  'phallic',
  ' pee ',
  ' piss ',
  ' pissed ',
  'pubic',
  'retard',
  'rimjob',
  'semen',
  'skank',
  'sperm',
  'stfu',
  'tampon',
  ' urine ',
  ' urinal ',
];

export const loadPostCards = async (posts, MainFeedView, navigation) => {
  return posts.map(postData => {
    return (
      <View key={postData.key}>
        <Button
          style={styles.defaultBackground}
          onPress={() => navigation.navigate('Thread', {ID: postData.key})}>
          <Card style={styles.defualtCardStyles}>
            <Text style={styles.cardTitle}>{postData.question}</Text>
            <Text style={styles.cardDesc}>{postData.desc}</Text>
            <View style={styles.cardDateAndBy}>
              {!postData.anon && (
                <Text
                  style={styles.blueText}
                  onPress={() =>
                    navigation.navigate('View Profile', {
                      uid: '' + postData.key.substring(0, 28),
                    })
                  }>
                  @{postData.username}
                </Text>
              )}
              <Text> on {postData.date}</Text>
            </View>
            <View style={styles.rowSpaceBetween}>
              <View style={styles.row}>
                {MainFeedView && (
                  <Button
                    style={styles.whiteBackground}
                    color="#cac5c4"
                    name="comment"
                    onPress={() =>
                      navigation.navigate('Thread', {ID: postData.key})
                    }
                  />
                )}
                <Button
                  style={styles.whiteBackground}
                  color={postData.likeColor}
                  name="thumbs-up"
                  onPress={() => likePost(postData.key)}
                />
                {postData.likes > 0 && (
                  <Text style={styles.iconBadge}>{postData.likes}</Text>
                )}
                <Button
                  style={styles.whiteBackground}
                  color={postData.reportColor}
                  name="exclamation-triangle"
                  onPress={async () =>
                    await reportPost(postData.key, MainFeedView, navigation)
                  }
                />
                {postData.reports > 0 && (
                  <Text style={styles.iconBadge}>{postData.reports}</Text>
                )}
              </View>
              <View style={styles.justifyCenter}>
                {postData.userType === 'pastor' && (
                  <View style={styles.pastorTag}>
                    <Text>Pastor</Text>
                  </View>
                )}
              </View>
            </View>
          </Card>
        </Button>
      </View>
    );
  });
};

export const loadEventCards = async (events, showDeleteButton) => {
  return events.map(eventData => {
    return (
      <View
        key={eventData.title}
        style={[styles.defaultBackground, styles.marginBottom15]}>
        <Card style={styles.defualtCardStyles}>
          <Text style={styles.cardTitle}>{eventData.title}</Text>
          <Text style={styles.cardDesc}>{eventData.desc}</Text>
          <Text>Date: {eventData.date}</Text>
          <Text>Time: {eventData.time}</Text>
          <Text>Where: {eventData.location}</Text>
          <TouchableOpacity
            style={[styles.Buttons, styles.alignSelfCenter]}
            onPress={async () =>
              addToCalendar(
                eventData.title,
                eventData.date,
                eventData.time,
                eventData.location,
                eventData.desc,
              )
            }>
            <View style={[styles.rowCenter, styles.aligItemsCenter]}>
              <Text style={styles.customBtnText}>Add event to calendar</Text>
              <Button
                style={styles.defaultButtonColor}
                name="calendar"
                color="white"
              />
            </View>
          </TouchableOpacity>
          {eventData.pastorWhoCreatedEvent && (
            <TouchableOpacity
              style={[
                styles.Buttons,
                styles.row,
                styles.aligItemsCenter,
                styles.alignSelfCenter,
                styles.redBackground,
              ]}
              onPress={async () => await deleteEvent(eventData.key)}>
              <Text style={styles.customBtnText}>Delete Event</Text>
              <Button
                style={styles.redBackground}
                name="trash"
                color="white"
              />
            </TouchableOpacity>
          )}
        </Card>
      </View>
    );
  });
};

export const loadCommentCards = async (postItems, commentItems) => {
  return commentItems.map(commentData => {
    return (
      <View
        key={commentData.key}
        style={[
          styles.defaultBackground,
          styles.marginTop15,
          styles.alignSelfCenter,
        ]}>
        <Card style={styles.defualtCardStyles}>
          <Text style={styles.cardTitle}>{commentData.comment}</Text>
          <View style={[styles.cardDateAndBy, styles.marginTop10]}>
            <Text
              style={styles.blueText}
              onPress={() =>
                this.props.navigation.navigate('View Profile', {
                  uid: '' + commentData.key.substring(0, 28),
                })
              }>
              @{commentData.username}
            </Text>
            <Text> on {commentData.date}</Text>
          </View>
          <View style={styles.rowSpaceBetween}>
            <Button
              style={styles.whiteBackground}
              color={commentData.ReportColor}
              name="exclamation-triangle"
              onPress={async () =>
                reportComment(postItems[0].key, commentData.key)
              }
            />
            <View style={styles.justifyCenter}>
              {commentData.ReportCount > 0 && (
                <Text style={styles.iconBadge}>{commentData.ReportCount}</Text>
              )}
              {commentData.userType === 'pastor' && (
                <View style={styles.pastorTag}>
                  <Text>Pastor</Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </View>
    );
  });
};

export const addToCalendar = (title, date, time, location, notes) => {
  date = date.split(' ');
  time = time.split(' ');
  var startDate = new Date(
    '' +
      date[1] +
      ' ' +
      date[2] +
      ', ' +
      date[3] +
      ' ' +
      time[0] +
      ':00 ' +
      time[1],
  ).toISOString();
  const eventConfig = {
    title,
    startDate,
    location,
    notes,
  };
  AddCalendarEvent.presentEventCreatingDialog(eventConfig);
};

export const preparePostsFromDB = async (snapshot, uid, sortQuestionsBy) => {
  console.log('inside prepare posts from db');
  let postItems = [];
  let likesForEachPost = [];
  let alreadyLikedpost;
  let alreadyReportedpost;
  snapshot.forEach(e => {

    alreadyLikedpost = '#cac5c4';
    alreadyReportedpost = '#cac5c4';
    if (e.val().likedBy.includes(uid)) {
      alreadyLikedpost = '#588dea';
    }

    if (e.val().reportedBy.includes(uid)) {
      alreadyReportedpost = '#f3b725';
    }

    postItems.push({
      key: e.key,
      username: e.val().username,
      date: e.val().date,
      question: e.val().question,
      likes: e.val().likes,
      desc: e.val().desc,
      reports: e.val().reports,
      anon: e.val().Anon,
      pastorOnly: e.val().PastorOnly,
      likeColor: alreadyLikedpost,
      reportColor: alreadyReportedpost,
      userType: e.val().userType,
    });

    likesForEachPost.push(e.val().likes);
  });

  // There might eventually be more ways to sort questions
  if (sortQuestionsBy === "Oldest First") {
    // leave the posts in the order we read them from the DB.
  }
  else if (sortQuestionsBy === "Most Recent") {
    postItems = postItems.reverse();
  }
  else if (sortQuestionsBy === "Most Liked") {
    let valuesAdded = 0;
    let postsSortedByMostLikes = [];

    // Sort posts from highest to lowest likes
    likesForEachPost.sort(function(a, b){return b-a});

    // Make sure we capture all of the posts, regardless of their original order
    while(valuesAdded < likesForEachPost.length) {
      snapshot.forEach(e => {

        // Grab the posts in order of most likes, ensuring we haven't already added this post
        if (e.val().likes === likesForEachPost[valuesAdded] && !postsSortedByMostLikes.includes(e.key)) {
          
          alreadyLikedpost = '#cac5c4';
          alreadyReportedpost = '#cac5c4';

          if (e.val().likedBy.includes(uid)) {
            alreadyLikedpost = '#588dea';
          }
      
          if (e.val().reportedBy.includes(uid)) {
            alreadyReportedpost = '#f3b725';
          }

          postsSortedByMostLikes.push({
            key: e.key,
            username: e.val().username,
            date: e.val().date,
            question: e.val().question,
            likes: e.val().likes,
            desc: e.val().desc,
            reports: e.val().reports,
            anon: e.val().Anon,
            pastorOnly: e.val().PastorOnly,
            likeColor: alreadyLikedpost,
            reportColor: alreadyReportedpost,
            userType: e.val().userType,
          });
          valuesAdded++;
        }
  
      });
    }
    postItems = postsSortedByMostLikes;
  }

  return postItems;
};

export const prepareEventsFromDB = async (snapshot, uid) => {
  let eventItems = [];
  snapshot.forEach(child => {
    eventItems.push({
      key: child.key,
      title: child.val().title,
      desc: child.val().desc,
      date: child.val().date,
      time: child.val().time,
      location: child.val().location,
      pastorWhoCreatedEvent: (child.val().pastor_uid == uid) ? true : false,
    });
  });
  return eventItems.reverse();
};

export const prepareThreadScreen = async (snapshot, uid, postID, SortCommentsBy) => {
  console.log('inside prepare thread screen: ' + postID);
  let commentItems = [];
  let postItems = [];
  let alreadyLikedpost = 'black';
  let alreadyReportedpost = 'black';
  let posterUsername = '';

  if (snapshot.exists()) {
    snapshot.child('comments').forEach(comment => {
      let alreadyReportedcomment = 'black';

      if (comment.val().reportedBy.includes(uid)) {
        alreadyReportedcomment = 'red';
      }

      commentItems.push({
        key: comment.key,
        comment: comment.val().comment,
        date: comment.val().date,
        username: comment.val().username,
        ReportColor: alreadyReportedcomment,
        ReportCount: comment.val().reports,
        userType: comment.val().userType,
      });
    });

    // There might eventually be more ways to sort comments
    if (SortCommentsBy === "Oldest First") {
      // leave the posts in the order we read them from the DB
    }
    else if (SortCommentsBy === "Most Recent") {
      commentItems = commentItems.reverse();
    }
    else if (SortCommentsBy === "Pastors First") {
      let valuesAdded = 0;
      let commentsSortedByPastors = [];

      snapshot.child('comments').forEach(comment => {

        if (comment.val().userType === 'pastor') {

          let alreadyReportedcomment = 'black';

          if (comment.val().reportedBy.includes(uid)) {
            alreadyReportedcomment = 'red';
          }

          commentsSortedByPastors.push({
            key: comment.key,
            comment: comment.val().comment,
            date: comment.val().date,
            username: comment.val().username,
            ReportColor: alreadyReportedcomment,
            ReportCount: comment.val().reports,
            userType: comment.val().userType,
          });
          valuesAdded++;
        }
      });
      snapshot.child('comments').forEach(comment => {

        if (comment.val().userType === 'user') {

          let alreadyReportedcomment = 'black';

          if (comment.val().reportedBy.includes(uid)) {
            alreadyReportedcomment = 'red';
          }

          commentsSortedByPastors.push({
            key: comment.key,
            comment: comment.val().comment,
            date: comment.val().date,
            username: comment.val().username,
            ReportColor: alreadyReportedcomment,
            ReportCount: comment.val().reports,
            userType: comment.val().userType,
          });
          valuesAdded++;
        }
      });
      commentItems = commentsSortedByPastors;
    }

    if (snapshot.val().likedBy.includes(uid)) {
      alreadyLikedpost = 'blue';
    }

    if (snapshot.val().reportedBy.includes(uid)) {
      alreadyReportedpost = 'orange';
    }

    postItems.push({
      key: postID,
      question: snapshot.val().question,
      username: snapshot.val().username,
      date: snapshot.val().date,
      desc: snapshot.val().desc,
      likes: snapshot.val().likes,
      reports: snapshot.val().reports,
      anon: snapshot.val().Anon,
      pastorOnly: snapshot.val().PastorOnly,
      likeColor: alreadyLikedpost,
      reportColor: alreadyReportedpost,
      userType: snapshot.val().userType,
    });
    posterUsername = snapshot.val().username;
  }
  return {postItems, commentItems, posterUsername};
};

export const cleanUsersPost = async userInput => {
  let cleanedUserInput = userInput;

  wordsToFilter.forEach(badWord => {
    // case insenstive global replace
    let regEx = new RegExp(badWord, 'ig');
    cleanedUserInput = cleanedUserInput.replace(
      regEx,
      '*'.repeat(badWord.length),
    );
  });

  return cleanedUserInput;
};
export const checkPasswordCredentials = async stateObj => {
  
  console.log("inside check password");
  let password1 = stateObj.Password1;
  let password2 = stateObj.Password2;
  let min_password_length = 6;
  let valid_password = false

  if (password1 < min_password_length || password2 < min_password_length) {
    Alert.alert(`New password needs to be at least ${min_password_length} characters long`);
  }
  else if (password1 !== password2) {
    Alert.alert("Your passwords do not match. Please try again.");
  }
  else {
    valid_password = true;
  }
  console.log("valid password: " + valid_password);
  return valid_password;
};

export const validateEventInputs = async state => {

  const JAN = 1;
  const FEB = 2;
  const MAR = 3;
  const APR = 4;
  const MAY = 5;
  const JUN = 6;
  const JUL = 7;
  const AUG = 8;
  const SEP = 9;
  const OCT = 10;
  const NOV = 11;
  const DEC = 12;

  let valid_inputs = false;
  let month = parseInt(state.Month);
  let day = parseInt(state.Day);
  let year = parseInt(state.Year);
  let hour = parseInt(state.Hour);
  let minute = parseInt(state.Minute);
  let am_or_pm = state.AM_or_PM;

  if (month < 1 || month > 12){
    Alert.alert(
      "Incorrect Month", 
      `Please provide a month value between 1 and 12. You provided: ${month}.` 
    );
  }
  // Make sure the provided day value is positive
  else if ( day < 1 ) {
    Alert.alert(
      "Incorrect Day", 
      `Please provide a day that is greater than 0. You provided: ${day}.` 
    );
  }
  // Ensure the months with 31 days are capped at 31
  else if ( (month == JAN || month == MAR || month == MAY || month == JUL || 
             month == AUG || month == OCT || month == DEC) && day > 31 ) 
  {
    Alert.alert(
      "Incorrect Day",
      `The provided month does not have more than 31 days in it. You entered: ${day}.`
    );
  }
  // Ensure the months with 31 days are capped at 31
  else if ( (month == APR || month == JUN || month == SEP || month == NOV) && day > 30 ) 
  {
    Alert.alert(
      "Incorrect Day",
      `The provided month does not have more than 30 days in it. You entered: ${day}.`
    );
  }
  // Determine what to do with February 
  else if ( month == FEB )
  {
    if ( year % 4 == 0 && day > 29) {
      Alert.alert(
        "Incorrect Day",
        `When it is a Leap Year, February can not have more than 29 days. You entered: ${day}.`
      );
    } 
    else if (day > 28) {
      Alert.alert(
        "Incorrect Day",
        `February can not have more than 28 days in it. You entered: ${day}.`
      );
    }
  }
  // Make sure the year is at least as new as the year this app is published 
  else if (year < 2021) {
    Alert.alert(
      "Incorrect Year",
      `The provided year must be after 2021. You entered: ${year}.`
    );
  }
  // Make sure the minutes are correct
  else if (minute < 0 || minute > 59) {
    Alert.alert(
      "Incorrect Minutes",
      `The provided minutes must be between 1 and 59. You entered: ${minute}`
    );
  }
  // Make sure the hours are correct
  else if (hour < 1 || hour > 12) {
    Alert.alert(
      "Incorrect Hours",
      `The provided hours must be between 1 and 12. You entered: ${hour}`
    );
  }
  // Get the correct time of day
  else if (am_or_pm != "AM" && am_or_pm != "PM") {
    Alert.alert(
      "Incorrect time of day",
      `You must provide "AM" or "PM". You entered: ${am_or_pm}`
    );

  }
  // everything seems to be good
  else {
    valid_inputs = true;
  }
  return valid_inputs;
};
