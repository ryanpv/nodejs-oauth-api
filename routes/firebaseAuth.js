import "dotenv/config.js";
import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import app from "../firebase-admin-config.js"; // must be imported before use any firebase functions
import { getAuth } from 'firebase-admin/auth'
import { auth } from "../firebase-client-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
// import serviceAccount from "../firebase_serviceAccount.js";
// import admin from 'firebase-admin'
// // import { initializeApp } from 'firebase-admin/app'
// const app = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.route('/')
  .get((req, res) => {
    res.redirect('/')
    // res.end()
  })

router.route('/signup')
  .get((req, res) => {
    res.sendFile('firebaseSignup.html', { root: 'public' })
  });

router.route('/firebaseAppAuth.js')
  .get((req, res) => {
    res.sendFile('firebaseAppAuth.js', { root: 'public' })
  })

router.route('/create-firebase-user')
  .post((req, res) => {
    getAuth()
      .createUser({
        email: req.body.emailName,
        password: req.body.passwordName
      })
      .then((userRecord) => {
        console.log('new user: ', userRecord.uid);
      })
      .catch((error) => {
        console.log(error);
      })

    console.log(req.body);
    res.redirect('/firebaseAuth/new-user-success')
  });

router.route('/new-user-success')
  .get((req, res) => {
    res.sendFile('signupSuccess.html', { root: 'public' })
  });

router.route('/sign-in')
  .post((req, res) => {
    // console.log(req.body);
    signInWithEmailAndPassword(auth, req.body.emailNameIndex, req.body.passwordNameIndex)
      .then((userCredential) => {
        const user = userCredential.user
        const userUid = user.uid
        const userEmail = user.email
        const userDisplayName = user.displayName

        req.session.authenticated = true;
        req.session.user = user
        req.session.userID = userEmail


        res.cookie('currentUserStatus', 'true', {
          httpOnly: false
        });
        res.cookie('currentUser', userEmail, {
          httpOnly: false,
          encode: String
        });
        res.cookie('firebase_access_token', user.accessToken, {
          httpOnly: true
        });

        console.log('firebase user: ', userEmail);
        res.redirect('/');
      })
      .catch((err) => {
        console.error(err.message);
        if (err) {
          // console.log('wrong password');
          res.send('check password')
        }
        res.end()
      })
  });


router.route('/check-session')
  .get((req, res) => {
    console.log('session user: ', req.session.user);
  res.redirect('/')
});

// router.route('/check-user')
//   .get((req, res) => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         console.log('user exists: ', user.accessToken);
//         res.send(user)
//       } else {
//         console.log('no user');
//         res.end()
//       }
//     })
//   })

export default router