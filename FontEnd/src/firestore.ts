import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "#####",
  authDomain: "####",
  projectId: "jq-stock",
  storageBucket: "####",
  messagingSenderId: "####",
  appId: "########",
  measurementId: "####",
};

const app = initializeApp(firebaseConfig);
const db = getStorage(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { db, analytics };
