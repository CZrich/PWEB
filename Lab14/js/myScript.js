/**
 * Esta función muestra un formulario de login (para fetch)
 * El botón enviar del formulario deberá invocar a la función doLogin
 * Modifica el tag div con id main en el html
 */
function showLogin(){
  let html = "<link rel='stylesheet' href='./css/myStyle.css' />\n"+
    "<form>\n"+
    "<label>Usuario: </label><br><input type='text' id='userID'><br>\n"+
    "<label>Contraseña: </label><br><input type='password' id='pwd'><br>\n"+
    "<br><input class='bot' type='button' value='Login' onclick='doLogin()'>\n";
  document.getElementById('main').innerHTML = html;
}

/**
 * Esta función recolecta los valores ingresados en el formulario
 * y los envía al CGI login.pl
 * La respuesta del CGI es procesada por la función loginResponse
 */
function doLogin(){
  let user = document.getElementById("userID").value;
  let pwd = document.getElementById("pwd").value;
  let url = "cgi-bin/login.pl?user="+user+"&password="+pwd;
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      loginResponse(xml);

    }).catch(error => {
      console.log("Error: ", error);
    });
}
/**
 * Esta función recibe una respuesta en un objeto XML
 * Si la respuesta es correcta, recolecta los datos del objeto XML
 * e inicializa la variable userFullName y userKey (e usuario)
 * termina invocando a la funcion showLoggedIn.
 * Si la respuesta es incorrecta, borra los datos del formulario html
 * indicando que los datos de usuario y contraseña no coinciden.
 */
function loginResponse(xml){
  if(xml.getElementsByTagName("owner")[0] == undefined){
    document.getElementById("userID").value = "";
    document.getElementById("pwd").value = "";
    let textoAux = document.getElementById("main").innerHTML;
    console.log(textoAux);
    document.getElementById("main").innerHTML = textoAux + "<p>Datos del usuario y contraseña no coinciden</p>";
  }
  else{
    userKey = xml.getElementsByTagName("owner")[0].textContent;
    let firstName = xml.getElementsByTagName("firstName")[0].textContent;
    let lastName = xml.getElementsByTagName("lastName")[0].textContent;
    userFullName = firstName + " " + lastName;
    showLoggedIn();
  }
}
/**
 * esta función usa la variable userFullName, para actualizar el
 * tag con id userName en el HTML
 * termina invocando a las functiones showWelcome y showMenuUserLogged
 */
function showLoggedIn(){
  document.getElementById("userName").innerHTML = userFullName;
  showWelcome();
  showMenuUserLogged();
}


/**
 * Esta función crea el formulario para el registro de nuevos usuarios
 * el fomulario se mostrará en tag div con id main.
 * La acción al presionar el bontón de Registrar será invocar a la 
 * función doCreateAccount
 * */
function showCreateAccount(){
  let html = "<link rel='stylesheet' href='./css/myStyle.css' />\n"+ 
      "<form>\n"+
      "<label>Usuario: </label><br><input type='text' id='userID'><br>\n"+
      "<br><label>Contraseña: </label><br><input type='password' id='pwd'><br>\n"+
      "<br><label>Nombre: </label><br><input type='text' id='firstNameUser'><br>\n"+
      "<br><label>Apellido: </label><br><input type='text' id='lastNameUser'><br>\n"+
      "<br><input class='bot' type='button' value='Register' onclick='doCreateAccount()'>\n";
  document.getElementById('main').innerHTML = html;
}

/* Esta función extraerá los datos ingresados en el formulario de
 * registro de nuevos usuarios e invocará al CGI register.pl
 * la respuesta de este CGI será procesada por loginResponse.
 */
function doCreateAccount(){
  let user = document.getElementById("userID").value;
  let pwd = document.getElementById("pwd").value;
  let fnUser = document.getElementById("firstNameUser").value;
  let lnUser = document.getElementById("lastNameUser").value;

  let url = "cgi-bin/register.pl?userName="+user+"&password="+pwd+"&firstName="+fnUser+"&lastName="+lnUser;
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      loginResponse(xml);
    }).catch(error => {
      console.log("Error: ", error);
    });
}

/*
 * Esta función invocará al CGI list.pl usando el nombre de usuario 
 * almacenado en la variable userKey
 * La respuesta del CGI debe ser procesada por showList
 */
var auxiliar;
function doList(){
  let url = "cgi-bin/list.pl?owner="+userKey;
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      showList(xml);
    }).catch(error => {
      console.log("Error: ", error);
    });
}

/**
 * Esta función recibe un objeto XML con la lista de artículos de un usuario
 * y la muestra incluyendo:
 * - Un botón para ver su contenido, que invoca a doView.
 * - Un botón para borrarla, que invoca a doDelete.
 * - Un botón para editarla, que invoca a doEdit.
 * En caso de que lista de páginas esté vacia, deberá mostrar un mensaje
 * indicándolo.
 */
function showList(xml){
  let html = "";
  if(xml.getElementsByTagName("owner")[0] == undefined){
    html = "Ud aun no tiene articulos creados";
  }
  else{
    let titulos = xml.getElementsByTagName("title");
    let tituloArticulo;
    let variablesFuncion;
    for(var i = 0; i<titulos.length; i++){
      tituloArticulo = titulos[i].textContent;
      tituloArticulo = tituloArticulo.toString();
      let user = userKey.toString();
      html += "<link rel='stylesheet' href='./css/myStyle.css' />\n"+
              "<div id='tituloArticulos'> \n"+
              "<h2>"+tituloArticulo+"</h2>"+
              "<input class='bot' type='button' onclick=\"doView( \'"+ user +"\' , \'"+ tituloArticulo+"\' )\" value='View'>\n"+
              "<input class='bot' type='button' onclick=\"doDelete( \'"+ user +"\' , \'"+ tituloArticulo+"\' )\" value='Delete'>\n"+
              "<input class='bot' type='button' onclick=\"doEdit( \'"+ user +"\' , \'"+ tituloArticulo+"\' )\" value='Edit'>\n"+
              "</div>\n";
    }
  }
  document.getElementById('main').innerHTML = html;
}

/**
 * Esta función deberá generar un formulario para la creación de un nuevo
 * artículo, el formulario deberá tener dos botones
 * - Enviar, que invoca a doNew 
 * - Cancelar, que invoca doList
 */
function showNew(){
  let html = "<link rel='stylesheet' href='./css/myStyle.css' />\n"+
            "<center>\n"+
              "<form>\n"+
                "<h3>Título: </h3><input type='text' id='tituloNuevo'><br>\n"+
                "<h3>Contenido: </h3><textarea id='textoNuevo' rows='10' cols='50'></textarea><br><br/>\n"+
                "<input class='bot' type='button' onclick='doNew()' value='Enviar'>\n"+
                "<input class='bot' type='button' onclick='doList()' value='Cancelar'>\n"+
              "</form>\n"+
            "</center>\n";
  document.getElementById('main').innerHTML = html;
}

/*
 * Esta función invocará new.pl para resgitrar un nuevo artículo
 * los datos deberán ser extraidos del propio formulario
 * La acción de respuesta al CGI deberá ser una llamada a la 
 * función responseNew
 */
function doNew(){
  let titulo = document.getElementById('tituloNuevo').value;
  let texto = document.getElementById('textoNuevo').value;
  let code = encodeURIComponent(texto); 
  let url = "cgi-bin/new.pl?title="+titulo+"&text="+code+"&owner="+userKey;
  //console.log(code);
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      auxiliar = xml;
      responseNew(xml);
    }).catch(error => {
      console.log("Error: ", error);
    });
}

/*
 * Esta función obtiene los datos del artículo que se envían como respuesta
 * desde el CGI new.pl y los muestra en el HTML o un mensaje de error si
 * correspondiera
 */
function responseNew(response){
  let html = "";
  if(response.getElementsByTagName("title")[0] == undefined)
    html = "El titulo del articulo ya existe";
  else{
    let titulo = response.getElementsByTagName("title")[0].textContent;
    let texto = response.getElementsByTagName("text")[0].textContent;
    console.log(texto);
    html ="<h2> titulo: " + titulo + " </h2>\n"+
          "<h3>Contenido</h3>\n"+
          "<p>"+ texto +"</p>\n";
  }
  document.getElementById('main').innerHTML = html;
}

/*
 * Esta función invoca al CGI view.pl, la respuesta del CGI debe ser
 * atendida por responseView
 */
function doView(owner, title){
  let url = "cgi-bin/view.pl?title="+title+"&owner="+owner;
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var html = (new window.DOMParser()).parseFromString(data, "text/html");
      responseView(html);
    }).catch(error => {
      console.log("Error: ", error);
    });
}

/*
 * Esta función muestra la respuesta del cgi view.pl en el HTML o 
 * un mensaje de error en caso de algún problema.
 */
function responseView(response){
  let html = response.getElementsByTagName("body")[0].innerHTML;
  document.getElementById('main').innerHTML = html;
}

/*
 * Esta función invoca al CGI delete.pl recibe los datos del artículo a 
 * borrar como argumentos, la respuesta del CGI debe ser atendida por doList
 */
function doDelete(owner, title){
  let url = "cgi-bin/delete.pl?title="+title+"&owner="+owner;
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      doList();
    }).catch(error => {
      console.log("Error: ", error);
    });
}

/*
 * Esta función recibe los datos del articulo a editar e invoca al cgi
 * article.pl la respuesta del CGI es procesada por responseEdit
 */
function doEdit(owner, title){
  let url = "cgi-bin/article.pl?title="+title+"&owner="+owner;
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      responseEdit(xml);
    }).catch(error => {
      console.log("Error: ", error);
    });
}

/*
 * Esta función recibe la respuesta del CGI data.pl y muestra el formulario 
 * de edición con los datos llenos y dos botones:
 * - Actualizar que invoca a doUpdate
 * - Cancelar que invoca a doList
 */
function responseEdit(xml){
  let titulo = xml.getElementsByTagName('title')[0].textContent;
  let texto = xml.getElementsByTagName('text')[0].textContent;
  let html = "<link rel='stylesheet' href='./css/myStyle.css' />\n"+
            "<center>\n"+
              "<form>\n"+
                "<h2>Titulo: </h2><h2 id='titulo'>"+titulo+"</h2><br>\n"+
                "<label>Contenido: </label><br><textarea id='textoActualizado' rows='10' cols='50'>"+texto+"</textarea><br><br/>\n"+
                "<input class='bot' type='button' onclick=\"doUpdate( \'"+ titulo+"\' )\" value='Actualizar'>\n"+
                "<input class='bot' type='button' onclick='doList()' value='Cancelar'>\n"+
              "</form>\n"+
            "</center>\n";
  document.getElementById('main').innerHTML = html;
}
/*
 * Esta función recibe el título del artículo y con la variable userKey y 
 * lo llenado en el formulario, invoca a update.pl
 * La respuesta del CGI debe ser atendida por responseNew
 */
function doUpdate(title){
  let texto = document.getElementById('textoActualizado').value;
  let code = encodeURIComponent(texto); 
  let url = "cgi-bin/update.pl?title="+title+"&text="+code+"&owner="+userKey;
  //console.log(code);
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      auxiliar = xml;
      responseNew(xml);
    }).catch(error => {
      console.log("Error: ", error);
    });
}

