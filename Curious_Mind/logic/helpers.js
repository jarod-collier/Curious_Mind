import {styles} from '../assets/styles/styles';
import {View, Text, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {likePost, reportPost, reportComment, deleteEvent} from './DbLogic';
import React from 'react';
import {Card} from 'react-native-shadow-cards';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// List of regex strings to filter words out on. This tests to make sure that each letter
// exists or a symbol (Ex: f$ck). Then it tests if there are repeated letters or spaces
// after the letter. I saw someone use this to exploit another app I use and figured
// we should guard against this. So this will catch "f u c k" and "ffffuuuuuccccckkk".
const wordsToFilter = [
  'f(u|\\W)(u*|\\s*)(c|\\W)(c*|\\s*)k',
  'f(u|\\W)(u*|\\s*)c',
  'f(u|\\W)(u*|\\s*)k',
  'f(u|\\W)(u*|\\s*)(k|\\W)(k*|\\s*)c',
  'f(v|\\W)(v*|\\s*)(c|\\W)(c*|\\s*)k',
  'f(x|\\W)(x*|\\s*)(c|\\W)(c*|\\s*)k',
  's(h|\\W)(h*|\\s*)(i|\\W)(i*|\\s*)t',
  'b(i|\\W)(i*|\\s*)(t|\\W)(t*|\\s*)(c|\\W)(c*|\\s*)h',
  'n(i|\\W)(i*|\\s*)(g|\\W)(g*|\\s*)(g|\\W)(g*|\\s*)(e|\\W)(e*|\\s*)r',
  'n(i|\\W)(i*|\\s*)(g|\\W)(g*|\\s*)(g|\\W)(g*|\\s*)a',
  'c(h|\\W)(h*|\\s*)(i|\\W)(i*|\\s*)(n|\\W)(n*|\\s*)k',
  'g(r|\\W)(r*|\\s*)(i|\\W)(i*|\\s*)(n|\\W)(n*|\\s*)(g|\\W)(g*|\\s*)o',
  ' (k|\\W)(k*|\\s*)(i|\\W)(i*|\\s*)(k|\\W)(k*|\\s*)(e|\\W)(e*|\\s*) ',
  ' (s|\\W)(s*|\\s*)(p|\\W)(p*|\\s*)(i|\\W)(i*|\\s*)(c|\\W)(c*|\\s*)(k|\\W)(k*|\\s*) ',
  ' (s|\\W)(s*|\\s*)(p|\\W)(p*|\\s*)(i|\\W)(i*|\\s*)(c|\\W)(c*|\\s*) ',
  'c(u|\\W)(u*|\\s*)(n|\\W)(n*|\\s*)t',
  'p(u|\\W)(u*|\\s*)(s|\\W)(s*|\\s*)(s|\\W)(s*|\\s*)y',
  ' (a|\\W)(a*|\\s*)(s|\\W)(s*|\\s*)(s|\\W)(s*|\\s*)(h|\\W)(h*|\\s*)(o|\\W)(o*|\\s*)(l|\\W)(l*|\\s*)e',
  'd(u|\\W)(u*|\\s*)(m|\\W)(m*|\\s*)(b|\\W)(b*|\\s*)(a|\\W)(a*|\\s*)(s|\\W)(s*|\\s*)s',
  'j(a|\\W)(a*|\\s*)(c|\\W)(c*|\\s*)(k|\\W)(k*|\\s*)(a|\\W)(a*|\\s*)(s|\\W)(s*|\\s*)s',
  'p(h|\\W)(h*|\\s*)(a|\\W)(a*|\\s*)(l|\\W)(l*|\\s*)(l|\\W)(l*|\\s*)(i|\\W)(i*|\\s*)c',
  'b(i|\\W)(i*|\\s*)(t|\\W)(t*|\\s*)(c|\\W)(c*|\\s*)h',
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
                  onPress={() => {
                    navigation.navigate('View Profile', {
                      uid: postData.creatorsUID,
                    });
                  }}>
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
                  onPress={async () => {
                    await reportPost(postData.key, MainFeedView, navigation);
                  }}
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
          {/* Commenting out until we can figure out how to best do this */}
          {/* <TouchableOpacity
            style={[styles.Buttons, styles.alignSelfCenter]}
            onPress={async () =>
              addToCalendar(
                eventData.title,
                eventData.addToCalendarDate,
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
          </TouchableOpacity> */}
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
              <Button style={styles.redBackground} name="trash" color="white" />
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
  let postItems = [];
  let likesForEachPost = [];
  let alreadyLikedpost;
  let alreadyReportedpost;
  snapshot.forEach(e => {
    alreadyLikedpost = '#cac5c4';
    alreadyReportedpost = '#cac5c4';
    if (e.val().likedBy.includes(uid)) {
      alreadyLikedpost = '#3c4498';
    }

    if (e.val().reportedBy != null) {
      if (e.val().reportedBy.includes(uid)) {
        alreadyReportedpost = '#f3b725';
      }
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
      creatorsUID: e.val().creatorsUID,
    });

    likesForEachPost.push(e.val().likes);
  });

  // There might eventually be more ways to sort questions
  if (sortQuestionsBy === 'Oldest First') {
    // leave the posts in the order we read them from the DB.
  } else if (sortQuestionsBy === 'Most Recent') {
    postItems = postItems.reverse();
  } else if (sortQuestionsBy === 'Most Liked') {
    let valuesAdded = 0;
    let postsSortedByMostLikes = [];

    // Sort posts from highest to lowest likes
    likesForEachPost.sort(function (a, b) {
      return b - a;
    });

    // Make sure we capture all of the posts, regardless of their original order
    while (valuesAdded < likesForEachPost.length) {
      snapshot.forEach(e => {
        // Grab the posts in order of most likes, ensuring we haven't already added this post
        if (
          e.val().likes === likesForEachPost[valuesAdded] &&
          !postsSortedByMostLikes.includes(e.key)
        ) {
          alreadyLikedpost = '#cac5c4';
          alreadyReportedpost = '#cac5c4';

          if (e.val().likedBy.includes(uid)) {
            alreadyLikedpost = '#588dea';
          }

          if (e.val().reportedBy != null) {
            if (e.val().reportedBy.includes(uid)) {
              alreadyReportedpost = '#f3b725';
            }
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
            creatorsUID: e.val().creatorsUID,
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
      pastorWhoCreatedEvent: child.val().pastor_uid == uid ? true : false,
      addToCalendarDate: child.val().addToCalendarDate,
    });
  });
  return eventItems.reverse();
};

export const prepareThreadScreen = async (
  snapshot,
  uid,
  postID,
  SortCommentsBy,
) => {
  let commentItems = [];
  let postItems = [];
  let alreadyLikedpost = '#cac5c4';
  let alreadyReportedpost = '#cac5c4';
  let posterUsername = '';

  if (snapshot.exists()) {
    snapshot.child('comments').forEach(comment => {
      let alreadyReportedcomment = 'black';

      if (comment.val().reportedBy != null) {
        if (comment.val().reportedBy.includes(uid)) {
          alreadyReportedcomment = 'red';
        }
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
    if (SortCommentsBy === 'Oldest First') {
      // leave the posts in the order we read them from the DB
    } else if (SortCommentsBy === 'Most Recent') {
      commentItems = commentItems.reverse();
    } else if (SortCommentsBy === 'Pastors First') {
      let valuesAdded = 0;
      let commentsSortedByPastors = [];

      snapshot.child('comments').forEach(comment => {
        if (comment.val().userType === 'pastor') {
          let alreadyReportedcomment = 'black';
          if (comment.val().reportedBy != null) {
            if (comment.val().reportedBy.includes(uid)) {
              alreadyReportedcomment = 'red';
            }
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
          if (comment.val().reportedBy != null) {
            if (comment.val().reportedBy.includes(uid)) {
              alreadyReportedcomment = 'red';
            }
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
      alreadyLikedpost = '#3c4498';
    }

    if (snapshot.val().reportedBy != null) {
      if (snapshot.val().reportedBy.includes(uid)) {
        alreadyReportedpost = 'orange';
      }
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

export const cleanUsersInput = async userInput => {
  let cleanedUserInput = userInput;

  wordsToFilter.forEach(badWord => {
    // case insenstive global replace
    let regEx = new RegExp(badWord, 'ig');
    let matches = cleanedUserInput.match(regEx);

    if (matches && matches.length) {
      // This prevents duplicate matches as we replace bad words with the '*', but
      // we are also checking for '*'s in the regex as people can type words like
      // 'f*ck'. To make sure we handle such cases, we still want to capture words
      // like 'f*ck', but not capture a string of '*'s that have already been used
      // to replace parts of the user input.
      if (!/\*{2,}/.test(matches[0])) {
        cleanedUserInput = cleanedUserInput.replace(
          regEx,
          '*'.repeat(matches[0].length),
        );
      }
    }
  });

  return cleanedUserInput;
};

export const checkPasswordCredentials = async stateObj => {
  let password1 = stateObj.Password1;
  let password2 = stateObj.Password2;
  let min_password_length = 6;
  let valid_password = false;

  if (
    password1.length < min_password_length ||
    password2.length < min_password_length
  ) {
    Alert.alert(
      `New password needs to be at least ${min_password_length} characters long.`,
    );
  } else if (password1 !== password2) {
    Alert.alert('Your passwords do not match. Please try again.');
  } else {
    valid_password = true;
  }
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
  let phoneDate = new Date();
  let currentDay = phoneDate.getDate();
  let currentMonth = phoneDate.getMonth() + 1;
  let currentYear = phoneDate.getFullYear();

  if (month < 1 || month > 12) {
    Alert.alert(
      'Incorrect Month',
      `Please provide a month value between 1 and 12. You provided: ${month}.`,
    );
  }
  // Make sure the provided day value is positive
  else if (day < 1) {
    Alert.alert(
      'Incorrect Day',
      `Please provide a day that is greater than 0. You provided: ${day}.`,
    );
  }
  // Ensure the months with 31 days are capped at 31
  else if (
    (month == JAN ||
      month == MAR ||
      month == MAY ||
      month == JUL ||
      month == AUG ||
      month == OCT ||
      month == DEC) &&
    day > 31
  ) {
    Alert.alert(
      'Incorrect Day',
      `The provided month does not have more than 31 days in it. You entered: ${day}.`,
    );
  }
  // Ensure the months with 31 days are capped at 31
  else if (
    (month == APR || month == JUN || month == SEP || month == NOV) &&
    day > 30
  ) {
    Alert.alert(
      'Incorrect Day',
      `The provided month does not have more than 30 days in it. You entered: ${day}.`,
    );
  }
  // Determine what to do with February
  else if (month == FEB) {
    if (year % 4 == 0 && day > 29) {
      Alert.alert(
        'Incorrect Day',
        `When it is a Leap Year, February can not have more than 29 days. You entered: ${day}.`,
      );
    } else if (day > 28) {
      Alert.alert(
        'Incorrect Day',
        `February can not have more than 28 days in it. You entered: ${day}.`,
      );
    }
  }
  // Make sure the minutes are correct
  else if (minute < 0 || minute > 59) {
    Alert.alert(
      'Incorrect Minutes',
      `The provided minutes must be between 1 and 59. You entered: ${minute}.`,
    );
  }
  // Make sure the hours are correct
  else if (hour < 1 || hour > 12) {
    Alert.alert(
      'Incorrect Hours',
      `The provided hours must be between 1 and 12. You entered: ${hour}.`,
    );
  }
  // Get the correct time of day
  else if (am_or_pm != 'AM' && am_or_pm != 'PM') {
    Alert.alert(
      'Incorrect time of day',
      `You must provide "AM" or "PM". You entered: ${am_or_pm}.`,
    );
  }
  // The provided year has to be at least our year
  else if ( year < currentYear ){
    Alert.alert(
      'Incorrect Year Provided',
      `The event's year needs to at least be the current year of ${currentYear}. You entered: ${year}.`,
    );
  }
  // The provided month has to be at least our month
  else if ( month < currentMonth ){
    Alert.alert(
      'Incorrect Month Provided',
      `The event's month needs to at least be the current month of ${currentMonth}. You entered: ${month}.`,
    );
  }
  // The provided day has to be at least be past the current day 
  else if ( month == currentMonth && day < currentDay){
    Alert.alert(
      'Incorrect Day Provided',
      `The event's day needs to at least be the current day of ${currentDay}. You entered: ${day}.`,
    );
  }
  // everything seems to be good
  else {
    valid_inputs = true;
  }
  return valid_inputs;
};

export const storeData= async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // error storing data
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // error removing data
  }
};
