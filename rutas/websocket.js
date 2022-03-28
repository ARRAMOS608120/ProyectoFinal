import controllerMensajes from '../controlador/controllerMensajes.js'

import logger from '../winston-module.js'

async function getMensajes() {
    try {
        const mjes = await controllerMensajes.obtenerMensajes();
        return mjes
    } catch (error) {
        return []
    }
}

function filtrarMjes(id, mjes) {
    
    let mjesFiltrados = []
    mjes.forEach(mje => {
        if (mje.userid == id) {
            mjesFiltrados.push(mje)
        }
    });
    return mjesFiltrados
}

export default async function chatHandler(socket, sockets) {

    socket.emit('mensajes', await getMensajes());

    socket.on('mensajeSoloUser', async data => {
        try {
            await controllerMensajes.guardarMensaje(data)
        } catch (error) {
            logger.error(`Error: ${error}`)
        }

        const mjes = await getMensajes();

        sockets.emit('mensajes', filtrarMjes(data.userid, mjes));
    })

    socket.on('mensaje', async data => {
        try {

            await controllerMensajes.guardarMensaje(data)
        } catch (error) {
            logger.error(`Error: ${error}`)
        }

        sockets.emit('mensajes', await getMensajes());
    })
}