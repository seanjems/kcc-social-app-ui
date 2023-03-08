import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Replace this firebaseConfig object with the congurations for the project you created on your firebase console.
var firebaseConfig = {
  apiKey: "AIzaSyDUl6uM8O7mTPRIRIlmZdTjDLJQi0prVL4",
  authDomain: "sdakcc.firebaseapp.com",
  projectId: "sdakcc",
  storageBucket: "sdakcc.appspot.com",
  messagingSenderId: "308096063661",
  appId: "1:308096063661:web:ff90c9dd83eacb697b0e24",
  measurementId: "G-BWQJPHZ",
};

initializeApp(firebaseConfig);
const messaging = getMessaging();

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });

export const requestForToken = () => {
  return getToken(messaging, {
    vapidKey:
      "BH1GFOPodrrSBYIB2i_ol3MrLWfoJh-jiuaPy-R3mjoYFE2FoJ59tj6rkp4cHfHyxWQY-N7jm6Rd_PNj4CKv3ao",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};
