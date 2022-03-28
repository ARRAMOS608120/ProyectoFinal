import mostrarInfo from '../negocio/negocioInfo.js'
import logger from '../winston-module.js'

  async function info (req, res) {
    const { url, method } = req
    logger.info(`Ruta ${method} ${url} funcionando correctamente`)
    const infototal = await mostrarInfo()
    res.json({infototal})  
  }

  export default info