//---------------------------------------------------------------------
// Firebase configuration;
// Specifies which firebase project your application is connected with.
//---------------------------------------------------------------------

let firebaseConfig = {
    apiKey: "AIzaSyAuuLl2oOTE1MflDv86ZIQu-Y-4gnDI6j4",
    authDomain: "littleguys-927ed.firebaseapp.com",
    databaseURL: "https://littleguys-927ed.firebaseio.com",
    projectId: "littleguys-927ed",
    storageBucket: "littleguys-927ed.appspot.com",
    messagingSenderId: "61009375033",
    appId: "1:61009375033:web:3104a4cb074ebc57dd82e8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create the Firestore database object
// Henceforce, any reference to the database can be made with "db"
const db = firebase.firestore();

export {
    db
};