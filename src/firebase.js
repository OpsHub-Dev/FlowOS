// src/firebase.js
// Replace the firebaseConfig below with your own from Firebase Console:
// https://console.firebase.google.com → Project Settings → Your Apps → SDK setup

import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB9DhSn5gDqAhpmLG9aVFAld1dSRYJWFDI",
  authDomain: "opshub-f802f.firebaseapp.com",
  projectId: "opshub-f802f",
  storageBucket: "opshub-f802f.firebasestorage.app",
  messagingSenderId: "84176854270",
  appId: "1:84176854270:web:f7a66b3b38e98b630859af",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// ── Auth helpers ──────────────────────────────────────────

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const registerWithEmail = async (email, password, fullName) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: fullName })
  return cred
}

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

export const resetPassword = (email) => sendPasswordResetEmail(auth, email)

export const logout = () => signOut(auth)

export const onAuthChange = (cb) => onAuthStateChanged(auth, cb)
