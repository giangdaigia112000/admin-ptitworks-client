import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref as refstorage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLFi4qoJ2CVmIYPHksnqekBsUkJBGUNhA",
  authDomain: "ptit-works-client.firebaseapp.com",
  databaseURL:
    "https://ptit-works-client-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ptit-works-client",
  storageBucket: "ptit-works-client.appspot.com",
  messagingSenderId: "405739471953",
  appId: "1:405739471953:web:aac0fac4aba27b66e7a470",
};

const app = initializeApp(firebaseConfig);
const dbstorage = getStorage(app);

export { refstorage, uploadBytes, getDownloadURL, dbstorage };
