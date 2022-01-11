import {
  getAuth,
  signOut,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  createUserWithEmailAndPassword,
  deleteUser,
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
  push,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';
import {Alert} from 'react-native';
import {checkPasswordCredentials} from './helpers';

export const db = getDatabase();
export const auth = getAuth();

export const isUserLoggedIn = async => {
  if (auth != null) {
    return true;
  } else {
    return false;
  }
};

export const logInUser = async (email, password, navigation) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    })
    .catch(error => {
      const errorCode = error.code;

      // user doesn't exist
      if (errorCode === 'auth/user-not-found') {
        Alert.alert('Incorrect username or password. \nPlease try again');
      } else if (errorCode === 'auth/invalid-email') {
        Alert.alert(
          'Invalid email',
          `Please enter a correct email. You entered: "${email}"`,
        );
      } else if (errorCode === 'auth/wrong-password') {
        Alert.alert(
          'Invalid Entry',
          "Invalid email-password combination. If you're seeing this error, " +
            'it is likely that the password entered does not match the email you provided, but the email does exist in ' +
            ' our database.\n\nPlease try again.',
        );
      } else if (password === '') {
        Alert.alert('Please enter a password.');
      } else {
        Alert.alert(
          'Error',
          `Internal app error: ${errorCode}. Please try again.`,
        );
      }
    });
};

export const resetPassword = async (stateObj, navigation) => {
  const user = auth.currentUser;
  let max_attempts_to_reset_password = 5;
  let errorCounter = stateObj.errorCounter;

  // Get the user's sign in credentials
  let credential = EmailAuthProvider.credential(
    user.email,
    stateObj.oldPassword,
  );

  await reauthenticateWithCredential(user, credential)
    .then(async () => {
      let validPassword = await checkPasswordCredentials(stateObj);
      if (validPassword) {
        updatePassword(user, stateObj.Password1)
          .then(() => {
            // reset credential and re-authenticate user session
            credential = EmailAuthProvider.credential(
              user.email,
              stateObj.Password1,
            );
            reauthenticateWithCredential(user, credential)
              .then(() => {
                Alert.alert('Your password has been reset!');

                // reset the error counter
                errorCounter = 0;
                navigation.navigate('Profile Screen');
              })
              .catch(error => {
                const errorCode = error.code;
                Alert.alert(
                  'Error',
                  `Internal app error: ${errorCode}. Please try again.`,
                );
              });
          })
          // an error occured updating the password
          .catch(error => {
            const errorCode = error.code;
            Alert.alert(
              'Error',
              `Internal app error: ${errorCode}. Please try again.`,
            );
          });
      }
    })
    // error authenticating user with their old password
    .catch(error => {
      errorCounter++;
      if (errorCounter < max_attempts_to_reset_password) {
        Alert.alert(
          'The old password you entered is incorrect.',
          `You have ${
            max_attempts_to_reset_password - errorCounter
          } attempts left.`,
        );
      } else {
        Alert.alert(
          'Error resetting your password.',
          'You have attempted to reset your password too many times. You will be signed out now.',
        );
        signOut(auth)
          .then(
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          )
          .catch(errorSignout =>
            Alert.alert(
              'Error',
              `Internal app error: ${errorSignout.code}. Please try again.`,
            ),
          );
      }
    });
  return errorCounter;
};

export const likePost = async postID => {
  const uid = auth.currentUser.uid;
  let likedBy = [];
  let likesCount;

  await get(child(ref(db), `posts/${postID}`)).then(snapshot => {
    likedBy = snapshot.val().likedBy;
    likesCount = snapshot.val().likes;
  });

  if (!likedBy.includes(uid)) {
    likedBy.push(uid);

    const updates = {};
    updates['/posts/' + postID + '/likedBy'] = likedBy;
    updates['/posts/' + postID + '/likes'] = likesCount + 1;

    update(ref(db), updates);
  } else {
    Alert.alert('You have already liked this post.');
  }
};

export const reportPost = async (postID, MainFeedView, navigation) => {
  const uid = auth.currentUser.uid;
  let reportedBy = [];
  let reportCount;
  let incAmount = 1;
  let pastorReportWeight = 5;
  const reportPostRef = ref(db, 'posts/' + postID);

  await get(child(ref(db), `userInfo/${uid}`)).then(async userInfo_snapshot => {
    if (userInfo_snapshot.exists()) {
      if (userInfo_snapshot.val().userType === 'pastor') {
        incAmount = pastorReportWeight;
      }
    }

    let alreadyReportedBefore = false;
    await get(child(ref(db), `posts/${postID}`)).then(async report_snapshot => {
      if (!alreadyReportedBefore) {
        alreadyReportedBefore = true;
        if (report_snapshot.exists()) {
          reportedBy =
            report_snapshot.val().reportedBy != null
              ? report_snapshot.val().reportedBy
              : [];
          reportCount = report_snapshot.val().reports;
          let userReportedAlready = reportedBy.includes(uid);
          if (!userReportedAlready) {
            Alert.alert(
              'Report Post',
              'Are you sure you want to report this post?',
              [
                {text: 'Cancel', onPress: () => {}},
                {
                  text: 'REPORT',
                  onPress: async () => {
                    if (reportCount + incAmount >= pastorReportWeight) {
                      remove(reportPostRef).then(() => {
                        if (!MainFeedView) {
                          navigation.reset({
                            index: 0,
                            routes: [{name: 'Home'}],
                          });
                        }
                      });
                      Alert.alert(
                        'Post Removed',
                        'The report count exceeded the limit. This post will be deleted now.',
                      );
                    } else {
                      reportedBy.push(uid);
                      const report_updates = {};
                      report_updates[`posts/${postID}/reportedBy`] = reportedBy;
                      report_updates[`posts/${postID}/reports`] =
                        reportCount + incAmount;
                      update(ref(db), report_updates);
                      Alert.alert('This post was reported.', 'Thank you.');
                    }
                  },
                  style: {color: 'red'},
                },
              ],
              {cancelable: true},
            );
          } else {
            Alert.alert('You already reported this post.');
          }
        }
      }
    });
  });
};

export const createPost = async postObj => {
  let uid = auth.currentUser.uid;
  await get(child(ref(db), `userInfo/${uid}`)).then(async snapshot => {
    await set(push(ref(db, 'posts/')), {
      username: snapshot.val().Username,
      date: new Date().toLocaleDateString(),
      question: postObj.Question,
      desc: postObj.Description,
      likes: 0,
      likedBy: [''],
      reports: 0,
      reportedBy: [],
      Anon: postObj.Anon,
      PastorOnly: postObj.pastorOnly,
      userType: snapshot.val().userType,
      creatorsUID: uid,
    }).catch(error => {
      const errorCode = error.code;
      Alert.alert(
        'Error',
        `Internal app error: ${errorCode}. Please try again.`,
      );
    });
    Alert.alert('Post added successfully.');
  });
};

export const updateUserPostCount = async () => {
  let uid = auth.currentUser.uid;
  let numberOfPosts = 0;

  // Get the current value
  await get(child(ref(db), `userInfo/${uid}`)).then(snapshot => {
    numberOfPosts = snapshot.val().postNum;
  });

  const updates = {};
  updates[`userInfo/${uid}/postNum`] = numberOfPosts + 1;

  //update the value.
  update(ref(db), updates);
};

export const createEvent = async eventObj => {
  let uid = auth.currentUser.uid;
  await set(push(ref(db, 'events/')), {
    title: eventObj.Title,
    desc: eventObj.Description,
    date: eventObj.chosenDate,
    time: eventObj.chosenTime,
    location: eventObj.location,
    pastor_uid: uid,
    addToCalendarDate: eventObj.AddToCalendarDate,
  }).catch(error => {
    const errorCode = error.code;
    Alert.alert('Error', `Internal app error: ${errorCode}. Please try again.`);
  });
  Alert.alert('Event added successfully');
};

export const canAddEvent = async () => {
  let canAdd = false;
  let uid = auth.currentUser.uid;
  await get(child(ref(db), `userInfo/${uid}`)).then(snapshot => {
    if (snapshot.val().userType === 'pastor') {
      canAdd = true;
    }
  });
  return canAdd;
};

export const canComment = async postValues => {
  let uid = auth.currentUser.uid;
  let userCan = true;

  if (postValues[0].pastorOnly) {
    await get(child(ref(db), `userInfo/${uid}`)).then(snapshot => {
      if (snapshot.val().userType !== 'pastor') {
        userCan = false;
      }
    });
  }
  return userCan;
};

export const addCommentToPost = async (postID, comment) => {
  let uid = auth.currentUser.uid;
  let unique_id = Math.random().toString(16).substring(2, 12);

  await get(child(ref(db), `userInfo/${uid}`)).then(async snapshot => {
    await set(push(ref(db, `posts/${postID}/comments`)), {
      comment: comment,
      username: snapshot.val().Username,
      date: new Date().toLocaleDateString(),
      reportedBy: [''],
      userType: snapshot.val().userType,
      reports: 0,
      key: `${uid}_${unique_id}`,
    }).catch(error => {
      const errorCode = error.code;
      Alert.alert(
        'Error',
        `Internal app error: ${errorCode}. Please try again.`,
      );
    });
    await updateUserCommentCount(uid, snapshot.val().commentNum);
    Alert.alert('Comment added successfully.');
  });
};

export const updateUserCommentCount = async (uid, commentNum) => {
  const updates = {};
  updates[`userInfo/${uid}/commentNum`] = commentNum + 1;
  update(ref(db), updates);
};

export const reportComment = async (postID, commentId) => {
  let uid = auth.currentUser.uid;
  let reportedBy = [];
  let reportCount;
  let incAmount = 1;
  let pastorReportWeight = 5;
  const commentPath = `posts/${postID}/comments/${commentId}`;

  await get(child(ref(db), `userInfo/${uid}`)).then(snapshot => {
    if (snapshot.val().userType === 'pastor') {
      incAmount = pastorReportWeight;
    }
  });
  await get(child(ref(db), commentPath)).then(report_snapshot => {
    reportedBy =
      report_snapshot.val().reportedBy != null
        ? report_snapshot.val().reportedBy
        : [];
    reportCount = report_snapshot.val().reports;

    let userReportedAlready = reportedBy.includes(uid);

    if (!userReportedAlready) {
      Alert.alert(
        'Report Comment',
        'Are you sure you want to report this comment?',
        [
          {text: 'Cancel', onPress: () => {}},
          {
            text: 'REPORT',
            onPress: async () => {
              if (reportCount + incAmount >= 5) {
                remove(ref(db, commentPath));
                Alert.alert(
                  'Comment Removed.',
                  'The comment report count exceeded the allowed limit. This comment will be deleted now.',
                );
              } else {
                reportedBy.push(uid);

                const report_updates = {};
                report_updates[`${commentPath}/reportedBy`] = reportedBy;
                report_updates[`${commentPath}/reports`] =
                  reportCount + incAmount;
                update(ref(db), report_updates);

                Alert.alert('This comment was reported.', 'Thank you.');
              }
            },
            style: {color: 'red'},
          },
        ],
        {cancelable: true},
      );
    } else {
      Alert.alert('You already reported this comment.');
    }
  });
};

export const sendForgotPasswordEmail = async (navigation, email) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      Alert.alert(
        'Reset Password Email Sent',
        'Please check your email to reset your password. Once you have reset it, please try to log in.',
        [{text: 'OK', onPress: () => navigation.goBack()}],
        {cancelable: false},
      );
    })
    .catch(error => {
      const errorCode = error.code;
      if (error.code === 'auth/user-not-found') {
        Alert.alert("User doesn't exist", [{text: 'OK'}], {
          cancelable: false,
        });
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid email', [{text: 'OK'}], {cancelable: false});
      } else {
        Alert.alert(
          'Error',
          `Internal app error: ${errorCode}. Please try again.`,
        );
      }
    });
};

export const validatePastorCode = async (code, navigation) => {
  await get(
    query(ref(db, 'userInfo'), orderByChild('pastorCode'), equalTo(code)),
  ).then(val => {
    if (val.exists()) {
      navigation.navigate('Pastor SignUp');
    } else {
      Alert.alert(
        'The code you entered of "' + code + '" is not a valid security code.',
      );
    }
  });
};

export const handleSignUp = async (normalUser, signupObject, navigation) => {
  let validUsername = await checkUsername(signupObject.Username);
  if (validUsername) {
    // Password are not empty
    let passwordMeetsStandards = await checkPasswordCredentials(signupObject);
    if (passwordMeetsStandards) {
      await createUserWithEmailAndPassword(
        auth,
        signupObject.Email,
        signupObject.Password1,
      )
        .then(userCredential => {
          // Signed in
          let UserId = userCredential.user.uid;
          let signUpRef = ref(db, 'userInfo/' + UserId);
          let userType = normalUser ? 'user' : 'pastor';
          
          if (normalUser) {
            set(signUpRef, {
              First: '' + signupObject.FirstName,
              Last: '' + signupObject.LastName,
              Username: '' + signupObject.Username,
              uid: UserId,
              postNum: 0,
              commentNum: 0,
              score: 0,
              Email: signupObject.Email,
              userType: userType,
            });
          }
          else {
            set(signUpRef, {
              First: '' + signupObject.FirstName,
              Last: '' + signupObject.LastName,
              Username: '' + signupObject.Username,
              uid: UserId,
              postNum: 0,
              commentNum: 0,
              score: 0,
              Email: signupObject.Email,
              userType: userType,
              AddintionalInfo: '' + signupObject.addintionalInfo,
              pastorCode:
                '' +
                (Math.random().toString(16).substring(2, 6) +
                  Math.random().toString(16).substring(2, 6)),
              Preach: signupObject.preach,
              Seminary: signupObject.seminary,
            });
          }
        })
        .then(() =>
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          }),
        )
        .catch(error => {
          const errorCode = error.code;
          if (errorCode === 'auth/invalid-email') {
            Alert.alert(
              'Invalid email',
              `Please enter a correct email. You entered: "${signupObject.Email}"`,
            );
          } else if (errorCode === 'auth/email-already-in-use') {
            Alert.alert(
              'Registered user',
              'The entered email is already registered, please login or reset your password if needed',
            );
          } else {
            Alert.alert(
              'Error',
              `Internal app error: ${errorCode}. Please try again.`,
            );
          }
        });
    }
  }
};

export const checkUsername = async username => {
  let valid = true;
  await get(
    query(ref(db, 'userInfo'), orderByChild('Username'), equalTo(username)),
  ).then(val => {
    if (val.exists()) {
      Alert.alert(
        'Username Error',
        `The username "${username}" is already in use. Please try a different username.`,
      );
      valid = false;
    }
  });
  return valid;
};

export const delUser = async (navigation, userPassword) => {
  Alert.alert(
    'Delete Account',
    'Are you sure you want to delete your account?',
    [
      {text: 'Cancel', onPress: () => {}},
      {
        text: 'DELETE',
        onPress: async () => {
          let uid = auth.currentUser.uid;
          const userInfoRef = ref(db, `userInfo/${uid}`);
          remove(userInfoRef);

          // Get the user's sign in credentials to reauthenticate
          var user = auth.currentUser;
          let credential = EmailAuthProvider.credential(
            user.email,
            userPassword,
          );

          reauthenticateWithCredential(user, credential)
            .then(() => {
              deleteUser(user);
            })
            .catch(error => {
              const errorCode = error.code;
              Alert.alert(
                'Error',
                `Internal app error: ${errorCode}. Please try again.`,
              );
            })
            .then(() =>
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            )
            .catch(error => {
              const errorCode = error.code;
              Alert.alert(
                'Error',
                `Internal app error: ${errorCode}. Please try again.`,
              );
            });
        },
        style: {color: 'red'},
      },
    ],
    {cancelable: true},
  );
};

export const updateAboutMe = async aboutmeText => {
  let uid = auth.currentUser.uid;
  const updates = {};
  updates[`userInfo/${uid}/AddintionalInfo`] = aboutmeText;
  await update(ref(db), updates);
};

export const deleteEvent = async eventKey => {
  Alert.alert(
    'Delete Event',
    'Are you sure you want to delete this event?',
    [
      {text: 'Cancel', onPress: () => {}},
      {
        text: 'DELETE',
        onPress: async () => {
          remove(ref(db, `events/${eventKey}`));
          Alert.alert('Event Deleted.');
        },
        style: {color: 'red'},
      },
    ],
    {cancelable: true},
  );
};
