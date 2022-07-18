import express from "express";
import session from 'express-session';
import MongoStore from 'connect-mongo';
const { Router } = express;
import { db, msgsModel} from "./dbsConfig.js";
import contenedorMongo from "./contenedorMongoDB.js";
import { Server as IOServer } from "socket.io";
import { Server as HttpServer } from "http";
import cors from "cors";
import {randomData} from "./fakerRP.js";
import { readFile, writeFile } from "fs/promises";

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const router = Router();

const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
 })
server.on("error", error => console.log(`Error en servidor ${error}`));

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", express.static("./public"));
app.set("view engine", "ejs"); 
app.set("views", "./views") 
app.use(cors());

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://Marco:250236@cluster0.50sez.mongodb.net/sessions?retryWrites=true&w=majority",
        mongoOptions: advancedOptions,
        ttl: 60
    }),
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true
   }))


const myChat = new contenedorMongo(db, msgsModel);

io.on("connection", async socket => { 
    console.log("Un nuevo cliente se ha conectado");
 
    socket.emit("Mensajes", await myChat.getElems());

    const data = await myChat.getElems();

    socket.on("new-message", async data => { 
        data.time = new Date().toLocaleString();
        io.sockets.emit("MensajeIndividual", data)
    })
})

router.get("/", (req, res) => {

    if (req.session.nombre) {
        res.render("pages/index.ejs", {name: req.session.nombre});
    } else {
        res.redirect('/api/login')
    }
});


router.get('/login', (req, res) => {

    if (req.session.user) {
        return res.redirect('/api/')
    } else {
        res.render("pages/login.ejs")
    }
})

router.post('/login', (req, res) => {
    console.log(req.body)
    const { yourname } = req.body

    if (!yourname) {
        return res.json({ error: 'Login fallado'})
    } else {
        req.session.nombre = yourname
        res.redirect('/api')
    }
})


router.get('/logout', (req, res) => {

    const nameRemanent = req.session.nombre;

    if (nameRemanent) {
        return req.session.destroy(err => {
            if (!err) {
              return res.render("pages/logout.ejs", {name: nameRemanent})
            }
            return res.send({ error: err })
          })
    } else {
        return res.redirect('/api/login')
    }
        
   })

router.get('/productos-test', async (req, res) => {
    return res.json(randomData(5));
 })


router.get('/mensajes', async (req, res) => {
    return res.json(await myChat.getElems(req, res))
 })

router.post('/mensajes', async (req, res) => {
    return await myChat.postElem(req, res)
 })

// router.get("/", (req, res) => {
//     res.render("pages/index.ejs");
// });

app.use('/api', router);
app.use((req, res, next) => {
    res.status(404).send({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`});
  });