import MongoStore from'connect-mongo'
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema({
    username: {type: String, require: true},
    password: {type: String, require: true},
    nombre: {type: String, require: true},
    direccion: {type: String, require: true},
    edad: {type: Number, require: true},
    numero: {type: String, require: true},
    foto: {type: String, require: true},
})

const usuarioModel = mongoose.model('usuarios', usuarioSchema)

async function CRUD(){
    try{
        await mongoose.connect ('mongodb+srv://ariel:Coder2021@cluster0.wjzen.mongodb.net/ecommerce?retryWrites=true&w=majority',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Base de datos conectada')
    }catch (error) {
    console.log(`Error de conexión a la base de datos ${error}`)
    }
}

function crearSesionMongo(){
    const ruta= {store: MongoStore.create({ mongoUrl:'mongodb+srv://ariel:Coder2021@cluster0.wjzen.mongodb.net/ecommerce?retryWrites=true&w=majority',
    mongoOptions: advancedOptions, ttl: 100
    }),
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 100000
    }
  }
  return ruta}

 async function listarUsuarios() {
    return await usuarioModel.find({})
}

async function guardarUsuario(usuario,contraseña, name, dir, age, number, imagen) {
    const usuarioNuevo = new usuarioModel({ username: usuario,  password: contraseña, nombre: name , direccion: dir, edad: age, numero: number, foto: imagen})
    return await usuarioNuevo.save()
}

export  {
    CRUD,
    listarUsuarios,
    guardarUsuario,
    crearSesionMongo
}