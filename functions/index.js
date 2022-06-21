const fb_fns = require('firebase-functions');
const Db_Firestore = require('./Db_Firestore');
const firebase = require('firebase-admin');
const nodemailer = require('nodemailer');

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

async function Register(to)
{
  let res;
  const mailOptions = 
  {
    from: "it@brandkindcommunity.com",
    to,
    subject: "Welcome to BrandKind!",
    text: 
      //"BRANDKIND\n" +
      //"Email introduction\n\n" +
      "\nWelcome to the Brandkind Community! We already love your generous spirit and can’t wait to get you " +
      "involved with the other nice and smart folks here.\n\n" +
      "We just need to get to know you even more so kindly complete the form at the following link.\n" +
      "https://brandkindcommunity.com/form.html\n\n" +
      "Then we will give you a shout to have a chat - and together, we can find ways for you to help out " +
      "and be a part of Brandkind in ways that suit you best.\n\n" +
      "See you soon!",
    html: `
      <html>
        <body>
          <p>BRANDKIND<br>
          Email introduction</p>
          <p>Welcome to the Brandkind Community! We already love your generous spirit and can’t wait to get you 
          involved with the other nice and smart folks here.</p>
          <p>We just need to get to know you even more so kindly complete the form at the following link.</p>
          <p><a href="https://brandkindcommunity.com/form.html">https://brandkindcommunity.com/form.html</a></p>
          <p>Then we will give you a shout to have a chat - and together, we can find ways for you to help out 
          and be a part of Brandkind in ways that suit you best.</p> 
          <p>See you soon!</p> 
        </body>
      </html>
    `,
  };

  try
  {
    const info = await mailTransport.sendMail(mailOptions);
    console.log("Register(): info =", info);
    res = {ok: info.accepted.includes(to)};
  }
  catch (e)
  {
    res = {ok: false, message: e.message};
  }
  
  return res;
}

async function Save_Registration(form)
{
  const res = await db.Save(form, "form");

  return res;
}

exports.Register = fb_fns.https.onCall(Register);
exports.Save_Registration = fb_fns.https.onCall(Save_Registration);
