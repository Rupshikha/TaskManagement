import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6Nj0B2VYagAXvAX99s9EB18tbwZOPkiw",
  authDomain: "gantt-task-management-2786a.firebaseapp.com",
  projectId: "gantt-task-management-2786a",
  storageBucket: "gantt-task-management-2786a.firebasestorage.app",
  messagingSenderId: "470070959166",
  appId: "1:470070959166:web:5d175c0aa7f76b00fb456f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
