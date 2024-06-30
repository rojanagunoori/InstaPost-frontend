// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNoPP_O_58Q7qO9uMXZRHq9bsuF00y7ZE",
  authDomain: "mypost-5b4a3.firebaseapp.com",
  projectId: "mypost-5b4a3",
  storageBucket: "mypost-5b4a3.appspot.com",
  messagingSenderId: "245911732428",
  appId: "1:245911732428:web:08023986f52f1a1b384269"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDb=getFirestore(app)
const auth=getAuth(app)
const storage=getStorage(app)

const handleSignup = async (email, password, name) => {
  try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateUserProfile(user, name, null); // Set name, photoURL can be added if needed
      console.log("User signed up and profile updated");
  } catch (error) {
      console.error("Error signing up", error);
  }
};

export {fireDb,auth,storage,handleSignup}

