import express from "express";
import session from 'express-session';
import MongoStore from 'connect-mongo';
const { Router } = express;
import { db, msgsModel, User} from "./dbsConfig.js";
import contenedorMongo from "./contenedorMongoDB.js";
import { Server as IOServer } from "socket.io";
import { Server as HttpServer } from "http";
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { Strategy as LocalStrategy } from "passport-local";
import cors from "cors";
import {randomData} from "./fakerRP.js";
import {createHash, isValidPassword} from "./middlewares.js"
import randomRouter from './randomRouter.js';
import { readFile, writeFile } from "fs/promises";
import minimist from "minimist";
import "dotenv/config.js";

const options = {
  alias: {
    p: 'PORT'
  }
}
const myArgs = minimist(process.argv.slice(2), options)
const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const router = Router();

const PORT = myArgs.PORT || 8080;

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

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


passport.use('login', new LocalStrategy((username, password, done) => {
    return User.findOne({ username })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Usuario inexistente' })
        }
  
        if (!isValidPassword(user.password, password)) {
          return done(null, false, { message: 'Contraseña incorrecta' })
        }
        
        return done(null, user)
      })
      .catch(err => done(err))
  }))

  passport.use('signup', new LocalStrategy({
    passReqToCallback: true
  }, (req, username, password, done) => {
    let errMsg = '';
    return User.findOne({ username })
      .then(user => {
        if (user) {
          errMsg = 'El nombre de usuario ya existe'
          return null;
        }
  
        const newUser = new User()
        newUser.username = username
        newUser.password = createHash(password)
        newUser.email = req.body.email

        req.session.user = newUser;
  
        return newUser.save()
      })
      .then(user => {
        if (!user && errMsg !== '') {
          return done(null, false, {message: errMsg})
          }
          return done(null, user)
      })
      .catch(err => {
        return done(err)
      })
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

passport.serializeUser((user, done) => {

    done(null, user.id)
  })
  
  passport.deserializeUser((id, done) => {

    User.findById(id, (err, user) => {
      done(err, user)
    })
  })



router.get("/", (req, res) => {
  
    if (req.user) {
        req.session.user = req.user;
        res.render("pages/index.ejs", {user: req.user});
    } else {
        res.redirect('/api/login')
    }
});


router.get('/login', (req, res) => {

    if (req.user) {
        return res.redirect('/api/')
    } else {
        res.render("pages/login.ejs", { message: req.flash('error')})
    }
})

router.post('/login', passport.authenticate('login', {
    successRedirect: '/api',
    failureRedirect: '/api/login',
    failureFlash: true
  }))


  router.get('/signup', (req, res) => {
    if (req.user) {
        return res.redirect('/api/')
    } else {
        res.render("pages/signup.ejs", { message: req.flash('error') })
    }
})

router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/api',
    failureRedirect: '/api/signup',
    failureFlash: true
  }))


router.get('/logout', (req, res) => {

    const nameRemanent = req.user; 

    if (nameRemanent) {
        return req.session.destroy(err => {
            if (!err) {
              return res.render("pages/logout.ejs", {name: nameRemanent})
            }
            return res.send({ error: err })
          })
    } else {
        return res.render("pages/expired.ejs")
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

 router.get('/info', (req, res) => {
  return res.render('pages/info.ejs', {info: process})
})


app.use('/api', router);
app.use('/api/randoms', randomRouter);
app.use((req, res, next) => {
    res.status(404).send({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`});
  });