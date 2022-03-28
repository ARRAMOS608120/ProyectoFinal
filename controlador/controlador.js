 import { listarUser, whatsapp,createSendMailEthereal,client} from '../negocio/funciones.js'

import logger from '../winston-module.js'

import { productosDao } from '../persistencia/daos/index.js'
import { carritosDao } from '../persistencia/daos/index.js'

const sendMail = createSendMailEthereal()
const cuentaDePrueba = '"hailie.murphy14@ethereal.email'
 
  function noImplement(req, res, next) {
    const rutaincorrecta= {error:-2, descripcion: `Ruta ${req.url} metodo ${req.method} no implementada`}
    logger.warn(`Ruta ${req.method} ${req.url} no implementada`)
    res.send(rutaincorrecta)
    next();
  }


async function datos (req, res) {
  let usuarios = await listarUser()
  const usuario = usuarios.find(usua => usua.username == req.user.nombre)
  if (!usuario) {
      return res.status(404).json({ error: 'usuario no encontrado' });
  }
  const products= await productosDao.getAll()
  const carritos = await carritosDao.getAll()
  const resultado = carritos.find( carrito => carrito.username === req.user.username);
  if (resultado==undefined){
    const carritoNuevo = {username: req.user.username}
    const prueba = await carritosDao.save(carritoNuevo)
    const productoSel =await carritosDao.getByID(prueba)
    const carritofinal= JSON.stringify (productoSel.productos)
  if (products.length==0){
    res.json({
      datos: usuario,
      listadoProd: products,
      listExists: false,
      carrito:  carritofinal
  })
} else {res.json({
  datos: usuario,
  listadoProd: products,
  listExists: true,
  carrito:  carritofinal
})}
}
else {
  const carritofinal= JSON.stringify (resultado.productos)
  if (products.length==0){
    res.json({
      datos: usuario,
      listadoProd: products,
      listExists: false,
      carrito:  carritofinal
  })
} else {res.json({
  datos: usuario,
  listadoProd: products,
  listExists: true,
  carrito:  carritofinal
})}
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
    res.json ( {email: req.user.username, direccion: req.user.direccion,nombre: req.user.nombre,edad: req.user.edad,numero: req.user.numero,foto: req.user.foto,  carrito: req.carritofinal} )
  }

export default  {
    noImplement,
    finalizarPed,
    datos
}