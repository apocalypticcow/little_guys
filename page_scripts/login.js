import {
    db
} from './firebase_api_littleguys.js';

// Initialize the FirebaseUI Widget using Firebase.
let auth = firebase.auth();

// handle logout
var queryString = decodeURIComponent(window.location.search);
if (queryString) {

    let query = queryString.slice(1, queryString.length);
    if (query === "logout") {
        auth.signOut()
            .then(() => {
                window.location.replace("home.html");
            });
    };
}

var ui = new firebaseui.auth.AuthUI(auth);

var uiConfig = {
    callbacks: {

        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            //------------------------------------------------------------------------------------------
            // The code below is modified from default snippet provided by the FB documentation.
            //
            // If the user is a "brand new" user, then create a new "user" in your own database.
            // Assign this user with the name and email provided.
            // Before this works, you must enable "Firestore" from the firebase console.
            // The Firestore rules must allow the user to write. 
            //------------------------------------------------------------------------------------------
            var user = authResult.user;
            if (authResult.additionalUserInfo.isNewUser) {
                db.collection("users").doc(user.uid).set({
                        name: user.displayName,
                        email: user.email
                    }).then(function () {
                        console.log("New user added to firestore");
                        window.location.assign("home.html");
                    })
                    .catch(function (error) {
                        console.log("Error adding new user: " + error);
                    });
            } else {
                return true;
            }
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('');

            let loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'none';
            }
            
            // toggle spinner and load page
            document.hideLoader();
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'profile.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: 'home.html',
    // Privacy policy url.
    privacyPolicyUrl: 'home.html',
    accountChooserEnabled: false
};
// The start method will wait until the DOM is loaded.
// Inject the login interface into the HTML
ui.start('#firebaseui-auth-container', uiConfig);