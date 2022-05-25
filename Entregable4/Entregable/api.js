
class Api {
    constructor(products) {
        this.productos = products;
    }

    getProducts(req, res) {
        res.json({productos: this.productos});
        console.log(this.productos.length);
    }

    getProduct(req, res) {
        const prod = this.productos.find(elem => elem.id === Number(req.params.id))

        if (prod) {
            res.json({prod})
        } else {
            res.status(404).json({error: "Producto no encontrado"})
        }
    }

    postProduct(req, res) {
        const newProd = req.body;

        if (newProd.name && newProd.price && Object.keys(newProd).length === 2) {
            const longitud = this.productos.length;
            longitud ? newProd.id = this.productos[longitud - 1].id + 1 : newProd.id = 1 ;
            this.productos.push(newProd);
            res.json(this.productos);
        } else {
            return res.status(400).send({ error: "parametros incorrectos" });
        }
    }
}

module.exports = Api;