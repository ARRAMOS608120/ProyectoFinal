import express from 'express'
const { Router } = express

import compression from 'compression'
import controllerInfo from '../controlador/controllerInfo.js'

const routerInfo= new Router()
routerInfo.use(express.json())
routerInfo.use(express.urlencoded({ extended: true }))

routerInfo.get('/' , controllerInfo)

routerInfo.get('/zip' ,compression(), controllerInfo)

export default routerInfo