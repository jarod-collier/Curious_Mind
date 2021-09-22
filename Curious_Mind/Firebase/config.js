
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUGaKuCPksP4F7ylFG6OhqZgqKAAb8gNA",
  authDomain: "curious-mind-82101.firebaseapp.com",
  databaseURL: "https://curious-mind-82101-default-rtdb.firebaseio.com",
  projectId: "curious-mind-82101",
  storageBucket: "curious-mind-82101.appspot.com",
  messagingSenderId: "493367019302",
  appId: "1:493367019302:web:a76a97e3fe1bd45149a3e7",
  measurementId: "G-EDRV4CER35"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
