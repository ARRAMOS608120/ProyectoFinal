import express from 'express'
const { Router } = express

import controllerMensajes from '../controlador/controllerMensajes.js'

const routerMensajes= new Router()
routerMensajes.use(express.json())
routerMensajes.use(express.urlencoded({ extended: true }))

routerMensajes.get('/' ,controllerMensajes.getMensajes)

export default routerMensajes