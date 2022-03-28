import {listarUser, guardarUser,createSendMailEthereal, isAdmin} from '../negocio/funciones.js'
import logger from '../winston-module.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const __dirname2 = dirname(__dirname)

const sendMail = createSendMailEthereal()
const asunto = 'Nuevo registro'
const cuentaDePrueba = '"hailie.murphy14@ethereal.email'

import jwt from '../jwt.js'

function registro (req, res){
    logger.info(`Ruta ${req.method} ${req.url} funcionando correctamente`)
    res.sendFile(__dirname2 + '/views/register.html')
  }

function errorRegistro (req, res) {
    logger.warn(`Falla ${req.method} ${req.url} el registrarse`)
    res.sendFile(__dirname2 + '/views/register-error.html')
  }


 async function register (req, res) {
    const { username } = req.body
    const { password } = req.body
    const { direccion } = req.body
    const { nombre } = req.body
    const { edad } = req.body
    const { numero } = req.body
    const { foto } = req.body
    let usuarios = await listarUser()
    const usuario = usuarios.find(usuario => usuario.username == username)
    if (usuario) {
        return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }

    const user = {
      username,
      password,
      nombre,
      direccion,
      edad,
      numero,
      foto,
    }
    
    try{
      guardarUser(username,password,nombre,direccion,edad,numero,foto)
      const access_token = jwt.generateAuthToken(nombre);
      res.json({ access_token });
      const info = await sendMail({
        to: cuentaDePrueba,
        subject: asunto,
        html: JSON.stringify(user)
      })
      console.log(info)
      console.log('usuario agregado!')}catch (error) {
        logger.error(`Error: ${error}`);
    }
}

  // LOGIN
  function login (req, res) {
    logger.info(`Ruta ${req.method} ${req.url} funcionando correctamente`)
    res.sendFile(__dirname2 + '/views/login.html')
  }

  function errorLogin (req, res) {
    logger.warn(`Falla ${req.method} ${req.url} al loguearse`)
    res.sendFile(__dirname2 + '/views/login-error.html')
  }

  async function loginpost (req, res) {
    const { username, password } = req.body
    let usuarios = await listarUser()
    const usuario = usuarios.find(usuario => usuario.username == username)
    if (!usuario) {
        return res.json({ error: 'usuario no registrado' });
    }
  
    const credencialesOk = usuario.username == username && usuario.password == password
    if (!credencialesOk) {
        return res.json({ error: 'credenciales invalidas' });
    }
  
    const access_token = jwt.generateAuthToken(username);
    res.json({
        username,
        access_token
    });
  }


  const verificarPermisos =  (req, res, next) => {
    try{
        if (isAdmin(req.user)) {
            next();
        } else {
          const usuarioincorrecto= {error:-3, descripcion: `Ruta ${req.url} metodo ${req.method} autorizada solo para usuarios adminsitradores`}
          logger.warn(`Ruta ${req.method} ${req.url} no autorizado para el usuario.`)
          res.send(usuarioincorrecto)
          next();
        }
    }catch (error) {
      logger.error(`Error: ${error}`);
    }
}

  export default  {
    registro,
    login,
    register,
    errorRegistro,
    loginpost,
    errorLogin,
    verificarPermisos
}