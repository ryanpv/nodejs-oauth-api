import "dotenv/config.js";
import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors';
import cookieParser from 'cookie-parser';



const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));

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
  res.redirect('/')
})


app.listen(3333, () => {
  console.log('listening to port 3333');
});