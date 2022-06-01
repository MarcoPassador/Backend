const express = require('express');
const { Router } = express;

const Api = require("./apiFunc.js");
const Chat = require("./ChatFunc.js");

const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const router = Router();

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
 })
server.on("error", error => console.log(`Error en servidor ${error}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.set("view engine", "ejs"); 
app.set("views", "./views") 

let productos = [
    {
        name: "Remera",
        price: 1500,
        thumbnail: "",
        id: 1,
    }, 
    {
        name: "Zapatilla",
        price: 2500,
        thumbnail: "",
        id: 2,
    }, 
];

const miApi = new Api(productos);
const miChat = new Chat("mensajes.json");

io.on("connection", async socket => { 
    
    console.log("Nuevo cliente");
    socket.emit("Productos", productos);
    socket.emit("Mensajes", await miChat.getAll());

    socket.on("new-message", async data => {
        data.time = new Date().toLocaleString()
        await miChat.save(data);
        io.sockets.emit("MensajeIndividual", data)
    })

    socket.on("nuevo-producto", data => {
        io.sockets.emit("ProductoIndividual", data)
    })
})

router.get('/productos/:id', (req, res) => {
    return miApi.getProduct(req, res)
 })

router.get('/productos', (req, res) => {
    return miApi.getProducts(req, res)
 })

router.post('/productos', (req, res) => {
    return miApi.postProduct(req, res)
 })


router.get("/", (req, res) => {
    res.render("pages/index", { productos: productos});
});

app.use('/', router);