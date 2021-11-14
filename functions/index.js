const fb_fns = require('firebase-functions');
const Db_Firestore = require('./Db_Firestore');
const firebase = require('firebase-admin');
const nodemailer = require('nodemailer');

const config = fb_fns.config();
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmail.email,
    pass: config.gmail.password,
  },
});

//const config = functions.config().firebase;
firebase.initializeApp(config, "brandkind");
const db = new Db_Firestore("brandkind");

async function Register()
{
  const mailOptions = 
  {
    from: "noreply@brandkind.com",
    to: "netssrmrz@yahoo.com.au",
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = "Welcome to BrandKind!";
  mailOptions.text = "Hi there! Welcome to BrandKind. I hope you will enjoy our service.";
  await mailTransport.sendMail(mailOptions);
  
  return "Thankyou for registering.";
}

async function Save_Registration(form)
{
  const res = await db.Save(form, "form");

  return res;
}

exports.Register = fb_fns.https.onCall(Register);
exports.Save_Registration = fb_fns.https.onCall(Save_Registration);
