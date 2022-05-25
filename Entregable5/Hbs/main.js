const express = require("express")
const app = express()

const { Router } = express
const { engine } = require("express-handlebars")

const router = Router()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static(`${__dirname}/public`))

app.engine("hbs", engine({
    extname:".hbs",
    defaultLayout: `${__dirname}/views/index.hbs`,
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`
}))

app.set("views", "./views")
app.set("view engine", "hbs")

let productos = [
    {
    name:"Remera",
    price:5300,
    thumbnail: "",
    id:1
},{
    name:"Pantalon",
    price:3200,
    thumbnail: "",
    id:2
},{
    name:"Gorro",
    price:1500,
    thumbnail: "",
    id:3
}
];

// API
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

        if (newProd.name && newProd.price && Object.keys(newProd).length === 3) {
            const longitud = this.productos.length;
            longitud ? newProd.id = this.productos[longitud - 1].id + 1 : newProd.id = 1 ;
            this.productos.push(newProd);
            res.json(this.productos);
        } else {
            return res.status(400).send({ error: "parametros incorrectos" });
        }
    }
}

const miApi = new Api(productos)


router.get("", (req,res)=>{
    res.render("layouts/main", {productos: productos})
})

router.get("/producto/:id", (req, res)=>{
    return miApi.getProduct(req, res)
})

router.get("/productos", (req,res)=>{
    res.render("layouts/productos", {productos: productos})

})

router.post("/productos", (req, res)=>{
    return miApi.postProduct(req, res)
})

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`)
 })
server.on("error", error => console.log(`Error en servidor ${error}`));

app.use("/api", router);
