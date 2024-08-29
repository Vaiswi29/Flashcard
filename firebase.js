// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLlNXggJSer2daQqqUsqqoMJYGoOAcF7M",
  authDomain: "flashcardsaas-4395e.firebaseapp.com",
  projectId: "flashcardsaas-4395e",
  storageBucket: "flashcardsaas-4395e.appspot.com",
  messagingSenderId: "1004950354926",
  appId: "1:1004950354926:web:6b9b594f3e3b4689a7acff",
  measurementId: "G-PWNPKLE2V7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};