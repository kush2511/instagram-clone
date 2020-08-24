import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBJiCHA6-3wxRjY3sJeEZls8FhIu4aHg5k",
    authDomain: "instagram-clone-44641.firebaseapp.com",
    databaseURL: "https://instagram-clone-44641.firebaseio.com",
    projectId: "instagram-clone-44641",
    storageBucket: "instagram-clone-44641.appspot.com",
    messagingSenderId: "764606236562",
    appId: "1:764606236562:web:9eaa228ad30035080a234b",
    measurementId: "G-YKFJDQXWRQ"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage};