import {styles} from '../assets/styles/styles';
import {View, Text, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-vector-icons/FontAwesome';
import {likePost, reportPost, reportComment} from './DbLogic';
import React from 'react';
import {Card} from 'react-native-shadow-cards';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

export const loadPostCards = async (posts, MainFeedView, navigation) => {
  console.log(MainFeedView);
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
              <Text>Posted{!postData.anon ? ' by: ' : ' '}</Text>
              {!postData.anon && (
                <Text
                  style={styles.blueText}
                  onPress={() =>
                    navigation.navigate('View Profile', {
                      uid: '' + postData.key.substring(0, 28),
                    })
                  }>
                  {postData.username}
                </Text>
              )}
              <Text> on {postData.date}</Text>
            </View>
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
                onPress={() =>
                  likePost(postData.key).then(() => this.refreshScreen)
                }
              />
              {postData.likes > 0 && (
                <Text style={styles.iconBadge}>{postData.likes}</Text>
              )}
              <Button
                style={styles.whiteBackground}
                color={postData.reportColor}
                name="exclamation-triangle"
                onPress={() =>
                  reportPost(postData.key).then(() => this.refreshScreen())
                }
              />
              {postData.reports > 0 && (
                <Text style={styles.iconBadge}>{postData.reports}</Text>
              )}
            </View>
          </Card>
        </Button>
      </View>
    );
  });
};

export const loadEventCards = async (events, navigation) => {
  return events.map(eventData => {
    return (
      <View key={eventData.title} style={styles.defaultBackground}>
        <Card style={styles.defualtCardStyles}>
          <Text style={styles.cardTitle}>{eventData.title}</Text>
          <Text style={styles.cardDesc}>{eventData.desc}</Text>
          <Text>Date: {eventData.date}</Text>
          <Text>Time: {eventData.time}</Text>
          <Text>Where: {eventData.location}</Text>
          <TouchableOpacity
            style={[styles.Buttons, styles.alignSelfCenter]}
            onPress={() =>
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
        style={[styles.defaultBackground, styles.marginTop15]}>
        <Card style={styles.defualtCardStyles}>
          <Text style={styles.cardTitle}>{commentData.comment}</Text>
          <View style={styles.cardDateAndBy}>
            <Text
              style={styles.blueText}
              onPress={() =>
                this.props.navigation.navigate('View Profile', {
                  uid: '' + commentData.key.substring(0, 28),
                })
              }>
              By: {commentData.username}
            </Text>
            <Text> on {commentData.date}</Text>
          </View>
          <View style={styles.row}>
            <Button
              style={styles.whiteBackground}
              color={commentData.ReportColor}
              name="exclamation-triangle"
              onPress={async () =>
                reportComment(postItems[0].key, commentData.key)
              }
            />
            {commentData.ReportCount > 0 && (
              <Text style={styles.iconBadge}>{commentData.ReportCount}</Text>
            )}
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

export const preparePostsFromDB = async (snapshot, uid) => {
  let postItems = [];
  snapshot.forEach(e => {
    var alreadyLikedpost = '#cac5c4';
    var alreadyReportedpost = '#cac5c4';
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
    });
  });
  return postItems.reverse();
};
