// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { CustomerInfo } from "@/types/types";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "faster-order-945ea.firebaseapp.com",
  projectId: "faster-order-945ea",
  storageBucket: "faster-order-945ea.appspot.com",
  messagingSenderId: "956239478411",
  appId: "1:956239478411:web:b0b0bcd4aef2f05ea15e8e",
  measurementId: "G-YH6TDR7W08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const signInAnonymous = (data: CustomerInfo) => {
  signInAnonymously(auth)
    .then(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: data.name,
            phone: data.phone,
            address: data.address,
            neighborhood: data.neighborhood,
          });
        } else {
          console.log("No user is signed in.");
        }
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
};

export { auth, analytics, db, signInAnonymous };
