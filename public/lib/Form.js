import Utils from "./Utils.js";

const hour = 3600000;

class Form
{
  constructor(obj)
  {
    Utils.To_Class_Obj(obj, this);
  }

  static Select(ctx)
  {
    const key = ctx.user.uid + ".Form.Select()";
    return ctx.cache.use(key, () => ctx.db.Select_Objs("form", Form), hour);
    //return db.Select_Objs("form", Form);
  }

  static Select_By_Id(ctx, id)
  {
    const key = ctx.user.uid + ".Form.Select_By_Id(" + id + ")";
    return ctx.cache.use(key, () => ctx.db.Select_Obj_By_Id(id, "form", Form), hour, (obj) => new Form(obj));
    //return db.Select_Obj_By_Id(id, "form", Form);
  }

  To_Array()
  {
    const ws_options = ["Full Time", "Part Time", "Freelance", "Owner/Founder"];
    const lv_options = 
    [
      "Senior Execs (CMO or Partner or equivalent)", 
      "Mid-level Execs (Director Level)", 
      "Manager (Brand Manager Level)", 
      "Coordinator (Asst Brand Manager/Account Exec)",
    ];
    const pp_options =
    {
      PP_DIS_YOU: "Disadvantaged Youth",
      PP_REF_ASY: "Refugees, Asylum Seekers, Migrants",
      PP_DIS_COM: "People with Disabilities",
      PP_HOMLESS: "Individuals experiencing housing instability",
      PP_EX_INC: "Previously Incarcerated Individuals",
      PP_ANIMALS: "Animal safety, protection, ethics",
      PP_INDI: "Indigenous advocacy and community support",
      PP_END_POV: "Closing the Poverty Gap",
      PP_ZER_HUN: "Food Security",
      PP_GOO_HEA: "Mental Health and Wellbeing",
      PP_QUA_EDU: "Quality Education and learning opportunities for all",
      PP_GEN_EQU: "Gender Equality",
      PP_CLE_WAT: "Clean Water and Sanitation",
      PP_RES_CON: "Sustainable Consumption and Production (Food Wastage, Sustainable Practices)",
      PP_SAF_CIT: "Safe Cities",
      PP_CLI_ACT: "Climate Action and the Environment (eg, Protect the Oceans)",
    };
    const at_options = 
    {
      TALENT_CAP_BUI: "Capability Building including Training and Masterclasses", 
      TALENT_COA_MEN: "Coaching and Mentoring", 
      TALENT_CON_PRO: "Consultancy and Projects", 
    };
    const pa_options = 
    {
      ARR_PRO_BONO: "Pro-Bono", 
      ARR_LOW_BONO: "Low-Bono", 
    };
    const dw_options = 
    [
      "Weekdays", 
      "Weekends", 
    ];
    const tw_options = 
    [
      "Daytime", 
      "Nightime", 
    ];

    const level = this.Get_One_Of_Other_Answer("level", "LEVEL_OTHER", "level_other");
    const p_points = this.Get_Any_Of_Other_Answer(pp_options, "PP_OTHERS");
    const talent = this.Get_Any_Of_Other_Answer(at_options);
    const arrangement = this.Get_Any_Of_Other_Answer(pa_options);

    let res =
    [
      {type: "question", question: "Name", answer: this.name},
      {type: "question", question: "Email", answer: this.email},
      {type: "question", question: "LinkedIn Profile", answer: this.linkedin},
      {type: "question", question: "Mobile", answer: this.mobile},
      {type: "question", question: "How do you describe what you do?", answer: this.describe},
      {type: "one_of", question: "Working Status", options: ws_options, answer: this.work_status},
      {type: "question", question: "City of Residence", answer: this.city},
      {type: "one_of_other", question: "Level", options: lv_options, answer: level},
      {type: "question_num", question: "No. of Years Experience in Branding and Marketing", answer: this.exp_years},
      {type: "question_rate", question: "Expertise: Brand Strategy & Growth", answer: this.EXP_BRA_STR},
      {type: "question_rate", question: "Expertise: Insights and Research", answer: this.EXP_INS_RES},
      {type: "question_rate", question: "Expertise: Brand Identity and Creative Design", answer: this.EXP_BRA_IDE},
      {type: "question_rate", question: "Expertise: Marketing Strategy", answer: this.EXP_MAR_STR},
      {type: "question_rate", question: "Expertise: Comms Strategy", answer: this.EXP_COM_STR},
      {type: "question_rate", question: "Expertise: Media / Channel Planning", answer: this.EXP_CHA_PLA},
      {type: "question_rate", question: "Expertise: Social Media", answer: this.EXP_SOC_MED},
      {type: "question_rate", question: "Expertise: Communications / PR", answer: this.EXP_COM_PR},
      {type: "question_rate", question: "Expertise: Digital Design", answer: this.EXP_DIG_DES},
      {type: "question_rate", question: "Expertise: Website Development", answer: this.EXP_WEB_DEV},
      {type: "question_bool", question: "I have experience in Social Enterprise or Not for Profit Sector", answer: this.EXP_SOC_ENT},
      {type: "question_long", question: "I have done work for (specify max of 5)", answer: this.form_orgs},
      {type: "any_of_other", question: "Passion Points", options: pp_options, max: 3, answer: p_points},
      {type: "any_of", question: "Areas I Could Give my Time and Talent to", options: at_options, answer: talent},
      {type: "question_bool", question: "Are you available now?", answer: this.avail_now},
      {type: "any_of", question: "Preferred Arrangement", options: pa_options, answer: arrangement},
      {type: "question_num", question: "Hours Available Per Month for Pro-Bono Work", answer: this.PRO_BONO_HRS},
      {type: "question_num", question: "Hours Available Per Month for Low-Bono Work", answer: this.LOW_BONO_HRS},
      {type: "one_of", question: "Preferred Days Working", options: dw_options, answer: this.PREF_DAYS},
      {type: "one_of", question: "Preferred Times Working", options: tw_options, answer: this.PREF_TIMES},
      {type: "question_long", question: "Finally, tell us what being kind means to you?", answer: this.form_kind},
      {type: "question", question: "Referred By (if applicable)", answer: this.referred_by},
    ];

    res = res.filter(q => q.answer);
    return res;
  }

  Get_One_Of_Other_Answer(key, key_other, key_other_value)
  {
    let value = this[key];
    if (value == key_other)
    {
      value = this[key_other_value];
    }

    return value;
  }

  Get_Any_Of_Other_Answer(options, key_other)
  {
    const res = [];

    for (const key in options)
    {
      if (this[key])
      {
        res.push(options[key]);
      }
    }
    if (key_other && this[key_other])
    {
      res.push(this[key_other]);
    }

    return Utils.nullIfEmpty(res);
  }
}

export default Form;