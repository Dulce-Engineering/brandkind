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
  
  Is_Closed()
  {
    return this.content_panel.style.maxHeight == "";
  }

  Close()
  {
    this.content_panel.style.maxHeight = null;
    this.open_img.hidden = false;
    this.close_img.hidden = true;
  }

  Open()
  {
    this.content_panel.style.maxHeight = this.content_panel.scrollHeight + "px";
    this.open_img.hidden = true;
    this.close_img.hidden = false;
  }

  // Events =======================================================================================

  On_Click_Expand()
  {
    if (this.Is_Closed())
    {
      this.Open();
    }
    else
    {
      this.Close();
    }
  }

  // Rendering ====================================================================================

  Render()
  {
    const content_elems = [...this.childNodes];

    const close_src = this.getAttribute("close-src") || "/v2/images/minus_white.svg";
    const open_src = this.getAttribute("open-src") || "/v2/images/plus_white.svg";

    const html = `
      <h4 cid="header">
        <span cid="title_panel"></span>
        <button cid="expand_btn">
          <img cid="open_img" src="${open_src}">
          <img cid="close_img" src="${close_src}" hidden>
        </button>
      </h4>
      <h5 cid="sub_title_panel" hidden></h5>
      <div cid="content_panel" class="content_panel"></div>
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