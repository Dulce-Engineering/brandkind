const Utils = require("./Utils.js");
const firebase = require('firebase-admin');

class De_Db_Firestore
{
  constructor(app_name)
  {
    this.app = firebase.app(app_name);
    this.db = this.app.firestore();
    this.auth = firebase.auth(this.app);
    this.last_error = null;
  }
  
  async Select_Value()
  {

  }
  
  async Select_Values(field_name, table_name, where)
  {
    let res;

    const table = this.db.collection(table_name);
    const query = this.Add_Where(table, where);
    const query_res = await query.get();
    if (!query_res.empty)
    {
      res = [];
      for (const row of query_res.docs)
      {
        const obj = row.data();
        const value = obj[field_name];
        res.push(value);
      }
    }

    return res;
  }

  async Select_Obj(table_name, class_type, where)
  {
    let res;

    const table = this.db.collection(table_name);
    const query = this.Add_Where(table, where).limit(1);
    const query_res = await query.get();
    if (!query_res.empty)
    {
      const row = query_res.docs[0];
      const raw_obj = row.data();
      raw_obj.id = row.id;
      const class_obj = new class_type(raw_obj);
      res = class_obj;
    }

    return res;
  }

  async Select_Objs(table_name, class_type, where)
  {
    let res;

    const table = this.db.collection(table_name);
    const query = this.Add_Where(table, where);
    const query_res = await query.get();
    if (!query_res.empty)
    {
      res = [];
      for (const row of query_res.docs)
      {
        const raw_obj = row.data();
        raw_obj.id = row.id;
        const class_obj = new class_type(raw_obj);
        res.push(class_obj);
      }
    }

    return res;
  }

  async Select_Obj_By_Id(id, table_name, class_type)
  {
    let class_obj;

    const table = this.db.collection(table_name);
    const query = table.doc(id);
    const query_res = await query.get();
    if (query_res.exists)
    {
      const obj = query_res.data();
      obj.id = query_res.id;
      class_obj = new class_type(obj);
    }

    return class_obj;
  }

  async Save(class_obj, table_name)
  {
    let res = false;

    if (class_obj.id)
    {
      res = await this.Update(class_obj, table_name);
    }
    else
    {
      res = await this.Insert(class_obj, table_name);
    }

    return res;
  }

  async Insert(class_obj, table_name)
  {
    let res = false;

    const obj = Utils.To_Obj(class_obj);
    delete obj.id;
    const table = this.db.collection(table_name);

    try 
    {
      const doc_ref = await table.add(obj);
      class_obj.id = doc_ref.id;
      res = true;
    }
    catch (e)
    {
      this.last_error = e;
    }

    return res;
  }

  async Update(class_obj, table_name)
  {
    let res = false;

    const obj = Utils.To_Obj(class_obj);
    const id = obj.id;
    delete obj.id;
    const table = this.db.collection(table_name);

    try 
    {
      await table.doc(id).set(obj);
      res = true;
    }
    catch (e)
    {
      this.last_error = e;
    }

    return res;
  }

  async Delete(table_name, id)
  {
    let res = false;

    const table = this.db.collection(table_name);
    try
    {
      await table.doc(id).delete();
      res = true;
    }
    catch (e)
    {
      this.last_error = e;
    }

    return res;
  }

  Add_Where(table, where_filters)
  {
    if (!Utils.isEmpty(where_filters))
    {
      for (const filter of where_filters)
      {
        table = table.where(filter.field, filter.op, filter.value);
      }
    }

    return table;
  }
  
  To_Db_Where(where, conditions)
  {
    let db_where;

    if (!Utils.isEmpty(where))
    {
      db_where = [];

      for (let i = 0; i < conditions.length; i += 3)
      {
        const condition_code = conditions[i];
        const condition_field = conditions[i+1];
        const condition_op = conditions[i+2];
        const condition_map_fn = conditions[i+3];

        let condition_value = where[condition_code];
        if (condition_value)
        {
          if (condition_map_fn)
          {
            condition_value = condition_map_fn(condition_value);
          }

          const filter = {field: condition_field, op: condition_op, value: condition_value};
          db_where.push(filter);
        }
      }
    }

    return db_where;
  }
}

module.exports = De_Db_Firestore;