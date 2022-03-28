import { productosDao } from '../persistencia/daos/index.js'

const administrador= true;

async function listaProd (req, res) {
    const products= await productosDao.getAll()
    if (products.length==0){
        res.json( { listadoProd: products, listExists: false })
    } else {res.json({ listadoProd: products, listExists: true })}
}

async function productoSelec (req, res) {
    const productoSel=await productosDao.getByID(req.params.id)
    res.json(productoSel)
}

async function guardarProd (req, res) {
    if(administrador!=false){
    const prueba = await productosDao.save(req.body)
    res.redirect('/api/productos')}else{ res.json({error: -1, descripcion: 'ruta api/productos metodo POST no autorizada'})}
}

async function actualizarProd (req, res) {
    if(administrador!=false){
        const producto = req.body
        await productosDao.actualizar(producto,req.params.id)
        const obtener = await productosDao.getByID(req.params.id)
        res.json(obtener)
    }else{ res.json({error: -1, descripcion: 'ruta api/productos/:id metodo PUT no autorizada'}  )}
 
}

async function eliminarProd (req, res) {
    if(administrador!=false){
        const borrado = await productosDao.deleteById(req.params.id)
        res.json(borrado)}else{res.json({error: -1, descripcion: 'ruta api/productos/:id metodo DELETE no autorizada'}  )} 
}

export default  {
    listaProd,
    productoSelec,
    guardarProd,
    actualizarProd,
    eliminarProd
}