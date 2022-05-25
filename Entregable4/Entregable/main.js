const express = require('express');
const { Router } = express
const Api = require("./api.js");

const app = express()
const router = Router()

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`)
 })
server.on("error", error => console.log(`Error en servidor ${error}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(__dirname + '/public'));

let productos = [
    {
    name:"Remera",
    price:5300,
    id:1
},{
    name:"Pantalon",
    price:3200,
    id:2
},{
    name:"Gorro",
    price:1500,
    id:3
}
];

const myApi = new Api(productos);

router.get('/productos', (req, res) => {
    return myApi.getProducts(req, res)
 })

router.get('/productos/:id', (req, res) => {
    return myApi.getProduct(req, res)
 })

router.post('/productos', (req, res) => {
    return myApi.postProduct(req, res)
 })

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.use('/api', router);