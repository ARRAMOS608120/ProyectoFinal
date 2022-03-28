const formRegister = document.getElementById("formRegister");
formRegister.addEventListener('submit', async e => {

  e.preventDefault()

  const datos = {
    username: formRegister[0].value,
    password: formRegister[1].value,
    nombre: formRegister[2].value,
    direccion: formRegister[3].value,
    edad: formRegister[4].value,
    numero: formRegister[5].value,
    foto: formRegister[6].value,
  }

  const respuesta = await fetch('/register', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  });

  const content = await respuesta.json();

  const { access_token } = content;

  if (access_token) {
    localStorage.setItem("access_token", access_token);
    location.href = '/'
  } else {
    location.href = '/register-error'
  }
})