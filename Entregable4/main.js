const express = require ("express")

const app = express()

app.use(express.json())

app.use(express.urlencoded({extended: true}))

const fs = require("fs")



const PORT = 8080

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


}

const productos = new Container("productos.txt");

const lista = productos.getAll()


app.get("/api/productos",  async(req, res)=>{

    const listReady = await lista
    const prodFilt = listReady.filter(prod => prod.id == req.query.id)

    if(!req.query.id){
        res.send(listReady)
        return
    }else if(!prodFilt){
        return res.status(404).json({
            error: "Producto no encontrado"
        })
    }
    else{
        console.log(prodFilt)
        res.send(prodFilt)

    }
})

app.post("/api/productos", async(req,res)=>{
    console.log("POST request recibido")

    const listReady = await lista


    const newProduct = req.body

    newProduct.id = listReady.length +1

    listReady.push(newProduct)

    return res.status(201).json(newProduct)
})





const server = app.listen(PORT, ()=>{
    console.log("Server escuchando en el puerto " + PORT)
})

server.on("error", (error)=>{console.log("Error:" + error)})