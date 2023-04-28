import Utils from "../lib/Utils.js";

class De_Menu extends HTMLElement 
{
  static tname = "de-menu";

  // Lifecycle ====================================================================================

  constructor() 
  {
    super();

    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // Fields =======================================================================================

  // API ==========================================================================================
  
  // Events =======================================================================================

  On_Click_Open_Btn()
  {
    this.menu.showModal();
  }

  On_Click_Close_Btn()
  {
    this.menu.close();
  }

  // Rendering ====================================================================================

  Render()
  {
    const html = `
      <div cid="desktop_menu" class="desktop-menu">
      </div>

      <img cid="open_btn" class="open-btn">
      <dialog cid="menu">
        <div class="content">
          <header>
            <img cid="title_img">
            <img cid="close_btn">
          </header>
          <main cid="menu_content">
            <slot name="menu">
          </main>
          <footer>
            <slot name="footer">
          </footer>
        </div>
      </dialog>
    `;
    const elem = Utils.toDocument(html, this);
    this.replaceChildren(elem);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.title_img.src = this.getAttribute("title-src");

    this.close_btn.src = this.getAttribute("close-src");
    
    this.menu.addEventListener("click", this.On_Click_Close_Btn);

    this.open_btn.src = this.getAttribute("open-src");
    this.open_btn.addEventListener("click", this.On_Click_Open_Btn);

    for (const menu_elem of this.menu_content.children)
    {
      const new_elem = menu_elem.cloneNode(true);
      this.desktop_menu.append(new_elem);
    }

    this.hidden = false;
  }
}

Utils.Register_Element(De_Menu);
export default De_Menu;