import normalizr from 'normalizr';
import { normalize, denormalize, schema } from 'normalizr';
import { readFile, writeFile } from "fs/promises";


const myJson = {
  "id": "mensajes",
  "mensajes": [
    {
      "_id":"62cc8222573f9b61077bf20a",
      "author":{
         "email":"marcopassador@outlook.com",
         "nombre":"Marco",
         "apellido":"Passador",
         "edad":"18",
         "alias":"Ronald",
         "avatar":"https://bysperfeccionoral.com/wp-content/uploads/2020/01/136-1366211_group-of-10-guys-login-user-icon-png.jpg"
      },
      "text":"Prueba",
      "time":"11/7/2022, 17:03:46"
   },
   {
      "_id":"62cc86a39fd07fb1cd58a4c2",
      "author":{
         "email":"ianinti@yahoo.com.ar",
         "nombre":"Damian",
         "apellido":"Sosso",
         "edad":"3",
         "alias":"Ian",
         "avatar":"https://bysperfeccionoral.com/wp-content/uploads/2020/01/136-1366211_group-of-10-guys-login-user-icon-png.jpg"
      },
      "text":"Hola",
      "time":"11/7/2022, 17:22:59"
   },
   {
      "_id":"62cc86c79fd07fb1cd58a4c6",
      "author":{
         "email":"marcopassador@outlook.com",
         "nombre":"Marco",
         "apellido":"Passador",
         "edad":"18",
         "alias":"Ronald",
         "avatar":"https://bysperfeccionoral.com/wp-content/uploads/2020/01/136-1366211_group-of-10-guys-login-user-icon-png.jpg"
      },
      "text":"Buenas ",
      "time":"11/7/2022, 17:23:35"
   }
    
    
  ]
}


  const newPS = (value, parent, key) => {
    console.log(parent.author)
}

const authorSchema = new normalizr.schema.Entity('author', {}, {idAttribute: 'alias'})

const textSchema = new normalizr.schema.Entity('text', {'author': authorSchema}, {idAttribute: '_id',});

const mensajeSchema = new normalizr.schema.Entity('mensajes', {'mensajes': [textSchema]})

const normalizedChat= normalizr.normalize(myJson, mensajeSchema);



console.log('#### LONGITUD DE ARCHIVO SIN NORMALIZAR ####')
console.log(JSON.stringify(myJson, null, 2).length)
console.log('#### LONGITUD DE ARCHIVO NORMALIZADO ####')
console.log(JSON.stringify(normalizedChat, null, 2).length)


await writeFile('./mensajesNormalizados.json', JSON.stringify(normalizedChat, null, 2))
 .then(_ => console.log('ok'))

export const normalizedMessages = (data) => {
    return normalize(data, chatSchema)
}