
class Carousel extends HTMLElement 
{
  static tname = "de-carousel";

  // Lifecycle ====================================================================================

  constructor() 
  {
    super();
    //this.attachShadow({mode: 'open'});
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

  //static observedAttributes = ["title"];
  attributeChangedCallback(attr_name, old_value, new_value)
  {
  }

  // Fields =======================================================================================

  // API ==========================================================================================
  
  // Events =======================================================================================

  // Rendering ====================================================================================

  Animate()
  {
    const imgs = this.children;
    let curr_img = 0;
    setTimeout(Show_Next_Img, 5000);

    function Show_Next_Img()
    {
      imgs[curr_img].style.opacity = 0;
      curr_img = (curr_img + 1) % imgs.length;
      imgs[curr_img].style.opacity = 1;
      setTimeout(Show_Next_Img, 10000);
    }
  }

  Render()
  {
    this.Animate();
  }
}

export default Carousel;