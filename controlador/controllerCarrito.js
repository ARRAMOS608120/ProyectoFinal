import { carritosDao } from '../persistencia/daos/index.js'

async function nuevoCarrito (req, res) {
    const carritoNuevo = {}
    const prueba = await carritosDao.save(carritoNuevo)
    res.json(prueba)
}

async function eliminarCarrito (req, res) {
    const borrado = await carritosDao.deleteById(req.params.id)
    res.json(borrado)
}

async function productosCarrito (req, res) {
    const productoSel=await carritosDao.getByID(req.params.id)
    res.json(productoSel.productos)  
}

async function  guardarProdCarr (req, res)  {
    const prueba = await carritosDao.saveProducto(req.params.id,req.body)
    res.json(prueba)
}

async function eliminarProdCarr (req, res) {
    const borrado = await carritosDao.deleteByIdFull(req.params.id,req.params.id_prod)
    res.json(borrado)
}

export default  {
    nuevoCarrito,
    eliminarCarrito,
    productosCarrito,
    guardarProdCarr,
    eliminarProdCarr
}