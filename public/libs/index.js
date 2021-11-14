import '/__/firebase/9.4.0/firebase-app-compat.js'
import '/__/firebase/9.4.0/firebase-functions-compat.js'
import '/__/firebase/init.js?useEmulator=true'

class Context
{
  constructor()
  {
    const fb_fns = firebase.functions();
    this.Register = fb_fns.httpsCallable('Register');
    this.Save_Registration = fb_fns.httpsCallable('Save_Registration');
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
}

export default Context;