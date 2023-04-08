const productos = [
    { id: 1, nombre: 'Television 4k', precio: 4000, img: 'https://www.techlicious.com/images/av/vizio-e55-f1-ballons-400px.jpg', cantidad : 1},
    { id: 2, nombre: 'Monitor 5k', precio: 3500, img: 'https://dahuawiki.com/images/thumb/6/6a/DHI-LM27-F211.png/400px-DHI-LM27-F211.png', cantidad : 1},
    { id: 3, nombre: 'Celular', precio: 1700, img: 'https://m.media-amazon.com/images/I/31oo6YhdepL.jpg', cantidad : 1},
    { id: 4, nombre: 'Aire acondicionado', precio: 2000, img: 'https://www.oscarbarbieri.com/pub/media/catalog/product/cache/cdaffbeb7ebc70de5b2a7790d5be3517/b/g/bgh2_2.jpg', cantidad : 1},
    { id: 5, nombre: 'Disco sólido intero', precio: 270, img: 'https://http2.mlstatic.com/D_NQ_NP_2X_839339-MLA40255016455_122019-V.webp', cantidad: 1},
    { id: 6, nombre: 'Heladera', precio: 4200, img: 'https://whirlpoolarg.vtexassets.com/arquivos/ids/164227-1200-auto?v=638127723857670000&width=1200&height=auto&aspect=true', cantidad: 1},
    { id: 7, nombre: 'Notebook', precio: 5000, img: 'https://mla-s1-p.mlstatic.com/873896-MLA48241212970_112021-F.jpg', cantidad: 1},
]



let productosContenedor = document.getElementById('productos');

let productosContenedorCarrito = document.getElementById('carritoAbierto');

let tienda = document.getElementById('tienda')

let carrito = document.getElementById('carrito');

let apiContainer = document.getElementById('api');

let botonCarrito;

let carritoLista = [];

let carritoStorage = [];

/*API MONEDAS*/
const DateTime = luxon.DateTime;
let x = DateTime.now().toFormat('yyyy-MM-dd')
listaMonedas = ['usd', 'eur', 'cny', 'rub', 'brl']

listaMonedas.forEach((moneda) => {
    const traerMoneda = async () => {
        url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${x}/currencies/${moneda}/ars.json`
        try {
            const response = await fetch(url)
            const data = await response.json();
            i = data.ars.toFixed(2)       
            monedaContainer = document.createElement('DIV')
            apiContainer.append(monedaContainer)
            monedaContainer.innerHTML = `${moneda.toUpperCase()} = $${i}ARS`
        } catch (error) {
            console.log(error)
            }
    }
    traerMoneda()
})




let carritoCaja = document.createElement('div');
carritoCaja.classList.add('carrito_caja', 'productos');
document.body.append(carritoCaja)

/*LISTADO DE PRODUCTOS */
const traerProductos = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(productos);
        }, 500)
    })
}

traerProductos()
    .then((response) => {
        response.forEach(producto => {
            let productoContenedor = document.createElement('div');
            productosContenedor.append(productoContenedor);
            productoContenedor.classList.add('producto');
            productoContenedor.innerHTML = `
                <img src="${producto.img}" alt="">
                <div class="producto__descripcion">
                    <h3>Id: ${producto.id}</h3> 
                    <h3>${producto.nombre}</h3> 
                    <p class="precio">$${producto.precio}</p>
                </div>
                <button class="carrito_boton" id="carrito_boton${producto.id}">Agregar al carrito</button>
                `;
            botonCarrito = document.getElementById(`carrito_boton${producto.id}`)
        
            botonCarrito.addEventListener("click", () => agregarProducto(producto.id));
        })
    })
    .catch((error) => {
        console.log(error)
    })


carritoStorage = localStorage.getItem("carrito")
let carritoFinal = JSON.parse(carritoStorage)
carritoFinal = carritoFinal == null ? [] : carritoFinal;
let contadorProductos = parseInt(localStorage.getItem('cant'))
contadorProductos = isNaN(contadorProductos) ? 0 : contadorProductos;
let listadoIds = []
carritoFinal.forEach(p => {listadoIds.push(p.id)})       

carrito.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> (${contadorProductos})`;

/*AGREGAR PRODUCTO AL CARRITO */
const agregarProducto = (id) => {
    Toastify({
        text: "Producto Agregado",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)"
        },
        duration: 3000
        
        }).showToast();
    let producto = productos.find((item) => item.id === id);
    (listadoIds.includes(producto.id)) ? producto.cantidad++ : carritoFinal.push(producto);
    contadorProductos++
    carritoFinal.forEach(p => {listadoIds.push(p.id)})


    localStorage.setItem('cant', contadorProductos)
    localStorage.setItem('carrito', JSON.stringify(carritoFinal))
    carrito.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> (${contadorProductos})`;
    carrito.addEventListener('click', aperturaCarrito)
};


/*APERTURA CARRITO*/
const aperturaCarrito = () => {
    carritoCaja.classList.add('mostrar_caja', 'productos');
    carritoCaja.innerHTML = `
        <div class='carrito_caja_titulo'>
            <h3>Carrito de compras</h3>
            <button id='botonCerrarCarrito' class="carrito_boton_masmenos"><i class="fa-solid fa-x fa-2x"></i></button>
        </div>
        <div class='carrito_caja_pie'>
            <button id='botonLimpiarCarrito'>Vaciar carrito</button>
        </div>
    `;

    tienda.classList.add('ocultar_tienda')

    carritoFinal.forEach(producto => {
        let productoCarrito = document.createElement('div');
        carritoCaja.append(productoCarrito);
        productoCarrito.classList.add('producto');
        productoCarrito.innerHTML = `
            <img src="${producto.img}" alt="">
            <div class="producto__descripcion">
                <h3>Cantidad: ${producto.cantidad}</h3> 
                <h3>${producto.nombre}</h3> 
                <p class="precio">$${producto.precio*producto.cantidad}</p>
            </div>
            <div class='masmenos'>
                <button class="carrito_boton_masmenos" id="carrito_boton_sumar${producto.id}"><i class="fa-solid fa-plus fa-2x"></i></button>
                <button class="carrito_boton_masmenos" id="carrito_boton_restar${producto.id}"><i class="fa-solid fa-minus fa-2x"></i></button>
            </div>  
            `;

        let botonRestar = document.getElementById(`carrito_boton_restar${producto.id}`)
        let botonSumar = document.getElementById(`carrito_boton_sumar${producto.id}`)
        botonRestar.addEventListener('click', ()=> restarProducto(producto.id))
        botonSumar.addEventListener('click', ()=> sumarProducto(producto.id))
    })
    let botonCerrarCarrito = document.getElementById('botonCerrarCarrito');
    botonCerrarCarrito.addEventListener('click', () => cerrarCarrito());

    let botonLimpiarCarrito = document.getElementById('botonLimpiarCarrito');
    botonLimpiarCarrito.classList.add('carrito_boton')
    botonLimpiarCarrito.addEventListener('click', () => limpiarCarrito())

};
/*RESTAR PRODUCTO*/
const restarProducto = (id) => {
    let productoCarro = carritoFinal.find((item) => item.id === id);
    productoCarro.cantidad--;
    contadorProductos--
    localStorage.setItem('cant', contadorProductos)
    localStorage.setItem('carrito', JSON.stringify(carritoFinal))
    carrito.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> (${contadorProductos})`;
    if (productoCarro.cantidad == 0) {
        eliminarProducto(id)
    }
    aperturaCarrito();
}
/*SUMAR PRODUCTO*/
const sumarProducto = (id) => {
    let productoCarro = carritoFinal.find((item) => item.id === id);
    productoCarro.cantidad++;
    contadorProductos++
    localStorage.setItem('cant', contadorProductos)
    localStorage.setItem('carrito', JSON.stringify(carritoFinal))
    carrito.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> (${contadorProductos})`;
    aperturaCarrito();
}
/*ELIMINACION DE PRODUCTO DEL CARRTIO */
const eliminarProducto = (id) => {
    // let productoCarro = carritoFinal.find((item) => item.id === id);
    const index = carritoFinal.findIndex(obj => {
        return obj.id === id
    });
    if (index !== -1) {
        carritoFinal.splice(index, 1)
        listadoIds.splice(id);
    }
    localStorage.setItem('carrito', JSON.stringify(carritoFinal))
    carrito.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> (${contadorProductos})`;
    aperturaCarrito();
};

/*CERRAR CARRITO*/

function cerrarCarrito() {
    carritoCaja.classList.remove('mostrar_caja', 'productos');
    tienda.classList.remove('ocultar_tienda')
}

/*LIMPIAR CARRITO*/
function limpiarCarrito() {
    localStorage.clear();
    alertOk('¿Desea vaciar el carrito?');
}

/*SI EL CARRITO ESTA VACIO, NO TIENE EVENTO */
(carritoFinal.length == 0) || carrito.addEventListener('click', aperturaCarrito);



/*SWEET ALERT - VACIAR CARRITO*/
function alertOk (texto) {
    Swal.fire({
        title: texto,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            '¡Borrado!',
            '¡Has vaciado el carrito!',
            'success',
            setTimeout( () => {
                location. reload();
            }, 1000)
          )
        }
      })  
}
