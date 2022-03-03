 import {listarUser, guardarUser, validarPassword, whatsapp,createSendMailEthereal,client} from '../negocio/funciones.js'

import logger from '../winston-module.js'

import { productosDao } from '../persistencia/daos/index.js'
import { carritosDao } from '../persistencia/daos/index.js'

const administrador= true;

import passport from 'passport'
import { Strategy as LocalStrategy} from 'passport-local'

const sendMail = createSendMailEthereal()
const cuentaDePrueba = '"hailie.murphy14@ethereal.email'
const asunto = 'Nuevo registro'


/* ------------------ PASSPORT -------------------- */


passport.use('register', new LocalStrategy({
    passReqToCallback: true
  }, async (req, username, password, done) => {

  const { direccion } = req.body
  const { nombre } = req.body
  const { edad } = req.body
  const { numero } = req.body
  const { foto } = req.body
  
  let usuarios = await listarUser()
  const usuario = usuarios.find(usuario => usuario.username == username)
  
    if (usuario) {
      return done((null, false))
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
   const info = await sendMail({
      to: cuentaDePrueba,
      subject: asunto,
      html: JSON.stringify(user)
    })
    console.log(info)
    console.log('usuario agregado!')}catch (error) {
      logger.error(`Error: ${error}`);
  }
  
    return done(null, user)
  }));
  


passport.use('login', new LocalStrategy(async (username, password, done) => {
 
  let usuarios = await listarUser()
  const user = usuarios.find(usuario => usuario.username == username)
  

  if (!user) {
    return done(null, false)
  }

  if (validarPassword(user.password, password)){
    return done(null, false)
  }

  return done(null, user);
}));

  passport.serializeUser(function (user, done) {
    done(null, user.username);
  });
  
  passport.deserializeUser(async function (username, done) {
    let usuarios = await listarUser()
    const usuario = usuarios.find(usuario => usuario.username == username)
    done(null, usuario);
  });
  
   // REGISTER

  function registro (req, res){
    logger.info(`Ruta ${req.method} ${req.url} funcionando correctamente`)
    res.sendFile('C:/Users/ArielMatias/Curso Backend MERN/ProyectoFinal/views/register.html')
  }

  function errorRegistro (req, res) {
    logger.warn(`Falla ${req.method} ${req.url} el registrarse`)
    res.render('register-error');
  }

  // LOGIN
  function login (req, res) {
    logger.info(`Ruta ${req.method} ${req.url} funcionando correctamente`)
    res.sendFile('C:/Users/ArielMatias/Curso Backend MERN/ProyectoFinal/views/login.html')
  }

  function errorLogin (req, res) {
    logger.warn(`Falla ${req.method} ${req.url} al loguearse`)
    res.render('login-error');
  }

/* --------- LOGOUT ---------- */
  function logout (req, res) {
    logger.info(`Ruta ${req.method} ${req.url} funcionando correctamente`)
    const nombre = req.user.username
    if (nombre) {
        req.session.destroy(err => {
            if (!err) {
                res.render('C:/Users/ArielMatias/Curso Backend MERN/ProyectoFinal/views/logout.hbs', { nombre })
                req.logout();
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/')
    }
  }

  function noImplement(req, res, next) {
    const rutaincorrecta= {error:-2, descripcion: `Ruta ${req.url} metodo ${req.method} no implementada`}
    logger.warn(`Ruta ${req.method} ${req.url} no implementada`)
    res.send(rutaincorrecta)
    next();
  }

/* ------------------------------------------------------ */
/* Productos */

async function listaProd (req, res) {
    const products= await productosDao.getAll()
    if (products.length==0){
        res.render('mainformulario', { listadoProd: products, listExists: false })
    } else {res.render('mainformulario', { listadoProd: products, listExists: true })}
}

async function productoSelec (req, res) {
    const productoSel=await productosDao.getByID(req.params.id)
    res.json(productoSel)
}

async function guardarProd (req, res) {
    if(administrador!=false){
    const prueba = await productosDao.save(req.body)
    res.redirect('/api/productos')}else{ res.json({error: -1, descripcion: 'ruta api/productos metodo POST no autorizada'})}
}

async function actualizarProd (req, res) {
    if(administrador!=false){
        const producto = req.body
        await productosDao.actualizar(producto,req.params.id)
        const obtener = await productosDao.getByID(req.params.id)
        res.json(obtener)
    }else{ res.json({error: -1, descripcion: 'ruta api/productos/:id metodo PUT no autorizada'}  )}
 
}

async function eliminarProd (req, res) {
    if(administrador!=false){
        const borrado = await productosDao.deleteById(req.params.id)
        res.json(borrado)}else{res.json({error: -1, descripcion: 'ruta api/productos/:id metodo DELETE no autorizada'}  )} 
}

/* ------------------------------------------------------ */

/* Carrito*/

async function nuevoCarrito (req, res) {
    const carritoNuevo = {}
    const prueba = await carritosDao.save(carritoNuevo)
    res.json(prueba)
}

async function eliminarCarrito (req, res) {
    const borrado = await carritosDao.deleteById(req.params.id)
    res.json(borrado)
}

async function productosCarrito (req, res) {
    const productoSel=await carritosDao.getByID(req.params.id)
    res.json(productoSel.productos)  
}

async function  guardarProdCarr (req, res)  {
    const prueba = await carritosDao.saveProducto(req.params.id,req.body)
    res.json(prueba)
}

async function eliminarProdCarr (req, res) {
    const borrado = await carritosDao.deleteByIdFull(req.params.id,req.params.id_prod)
    res.json(borrado)
}

async function inicio (req, res)  {
    const carritos = await carritosDao.getAll()
    const resultado = carritos.find( carrito => carrito.username === req.user.username);
    const products= await productosDao.getAll()
    if (resultado==undefined){
        const carritoNuevo = {username: req.user.username}
        const prueba = await carritosDao.save(carritoNuevo)
        const productoSel =await carritosDao.getByID(prueba.id)
        const carritofinal= JSON.stringify (productoSel.productos)
        if (products.length==0){
            res.render('index', { listadoProd: products, listExists: false, email: req.user.username, direccion: req.user.direccion,nombre: req.user.nombre,edad: req.user.edad,numero: req.user.numero,foto: req.user.foto, carrito:  carritofinal} )
        } else {res.render('index', { listadoProd: products, listExists: true, email: req.user.username, direccion: req.user.direccion,nombre: req.user.nombre,edad: req.user.edad,numero: req.user.numero,foto: req.user.foto, carrito:  carritofinal })}
    }
    else{
        const carritofinal= JSON.stringify (resultado.productos)
        if (products.length==0){
            res.render('index', { listadoProd: products, listExists: false, email: req.user.username, direccion: req.user.direccion,nombre: req.user.nombre,edad: req.user.edad,numero: req.user.numero,foto: req.user.foto,  carrito: carritofinal} )
        } else {res.render('index', { listadoProd: products, listExists: true, email: req.user.username, direccion: req.user.direccion,nombre: req.user.nombre,edad: req.user.edad,numero: req.user.numero,foto: req.user.foto, carrito: carritofinal })}
    }  
 }

 const from = '+16614909501'
 const body = 'Su pedido ha sido recibido y se encuentra en proceso'

 async function finalizarPed (req, res) {
    logger.info(`Ruta ${req.method} ${req.url} funcionando correctamente`)
    const asuntopedido=  `Nuevo pedido de ${req.user.nombre}  ${req.user.username}`
    const infopedido = await sendMail({
      to: cuentaDePrueba,
      subject: asuntopedido,
      html: JSON.stringify(req.carritofinal)
    })
    console.log(infopedido)
    const pedidowhatsapp=  `Nuevo pedido de ${req.user.nombre}  ${req.user.username}  ${JSON.stringify(req.carritofinal)}`
    whatsapp(pedidowhatsapp)
    const to = req.user.numero
    const infomensaje = await client.messages.create({ body, from, to })
    console.log(infomensaje)
    res.render ( 'C:/Users/ArielMatias/Curso Backend MERN/ProyectoFinal/views/pedido-finalizado.hbs', {email: req.user.username, direccion: req.user.direccion,nombre: req.user.nombre,edad: req.user.edad,numero: req.user.numero,foto: req.user.foto,  carrito: req.carritofinal} )
  }

export default  {
    noImplement,
    registro,
    errorRegistro,
    login,
    errorLogin,
    logout,
    listaProd,
    productoSelec,
    guardarProd,
    actualizarProd,
    eliminarProd,
    nuevoCarrito,
    eliminarCarrito,
    productosCarrito,
    guardarProdCarr,
    eliminarProdCarr,
    inicio,
    finalizarPed
}