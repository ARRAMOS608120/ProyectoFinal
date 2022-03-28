import express from 'express'
const { Router } = express

import controlador from '../controlador/controllerCarrito.js'

import jwt from '../jwt.js'

const routerCarrito = new Router()
routerCarrito.use(express.json())
routerCarrito.use(express.urlencoded({ extended: true }))

routerCarrito.post('/',  jwt.auth, controlador.nuevoCarrito)

routerCarrito.delete('/:id', jwt.auth, controlador.eliminarCarrito)

routerCarrito.get('/:id/productos', controlador.productosCarrito)

routerCarrito.post('/:id/productos', jwt.auth, controlador.guardarProdCarr)

routerCarrito.delete('/:id/productos/:id_prod', jwt.auth, controlador.eliminarProdCarr)

export default routerCarrito