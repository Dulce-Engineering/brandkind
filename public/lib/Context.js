import '/__/firebase/9.4.0/firebase-app-compat.js';
import '/__/firebase/9.4.0/firebase-functions-compat.js';
import '/__/firebase/9.4.0/firebase-analytics-compat.js';
import '/__/firebase/9.4.0/firebase-auth-compat.js';
import '/__/firebase/9.4.0/firebase-firestore-compat.js';
import '/__/firebase/init.js?useEmulator=true';
import Db from "./De_Db_Firestore.js";
import Client_Cache_Local from "../node_modules/cache-buddy/Client_Cache_Local.js";

class Context
{
  constructor(app_name)
  {
    //this.fb_app = firebase.app(app_name);
    //this.fb_auth = firebase.auth(this.fb_app);
    this.fb_app = firebase.app();
    this.fb_anl = firebase.analytics();
    this.fb_fns = firebase.functions();
    this.fb_auth = firebase.auth();
    this.fb_db = firebase.firestore();
    this.db = new Db(this.fb_db);
    this.cache = new Client_Cache_Local();
  }

  static Set_Id_Shortcuts(src_elem, dest_elem)
  {
    const elems = src_elem.querySelectorAll("[id]");
    for (const elem of elems)
    {
      const id = elem.id;
      dest_elem[id] = elem;
    }
  }

  async Register(to)
  {
    this.fb_anl.logEvent("sign_up", {method: "landing page"});

    const fn = this.fb_fns.httpsCallable('Register');
    const res = await fn(to);

    return res;
  }

  async Save_Registration(form)
  {
    this.fb_anl.logEvent("save_form");

    const fn = this.fb_fns.httpsCallable('Save_Registration');
    const res = await fn(form);

    return res;
  }
}

export default Context;