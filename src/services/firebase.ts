import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyBJ2BPe9Ejj-f3uy0Q1DE21-sED6PXCMO8",
  authDomain: "recircula-ad7af.firebaseapp.com",
  projectId: "recircula-ad7af",
  storageBucket: "recircula-ad7af.firebasestorage.app",
  messagingSenderId: "101103638039",
  appId: "1:101103638039:web:9557bb2901cdde59f7ae52",
  measurementId: "G-9Q0E5HR31Z"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
