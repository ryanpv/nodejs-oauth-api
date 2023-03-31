import "dotenv/config.js";
import express from "express";
import axios from "axios";
import path from "path";
import { OAuth2Client } from 'google-auth-library';


const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)


router.route('/')
  .get((req, res) => {
  res.redirect('/');
});

router.route('/verify-token')
  .get(async (req, res) => {
    console.log('verify token route');

    // async function verify() {
      try {
        const ticket = await googleClient.verifyIdToken({
        idToken: req.query.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

    
      const payload = await ticket.getPayload();
      const jsonPayload = await JSON.stringify(payload)
      const userid = payload['sub']
      const userEmail = payload['email']
      // console.log('userid', userid);
      // console.log('email', userEmail);
      req.session.authenticated = true;
      req.session.user = jsonPayload;
      req.session.userID = userEmail;
      
      console.log('payload', payload);

      res.cookie('currentUser', payload['email'], {
        httpOnly: false,
        encode: String
      })
    // };
    res.cookie('currentUserStatus', 'true', {
      httpOnly: false
    });


    res.redirect('/')
    
  } catch (err) {
    console.log(err);
  }
  })


router.route('/logout')
  .post(async (req, res) => {
    console.log('token: ', req.cookies.google_token);
    const revokeToken = await axios.post(`https://oauth2.googleapis.com/revoke?token=${ req.cookies.google_token }`, {
      method: 'POST',
      headers: {
        'Content-type':'application/x-www-form-urlencoded'
      },
      token: req.cookies.google_token
    })
  })




export default router