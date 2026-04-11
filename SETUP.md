# FlowOS — Firebase Setup Guide

## 1. Firebase Console Setup

Go to [console.firebase.google.com](https://console.firebase.google.com) and:

1. **Authentication** → Sign-in method → Enable **Email/Password** and **Google**
2. **Firestore Database** → Create database → Start in **production mode**
3. **Functions** → Enable (requires Blaze pay-as-you-go plan for email sending)

---

## 2. Configure Firebase in the App

Open `src/firebase.js` and replace the config:
```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
}
```
Find this in: Firebase Console → Project Settings → Your Apps → SDK setup & config

---

## 3. Deploy Firestore Rules & Indexes

```bash
npm install -g firebase-tools
firebase login
firebase init   # select Firestore + Functions + Hosting, use existing project
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

---

## 4. Set Up Email (Gmail App Password)

1. Go to your Google Account → Security → 2-Step Verification → **App passwords**
2. Create an app password for "Mail"
3. Run:
```bash
firebase functions:config:set email.user="you@gmail.com" email.pass="your-16-char-app-password"
```

---

## 5. Deploy Cloud Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

This deploys:
- `sendInvite` — sends invitation email to new staff
- `verifyInvite` — validates invite token on register page
- `completeRegistration` — saves user role to Firestore
- `submitRequest` — staff submits request → goes to HQ inbox
- `respondToRequest` — HQ approves/rejects → staff gets email
- `onUserCreated` — auto-saves new users to Firestore

---

## 6. Create Your First Admin User

1. Register normally at `/register`
2. Go to Firebase Console → Firestore → `users` collection
3. Find your user document → set `role` to `"Admin"`

All subsequent users invited by you will automatically get their role from the invite.

---

## 7. How the System Works

### Admin / Manager (HQ)
- Logs in → sees full dashboard at `/dashboard`
- Goes to **Team** page → clicks **+ Invite Member**
- Fills in name, email, role, department → clicks **Send Invite**
- Staff receives a **real email** with a registration link

### Staff (Employee)
- Clicks the email link → taken to `/register?invite=TOKEN`
- Sets their password → automatically gets their role + department
- Logs in → redirected to **Employee Portal** at `/portal`
- Can submit: Leave, IT, Purchase, Travel, Expense, Training requests
- Tracks request status and receives email notifications

### HQ Inbox
- All staff requests appear in real-time in `/inbox`
- HQ can **Approve**, **Reject**, or put **On Hold** with a comment
- Staff member receives an email with the decision + comment

---

## 8. Run Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 9. Deploy the App

```bash
npm run build
firebase deploy --only hosting
```

---

## File Structure

```
flowos/
├── src/
│   ├── firebase.js              ← Firebase init + auth helpers
│   ├── services/
│   │   └── firebaseService.js   ← All Firestore + Functions calls
│   ├── context/
│   │   ├── AuthContext.jsx      ← User + role state (isHQ / isStaff)
│   │   └── StoreContext.jsx     ← Local UI state
│   ├── pages/
│   │   ├── staff/
│   │   │   └── StaffPortal.jsx  ← Employee portal (submit requests)
│   │   ├── Inbox.jsx            ← HQ inbox (real Firestore)
│   │   ├── Team.jsx             ← Real Firebase invites
│   │   └── ...                  ← Other pages
│   └── layouts/
│       └── AppLayout.jsx
├── functions/
│   └── index.js                 ← Cloud Functions (email, invites, requests)
├── firestore.rules              ← Security rules
├── firestore.indexes.json       ← Query indexes
└── firebase.json                ← Firebase project config
```
