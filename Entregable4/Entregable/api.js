
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

    putProduct(req, res) {
        const prodMod = req.body;

        const format = prodMod.name && prodMod.price && Object.keys(prodMod).length === 2 ? true : null;

        const prodId = this.productos.findIndex(elem => elem.id === Number(req.params.id))

        const producto = this.productos.find(elem => elem.id === Number(req.params.id));

        if (format && producto) {
            prodMod.id = this.productos[prodId].id;
            this.productos[prodId] = prodMod;
            return res.send("Producto modificado");
        } 
    
        if (!producto) {
            return res.status(404).send({error: "producto no encontrado"})
        }

        if (!format) {
            res.send({error: "formato incorrecto"})
        }
    }

    deleteProduct(req, res) {
        const prodId = this.productos.findIndex(elem => elem.id === Number(req.params.id));

        if (prodId < 0) {
            return res.status(404).send({error: "producto no encontrado"})
        }

        this.productos.splice(prodId, 1);
        res.send("producto eliminado");
    }
}

module.exports = Api;