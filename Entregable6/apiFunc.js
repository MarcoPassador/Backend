
class Api {
    constructor(archivo) {
        this.archivo = archivo;
    }

     async getProductsJSON(req, res) {
        try{
            const data = await fs.promises.readFile(this.archivo, "utf-8")
            const objetos = data ? (JSON.parse(data)) : []
            res.json({productos: objetos});
        } 
        catch(err) {
            console.log(err)
        }
    }

    async getProducts(req, res){
        try{
            const data = await fs.promises.readFile(this.archivo, "utf-8")
            const objetos = data ? (JSON.parse(data)) : []
            return objetos;

        } catch(err){
            console.log(err)
        }
    }

    async getProduct(req, res) {
        const objetos = await this.getProducts();
        const producto = objetos.find(elem => elem.id === Number(req.params.id))
        if (producto) {
            res.json({producto})
        } else {
            res.status(404).json({error: "Producto no encontrado"})
        }
    }

    postProduct(req, res) {
        const productoNuevo = req.body;

        if (productoNuevo.name && productoNuevo.price && productoNuevo.thumbnail && Object.keys(productoNuevo).length === 3) {
            const longitud = this.productos.length;
            longitud ? productoNuevo.id = this.productos[longitud - 1].id + 1 : productoNuevo.id = 1 ;
            this.productos.push(productoNuevo);
            res.redirect(301, '/')
        } else {
            return res.status(400).send({ error: "parametros incorrectos" });
        }
    }

}

module.exports = Api;