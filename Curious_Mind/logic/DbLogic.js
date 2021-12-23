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
  onValue,
  push,
} from 'firebase/database';
import {Alert} from 'react-native';
import {checkPasswordCredentials} from './helpers';

export const db = getDatabase();
export const auth = getAuth();

// doesn't work with real username and password and empty values
export const logInUser = async (email, password, navigation) => {
  // await signInWithEmailAndPassword(auth, email, password)
  await signInWithEmailAndPassword(auth, 'collierj@mail.gvsu.edu', 'Admin731')
  // await signInWithEmailAndPassword(auth, 'jarod.collier@yahoo.com', 'User703', )
    .then(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log('error code:');
      console.log(errorCode);
      //user doesn't exist
      if (errorCode === 'auth/user-not-found') {
        Alert.alert('Incorrect username or password. \nPlease try again');
      } else if (errorCode === 'auth/invalid-email') {
        Alert.alert(
          'Invalid email',
          'Please enter a correct email. You entered: "' + email + '"',
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
        Alert.alert(errorCode + ': ' + errorMessage);
      }
    });
};

// still working on it -------needs testing
export const resetPassword = async (stateObj, navigation) => {
  const user = auth.currentUser;
  let max_attempts_to_reset_password = 5;

  // Get the user's sign in credentials
  let credential = EmailAuthProvider.credential(
    user.email,
    stateObj.oldPassword,
  );

  reauthenticateWithCredential(user, credential)
    .then(() => {
      if (checkPasswordCredentials(stateObj)) {
        updatePassword(user, stateObj.Password1)
          .then(() => {
            // reset credential and re-authenticate user session
            credential = EmailAuthProvider.credential(
              user.email,
              stateObj.Password1,
            );
            reauthenticateWithCredential(user, credential)
            .then(() => {
              console.log('user reauthenticated with new password');
              Alert.alert('Your password has been reset');
              navigation.navigate('Profile');
  
            })
            .catch(error => {
              console.log(
                'could not reauthenticate after change of password',
              );
            });
          })
          // an error occured updating the password
          .catch(error => {
            console.log('could not update password: ' + error.message);
          });
      }
    })
    // error authenticating user with their old password
    .catch(error => {
      stateObj.errorCounter++;
      if (stateObj.errorCounter < max_attempts_to_reset_password) {
        Alert.alert(
          'The old password you entered is incorrect.',
          `You have ${
            max_attempts_to_reset_password - stateObj.errorCounter
          } attempts left`,
        );
      } else {
        Alert.alert(
          'You have attempted to reset your password too many times.',
          'You will be signed out now.',
        );
        signOut(auth)
          .then(
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          )
          .catch(errorSignout => Alert.alert(errorSignout.message));
      }
    });
  return stateObj.errorCounter;
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
    Alert.alert('This post has already been liked.');
  }
};

export const reportPost = async (postID, MainFeedView, navigation) => {
  const uid = auth.currentUser.uid;
  let reportedBy = [];
  let reportCount;
  let incAmount = 1;
  let pastorReportWeight = 5;
  const reportPostRef = ref(db, 'posts/' + postID);

  onValue(ref(db, `userInfo/${uid}`), userInfo_snapshot => {
    if (userInfo_snapshot.exists()) {
      if (userInfo_snapshot.val().userType === 'pastor') {
        incAmount = pastorReportWeight;
      }
    }

    onValue(reportPostRef, report_snapshot => {
      console.log('onValue reportPost');
      if (report_snapshot.exists()) {
        reportedBy = report_snapshot.val().reportedBy;
        reportCount = report_snapshot.val().reports;
        if (!reportedBy.includes(uid)) {
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
                    report_updates['posts/' + postID + '/reportedBy'] =
                      reportedBy;
                    report_updates['posts/' + postID + '/reports'] =
                      reportCount + incAmount;
                    update(ref(db), report_updates);
                    Alert.alert('This post was reported.\nThank you.');
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
    });
  });
};

export const createPost = async postObj => {
  let uid = auth.currentUser.uid;
  await get(child(ref(db), `userInfo/${uid}`)).then(async snapshot => {
    await set(push(ref(db, `posts/`)), {
      username: snapshot.val().Username,
      date: new Date().toLocaleDateString(),
      question: postObj.Question,
      desc: postObj.Description,
      likes: 0,
      likedBy: [''],
      reports: 0,
      reportedBy: [''],
      Anon: postObj.Anon,
      PastorOnly: postObj.pastorOnly,
      userType: snapshot.val().userType,
      creatorsUID: uid,
    }).catch(error => {
      Alert.alert('error ', error);
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
  await set(push(ref(db, `events/`)), {
    title: eventObj.Title,
    desc: eventObj.Description,
    date: eventObj.chosenDate,
    time: eventObj.chosenTime,
    location: eventObj.location,
    pastor_uid: uid,
  }).catch(error => {
    Alert.alert('error ', error);
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

export const canComment = async posterUser => {
  let uid = auth.currentUser.uid;
  let userCan = true;

  await get(child(ref(db), `userInfo/${uid}`)).then(snapshot => {
    if (snapshot.val().userType !== 'pastor') {
      userCan = false;
    }
  });
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
      Alert.alert('error ', error);
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
    reportedBy = report_snapshot.val().reportedBy;
    reportCount = report_snapshot.val().reports;

    if (!reportedBy.includes(uid)) {
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
        'Reset Password',
        'Your password has been reset.\nPlease check your email to finish the process',
        [{text: 'OK', onPress: () => navigation.goBack()}],
        {cancelable: false},
      );
    })
    .catch(error => {
      if (error.code === 'auth/user-not-found') {
        Alert.alert("User doesn't exist", [{text: 'OK'}], {cancelable: false});
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid email', [{text: 'OK'}], {cancelable: false});
      }
    });
};

export const validatePastorCode = async (code, navigation) => {
  let found = false;
  await get(child(ref(db), 'userInfo/')).then(snapshot => {
    snapshot.forEach(user => {
      if (user.val().userType === 'pastor') {
        if (user.val().pastorCode === code) {
          found = true;
        }
      }
    });
  });
  if (found) {
    navigation.navigate('Pastor SignUp');
  } else {
    Alert.alert(
      'The code you entered of "' + code + '" is not a valid security code.',
    );
  }
};

//firebase error here
export const handleSignUp = async (normalUser, signupObject, navigation) => {
  if (await checkUsername(signupObject.Username)) {

    // Password are not empty
    if (await checkPasswordCredentials(signupObject)) {
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
        console.log("user type: " + userType);
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
        if (!normalUser) {
          set(signUpRef, {
            AddintionalInfo: '' + signupObject.addintionalInfo,
            pastorCode:
              '' +
              (Math.random().toString(16).substring(2, 6) +
              Math.random().toString(16).substring(2, 6)),
            Preach: signupObject.preach,
            Seminary: signupObject.seminary
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
        }
        else {
          Alert.alert(
            'Error',
            'Internal app error. Please try again.'
          )
        } 
      });
    } 
  }
};

export const checkUsername = async username => {
  let valid = true;
  await get(child(ref(db), 'userInfo/')).then(async snapshot => {
    snapshot.forEach(user => {
      if (user.val().Username === username) {
        Alert.alert(
          'Username Error',
          'The username "' +
            username +
            '" is already in use. Please try a different username.',
        );
        valid = false;
      }
    });
    valid = true;
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
            userPassword
          );
            
          reauthenticateWithCredential(user, credential)
          .then( () => {
            deleteUser(user);
          }).catch(error => Alert.alert(error.message))
          .then(() =>
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            })
          )
          .catch(error => Alert.alert(error.message));
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
  //update the value.
  await update(ref(db), updates);
};

export const deleteEvent = async (eventKey) => {
  Alert.alert(
    'Delete Event',
    'Are you sure you want to delete this event?',
    [
      {text: 'Cancel', onPress: () => {}},
      {
        text: 'DELETE',
        onPress: async () => {
          remove(ref(db, `events/${eventKey}`));
          Alert.alert(
            'Event Deleted.',
          );
        },
        style: {color: 'red'},
      },
    ],
    {cancelable: true},
  );
};
