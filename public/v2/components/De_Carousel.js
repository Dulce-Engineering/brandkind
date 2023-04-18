import Utils from "../lib/Utils.js";

class De_Carousel extends HTMLElement 
{
  static tname = "de-carousel";

  // Lifecycle ====================================================================================

  constructor() 
  {
    super();
    this.curr_img = 0;
    this.imgs = null;
    this.timeout_id = null;

    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // Fields =======================================================================================

  // API ==========================================================================================
  
  // Events =======================================================================================

  On_Show_Next_Img()
  {
    this.curr_img = (this.curr_img + 1) % this.imgs.length;
    this.Show_Current_Img();
  }

  On_Show_Prev_Img()
  {
    this.curr_img = (this.curr_img - 1) % this.imgs.length;
    this.Show_Current_Img();
  }

  On_Click_Dot(event)
  {
    const img = event.target.img;
    this.curr_img = this.imgs.indexOf(img);
    this.Show_Current_Img();
  }

  // Rendering ====================================================================================

  Show_Current_Img()
  {
    clearTimeout(this.timeout_id);

    const img = this.imgs[this.curr_img];
    this.Set_Dot(img);
    this.Show_Img(img);

    this.timeout_id = setTimeout(this.On_Show_Next_Img, 10000);
  }

  Hide_Imgs()
  {
    for (const img of this.imgs)
    {
      img.style.opacity = 0;
    }
  }

  Show_Img(img)
  {
    this.Hide_Imgs();
    this.curr_img = this.imgs.indexOf(img);
    this.imgs[this.curr_img].style.opacity = 1;
  }

  Clear_All_Dots()
  {
    for (const img of this.imgs)
    {
      this.Clear_Dot(img);
    }
  }

  Clear_Dot(img)
  {
    if (this.hasAttribute("show-remote"))
    {
      img.dot_grey.hidden = false;
      img.dot_blue.hidden = true;
    }
  }

  Set_Dot(img)
  {
    if (this.hasAttribute("show-remote"))
    {
      this.Clear_All_Dots();
      img.dot_grey.hidden = true;
      img.dot_blue.hidden = false;

      const idx = this.imgs.indexOf(img);
      if (idx == 0)
      {
        this.prev_btn.hidden = true;
        this.prev_off_btn.hidden = false;
        this.next_off_btn.hidden = true;
        this.next_btn.hidden = false;
      }
      else if (idx == this.imgs.length-1)
      {
        this.prev_btn.hidden = false;
        this.prev_off_btn.hidden = true;
        this.next_off_btn.hidden = false;
        this.next_btn.hidden = true;
      }
      else
      {
        this.prev_btn.hidden = false;
        this.prev_off_btn.hidden = true;
        this.next_off_btn.hidden = true;
        this.next_btn.hidden = false;
      }
    }
  }

  Animate()
  {
    this.Set_Dot(this.imgs[0]);
    this.timeout_id = setTimeout(this.On_Show_Next_Img, 5000);
  }

  Render()
  {
    this.imgs = [...this.children];

    if (this.hasAttribute("show-remote"))
    {
      const html = `
        <div cid="imgs_panel" class="content_panel"></div>
        <div class="remote_panel">
          <img cid="prev_btn" class="prev_btn" src="/v2/images/arrow_left_blue.svg">
          <img cid="prev_off_btn" class="prev_btn" src="/v2/images/arrow_left_grey.svg">
          <img cid="next_off_btn" class="next_btn" src="/v2/images/arrow_right_grey.svg">
          <img cid="next_btn" class="next_btn" src="/v2/images/arrow_right_blue.svg">
        </div>
      `;
      const elem = Utils.toDocument(html);
      this.replaceChildren(elem);
      Utils.Set_Id_Shortcuts(this, this, "cid");

      this.prev_btn.addEventListener("click", this.On_Show_Prev_Img);
      this.next_btn.addEventListener("click", this.On_Show_Next_Img);

      for (const img of this.imgs)
      {
        img.dot_grey = document.createElement("img");
        img.dot_grey.src = "/v2/images/circle_grey.svg";
        img.dot_grey.img = img;
        img.dot_grey.classList.add("dot");
        img.dot_grey.addEventListener("click", this.On_Click_Dot);

        img.dot_blue = document.createElement("img");
        img.dot_blue.src = "/v2/images/circle_blue.svg";
        img.dot_blue.hidden = true;
        img.dot_blue.classList.add("dot");

        this.next_off_btn.before(img.dot_grey, img.dot_blue);
      }

      this.imgs_panel.append(...this.imgs);
      this.Animate();
    }
    else
    {
      const html = `
        <div cid="imgs_panel" class="content_panel"></div>
      `;
      const elem = Utils.toDocument(html);
      this.replaceChildren(elem);
      Utils.Set_Id_Shortcuts(this, this, "cid");

      this.imgs_panel.append(...this.imgs);
      this.Animate();
    }

  }
}

Utils.Register_Element(De_Carousel);
export default De_Carousel;