import express from 'express'
const { Router } = express


import controlador from '../controlador/controlador.js'
import controllerUsuarios from '../controlador/controllerUsuarios.js'


  
const router = new Router()

import jwt from '../jwt.js'

/* --------------------- ROUTES --------------------------- */
  
 // REGISTER
 router.get('/register', controllerUsuarios.registro)
    
 router.post('/register', controllerUsuarios.register)

 router.get('/register-error', controllerUsuarios.errorRegistro)
  
// LOGIN
router.get('/login', controllerUsuarios.login )

router.post('/login', controllerUsuarios.loginpost)

router.get('/login-error', controllerUsuarios.errorLogin )

    /* --------- INICIO ---------- */
router.get('/api/datos',jwt.auth,controlador.datos)
router.get('/pedido-finalizado',jwt.auth, controlador.finalizarPed)
router.get('*', controlador.noImplement);

export default router 
