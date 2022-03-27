import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBGuwZfn6ps4KvYDFfIwTSdDz8CCbNrUKw",
    authDomain: "invoice-app-1bd19.firebaseapp.com",
    projectId: "invoice-app-1bd19",
    storageBucket: "invoice-app-1bd19.appspot.com",
    messagingSenderId: "107836139327",
    appId: "1:107836139327:web:98bc4984b2b838ac11d58a"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const db =getFirestore(firebaseApp);

  export default db;