const functions = require('firebase-functions')
const admin = require('firebase-admin')
const nodemailer = require('nodemailer')

admin.initializeApp()
const db = admin.firestore()

// ── Email transporter (configure with your SMTP or Gmail app password) ────────
// In Firebase console → Functions → Environment config:
// firebase functions:config:set email.user="you@gmail.com" email.pass="your-app-password"
const getTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email?.user || process.env.EMAIL_USER,
    pass: functions.config().email?.pass || process.env.EMAIL_PASS,
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// 1. SEND STAFF INVITE EMAIL
//    Called by Admin when inviting a new team member
// ─────────────────────────────────────────────────────────────────────────────
exports.sendInvite = functions.https.onCall(async (data, context) => {
  // Only admins can invite
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.')

  const callerDoc = await db.collection('users').doc(context.auth.uid).get()
  const callerRole = callerDoc.data()?.role
  if (!['Admin', 'Manager'].includes(callerRole)) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can send invites.')
  }

  const { email, name, role, dept, orgName } = data
  if (!email || !name) throw new functions.https.HttpsError('invalid-argument', 'Email and name required.')

  // Create invite record in Firestore
  const inviteRef = db.collection('invites').doc()
  const token = inviteRef.id
  await inviteRef.set({
    email,
    name,
    role: role || 'Member',
    dept: dept || '',
    orgName: orgName || 'FlowOS',
    invitedBy: context.auth.uid,
    invitedByName: callerDoc.data()?.name || 'Admin',
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  })

  // Build the registration link
  const registerLink = `${data.appUrl || 'http://localhost:5173'}/register?invite=${token}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`

  // Send email
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"${orgName || 'FlowOS'}" <${functions.config().email?.user}>`,
    to: email,
    subject: `You're invited to join ${orgName || 'FlowOS'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"/></head>
      <body style="margin:0;padding:0;background:#0d0f14;font-family:'Segoe UI',sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:#13161e;border:1px solid #232838;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#4f6ef7,#7c4dff);padding:32px;text-align:center;">
            <div style="width:48px;height:48px;background:rgba(255,255,255,.15);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;margin-bottom:12px;">F</div>
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">You're Invited!</h1>
            <p style="color:rgba(255,255,255,.7);margin:8px 0 0;font-size:14px;">Join ${orgName || 'FlowOS'} on FlowOS</p>
          </div>
          <!-- Body -->
          <div style="padding:32px;">
            <p style="color:#e8eaf2;font-size:15px;margin:0 0 8px;">Hi <strong>${name}</strong>,</p>
            <p style="color:#8a90a8;font-size:14px;line-height:1.6;margin:0 0 24px;">
              <strong style="color:#e8eaf2;">${callerDoc.data()?.name || 'Your admin'}</strong> has invited you to join 
              <strong style="color:#e8eaf2;">${orgName || 'FlowOS'}</strong> as a <strong style="color:#4f6ef7;">${role || 'Member'}</strong> 
              in the <strong style="color:#e8eaf2;">${dept || 'team'}</strong> department.
            </p>
            <!-- Role card -->
            <div style="background:#1a1e2a;border:1px solid #232838;border-radius:10px;padding:16px;margin-bottom:24px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="color:#555c78;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Your Role</span>
                <span style="color:#4f6ef7;font-size:12px;font-weight:600;">${role || 'Member'}</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#555c78;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Department</span>
                <span style="color:#e8eaf2;font-size:12px;font-weight:600;">${dept || 'General'}</span>
              </div>
            </div>
            <!-- CTA Button -->
            <div style="text-align:center;margin-bottom:24px;">
              <a href="${registerLink}" style="display:inline-block;background:linear-gradient(135deg,#4f6ef7,#7c4dff);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:14px;font-weight:600;">
                Accept Invitation &amp; Set Up Account
              </a>
            </div>
            <p style="color:#555c78;font-size:12px;text-align:center;margin:0;">
              This invite expires in 7 days. If you didn't expect this email, you can ignore it.
            </p>
          </div>
          <!-- Footer -->
          <div style="border-top:1px solid #232838;padding:16px;text-align:center;">
            <p style="color:#555c78;font-size:11px;margin:0;">FlowOS · Work Management Platform</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })

  return { success: true, token }
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. VERIFY INVITE TOKEN (called on register page when token present in URL)
// ─────────────────────────────────────────────────────────────────────────────
exports.verifyInvite = functions.https.onCall(async (data) => {
  const { token } = data
  if (!token) throw new functions.https.HttpsError('invalid-argument', 'Token required.')

  const inviteDoc = await db.collection('invites').doc(token).get()
  if (!inviteDoc.exists) throw new functions.https.HttpsError('not-found', 'Invite not found or expired.')

  const invite = inviteDoc.data()
  if (invite.status !== 'pending') throw new functions.https.HttpsError('already-exists', 'Invite already used.')
  if (invite.expiresAt.toDate() < new Date()) throw new functions.https.HttpsError('deadline-exceeded', 'Invite expired.')

  return { email: invite.email, name: invite.name, role: invite.role, dept: invite.dept, orgName: invite.orgName }
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. COMPLETE REGISTRATION — saves user profile & marks invite used
//    Called after Firebase Auth createUser succeeds
// ─────────────────────────────────────────────────────────────────────────────
exports.completeRegistration = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.')

  const { token, name, role, dept } = data
  const uid = context.auth.uid

  // Mark invite used
  if (token) {
    await db.collection('invites').doc(token).update({ status: 'used', usedBy: uid, usedAt: admin.firestore.FieldValue.serverTimestamp() })
  }

  // Save user profile in Firestore
  await db.collection('users').doc(uid).set({
    uid,
    name: name || context.auth.token.name || '',
    email: context.auth.token.email || '',
    role: role || 'Member',
    dept: dept || '',
    status: 'Active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    workflows: 0,
    tasks: 0,
  }, { merge: true })

  return { success: true }
})

// ─────────────────────────────────────────────────────────────────────────────
// 4. SUBMIT REQUEST (Staff → HQ)
//    Staff submits a workflow request; creates inbox item for HQ
// ─────────────────────────────────────────────────────────────────────────────
exports.submitRequest = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.')

  const userDoc = await db.collection('users').doc(context.auth.uid).get()
  const user = userDoc.data()

  const { type, title, details, priority, attachmentName } = data

  const requestRef = await db.collection('requests').add({
    type,
    title,
    details,
    priority: priority || 'Medium',
    attachmentName: attachmentName || null,
    submittedBy: context.auth.uid,
    submittedByName: user?.name || 'Unknown',
    submittedByDept: user?.dept || '',
    status: 'Pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  // Notify all Admins and Managers via Firestore (inbox items)
  const admins = await db.collection('users').where('role', 'in', ['Admin', 'Manager']).get()
  const batch = db.batch()
  admins.forEach(adminDoc => {
    const inboxRef = db.collection('users').doc(adminDoc.id).collection('inbox').doc(requestRef.id)
    batch.set(inboxRef, {
      requestId: requestRef.id,
      from: user?.name || 'Staff',
      fromDept: user?.dept || '',
      title,
      type,
      preview: details?.substring(0, 80) || '',
      priority: priority || 'Medium',
      status: 'Pending',
      unread: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  })
  await batch.commit()

  return { success: true, requestId: requestRef.id }
})

// ─────────────────────────────────────────────────────────────────────────────
// 5. APPROVE / REJECT REQUEST (HQ action)
// ─────────────────────────────────────────────────────────────────────────────
exports.respondToRequest = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.')

  const callerDoc = await db.collection('users').doc(context.auth.uid).get()
  if (!['Admin', 'Manager'].includes(callerDoc.data()?.role)) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can respond.')
  }

  const { requestId, status, comment } = data // status: 'Approved' | 'Rejected' | 'On Hold'

  // Update request
  const requestRef = db.collection('requests').doc(requestId)
  const requestDoc = await requestRef.get()
  const request = requestDoc.data()

  await requestRef.update({
    status,
    respondedBy: context.auth.uid,
    respondedByName: callerDoc.data()?.name,
    respondedAt: admin.firestore.FieldValue.serverTimestamp(),
    comment: comment || '',
  })

  // Notify the staff member who submitted
  if (request?.submittedBy) {
    await db.collection('users').doc(request.submittedBy).collection('notifications').add({
      title: `Your request "${request.title}" was ${status}`,
      body: comment || `Your request has been ${status.toLowerCase()} by ${callerDoc.data()?.name}.`,
      status,
      requestId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    // Send email notification to staff member
    const staffDoc = await db.collection('users').doc(request.submittedBy).get()
    const staffEmail = staffDoc.data()?.email
    if (staffEmail) {
      const transporter = getTransporter()
      const statusColor = status === 'Approved' ? '#00d4a0' : status === 'Rejected' ? '#f74f6e' : '#f7934c'
      const statusIcon = status === 'Approved' ? '✓' : status === 'Rejected' ? '✗' : '⏸'
      await transporter.sendMail({
        from: `"FlowOS" <${functions.config().email?.user}>`,
        to: staffEmail,
        subject: `Request ${status}: ${request.title}`,
        html: `
          <div style="max-width:480px;margin:32px auto;background:#13161e;border:1px solid #232838;border-radius:16px;overflow:hidden;font-family:'Segoe UI',sans-serif;">
            <div style="background:${statusColor}22;border-bottom:2px solid ${statusColor};padding:24px;text-align:center;">
              <div style="font-size:32px;margin-bottom:8px;">${statusIcon}</div>
              <h2 style="color:${statusColor};margin:0;font-size:18px;">Request ${status}</h2>
            </div>
            <div style="padding:24px;">
              <p style="color:#e8eaf2;margin:0 0 8px;">Hi <strong>${staffDoc.data()?.name || 'there'}</strong>,</p>
              <p style="color:#8a90a8;font-size:14px;line-height:1.6;margin:0 0 16px;">Your request <strong style="color:#e8eaf2;">"${request.title}"</strong> has been <strong style="color:${statusColor};">${status.toLowerCase()}</strong> by ${callerDoc.data()?.name}.</p>
              ${comment ? `<div style="background:#1a1e2a;border-left:3px solid ${statusColor};padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:16px;"><p style="color:#8a90a8;font-size:13px;margin:0;font-style:italic;">"${comment}"</p></div>` : ''}
              <p style="color:#555c78;font-size:12px;text-align:center;margin:0;">Log in to FlowOS to view your request status.</p>
            </div>
          </div>
        `,
      })
    }
  }

  return { success: true }
})

// ─────────────────────────────────────────────────────────────────────────────
// 6. ON USER CREATE — auto-save email to Firestore
// ─────────────────────────────────────────────────────────────────────────────
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  const existing = await db.collection('users').doc(user.uid).get()
  if (!existing.exists) {
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email || '',
      name: user.displayName || '',
      role: 'Member',
      dept: '',
      status: 'Active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }
})
