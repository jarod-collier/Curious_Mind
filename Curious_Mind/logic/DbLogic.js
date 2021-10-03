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
  onValue,
  update,
  remove,
} from 'firebase/database';
import {Alert} from 'react-native';

export const db = getDatabase();
export const auth = getAuth();

export const logInUser = async (email, password) => {
  // signInWithEmailAndPassword(auth, email, password)
  await signInWithEmailAndPassword(
    auth,
    'collierj@mail.gvsu.edu',
    'Admin703',
  ).catch(error => {
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

  if (this.state.oldPassword != null) {
    // Get the user's sign in credentials
    let credential = EmailAuthProvider.credential(
      user.email,
      stateObj.oldPassword,
    );

    reauthenticateWithCredential(user, credential)
      .then(() => {
        /**************THIS SHOULD BE MOVED TO THE HELPERS */

        //user re-authenticated
        if (stateObj.newPassword1 !== '' && stateObj.newPassword2 !== '') {
          //passwords exist
          if (
            stateObj.newPassword1.length >= 6 &&
            stateObj.newPassword2.length >= 6
          ) {
            //password longer than 6 characters
            if (stateObj.newPassword1 === stateObj.newPassword2) {
              //passwords match
              updatePassword(user, stateObj.newPassword1)
                .then(() => {
                  Alert.alert('Your password has been reset');
                  navigation.navigate('Profile');
                  //reset credential and re-authenticate user session
                  credential = EmailAuthProvider.credential(
                    user.email,
                    stateObj.newPassword1,
                  );
                  reauthenticateWithCredential(user, credential)
                    .then(() => {
                      console.log('user reauthenticated with new password');
                    })
                    .catch(error => {
                      console.log(
                        'could not reauthenticate after change of password',
                      );
                    });
                })
                .catch(error => {
                  // an error occured
                  console.log('could not update password: ' + error.message);
                });
            } else {
              //passwords dont match
              Alert.alert("New passwords don't match");
            }
          } else {
            //new passwords less than 6 characters
            Alert.alert('New password needs to be at least 6 characters long');
          }
        } else {
          //empty new password
          Alert.alert('Please fill all fields');
        }
      })
      .catch(error => {
        //error authenticating
        Alert.alert('' + error);
        stateObj.errorCounter++;
        if (stateObj.errorCounter < 5) {
          Alert.alert(
            'Old password is incorrect\nYou have ' +
              (5 - stateObj.errorCounter) +
              ' attempts left',
          );
        } else {
          Alert.alert(
            'You have exceeded the trail limit.\nYou will be signed out now.',
          );
          signOut()
            .then(
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            )
            .catch(errorSignout => Alert.alert(errorSignout.message));
        }
      });
  } else {
    Alert.alert('Please Enter old password');
  }
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

export const reportPost = async postID => {
  const uid = auth.currentUser.uid;
  const userInfoRef = ref(db, 'userInfo/' + auth.currentUser.uid);
  let reportedBy = [];
  let reportCount;
  let incAmount = 1;
  let pastorReportWeight = 5;
  const reportPostRef = ref(db, 'posts/' + postID);

  onValue(userInfoRef, userInfo_snapshot => {
    if (userInfo_snapshot.val().userType === 'pastor') {
      incAmount = pastorReportWeight;
    }

    //firebase error here
    onValue(reportPostRef, report_snapshot => {
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
                  remove(reportPostRef);
                  // this.refreshScreen();
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

                  // this.refreshScreen();
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
    });
  });
};

export const loadThreadPostFromDB = async postID => {
  let uid = auth.currentUser.uid;
  let postItems = [];
  let commentItems = [];
  let posterUsername;
  await get(child(ref(db), `posts/${postID}`)).then(snapshot => {
    var alreadyLikedpost = '#cac5c4';
    var alreadyReportedpost = '#cac5c4';

    snapshot.child('comments').forEach(comment => {
      var alreadyReportedcomment = '#cac5c4';

      if (comment.val().reportedBy.includes(uid)) {
        alreadyReportedcomment = '#cac5c4';
      }

      commentItems.push({
        key: comment.key,
        comment: comment.val().comment,
        date: comment.val().date,
        username: comment.val().username,
        ReportColor: alreadyReportedcomment,
        ReportCount: comment.val().reports,
      });
    });

    if (snapshot.val().likedBy.includes(uid)) {
      alreadyLikedpost = '#588dea';
    }

    if (snapshot.val().reportedBy.includes(uid)) {
      alreadyReportedpost = '#f3b725';
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
    });
    posterUsername = snapshot.val().username;
  });
  return {postItems, commentItems, posterUsername};
};

export const createPost = async postObj => {
  let uid = auth.currentUser.uid;
  const userInfoRef = ref(db, 'userInfo/' + uid);
  // Get the current value
  onValue(userInfoRef, snapshot => {
    set(ref(db, 'posts/' + uid + postObj.Question), {
      /** CAN WE REMOVE THOSE EMPTY STRINGS AT THE START? */
      username: '' + snapshot.val().Username,
      date: '' + new Date().toLocaleDateString(),
      question: '' + postObj.Question,
      desc: '' + postObj.Description,
      likes: 0,
      likedBy: [''],
      reports: 0,
      reportedBy: [''],
      Anon: postObj.Anon,
      PastorOnly: postObj.pastorOnly,
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
  updates['userInfo/' + uid + '/postNum'] = numberOfPosts + 1;

  //update the value.
  update(ref(db), updates);
};

//providers should solve this issue of updating
export const observePostFromDB = () => {
  let uid = auth.currentUser.uid;
  let postItems = [];
  onValue(ref(db, 'posts/'), snapshot => {
    snapshot.forEach(ss => {
      var alreadyLikedpost = 'black';
      var alreadyReportedpost = 'black';
      if (ss.val().likedBy.includes(uid)) {
        alreadyLikedpost = 'blue';
      }

      if (ss.val().reportedBy.includes(uid)) {
        alreadyReportedpost = 'orange';
      }

      postItems.push({
        key: ss.key,
        username: ss.val().username,
        date: ss.val().date,
        question: ss.val().question,
        likes: ss.val().likes,
        desc: ss.val().desc,
        reports: ss.val().reports,
        anon: ss.val().Anon,
        pastorOnly: ss.val().PastorOnly,
        likeColor: alreadyLikedpost,
        reportColor: alreadyReportedpost,
      });
    });
  });
};

export const createEvent = async eventObj => {
  let uid = auth.currentUser.uid;
  set(ref(db, 'events/' + uid + eventObj.Title), {
    title: eventObj.Title,
    desc: eventObj.Description,
    date: eventObj.chosenDate,
    time: eventObj.chosenTime,
    location: eventObj.location,
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

//this is not posting comments
export const addCommentToPost = async (postID, comment) => {
  var username;
  let uid = auth.currentUser.uid;
  let commentNum;
  let comment_id;
  console.log(comment);

  await get(child(ref(db), `userInfo/${uid}`)).then(snapshot => {
    username = snapshot.val().Username;
    commentNum = snapshot.val().commentNum;
    let unique_id = Math.random().toString(16).substring(2, 12);
    comment_id = uid + '_' + unique_id;
  });
  await set(ref(db, 'posts/' + postID + '/comments/' + comment_id), {
    comment: comment,
    username: username,
    date: '' + new Date().toLocaleDateString(),
    reportedBy: [''],
    reports: 0,
    key: comment_id,
  }).catch(error => {
    Alert.alert('error ', error);
  });

  await updateUserCommentCount(uid, commentNum);
  Alert.alert('Comment added successfully.');
};

export const updateUserCommentCount = async (uid, commentNum) => {
  const updates = {};
  updates['userInfo/' + uid + '/commentNum'] = commentNum + 1;
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
                report_updates[commentPath + '/reportedBy'] = reportedBy;
                report_updates[commentPath + '/reports'] =
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

//NEEDS TESTING
export const sendForgotPasswordEmail = navigation => {
  let allUserEmails = []; //WHY IS THIS HERE?
  get(child(ref(db), 'userInfo/')).then(snapshot => {
    snapshot.forEach(element => {
      allUserEmails.push(element.val().Email);
    });

    if (allUserEmails.includes(this.state.Email)) {
      sendPasswordResetEmail(auth, this.state.Email)
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
          const errorMessage = error.message;
          console.log('error sending reset password email: ' + errorMessage);
        });
    } else {
      Alert.alert(
        'Incorrect Email',
        `The email you provided is: "${this.state.Email}". This does not exist in our database. Please try a different email.`,
      );
    }
  });
};

export const validatePastorCode = async (code, navigation) => {
  let found = false;
  get(child(ref(db), 'userInfo/')).then(snapshot => {
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
  const validUserName = await checkUsername(signupObject.Username);
  if (validUserName) {
    let UserId;

    //THIS SHOULD BE IN THE HELPER
    // Password are not empty
    if (signupObject.Password1 !== '' && signupObject.Password2 !== '') {
      // Passwords match
      if (signupObject.Password1 === signupObject.Password2) {
        // Passwords are greater than length 6
        if (
          signupObject.Password1.length >= 6 &&
          signupObject.Password2.length >= 6
        ) {
          createUserWithEmailAndPassword(
            auth,
            signupObject.Email,
            signupObject.Password1,
          )
            .then(userCredential => {
              // Signed in
              console.log('successfully created user account');
              UserId = userCredential.user.uid;
            })
            .catch(error => {
              console.log('failure creating account');
              const errorMessage = error.message;
              console.log('error message: ' + errorMessage);
            })
            .then(() => {
              normalUser
                ? set(ref(db, 'userInfo/' + UserId), {
                    First: '' + signupObject.FirstName,
                    Last: '' + signupObject.LastName,
                    Username: '' + signupObject.Username,
                    uid: UserId,
                    postNum: 0,
                    commentNum: 0,
                    AddintionalInfo: '',
                    score: 0,
                    userType: 'user',
                    Email: signupObject.Email,
                  })
                : set(ref(db, 'userInfo/' + UserId), {
                    First: '' + signupObject.FirstName,
                    Last: '' + signupObject.LastName,
                    Username: '' + signupObject.Username,
                    Email: '' + signupObject.Email,
                    Preach: '' + signupObject.preach,
                    Seminary: '' + signupObject.seminary,
                    AddintionalInfo: '' + signupObject.addintionalInfo,
                    pastorCode:
                      '' +
                      (Math.random().toString(16).substring(2, 6) +
                        Math.random().toString(16).substring(2, 6)),
                    uid: UserId,
                    commentNum: 0,
                    postNum: 0,
                    score: 0,
                    userType: 'pastor',
                  });
            })
            .catch(error => {
              console.log('failure setting data');
            })
            .then(() =>
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              }),
            );
        } else {
          //new passwords less than 6 characters
          Alert.alert('New password needs to be at least 6 characters long');
        }
      } else {
        //passwords dont match
        Alert.alert("New passwords don't match");
      }
    } else {
      //empty new password
      Alert.alert('Please fill all fields');
    }
  }
};

export const checkUsername = async username => {
  let valid = true;
  await get(child(ref(db), 'userInfo/')).then(snapshot => {
    snapshot.forEach(user => {
      if (user.val().Username === username) {
        console.log('found it');
        Alert.alert(
          'Username Error',
          'The username "' +
            username +
            '" is already in use. Please try a different username.',
        );
        return false;
      }
    });
    return valid;
  });
};

export const delUser = navigation => {
  Alert.alert(
    'Delete Account',
    'Are you sure you want to delete your account?',
    [
      {text: 'Cancel', onPress: () => {}},
      {
        text: 'DELETE',
        onPress: async () => {
          let uid = auth.currentUser.uid;
          const userInfoRef = ref(db, 'userInfo/' + uid);
          remove(userInfoRef);

          this.makeDelay(500);
          var user = auth.currentUser;
          deleteUser(user)
            .then(() =>
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
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
  updates['userInfo/' + uid + '/AddintionalInfo'] = aboutmeText;
  //update the value.
  await update(ref(db), updates);
};

export const getUserInfo = async ({uid = auth.currentUser.uid}) => {
  // let uid = auth.currentUser.uid;
  let userObj = {};
  await get(child(ref(db), `userInfo/${uid}`)).then(snapshot => {
    snapshot.val().userType === 'pastor'
      ? (userObj = {
          fName: snapshot.val().First,
          lName: snapshot.val().Last,
          email: snapshot.val().Email,
          username: snapshot.val().Username,
          commentNum: snapshot.val().commentNum,
          postNum: snapshot.val().postNum,
          score: snapshot.val().postNum * 2 + snapshot.val().commentNum,
          aboutMe: snapshot.val().AddintionalInfo,
          pastorUser: true,
          preach: snapshot.val().Preach,
          seminary: snapshot.val().Seminary,
          pastorCode: snapshot.val().pastorCode,
        })
      : (userObj = {
          fName: snapshot.val().First,
          lName: snapshot.val().Last,
          email: snapshot.val().Email,
          username: snapshot.val().Username,
          commentNum: snapshot.val().commentNum,
          postNum: snapshot.val().postNum,
          score: snapshot.val().postNum * 2 + snapshot.val().commentNum,
          aboutMe: snapshot.val().AddintionalInfo,
        });
  });
  return userObj;
};
