import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFll2179-HFHdYxuzWbEFh7iM7R78pn3o",
  authDomain: "binucot-pearl.firebaseapp.com",
  projectId: "binucot-pearl",
  storageBucket: "binucot-pearl.firebasestorage.app",
  messagingSenderId: "574951649848",
  appId: "1:574951649848:web:9516a90b9d796034926ccd",
  measurementId: "G-409MFRWFHH"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

isSupported().then((supported) => {
  if (supported) {
    window.firebaseAnalytics = getAnalytics(app);
  }
});

window.firebaseApp = app;
