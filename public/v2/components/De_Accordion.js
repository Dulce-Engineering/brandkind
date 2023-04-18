import Utils from "../lib/Utils.js";

class De_Accordion extends HTMLElement 
{
  static tname = "de-accordion";

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

  On_Click_Expand(event)
  {
    const target_article = event.target.closest("de-article");
    for (const child_elem of this.children)
    {
      if (child_elem.tagName == "DE-ARTICLE" && child_elem != target_article)
      {
        child_elem.Close();
      }
    }
  }

  // Rendering ====================================================================================

  Render()
  {
    if (this.hasAttribute("title"))
    {
      const title_text = this.getAttribute("title");
      const title_elem = document.createElement("h3");
      title_elem.innerText = title_text;
      this.prepend(title_elem);
    }

    this.addEventListener("click", this.On_Click_Expand);
  }
}

Utils.Register_Element(De_Accordion);
export default De_Accordion;