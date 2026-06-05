
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOgWRmkIT3yeEtvgsG7BCExbnXkiI0jZs",
  authDomain: "internsnest.firebaseapp.com",
  projectId: "internsnest",
  storageBucket: "internsnest.firebasestorage.app",
  messagingSenderId: "352983470378",
  appId: "1:352983470378:web:5abc7d84c4db8713f24e53",
  measurementId: "G-W34WD2SW8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth(app);
const provider=new GoogleAuthProvider();
export {auth,provider};