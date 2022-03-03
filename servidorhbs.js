import express from 'express'
import exphbs from 'express-handlebars'

const app = express()

import {CRUD,crearSesionMongo} from './persistencia/funciones.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

import session from 'express-session'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//app.use(express.static('views'))


import { routerCarrito, routerProductos, router } from './rutas/rutas.js'
import logger from './winston-module.js'

app.use(session(crearSesionMongo()))

app.engine('hbs', exphbs({
  extname: ".hbs",
  defaultLayout: "index.hbs",
  //layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials"
}))

CRUD();

app.set('view engine', 'hbs')
app.set('views', './views')

    
/* Cargo los routers */
app.use('/api/carrito',routerCarrito)
app.use('/api/productos',routerProductos)
app.use('/', router)

/* Server Listen */
import os from 'os';
const numCPUs = os.cpus().length;
import cluster from 'cluster'
const modo = "FORK"

if (modo == "FORK") {
  levantarServer();
} else if (modo== "CLUSTER") {
  if (cluster.isMaster){
      console.log(`Cantidad de CPUs: ${numCPUs}`);
      console.log(`Master PID ${process.pid} is running`);
      for (let i=0; i<numCPUs; i++){
          cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`)
        cluster.fork();});
  } else {
      levantarServer();
  }    
}

function levantarServer(){
  const PORT = 8080
  const server = app.listen(PORT, ()=>{
      logger.info(`Servidor express escuchando en el puerto ${PORT}`)
  });
  server.on('error', error=>logger.error(`Error en servidor: ${error}`));
}


