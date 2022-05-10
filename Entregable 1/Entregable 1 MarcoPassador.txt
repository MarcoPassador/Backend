class Usuario {

    constructor(nombre, apellido, libros, mascotas){
        this.nombre = nombre;
        this.apellido = apellido,
        this.libros = libros,
        this.mascotas = mascotas
    }

    getFullName (){
        return `${this.nombre}  ${this.apellido}`
    }

    addMascota(mascota){
        this.mascotas.push(mascota)
    }

    countMascotas(){
        return this.mascotas.length 
    }

    addBook(nombre, autor){
        this.libros.push({nombre,autor})
    }

    getBookNames(){
        let nombreLibros = []
        this.libros.map((libro)=> nombreLibros.push(libro.nombre))
        return nombreLibros
    }

}

let marco = new Usuario("Marco", "Passador", [{nombre:"Harry Potter", autor:"Jorge"}], ["Kira", "Luna"])

marco.getFullName()

marco.addMascota("Lila")

marco.countMascotas()

marco.addBook("Anillos", "Raul")

marco.getBookNames()




