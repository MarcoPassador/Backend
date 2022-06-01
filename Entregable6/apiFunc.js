
class Api {
    constructor(productos) {
        this.productos = productos;
    }

    getProducts(req, res) {
        res.json({productos: this.productos});
    }

    getProduct(req, res) {
        const producto = this.productos.find(elem => elem.id === Number(req.params.id))
        const prodIndex = this.productos.findIndex(elem => elem.id === Number(req.params.id))
        console.log(prodIndex);

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