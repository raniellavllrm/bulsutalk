import firebase from "firebase"; 
var firebaseConfig = {
  apiKey: "AIzaSyC23lhv3mFFFPVpbPGzc_pfojiAH_psc_4",
  authDomain: "bulsutalk.firebaseapp.com",
  projectId: "bulsutalk",
  storageBucket: "bulsutalk.appspot.com",
  messagingSenderId: "3140316284",
  appId: "1:3140316284:web:41d5587097f4b7d7c2adf9",
  measurementId: "G-M15P7TN44W"
  };
firebase.initializeApp(firebaseConfig);
firebase.analytics();
export default firebase; 