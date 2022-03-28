(async () => {
    try {
      const respuesta = await fetch('/api/datos', {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
  
      if (respuesta.status != 200) {
        return location.href = '/noAutorizado.html'
      }
  
      const data = await respuesta.json();
  
      const respuesta2 = await fetch('/plantillas/mainformulario.hbs');
      const plantilla = await respuesta2.text()
      const templateFun = Handlebars.compile(plantilla)
      const html = templateFun({ datos: data.datos, listadoProd: data.listadoProd, listExists: data.listExists, carritoFinal: data.carritoFinal})
  
      document.querySelector('main').innerHTML = html
  
    } catch (error) {
      document.querySelector('main').innerHTML = error
    }
  })()
  
  function logout() {
    localStorage.removeItem('access_token');
    location.href = '/login'
  }

const socket = io();

function enviarMensaje() {
    const id = document.getElementById('email').value
    const inputMje = document.getElementById('mje');
    
    const userOnlyFlag = document.getElementById('onlyOwner').checked
    if (userOnlyFlag == true) {
        socket.emit("mensajeSoloUser",{ userid: id, mensaje: inputMje.value})
    } else {
        socket.emit("mensaje", { userid: id, mensaje: inputMje.value})
    }

}

socket.on("mensajes", actualizarMensajes);

async function actualizarMensajes(data) {

  const recursoRemoto = await fetch('plantillas/mensajes.hbs')

  const textoPlantilla = await recursoRemoto.text()

  const functionTemplate = Handlebars.compile(textoPlantilla)

  const html = functionTemplate({data})

  document.getElementById('chat').innerHTML = html
}