const socket = io.connect();

const chatButton = document.querySelector("#chatButton");
const chatForm = document.querySelector(".chatForm");

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    return fetch(`http://localhost:8080/api/mensajes/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {"author": 
                {"email": e.target.email.value, 
                "nombre": e.target.nombre.value, 
                "apellido": e.target.apellido.value, 
                "edad": e.target.edad.value,
                "alias": e.target.alias.value, 
                "avatar": e.target.avatar.value}, 
            "text": e.target.text.value, 
            "time": new Date().toLocaleString()}),})
})

const render = (data) => {
    const html = data.map(elem => {
        return (`
        <div style="display:flex; column-gap: 0.2rem;">
            <strong>${elem.author.alias}</strong> 
            <p>[${elem.time}]</p>
            <i>${elem.text}</i>
        </div>`)}).join(" ");
        document.querySelector(".ChatMsgs").innerHTML = html;
}

const addMessage = () => {
    const mensaje = {
        email: document.querySelector("#email").value,
        text: document.querySelector("#text").value,
    }

    socket.emit("new-message", mensaje);
    return false;
}

chatForm.addEventListener("submit", () => addMessage());

socket.on("Mensajes", data => {
    render(data);
});

socket.on("MensajeIndividual", data => {
    document.querySelector(".ChatMsgs").innerHTML+=`
    <div style="display:flex; column-gap: 0.2rem;">
        <strong>${data.alias}</strong> 
        <p>[${data.time}]</p>
        <i>${data.text}</i>
    </div>               
`

});


//PRODUCTOS FAKER

const getTemplate = async () => {
    const template = await fetch("http://localhost:8080/api/template.html");
    const templateData = await template.text();
    return templateData;
}

const getProducts = async () => {
    const products= await fetch("http://localhost:8080/api/productos-test");
    const productsData = await products.json();
    console.log(productsData);

    const templateData = await getTemplate();
    const template = ejs.compile(templateData);

    const templateRendered = productsData.map(elem => {
        return template({
            name: elem.name,
            price: elem.price,
            photo: elem.photo,
            id: elem.id,
        })
    }).join(" ");

    element.innerHTML = templateRendered;
}

getProducts()



