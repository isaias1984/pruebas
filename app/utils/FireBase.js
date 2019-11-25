import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDM4t9V1vy5CjKwkjsCv2ugYEVgsoCB3sk",
  authDomain: "tenedores-1f9b3.firebaseapp.com",
  databaseURL: "https://tenedores-1f9b3.firebaseio.com",
  projectId: "tenedores-1f9b3",
  storageBucket: "tenedores-1f9b3.appspot.com",
  messagingSenderId: "849029372045",
  appId: "1:849029372045:web:81fe6dee81e925d3ddeac4",
  measurementId: "G-KTYJFK0ZMC"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
