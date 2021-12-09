import Utils from "./Utils.js";

class Form
{
  constructor(obj)
  {
    Utils.To_Class_Obj(obj, this);
  }

  static Select(db)
  {
    return db.Select_Objs("form", Form);
  }
}

export default Form;