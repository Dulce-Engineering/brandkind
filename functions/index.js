const fb_fns = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const RPC_Buddy = require('rpc-buddy');
const Db_Firestore = require('./Db_Firestore');
const Brandkind = require('./Brandkind');

const config = fb_fns.config();
/*const mail_options =
{
  service: 'gmail',
  auth: {
    user: config.gmail.email,
    pass: config.gmail.password,
  },
};*/
const mail_options =
{
  host: 'ventraip.email',
  port: 465,
  secure: true,
  auth: {
    user: config.ventraip.email,
    pass: config.ventraip.password,
  },
};
const mailTransport = nodemailer.createTransport(mail_options);

firebase.initializeApp(config, "brandkind");
const db = new Db_Firestore("brandkind");

const app = express();
app.use(cors({ origin: true }));

const rpc_buddy = new RPC_Buddy
(
  app, 
  '/rpc-server', 
  '/rpc-client',
  [Brandkind],
  [
    {name: "Brandkind.Register", inject: [mailTransport]},
    {name: "Brandkind.Save_Registration", inject: [db]},
  ],
  RPC_Buddy.Express
);
rpc_buddy.client_cache_control = "max-age=2592000"; // 30 days

exports.api = fb_fns.https.onRequest(app);
