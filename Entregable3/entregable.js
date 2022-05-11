const express = require("express");

const app = express()

const PORT = 8080

const fs = require ("fs");

class Container{
    constructor(arch){
        this.archivo = arch
    }

    async getAll(){
        try {
            const data = await fs.promises.readFile(this.archivo, "utf-8");
            const productos = await JSON.parse(data);
            return productos;

            
        }
        catch (error) {
            console.log(error)
        }
    }

    async getRandom(){
        try{
            const data = await fs.promises.readFile(this.archivo, "utf-8");
            const dataparsed = JSON.parse(data);
            return dataparsed[Math.floor(Math.random()*dataparsed.length)]


        }
        catch(error){
            console.log(error)
        }
    }


}

const productos = new Container("productos.txt");

const lista = productos.getAll()

const random = productos.getRandom()

app.get("/", (req, res)=>{
    res.send("Inicio")
})

app.get("/productos", async (req, res)=>{
    res.send(await lista)
})

app.get("/productosRandom", async (req, res)=>{
    res.send(await random)
})

const server = app.listen(PORT, ()=>{
    console.log("Server escuchando en el puerto " + PORT)
})

server.on("error", (error)=>{console.log("Error en servidor"+error)})


