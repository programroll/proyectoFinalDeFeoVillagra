

fetch("productos.json")
.then(respuesta => respuesta.json())
.then(listaProductos => {
    miPrograma(listaProductos)
})
.catch(console.log("error"))

function miPrograma(listaProductos) {

let tienda = document.getElementById("tienda")
let login = document.getElementById("login")


//registrarse

let usuario = document.getElementById("usuario")
let contrasenia = document.getElementById("contrasenia")
let registrarse = document.getElementById("registrarse")
let formIniciarS = document.getElementById("formIniciarS")
let formRegistro = document.getElementById("formRegistro")



registrarse.addEventListener("click", () => {
    let infoUsuario = { usuario: usuario.value, contrasenia: contrasenia.value }
    if (usuario.value != "" && contrasenia.value != "") {
        localStorage.setItem("infoUsuario", JSON.stringify(infoUsuario))
        formIniciarS.classList.remove("ocultar")
        formRegistro.classList.replace("mostrar", "ocultar")
    } else {
        alerta("Todos los campos tienen que llenarse para poder ingresar", "warning")
    }


})

//iniciar sesion
let usuarioUs = document.getElementById("usuarioUs")
let contraseniaUs = document.getElementById("contraseniaUs")
let iniciarS = document.getElementById("iniciarS")


iniciarS.addEventListener("click", () => {

    let infoUsuario = JSON.parse(localStorage.getItem("infoUsuario"))
    if (usuarioUs.value != "" && contraseniaUs.value != "") {
        if (infoUsuario.usuario == usuarioUs.value && infoUsuario.contrasenia == contraseniaUs.value) {
            login.classList.replace("mostrar", "ocultar")
            tienda.classList.remove("ocultar")
            alerta("Ya sos parte de nuestra comunidad","success","white","top")

        } else {
            alerta("El usuario o la contraseña no son correctos","error","#a60d02")
        }
    } else {
        alerta("Todos los campos tienen que llenarse para poder ingresar","warning","white","center")
    }
})



let contenedor = document.getElementById("contenedor")
cargarTarjetas(listaProductos)

let liCategorias = document.getElementById("liCategorias")
let categorias = document.getElementById("categorias")

liCategorias.addEventListener("click", motrarCategorias)

/* Armado de tarjetas dinámicas */

let inputBuscador = document.getElementById("buscador")
inputBuscador.addEventListener("input", filtrarPorInput)

function cargarTarjetas(arrayProductos) {
    const productos = document.getElementById("productos")
    productos.innerHTML = ""/* se borra todo el contenido dentro de productos para que no se agregen en cada vuelta*/
    arrayProductos.forEach(({ categoria, nombre, imagen, precio, stock, id }) => {
        let tarjeta = document.createElement("div")
        tarjeta.className = "tarjeta"

        tarjeta.innerHTML =
            `<h3>${nombre}</h3>
        <div>
            <img class="imagenes" src="${imagen}" alt="">
        </div>
        <p>Categoria: ${categoria}</p>
        <p><span id="stock${id}">${stock}</span>u. en stock</p>
        <p class="precio">$${precio}</p>
        <button class="boton" id="${id}" >Agregar al carrito</button>
        `
        productos.appendChild(tarjeta)

        let agregar = document.getElementById(id)
        agregar.addEventListener("click", agregarAlCarrito)
    })
}

//Para cargar cosas al carrito
let carrito = document.getElementById("carrito")
let campoCarrito = document.getElementById("campoCarrito")
let listaCarrito = JSON.parse(localStorage.getItem("listaCarrito")) || []
representarCarrito(listaCarrito)

function agregarAlCarrito(e) {
    let productoSelec = listaProductos.findIndex(producto => producto.id == e.target.id)//"producto" = el elemento que se itera al momento de evaluar la condicion..pasa por todos hasta que la condicion sea true.
    //productoSelect es el indice el producto que cumple que la condicion sea true.

    let productoBuscado = listaProductos.find(producto => producto.id === Number(e.target.id))

    if (listaProductos[productoSelec].stock > 0)//[productoSelect] =id del producto.
    {
        let stockId = document.getElementById("stock" + e.target.id)
        listaProductos[productoSelec].stock--
        stockId.innerHTML = listaProductos[productoSelec].stock

        if (listaCarrito.some(({ id }) => id == productoBuscado.id)) {
            let posicionCarrito = listaCarrito.findIndex(producto => producto.id == productoBuscado.id)
            listaCarrito[posicionCarrito].unidades++
            listaCarrito[posicionCarrito].subtotal = listaCarrito[posicionCarrito].precio * listaCarrito[posicionCarrito].unidades
        } else {
            listaCarrito.push({
                id: productoBuscado.id,
                nombre: productoBuscado.nombre,
                precio: productoBuscado.precio,
                unidades: 1, 
                subtotal: productoBuscado.precio
            })
        }

        localStorage.setItem("listaCarrito", JSON.stringify(listaCarrito))
        representarCarrito(listaCarrito)

    } else {
        alerta(`El producto ${productoBuscado.nombre} está sin stock`,"info","white")
    }
}

//productos en el carrito

function representarCarrito(arrayDeProductos) {
    campoCarrito.innerHTML = ""
    if (arrayDeProductos.length) /* si el array no esta vacio... */ {
        arrayDeProductos.forEach(({ nombre, precio, unidades, subtotal }) => {
            campoCarrito.innerHTML += `<h3>${nombre} ${precio} ${unidades} ${subtotal}</h3>`
        })

        let total = arrayDeProductos.reduce((acum, producto) => acum + producto.subtotal, 0)

        campoCarrito.innerHTML += `<p>Total a pagar $${total}</p>`

        campoCarrito.innerHTML += `<button class="boton" id="comprar">Finalizar compra</button>`

        let botonComprar = document.getElementById("comprar")
        botonComprar.addEventListener("click", finalizarCompra)
    }
}
function finalizarCompra() {
    alerta("Muchas gracias por su compra","success","white")
    localStorage.removeItem("listaCarrito")
    listaCarrito = []
    representarCarrito(listaCarrito)
}

// Filtrar productos

let listaCategorias = document.getElementsByClassName("listaCategorias")
console.log(listaCategorias)

for (const e of listaCategorias) {
    e.addEventListener("click", filtrarPorCategoria)
}/* resume codigo(por cada elemento) */

function filtrarPorCategoria() {

    let filtros = []
    for (const input of listaCategorias) {

        if (input.checked) {
            filtros.push(input.id)
        }
    }
    let arrayFiltrado = listaProductos.filter(producto => filtros.includes(producto.categoria.toLowerCase()))

    cargarTarjetas(arrayFiltrado.length > 0 ? arrayFiltrado : listaProductos)

}

function filtrarPorInput() {
    let arrayPorInput = listaProductos.filter(producto => producto.nombre.toLowerCase().includes(inputBuscador.value.toLowerCase()))
    cargarTarjetas(arrayPorInput)/* mejorar para mayusculas */
}

/*Visualizar carrito */


carrito.addEventListener("click", mostrarCarrito)

function mostrarCarrito() {
    campoCarrito.classList.toggle("ocultar")
}

//Opciones

function motrarCategorias() {

    categorias.classList.toggle("ocultar")
}


//Alertas
function alerta(titulo, icono, iColor,posicion,texto) {
    Swal.fire({
        color:texto,
        position:posicion,
        icon: icono,
        title: titulo,
        showConfirmButton: false,
        timer: 2500,
        iconColor: iColor,
        background:`#bbac9e`
    })
}
}