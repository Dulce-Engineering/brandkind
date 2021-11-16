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

async function Register(to)
{
  const mailOptions = 
  {
    from: "noreply@brandkind.com",
    to,
    subject: "Welcome to BrandKind!",
    text: 
      "Hi! Thankyou for registering your interest. The following link will take you to a form " +
      "through which we can collect your details.\n\n" +
      "https://brandkind.net.au/form.html",
    html: `
      <html>
        <body>
          <p>Hi! Thankyou for registering your interest. The following link will take you to a form
          through which we can collect your details.</p>
          <p><a href="https://brandkind.net.au/form.html">https://brandkind.net.au/form.html</a></p>
        </body>
      </html>
      `,
  };

  // The user subscribed to the newsletter.

  const info = await mailTransport.sendMail(mailOptions);
  console.log("functions.Register()", info);
  const res = info.accepted.includes(to);
  
  return res;
}

async function Save_Registration(form)
{
  const res = await db.Save(form, "form");

  return res;
}

exports.Register = fb_fns.https.onCall(Register);
exports.Save_Registration = fb_fns.https.onCall(Save_Registration);
