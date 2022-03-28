import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

class MensajesDaoMongoDb extends ContenedorMongoDb {

    constructor() {

        super('mensaje', {
            userid: { type: String},
            date: {type: Date},
            mensaje: {type: String}
        })
    }
}

export default MensajesDaoMongoDb