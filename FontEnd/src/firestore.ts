import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB0J_aHKGpyHYwsKIaDqz_X93cGYEZheF4",
  authDomain: "jq-stock.firebaseapp.com",
  projectId: "jq-stock",
  storageBucket: "jq-stock.firebasestorage.app",
  messagingSenderId: "98689927822",
  appId: "1:98689927822:web:da48b41df1e1ff0b0357df",
  measurementId: "G-PWWV30CWQY",
};

const app = initializeApp(firebaseConfig);
const db = getStorage(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { db, analytics };
