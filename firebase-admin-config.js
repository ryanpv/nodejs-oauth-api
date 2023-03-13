import admin from 'firebase-admin'
import serviceAccount from './firebase_serviceAccount.js'

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

export default app