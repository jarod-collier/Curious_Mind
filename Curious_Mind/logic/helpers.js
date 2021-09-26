import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {getDatabase, ref, set, onValue} from 'firebase/database';


export default class Helpers {

    async signUserUp () {

        const auth = getAuth();
    
        if ( this.state.Password1 !== '' && this.state.Password2 !== '' ) {
            if (this.state.Password1 === this.state.Password2) {

            }
            else {
                Alert.alert("New passwords don't match");
            }
        } 
        else {
            Alert.alert('One of the password prompts is empty.');
        }
    
    }

    //  // Passwords match
    //  if (this.state.Password1 === this.state.Password2) {
    
    //     // Passwords are greater than length 6
    //     if (this.state.Password1.length >= 6 && this.state.Password2.length >= 6 ) {

    //     createUserWithEmailAndPassword(auth, this.state.Email, this.state.Password1)
    //     .then(userCredential => {
    //         // Signed in
    //         console.log('successfully created user account');
    //         UserId = userCredential.user.uid;
    //     })
    //     .catch(error => {
    //         console.log('failure creating account');
    //         const errorMessage = error.message;
    //         console.log('error message: ' + errorMessage);
    //     })
    //     .then(() => {
    //         const db = getDatabase();
    //         set(ref(db, 'userInfo/' + UserId), {
    //         First: '' + this.state.FirstName,
    //         Last: '' + this.state.LastName,
    //         Username: '' + this.state.Username,
    //         uid: UserId,
    //         postNum: 0,
    //         commentNum: 0,
    //         AddintionalInfo: '',
    //         score: 0,
    //         userType: 'user',
    //         Email: this.state.Email,
    //         });
    //     })
    //     .catch(error => {
    //         console.log('failure setting data');
    //     })
    //     .then(() =>
    //         navigation.reset({
    //         index: 0,
    //         routes: [{name: 'Home'}],
    //         }),
    //     );
    // } 
    //     else {
        
    //     //new passwords less than 6 characters
    //     Alert.alert(
    //         'New password needs to be at least 6 characters long',
    //     );
    //     }
    // } else {
    //     //passwords dont match
    //     Alert.alert("New passwords don't match");
    // }

}
