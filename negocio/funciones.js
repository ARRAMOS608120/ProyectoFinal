import {listarUsuarios,guardarUsuario} from '../persistencia/funciones.js'

import nodemailer from 'nodemailer'

async function listarUser(){
    return await listarUsuarios()
} 

import bCrypt from 'bcrypt'

function createHash(password){
    return bCrypt.hashSync(
        password,
        bCrypt.genSaltSync(10),
        null);
}

function validarPassword(password1, password2){
  return  bCrypt.compareSync(password1, password2)
}
async function guardarUser(usuario, password, nombre, direccion, edad, numero, foto){
  await guardarUsuario(usuario,createHash(password),nombre, direccion, edad, numero, foto)
  console.log("Usuario agregado")
} 

/* ------------------ MAIL -------------------- */
function createSendMail(mailConfig) {

    const transporter = nodemailer.createTransport(mailConfig);
  
    return function sendMail({ to, subject, text, html, attachments }) {
      const mailOptions = { from: mailConfig.auth.user, to, subject, text, html, attachments };
      return transporter.sendMail(mailOptions)
    }
  }
  
  function createSendMailEthereal() {
    return createSendMail({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user:process.env.USERMAIL,
        pass:process.env.PASSMAIL
      }
    })
  }
  
  /* ------------------ Whatsapp -------------------- */
  import twilio from 'twilio'
  
  const accountSid = 'AC5dce4c7fb0529562951bd15dd73eef95';
  const authToken = '813d4243f1e13b786612082d3b2cc53d';
  
  const client = twilio(accountSid, authToken)
  
  const numero = +5491162422921 
  
  async function whatsapp(mensaje){
    try {
    const message = await client.messages.create({
        body: mensaje, 
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${numero}`
    })
    console.log(message.sid)
  } catch (error) {
    console.log(error)
  }
  }
  
  const isAdmin = (userid) => {
    if(process.env.ADMINUSER==userid.username) {
        return true;
    }else {
        return false;
    }
}

export {listarUser,
  guardarUser,
  validarPassword,
  whatsapp,
  createSendMailEthereal,
  client,
  isAdmin
} 