import "dotenv/config.js";
import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const store = new session.MemoryStore();


app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use(session({
  secret: 'qwerty123',
  saveUninitialized: false,
  cookie: { maxAge: 30000 },
  resave: false,
  store: store
}));

app.use((req, res, next) => {
  console.log('current req: ', req.session.user);
  console.log('store: ', store);
  next();
});


app.get('/user', (req, res) => { // GET route to check if session is successful/still active
  console.log('session user: ', req.session.user);
  if (req.session.user) {
    res.send(`<p>Welcome User: ${ req.session.userID }</p> <p>Session ID: ${ req.sessionID}</p> <a href='/clear-all-cookies'>Click to logout.</a> <a href='/'>Go back home.</a>`);
    // res.send(req.session.user)
  } else {
    res.redirect('/clear-all-cookies')
  }  // console.log('homepage');
})

import githubAuth from './routes/githubAuth.js'
app.use('/githubAuth', githubAuth)

import googleAuth from './routes/googleAuth.js'
app.use('/googleAuth', googleAuth)

import firebaseAuth from './routes/firebaseAuth.js'
// app.use('/firebaseAuth', express.static(path.join(__dirname, 'public/firebaseAppAuth.js')))
app.use('/firebaseAuth', firebaseAuth)

console.log(path.join(__dirname, '/public', 'firebaseAppAuth.js'));




app.get('/clear-all-cookies', (req, res) => {
  res.clearCookie('github_access_token')
  res.clearCookie('github_token_exists')
  res.clearCookie('googleEmail')
  res.clearCookie('google_payload')
  res.clearCookie('g_state')
  res.clearCookie('currentUserStatus')
  res.clearCookie('currentUser')
  res.clearCookie('firebase_access_token')
  req.session.destroy();
  res.redirect('/')

})


app.listen(3333, () => {
  console.log('listening to port 3333');
});