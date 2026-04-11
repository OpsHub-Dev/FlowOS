// src/services/firebaseService.js
// All Firestore reads/writes and Cloud Function calls

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { auth } from '../firebase'

export const db = getFirestore()
export const functions = getFunctions()

// ── Cloud Function callers ────────────────────────────────────────────────────
export const sendInviteFn      = httpsCallable(functions, 'sendInvite')
export const verifyInviteFn    = httpsCallable(functions, 'verifyInvite')
export const completeRegFn     = httpsCallable(functions, 'completeRegistration')
export const submitRequestFn   = httpsCallable(functions, 'submitRequest')
export const respondRequestFn  = httpsCallable(functions, 'respondToRequest')

// ── USER PROFILE ──────────────────────────────────────────────────────────────

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export const updateUserProfile = async (uid, data) => {
  await setDoc(doc(db, 'users', uid), data, { merge: true })
}

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const deleteUser = async (uid) => {
  await deleteDoc(doc(db, 'users', uid))
}

// ── WORKFLOWS ─────────────────────────────────────────────────────────────────

export const getWorkflows = async () => {
  const snap = await getDocs(query(collection(db, 'workflows'), orderBy('createdAt', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const subscribeWorkflows = (callback) =>
  onSnapshot(query(collection(db, 'workflows'), orderBy('createdAt', 'desc')), snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )

export const addWorkflow = async (data) => {
  const ref = await addDoc(collection(db, 'workflows'), {
    ...data,
    createdBy: auth.currentUser?.uid,
    createdAt: serverTimestamp(),
    instances: 0,
    pct: 0,
  })
  return ref.id
}

export const updateWorkflow = async (id, data) => {
  await updateDoc(doc(db, 'workflows', id), { ...data, updatedAt: serverTimestamp() })
}

export const deleteWorkflow = async (id) => {
  await deleteDoc(doc(db, 'workflows', id))
}

// ── TASKS ─────────────────────────────────────────────────────────────────────

export const subscribeTasks = (callback) =>
  onSnapshot(query(collection(db, 'tasks'), orderBy('createdAt', 'desc')), snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )

export const addTask = async (data) => {
  await addDoc(collection(db, 'tasks'), { ...data, createdBy: auth.currentUser?.uid, createdAt: serverTimestamp() })
}

export const updateTask = async (id, data) => {
  await updateDoc(doc(db, 'tasks', id), { ...data, updatedAt: serverTimestamp() })
}

export const deleteTask = async (id) => {
  await deleteDoc(doc(db, 'tasks', id))
}

// ── FORMS ─────────────────────────────────────────────────────────────────────

export const subscribeForms = (callback) =>
  onSnapshot(query(collection(db, 'forms'), orderBy('createdAt', 'desc')), snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )

export const addForm = async (data) => {
  await addDoc(collection(db, 'forms'), { ...data, submissions: 0, createdBy: auth.currentUser?.uid, createdAt: serverTimestamp() })
}

export const updateForm = async (id, data) => {
  await updateDoc(doc(db, 'forms', id), { ...data, updatedAt: serverTimestamp() })
}

export const deleteForm = async (id) => {
  await deleteDoc(doc(db, 'forms', id))
}

// ── CASES ─────────────────────────────────────────────────────────────────────

export const subscribeCases = (callback) =>
  onSnapshot(query(collection(db, 'cases'), orderBy('createdAt', 'desc')), snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )

export const addCase = async (data) => {
  const ref = await addDoc(collection(db, 'cases'), {
    ...data,
    createdBy: auth.currentUser?.uid,
    createdAt: serverTimestamp(),
    created: new Date().toISOString().slice(0, 10),
  })
  return ref.id
}

export const updateCase = async (id, data) => {
  await updateDoc(doc(db, 'cases', id), { ...data, updatedAt: serverTimestamp() })
}

export const deleteCase = async (id) => {
  await deleteDoc(doc(db, 'cases', id))
}

// ── INBOX / REQUESTS ──────────────────────────────────────────────────────────

export const subscribeInbox = (uid, callback) =>
  onSnapshot(
    query(collection(db, 'users', uid, 'inbox'), orderBy('createdAt', 'desc')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )

export const markInboxRead = async (uid, itemId) => {
  await updateDoc(doc(db, 'users', uid, 'inbox', itemId), { unread: false })
}

export const getRequestDetail = async (requestId) => {
  const snap = await getDoc(doc(db, 'requests', requestId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// Staff: get own submitted requests
export const subscribeMyRequests = (uid, callback) =>
  onSnapshot(
    query(collection(db, 'requests'), where('submittedBy', '==', uid), orderBy('createdAt', 'desc')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )

// Staff: get own notifications
export const subscribeNotifications = (uid, callback) =>
  onSnapshot(
    query(collection(db, 'users', uid, 'notifications'), orderBy('createdAt', 'desc')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )

export const markNotificationRead = async (uid, notifId) => {
  await updateDoc(doc(db, 'users', uid, 'notifications', notifId), { read: true })
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────

export const getOrgSettings = async (orgId = 'default') => {
  const snap = await getDoc(doc(db, 'settings', orgId))
  return snap.exists() ? snap.data() : null
}

export const updateOrgSettings = async (data, orgId = 'default') => {
  await setDoc(doc(db, 'settings', orgId), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}
