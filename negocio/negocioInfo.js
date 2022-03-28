import os from 'os';
const numCPUs = os.cpus().length;

function mostrarInfo(){
    const args = process.argv

    const argumentos = args.slice(2)
    const plataforma= process.platform
    const version= process.version
    const memoria= process.memoryUsage().rss
    const pathEje= process.execPath
    const pid= process.pid 
    const carpeta= process.cwd()
    
    const info = {
      argumentos,
      plataforma,
      version,
      memoria,
      pathEje,
      pid,
      carpeta,
      numCPUs
    }

    return info
}

export default mostrarInfo