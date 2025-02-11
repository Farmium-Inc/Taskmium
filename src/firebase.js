import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot, 
  updateDoc 
} from "firebase/firestore";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDn1bixspPa2M-0ce853Ac7E681Z6XnvR4",
  authDomain: "taskmium.firebaseapp.com",
  projectId: "taskmium",
  storageBucket: "taskmium.firebasestorage.app",
  messagingSenderId: "183547983132",
  appId: "1:183547983132:web:dafbcaed053025800776d9",
  measurementId: "G-4BRK35VVJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firestore Collections
const getTasksCollection = (userId) => collection(db, "users", userId, "tasks");

// Authentication Functions
export const signUp = (email, password) => 
  createUserWithEmailAndPassword(auth, email, password);

export const logIn = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

export const logOut = () => signOut(auth);

export const onAuthChange = (callback) => 
  onAuthStateChanged(auth, callback);

// Task Operations
export const addTask = async (userId, task) => {
  try {
    await addDoc(getTasksCollection(userId), {
      text: task.text,
      emoji: task.emoji,
      createdAt: new Date(),
      completed: false,
      important: false
    });
  } catch (error) {
    throw new Error("Failed to add task: " + error.message);
  }
};

export const deleteTask = async (userId, taskId) => {
  try {
    await deleteDoc(doc(db, "users", userId, "tasks", taskId));
  } catch (error) {
    throw new Error("Failed to delete task: " + error.message);
  }
};

export const toggleTaskComplete = async (userId, taskId, completed) => {
  try {
    await updateDoc(doc(db, "users", userId, "tasks", taskId), {
      completed: !completed
    });
  } catch (error) {
    throw new Error("Failed to update task: " + error.message);
  }
};

export const toggleTaskImportant = async (userId, taskId, important) => {
  try {
    await updateDoc(doc(db, "users", userId, "tasks", taskId), {
      important: !important
    });
  } catch (error) {
    throw new Error("Failed to update task: " + error.message);
  }
};

// Real-time Task Listener
export const getTasksStream = (userId, callback) => {
  const q = query(
    getTasksCollection(userId),
    where("completed", "==", false)
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(tasks);
  });

  return unsubscribe;
};

// Optional: User Profile Management
export const updateUserProfile = async (userId, updates) => {
  try {
    await updateDoc(doc(db, "users", userId), updates);
  } catch (error) {
    throw new Error("Failed to update profile: " + error.message);
  }
};

export { db, auth };