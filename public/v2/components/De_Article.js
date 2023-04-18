import Utils from "../lib/Utils.js";

class De_Article extends HTMLElement 
{
  static tname = "de-article";

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
  
  Close()
  {
    this.content_panel.hidden = true;
    this.open_img.hidden = !this.content_panel.hidden;
    this.close_img.hidden = this.content_panel.hidden;
  }

  // Events =======================================================================================

  On_Click_Expand()
  {
    this.content_panel.hidden = !this.content_panel.hidden;
    this.open_img.hidden = !this.content_panel.hidden;
    this.close_img.hidden = this.content_panel.hidden;
  }

  // Rendering ====================================================================================

  Render()
  {
    const content_elems = [...this.childNodes];

    const html = `
      <h4 cid="header">
        <span cid="title_panel"></span>
        <button cid="expand_btn">
          <img cid="open_img" src="/v2/images/plus_blue.svg">
          <img cid="close_img" src="/v2/images/minus_blue.svg" hidden>
        </button>
      </h4>
      <h5 cid="sub_title_panel" hidden></h5>
      <div cid="content_panel" class="content_panel" hidden></div>
    `;
    const elem = Utils.toDocument(html);
    this.replaceChildren(elem);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.content_panel.append(...content_elems);

    const title_text = this.getAttribute("title");
    this.title_panel.append(title_text);

    if (this.hasAttribute("sub-title"))
    {
      const sub_title_text = this.getAttribute("sub-title");
      this.sub_title_panel.append(sub_title_text);
      this.sub_title_panel.hidden = false;
    }

    if (this.hasAttribute("src-open"))
    {
      const url = this.getAttribute("src-open");
      this.open_img.src = url;
    }
    if (this.hasAttribute("src-close"))
    {
      const url = this.getAttribute("src-close");
      this.close_img.src = url;
    }

    this.header.addEventListener("click", this.On_Click_Expand);
  }
}

Utils.Register_Element(De_Article);
export default De_Article;