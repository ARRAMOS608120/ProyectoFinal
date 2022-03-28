import express from 'express'
const { Router } = express

import controllerProductos from '../controlador/controllerProductos.js'
import controllerUsuarios from '../controlador/controllerUsuarios.js'

import jwt from '../jwt.js'

const routerProductos = new Router()
routerProductos.use(express.json())
routerProductos.use(express.urlencoded({ extended: true }))

routerProductos.get('/' ,controllerProductos.listaProd)

routerProductos.get('/:id', controllerProductos.productoSelec)

routerProductos.post('/',jwt.auth, controllerUsuarios.verificarPermisos, controllerProductos.guardarProd)

routerProductos.put('/:id',jwt.auth, controllerUsuarios.verificarPermisos,controllerProductos.actualizarProd)

routerProductos.delete('/:id',jwt.auth, controllerUsuarios.verificarPermisos,controllerProductos.eliminarProd)

export default routerProductos
