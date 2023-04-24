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

let boton_cambio_moneda = document.getElementById('boton_cambio_moneda')
let sublista_monedas = document.getElementById('sublista_monedas');

/*API MONEDAS*/
const DateTime = luxon.DateTime;
let x = DateTime.now().toFormat('yyyy-MM-dd')
let listaMonedas = ['usd', 'eur', 'cny', 'rub', 'brl']


let listadoTotalMonedas = ['ars'].concat(listaMonedas);

// localStorage.setItem('moneda', listadoTotalMonedas[0])
// localStorage.setItem('valorMoneda', 1)

let valorMoneda = Number(localStorage.getItem('valorMoneda'));

let tipoMoneda = localStorage.getItem('moneda');

(valorMoneda || tipoMoneda) || (valorMoneda=1, tipoMoneda='ars')
console.log(valorMoneda, tipoMoneda)

boton_cambio_moneda.innerHTML = `<i class="fa-solid fa-dollar-sign" id="${tipoMoneda}" >${tipoMoneda.toUpperCase()}</i>`;

listadoTotalMonedas.forEach((moneda) => {
    if (boton_cambio_moneda.innerText !== `${moneda.toLocaleUpperCase()}`) {
        sublista_monedas.innerHTML+= `<li id=${moneda} class='boton_moneda'>${moneda.toLocaleUpperCase()}</li>`
    }
})
boton_cambio_moneda.append(sublista_monedas)
listadoTotalMonedas.forEach((moneda) => {
    let btnMoneda = document.getElementById(`${moneda}`)
    btnMoneda.addEventListener('click', ()=> botonCambiarMoneda(moneda))
});

listaMonedas.forEach((moneda) => {
    const traerMoneda = async () => {
        url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${x}/currencies/${moneda}/ars.json`
        try {
            const response = await fetch(url)
            const data = await response.json();
            i = data.ars.toFixed(2)       
            monedaContainer = document.createElement('DIV')
            apiContainer.append(monedaContainer)
            monedaContainer.innerHTML = `${moneda.toUpperCase()} = $<b id='${moneda+moneda}'>${i}</b> ARS`
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

traerProductos(valorMoneda, tipoMoneda)
    .then((response) => {
        response.forEach(producto => {
            let productoContenedor = document.createElement('div');
            productosContenedor.append(productoContenedor);
            productoContenedor.classList.add('producto');
            productoContenedor.innerHTML = `
                <img src="${producto.img}" alt="${producto.nombre}">
                <div class="producto__descripcion">
                    <h3>Id: ${producto.id}</h3> 
                    <h3>${producto.nombre}</h3> 
                    <p class="precio precio_listado">$${(producto.precio/valorMoneda).toFixed(2)} ${tipoMoneda.toLocaleUpperCase()}</p>
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
    carrito.addEventListener('click', function () {aperturaCarrito(valorMoneda, tipoMoneda)});


};

let totalCarrito = 0
/*APERTURA CARRITO*/
const aperturaCarrito = (valorMoneda, tipoMoneda) => {
    carritoFinal.forEach(p => {
        totalCarrito += (p.precio/valorMoneda)*p.cantidad
    })
    carritoCaja.classList.add('mostrar_caja', 'productos');
    carritoCaja.innerHTML = `
        <div class='carrito_caja_titulo'>
            <h3>Carrito de compras</h3>
            <button id='botonCerrarCarrito' class="carrito_boton_masmenos"><i class="fa-solid fa-x fa-2x"></i></button>
        </div>
        <div class="carrito_total">
            <p>Total: $${totalCarrito.toFixed(2)}</p>
        </div>
        <div class='carrito_caja_pie'>
            <button id='botonLimpiarCarrito'>Vaciar carrito</button>
            <button id='confirmar_compra'>Comprar</button>
        </div>
    `;

    tienda.classList.add('ocultar_tienda')

    if(valorMoneda && tipoMoneda) {
        valorMoneda = valorMoneda;
        tipoMoneda = tipoMoneda;
    }else {
        valorMoneda = 1;
        tipoMoneda = 'ars'
    }
    
    carritoFinal.forEach(producto => {
        
        productoCarrito = document.createElement('div');
        carritoCaja.append(productoCarrito);
        productoCarrito.classList.add('producto');
        productoCarrito.innerHTML = `
            <img src="${producto.img}" alt="">
            <div class="producto__descripcion">
                <h3>Cantidad: ${producto.cantidad}</h3> 
                <h3>${producto.nombre}</h3> 
                <p class="precio precio_carrito_listado">$${((producto.precio/valorMoneda)*producto.cantidad).toFixed(2)} ${tipoMoneda.toLocaleUpperCase()}</p>
            </div>
            <div class='masmenos'>
                <button class="carrito_boton_masmenos" id="carrito_boton_sumar${producto.id}"><i class="fa-solid fa-plus fa-2x"></i></button>
                <button class="carrito_boton_masmenos" id="carrito_boton_restar${producto.id}"><i class="fa-solid fa-minus fa-2x"></i></button>
            </div>  
            `;

        botonRestar = document.getElementById(`carrito_boton_restar${producto.id}`)
        botonSumar = document.getElementById(`carrito_boton_sumar${producto.id}`)
        botonRestar.addEventListener('click', ()=> restarProducto(producto.id))
        botonSumar.addEventListener('click', ()=> sumarProducto(producto.id))
    })

    botonCerrarCarrito = document.getElementById('botonCerrarCarrito');
    botonCerrarCarrito.addEventListener('click', () => cerrarCarrito());

    botonLimpiarCarrito = document.getElementById('botonLimpiarCarrito');
    botonLimpiarCarrito.classList.add('carrito_boton')
    botonLimpiarCarrito.addEventListener('click', () => limpiarCarrito('¿Desea vaciar el carrito?'))

    confirmar_compra = document.getElementById('confirmar_compra');
    confirmar_compra.classList.add('carrito_boton')
    confirmar_compra.addEventListener('click', () => limpiarCarrito('¿Desea confirmar la compra?'))
    
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
    aperturaCarrito(valorMoneda, tipoMoneda);
    
}
/*SUMAR PRODUCTO*/
const sumarProducto = (id) => {
    let productoCarro = carritoFinal.find((item) => item.id === id);
    productoCarro.cantidad++;
    contadorProductos++
    localStorage.setItem('cant', contadorProductos)
    localStorage.setItem('carrito', JSON.stringify(carritoFinal))
    carrito.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> (${contadorProductos})`;
    aperturaCarrito(valorMoneda, tipoMoneda);
    
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
    aperturaCarrito(valorMoneda, tipoMoneda);
};

/*CERRAR CARRITO*/

function cerrarCarrito() {
    carritoCaja.classList.remove('mostrar_caja', 'productos');
    tienda.classList.remove('ocultar_tienda')
}

/*LIMPIAR CARRITO*/
function limpiarCarrito(texto) {
    localStorage.clear();
    alertOk(texto);
}


/*SI EL CARRITO ESTA VACIO, NO TIENE EVENTO */
(carritoFinal.length == 0) || carrito.addEventListener('click', function () {aperturaCarrito(valorMoneda, tipoMoneda);}); 


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
            '¡Completado!',
            '',
            'success',
            setTimeout( () => {
                location. reload();
            }, 1000)
          )
        }
      })  
}



/*BOTONES PARA EL CAMBIO DE MONEDA */
let elementoRemover
let btnMoneda

const botonCambiarMoneda = (coin) => {
    elementoRemover = document.getElementById(`${coin}`)
    elementoRemover.remove()

    boton_cambio_moneda.innerHTML = `<i class="fa-solid fa-dollar-sign" id="${coin}">${coin.toString().toUpperCase()} </i>`
    let indice = listadoTotalMonedas.indexOf(coin);
    
    let elemento_a_ir_primero = listadoTotalMonedas.splice(indice, 1);
    listadoTotalMonedas.unshift(elemento_a_ir_primero);

    sublista_monedas.innerHTML = ''

    listadoTotalMonedas.forEach((moneda) => {
        if (boton_cambio_moneda.innerText !== `${moneda.toString().toLocaleUpperCase()}`) {
            sublista_monedas.innerHTML+= `<li id=${moneda} class='boton_moneda'>${moneda.toString().toLocaleUpperCase()}</li>`
            
        }
        
    })
    boton_cambio_moneda.appendChild(sublista_monedas)

    listadoTotalMonedas.forEach((moneda) => {
        if (boton_cambio_moneda.innerText !== `${moneda.toString().toLocaleUpperCase()}`) {
            btnMoneda = document.getElementById(`${moneda}`)
            btnMoneda.addEventListener('click', ()=> botonCambiarMoneda(moneda))
        }
        
    })

    cambiarMoneda(coin);
}


/*CAMBIO DE MONEDA */

// localStorage.setItem('moneda', listadoTotalMonedas[0])
// localStorage.setItem('valorMoneda', 1)

const cambiarMoneda = (coin) => {

    listadoPrecios = document.querySelectorAll('.precio_listado'); //lista de nodos de los precios
    listadoPreciosCarritos = document.querySelectorAll('.precio_carrito_listado'); //lista de nodos de los precios del carrito


    /*DOLAR - PESO */
    let pesoUsd = document.getElementById("usdusd");
    let dolarAPeso = pesoUsd.innerText;
    dolarAPeso = Number(dolarAPeso);
    const listaUsd = []

    /*EUR - PESO */
    let pesoEur = document.getElementById('eureur');
    let euroAPeso = pesoEur.innerText;
    euroAPeso = Number(euroAPeso);
    const listaEur = []

    /*CNY - PESO */
    let pesoCny = document.getElementById('cnycny');
    let cnyAPeso = pesoCny.innerText;
    cnyAPeso = Number(cnyAPeso);
    const listaCny = []

    /*RUB - PESO */
    let pesoRub = document.getElementById('rubrub');
    let rubAPeso = pesoRub.innerText;
    rubAPeso = Number(rubAPeso);
    const listaRub = []

    /*BRL - PESO */
    let pesoBrl = document.getElementById('brlbrl');
    let brlAPeso = pesoBrl.innerText;
    brlAPeso = Number(brlAPeso);
    const listaBrl = []
    
    if (coin == 'ars') {
        productos.forEach((p, indice) => {
            listadoPrecios[indice].innerText = `$${p.precio} ARS`
        })
        // valorMoneda = 1;
        // tipoMoneda = 'ARS'
        location.reload() //para que se actualice el precio del listado de productos en el carrito
        localStorage.setItem('moneda', coin)
        localStorage.setItem('valorMoneda', 1)
        console.log(valorMoneda, tipoMoneda)


    }else if (coin == 'usd') {
        
        productos.forEach((p) => {
            precioUsdFinal = p.precio/dolarAPeso
            listaUsd.push(precioUsdFinal)
        })
        cambiarDom(listaUsd ,coin)
        // valorMoneda = dolarAPeso;
        // tipoMoneda = 'USD'
        location.reload() //para que se actualice el precio del listado de productos en el carrito
        localStorage.setItem('moneda', coin)
        localStorage.setItem('valorMoneda', dolarAPeso)
        console.log(valorMoneda, tipoMoneda)
        
        
    }else if (coin == 'eur') {
        
        productos.forEach((p) => {
            precioEurFinal = p.precio/euroAPeso
            listaEur.push(precioEurFinal)
        })
        cambiarDom(listaEur ,coin)
        // valorMoneda = euroAPeso;
        // tipoMoneda = 'EUR'
        location.reload() //para que se actualice el precio del listado de productos en el carrito
        localStorage.setItem('moneda', coin)
        localStorage.setItem('valorMoneda', euroAPeso)
        console.log(valorMoneda, tipoMoneda)
        
    }else if (coin == 'cny') {
        
        productos.forEach((p) => {
            precioCnyFinal = p.precio/cnyAPeso
            listaCny.push(precioCnyFinal)
        })
        cambiarDom(listaCny ,coin)
        // valorMoneda = cnyAPeso;
        // tipoMoneda = 'CNY'
        location.reload() //para que se actualice el precio del listado de productos en el carrito
        localStorage.setItem('moneda', coin)
        localStorage.setItem('valorMoneda', cnyAPeso)
        console.log(valorMoneda, tipoMoneda)
        
    }else if (coin == 'rub') {
        
        productos.forEach((p) => {
            precioRubFinal = p.precio/rubAPeso
            listaRub.push(precioRubFinal)
        })
        cambiarDom(listaRub ,coin)
        // valorMoneda = rubAPeso;
        // tipoMoneda = 'RUB'
        location.reload() //para que se actualice el precio del listado de productos en el carrito
        localStorage.setItem('moneda', coin)
        localStorage.setItem('valorMoneda', rubAPeso)
        console.log(valorMoneda, tipoMoneda)
        
    }else if (coin == 'brl') {
        
        productos.forEach((p) => {
            precioBrlFinal = p.precio/brlAPeso
            listaBrl.push(precioBrlFinal)
        })
        cambiarDom(listaBrl ,coin)
        // valorMoneda = brlAPeso;
        // tipoMoneda = 'BRL'
        location.reload() //para que se actualice el precio del listado de productos en el carrito
        localStorage.setItem('moneda', coin)
        localStorage.setItem('valorMoneda', brlAPeso)
        console.log(valorMoneda, tipoMoneda)
        
    }

}


/*Asignar cambio de moneda al dom */
const cambiarDom = (lista, tipoMoneda) => {
    lista.forEach((valor, indice) => {
        listadoPrecios[indice].innerText = `$${valor.toFixed(2)} ${tipoMoneda.toString().toLocaleUpperCase()}`
    }) 
}




