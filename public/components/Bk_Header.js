import Utils from "../lib/Utils.js";
import 'https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.js'

class Bk_Header extends HTMLElement 
{
  static name = "bk-header";

  // Lifecycle ====================================================================================

  constructor() 
  {
    super();

    this.On_Auth_State_Changed = this.On_Auth_State_Changed.bind(this);
    this.On_Sign_In_Clicked = this.On_Sign_In_Clicked.bind(this);
    this.On_Sign_Out_Clicked = this.On_Sign_Out_Clicked.bind(this);
    this.On_Acc_Clicked = this.On_Acc_Clicked.bind(this);
  }

  connectedCallback()
  {
    this.Render();
  }

  disconnectedCallback()
  {
  }

  adoptedCallback()
  {
  }

  static observedAttributes = ["title"];
  attributeChangedCallback(attr_name, old_value, new_value)
  {
    if (attr_name == "title")
    {
      this.init_title = new_value;
      this.title = new_value;
    }
  }

  // Fields =======================================================================================

  set title(value)
  {
    if (value)
    {
      const title_span = this.querySelector("#title_span");
      if (title_span)
      {
        title_span.innerText = value;
      }
    }
  }

  set fb_ctx(value)
  {
    this.Init(value);
  }

  // API ==========================================================================================

  Init(ctx)
  {
    this.ctx = ctx;
    this.ui = new firebaseui.auth.AuthUI(this.ctx.fb_auth);
    this.ctx.fb_auth.onAuthStateChanged(this.On_Auth_State_Changed);
  }

  Sign_In(signin_fn)
  {
    let signInSuccessWithAuthResult = (auth_result, redirect_url) => false;
    if (signin_fn)
    {
      signInSuccessWithAuthResult = function (auth_result, redirect_url)
      {
        const display_name = auth_result.user.displayName;
        this.Render_Signed_In(display_name);
      };
      signInSuccessWithAuthResult = signInSuccessWithAuthResult.bind(this);
    }

    const auth_ui_config = 
    {
      callbacks:
      {
        signInSuccessWithAuthResult,
        uiShown: this.On_User_Is_Signing_In
      },
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
    };

    let auth_div = document.getElementById("firebaseui-auth-container");
    if (!auth_div)
    {
      auth_div = document.createElement("div");
      auth_div.id = "firebaseui-auth-container";
      document.body.append(auth_div);
    }
    this.ui.start('#firebaseui-auth-container', auth_ui_config);
  }
  
  // Events =======================================================================================

  On_Auth_State_Changed(user)
  {
    if (user)
    {
      this.On_User_Has_Signed_In(user);
    }
    else
    {
      this.On_User_Has_Signed_Out();
    }
  }

  On_User_Has_Signed_In(user)
  {
    this.Render_Signed_In(user.displayName);
  }

  On_User_Has_Signed_Out()
  {
    Utils.Show("signin_info", this);
    Utils.Hide("user_info", this);
  }

  On_Sign_In_Clicked()
  {
    this.Sign_In();
  }

  On_Sign_Up_Clicked()
  {
    window.open("user.html", "_self");
  }

  async On_Sign_Out_Clicked()
  {
    if (this.ctx)
    {
      await this.ctx.fb_auth.signOut();
    }
  }

  On_User_Is_Signing_In() 
  {
    Utils.Hide("signin_info", this);
    Utils.Hide("user_info", this);
  }

  On_Acc_Clicked()
  {
    if (this.ctx)
    {
      const uid = this.ctx.fb_auth.currentUser.uid;
      window.open("user.html?uid=" + uid, "_self");
    }
  }

  On_Main_Menu_Clicked(event)
  {
    if (event.detail.title == "Home")
    {
      window.open("/admin/index.html", "self");
    }
    if (event.detail.title == "Registration Forms")
    {
      window.open("/admin/reg_forms.html", "self");
    }
  }

  // Rendering ====================================================================================

  Render_Signed_In(display_name)
  {
    const elem = this.querySelector("#user_name");
    elem.innerText = display_name;

    Utils.Hide("signin_info", this);
    Utils.Show("user_info", this);
  }

  Render()
  {
    const html =
      `<menu-buddy-btn id="main_menu" btn-style-src="/components/menu-btn.css" show-pos="bottom">
        <img src="/images/menu_white_24dp.svg">
      </menu-buddy-btn>
      <span id="title" class="bk-header-title">
        <a href="/"><span>BranKind</span></a> - <span id="title_span"></span>
      </span>
      <div id="firebaseui-auth-container"></div>
      <div id="btn_bar" class="bk-header-action">
        <div id="user_info" class="bk-header-user">
          <span></span>
          <span id="user_name"></span>
          <button id="acc_btn">Account</button>
          <button id="sign_out_btn">Sign Out</button>
        </div>
        <div id="signin_info" class="bk-header-signin">
          <button id="sign_up_btn">Sign Up</button>
          <button id="sign_in_btn">Sign In</button>
        </div>
      </div>`;
    this.innerHTML = html;
    this.classList.add("bk-header");

    const m =
    {
      title: "Galaxies",
      class_name: "menu",
      options: 
      [
        {
          title: "Andromeda",
          class_name: "menu",
          options: 
          [
            {
              title: "Sirius",
              class_name: "menu",
              options: 
              [
                {title: "Mercury"},
                {title: "Venus"},
                {title: "Mars"},
                {title: "Jupiter"}
              ]
            },
            {title: "Rigel"}, 
            {title: "Vega"},
            {title: "Antares"}
          ]
        },
        {title: "Milky Way"}, 
        {title: "Cygnus A"}
      ]
    };
    /*const m =
    {
      title: "BrandKind",
      class_name: "menu",
      options: 
      [
        {title: "Home"}, 
        {title: "Registration Forms"}
      ]
    };*/

    const main_menu = document.getElementById("main_menu");
    main_menu.menu = m;
    main_menu.menu_buddy.addEventListener("clickoption", this.On_Main_Menu_Clicked);

    const sign_in_btn = document.getElementById("sign_in_btn");
    sign_in_btn.addEventListener("click", this.On_Sign_In_Clicked);

    const sign_up_btn = document.getElementById("sign_up_btn");
    sign_up_btn.addEventListener("click", this.On_Sign_Up_Clicked);

    const sign_out_btn = document.getElementById("sign_out_btn");
    sign_out_btn.addEventListener("click", this.On_Sign_Out_Clicked);

    const acc_btn = this.querySelector("#acc_btn");
    acc_btn.addEventListener("click", this.On_Acc_Clicked);

    this.title = this.init_title;
  }
}

export default Bk_Header;