import { mensajesDao } from '../persistencia/daos/index.js'
import MensajeFactory from '../persistencia/Factories/Mensaje.factory.js';


import logger from '../winston-module.js'

const guardarMensaje = async function (data) {

    const mensaje = MensajeFactory.crearMensaje(data);   
    try {
        await mensajesDao.save(mensaje);
    } catch (error) {
        logger.error(`Error: ${error}`)
    }
}

const obtenerMensajes = async function () {
    return mensajesDao.getAll();
}

const getMensajes = (req, res, next) => {
  res.render('partials/chat')
}

export default  {
    guardarMensaje,
    obtenerMensajes,
    getMensajes
}