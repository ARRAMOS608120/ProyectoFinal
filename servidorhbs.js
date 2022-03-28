import express from 'express'
import exphbs from 'express-handlebars'

import cors from 'cors'

import 'dotenv/config'

import router from './rutas/rutas.js'
import routerCarrito from './rutas/routerCarrito.js'
import routerProductos from './rutas/routerProductos.js'
import routerMensajes from './rutas/routerMensajes.js';
import routerInfo from './rutas/routerInfo.js';
import chatHandler from './rutas/websocket.js'
import logger from './winston-module.js'

import { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';

const app = express()
const httpServer = new HttpServer(app);
const io =  new Socket(httpServer);


io.on('connection', async socket => {
   logger.debug("Usuario conectado")
   chatHandler(socket, io.sockets)
})

app.use(cors())

import {CRUD,crearSesionMongo} from './persistencia/funciones.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

import session from 'express-session'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//app.use(express.static('views'))
app.use(express.static('public'))



app.use(session(crearSesionMongo()))

app.engine('hbs', exphbs({
  extname: ".hbs",
  defaultLayout: "index.hbs",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials"
}))

CRUD();

app.set('view engine', 'hbs')
app.set('views', './views')


/* Cargo los routers */
app.use('/chat', routerMensajes) 
app.use('/api/carrito',routerCarrito)
app.use('/api/productos',routerProductos)
app.use('/info', routerInfo)
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
  const PORT = process.env.PORT || 8080
  const server = httpServer.listen(PORT, ()=>{
      logger.info(`Servidor express escuchando en el puerto ${PORT}`)
  });
  server.on('error', error=>logger.error(`Error en servidor: ${error}`));
}


