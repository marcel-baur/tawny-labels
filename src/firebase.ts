import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage'
var firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

firebase.initializeApp(firebaseConfig);


export const db = firebase.firestore();

export const storage = firebase.storage();
