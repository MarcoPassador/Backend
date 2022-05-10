const fs = require ("fs");

class Container{
    constructor(arch){
        this.archivo = arch
    }

    save(obj){
        let archivo = this.archivo
        fs.promises.readFile(this.archivo, "utf-8")
        .then(data =>{
            async function agregar() {
                let dataparsed = JSON.parse(data);
                try{
                    obj.id = dataparsed.length+1
                    dataparsed.push(obj);
                    let nuevadata = JSON.stringify(dataparsed);
                    await fs.promises.writeFile(archivo, nuevadata, "utf-8");
                    console.log(obj.id)
                }
                catch(err){
                    console.log(err);
                }
            }
            agregar()
            
        })
        .catch(err =>{
            console.log(err)
        })

    }

    getById(ids){
        fs.promises.readFile(this.archivo, "utf-8")
        .then(data =>{
            const dataparsed = JSON.parse(data)
            let item = dataparsed.find(el=> el.id === ids);
            item? console.log(item) : console.log(null)
        })
        .catch(err =>{
            console.log(err)
        })

    }

    deleteById(ids){
        let archivo = this.archivo
        fs.promises.readFile(this.archivo, "utf-8")
        .then(data =>{
            async function borrar(){
                try{
                    let dataparsed = JSON.parse(data)
                    const nuevadata = dataparsed.filter(item => item.id !== ids);
                    await fs.promises.writeFile(archivo, JSON.stringify(nuevadata), "utf-8" )
                }
                catch(err){
                    console.log(err)
                }

            }
            borrar();
        })
        .catch(err =>{
            console.log(err)
        })

    }



    getAll(){
        fs.promises.readFile(this.archivo, "utf-8")
        .then(data =>{
            const dataparsed = JSON.parse(data)
            console.log(dataparsed)
        })
        .catch(err =>{
            console.log(err)
        })
    }

    deleteAll(){
        let archivo = this.archivo
        try{
            let nuevadata = ""
            fs.promises.writeFile(archivo, nuevadata, "utf-8")

        }
        catch(err){
            console.log(err)
        }

    }


}

const Ejemplo = new Container("productos.txt");

// Ejemplo.save({name :"Gorro", price: "700", img: "thumbnail.jpg"});

// Ejemplo.getAll();

// Ejemplo.getById(2);

// Ejemplo.deleteById(5);

//Ejemplo.deleteAll()









