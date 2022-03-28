import config from '../config.js'

let productosDao
let carritosDao
let mensajesDao


process.env.PERS='mongodb'

switch (process.env.PERS) {
    case 'json':
        const { default: ProductosDaoArchivo } = await import('./productos/ProductosDaoArchivo.js')
        const { default: CarritosDaoArchivo } = await import('./carritos/CarritosDaoArchivo.js')

        productosDao = new ProductosDaoArchivo(config.fileSystem.path)
        carritosDao = new CarritosDaoArchivo(config.fileSystem.path)
        break
    case 'mongodb':
        const { default: ProductosDaoMongoDb } = await import('./productos/ProductosDaoMongoDb.js')
        const { default: CarritosDaoMongoDb } = await import('./carritos/CarritosDaoMongoDb.js')
        const { default: MensajesDaoMongoDb } = await import('./mensajes/MensajesDaoMongoDb.js')
        productosDao = new ProductosDaoMongoDb()
        carritosDao = new CarritosDaoMongoDb()
        mensajesDao = new MensajesDaoMongoDb()
        break
    case 'firebase':
        const { default: ProductosDaoFirebase } = await import('./productos/ProductosDaoFirebase.js')
        const { default: CarritosDaoFirebase } = await import('./carritos/CarritosDaoFirebase.js')

        productosDao = new ProductosDaoFirebase()
        carritosDao = new CarritosDaoFirebase()
        break
}

export { productosDao, carritosDao, mensajesDao }