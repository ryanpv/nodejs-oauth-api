import "dotenv/config.js";
import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.route('/')
  .get((req, res) => {
    // res.sendFile('index.html', { root: 'public' })
    res.redirect('/')
  });

router.route('/auth')
  .get((req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
  });

router.route('/oauth-callback')
  .get(async (req, res) => {
    try {
      const body = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET,
        code: req.query.code
      };
      const opts = { headers: { accept: 'application/json' } };
      const getToken = await axios.post('https://github.com/login/oauth/access_token', body, opts);
      const githubToken = await getToken
      console.log('github token: ', githubToken.data);

    
      res.cookie('currentUserStatus', 'true', {
        httpOnly: false
      });
    
      res.cookie('github_access_token', githubToken.data.access_token, {
        httpOnly: true
      });
      
    } catch (err) {
      console.log('error', err.message);
    };
    // res.end()
    res.redirect('/githubAuth/githubUser')
  });

// GET GITHUB USER INFO
router.route('/githubUser')
  .get(async (req, res) => {
    const githubToken = req.cookies.github_access_token
    console.log('github token: ', githubToken);
    const getUser = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${ githubToken }`
      }
    })

    const user = await getUser
    console.log(user.data);

    req.session.authenticated = true;
    req.session.user = user.data;
    req.session.userID = user.data.login

    res.cookie('currentUser', user.data.login, {
      httpOnly: false
    });

    res.redirect('/')
  })



  

router.route('/logout')
  .get((req, res) => {
    console.log('cleared cookie');
    res.clearCookie('github_access_token')
    res.clearCookie('github_token_exists')
    res.redirect('/')
  })


export default router