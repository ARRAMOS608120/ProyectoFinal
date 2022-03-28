import MensajeDTO from '../Dtos/Mensaje.js';

class MensajeFactory {
    
    static crearMensaje(data) {
        return new MensajeDTO(data.userid, Date.now(), data.mensaje );
    }
}

export default MensajeFactory