class Search{
  static get(url){
    let xhr = new XMLHttpRequest();
    xhr.open("GET",url);
    xhr.send();
    return new Promise((resolve,reject)=>{
      xhr.onreadystatechange = () =>{
        if(xhr.readyState == 4){
          // se logró ejecutar bien la petición
          if(xhr.status == 200) return resolve(JSON.parse(xhr.responseText))
          // hubo problemas
          reject(xhr.status);
        }
      }
    });
  }
}

class Autocomplete{
  constructor(input_selector,base_url){
    // el bind del search es para el setTimeout, dado que se le pasa el search con el this de la clase
    this.search = this.search.bind(this);
    this.input = document.querySelector(input_selector);
    this.url = base_url;
    this.value = "";
    this.interval = null;
    this.buildDataList();
    this.bindEvents();
  }

  bindEvents(){
    this.input.addEventListener("keyup",()=>{
      // si el valor del input es el mismo que el valor de la propiedad del objeto, por tanto el valor no se ha modificado
      // si se teclea alt u otra tecla que no modifique la palabra, no se hace el search
      if (this.input.value == this.value || this.input.value.length < 3) return
      // se limpia el intervalo para que solo quede el ùltimo intervalo que ejecuta la funcion search, sino por cada palabra ejecutarìa un interval con un search
      if(this.interval) window.clearInterval(this.interval);
      this.value = this.input.value;


      this.interval = window.setTimeout(this.search,500);
      // this.search();
    })
  }

  buildDataList(){
    // el id del datalist debe el mismo que el atributo list del input searcher
    this.dataList = document.createElement("datalist");
    this.dataList.id = "datalist-autocomplete";
    document.querySelector("body").appendChild(this.dataList);
    this.input.setAttribute("list","datalist-autocomplete")
  }

  search(){
    Search.get(this.url+this.value)
          .then(results => this.build(results));
  }

  build(response){
    // si tenia algo el dataList, lo borra
    this.dataList.innerHTML = "";
    response.items.forEach(item => {
      let optionEl = document.createElement("option");
      // el objeto volumenInfo es de la APi
      optionEl.value = item.volumeInfo.title;
      if(item.volumeInfo.subtitle)
        optionEl.innerHTML = item.volumeInfo.title;

      this.dataList.appendChild(optionEl);
    });
  }
}

(function(){
  const GoogleBooksApiURL = "https://www.googleapis.com/books/v1/volumes?q=";
  let autocomplete = new Autocomplete("#searcher",GoogleBooksApiURL);
})()
