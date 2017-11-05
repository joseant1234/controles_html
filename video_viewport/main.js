class ViewPort{
    static visible(el){
      // altura con height y la distancia con top
      let coords = el.getBoundingClientRect();
      // altura de todo el documento
      let windowHeight = document.documentElement.clientHeight;

      // validar si el elemento esta dentro del viewport
      return (coords.top < windowHeight && (coords.top * -1) < windowHeight);
    }
}

class PlayOnViewPort{
  constructor(video_selector){
    this.video = document.querySelector(video_selector);
    this.evaluate = this.evaluate.bind(this);
    this.bindEvents();
  }

  bindEvents(){
    window.addEventListener('scroll',this.evaluate)
  }

  evaluate(){
    if(ViewPort.visible(this.video)){
      this.video.play();
    }else{
      this.video.pause();
    }
  }

}

(function(){
  new PlayOnViewPort("video");
})()
