// ==========================================================
// pagina-carrito.js · interfaz de carrito.html
// Líneas con cantidades (1 a 5), quitar, carrito vacío,
// forma de entrega, código de descuento y resumen de importes.
// ==========================================================

import './layout.js';
import { obtenerProductos, precioFinal, formatearPrecio, htmlPrecio, escapar } from './productos.js';
import {
  leerCarrito, cambiarCantidad, quitarLinea, claveLinea, unirConCatalogo,
  leerPedido, guardarPedido, EVENTO_CAMBIO
} from './carrito.js';
import { calcularImportes, validarCodigo, calcularSubtotal } from './importes.js';
import { htmlImportes, htmlFaltaEnvioGratis } from './vista-importes.js';
import { CARRITO, ENVIO } from './config.js';

const contenido = document.getElementById('carrito-contenido');
const estado = document.getElementById('estado-carrito');
const titulo = document.getElementById('titulo-carrito');

let catalogo = [];
let errorCodigo = ''; // mensaje del último intento fallido de código

function htmlVacio() {
  return `
    <div class="sin-resultados">
      <h2>Tu carrito está vacío</h2>
      <p>Cuando añadas alguna prenda, la verás aquí.</p>
      <a class="boton" href="tienda.html">Ir a la tienda</a>
    </div>`;
}

function htmlLinea(l) {
  const p = l.producto;
  const clave = escapar(claveLinea(l));
  const nombre = escapar(p.nombre);
  const descripcion = `${nombre}, talla ${escapar(l.talla)}, ${escapar(l.color)}`;
  const totalLinea = precioFinal(p) * l.cantidad;

  return `
    <li class="linea${p.stock ? '' : ' linea--agotada'}" data-clave="${clave}">
      <a class="linea__foto" href="producto.html?id=${p.id}" tabindex="-1" aria-hidden="true">
        <img src="${escapar(p.imagen)}" alt="" width="120" height="150" loading="lazy">
      </a>
      <div class="linea__info">
        <h2 class="linea__nombre"><a href="producto.html?id=${p.id}">${nombre}</a></h2>
        <p class="linea__detalle">Talla: ${escapar(l.talla)} · Color: ${escapar(l.color)}</p>
        ${htmlPrecio(p)}
        ${p.stock ? '' : '<p class="error-campo">Esta prenda se ha agotado y no cuenta en el total. Quítala para poder finalizar el pedido.</p>'}
      </div>
      <div class="linea__acciones">
        <div class="cantidad" role="group" aria-label="Cantidad de ${descripcion}">
          <button type="button" data-accion="restar" aria-label="Quitar una unidad de ${descripcion}"${l.cantidad <= CARRITO.cantidadMin ? ' disabled' : ''}>−</button>
          <span class="cantidad__valor">${l.cantidad}</span>
          <button type="button" data-accion="sumar" aria-label="Añadir una unidad de ${descripcion}"${l.cantidad >= CARRITO.cantidadMax ? ' disabled' : ''}>+</button>
        </div>
        <p class="linea__total"><span class="solo-lectores">Total de la línea: </span>${formatearPrecio(totalLinea)}</p>
        <button type="button" class="enlace-boton" data-accion="quitar" aria-label="Quitar ${descripcion} del carrito">Quitar</button>
      </div>
    </li>`;
}

function htmlEntrega(entrega) {
  const umbral = formatearPrecio(ENVIO.umbralGratis);
  const coste = formatearPrecio(ENVIO.costeDomicilio);
  return `
    <fieldset class="selector selector--bloque">
      <legend>¿Cómo quieres recibirlo?</legend>
      <label class="opcion-bloque">
        <input type="radio" name="entrega" value="domicilio"${entrega === 'domicilio' ? ' checked' : ''}>
        <span><strong>Envío a domicilio</strong><small>${coste}; gratis desde ${umbral}</small></span>
      </label>
      <label class="opcion-bloque">
        <input type="radio" name="entrega" value="recogida"${entrega === 'recogida' ? ' checked' : ''}>
        <span><strong>Recogida en tienda</strong><small>Gratis · Calle Mayor 5, Fuente Alta</small></span>
      </label>
    </fieldset>`;
}

function htmlCodigo(imp) {
  if (imp.codigo.valido) {
    return `
      <div class="codigo codigo--aplicado">
        <p>Código <strong>${escapar(imp.codigo.codigo)}</strong> aplicado: ${imp.codigo.porcentaje} % en los productos.</p>
        <button type="button" class="enlace-boton" id="quitar-codigo">Quitar código</button>
      </div>`;
  }
  // Un código guardado que ha dejado de cumplir el mínimo también da error
  const error = errorCodigo || imp.codigo.error;
  return `
    <form class="codigo" id="form-codigo" novalidate>
      <label for="codigo">Código de descuento</label>
      <div class="codigo__fila">
        <input type="text" id="codigo" name="codigo" autocomplete="off" autocapitalize="characters" spellcheck="false"
          value="${escapar(imp.codigo.codigo)}"${error ? ' aria-invalid="true" aria-describedby="error-codigo"' : ''}>
        <button class="boton boton--secundario boton--pequeno" type="submit" id="aplicar-codigo">Aplicar</button>
      </div>
      <p class="error-campo" id="error-codigo"${error ? '' : ' hidden'}>${escapar(error)}</p>
      <p class="pista">Solo se puede usar un código por pedido.</p>
    </form>`;
}

function pintar() {
  const todas = unirConCatalogo(leerCarrito(), catalogo);

  if (!todas.length) {
    contenido.innerHTML = htmlVacio();
    return;
  }

  // Las prendas agotadas se ven, pero no cuentan en los importes
  const disponibles = todas.filter((l) => l.producto.stock);
  const hayAgotadas = disponibles.length < todas.length;
  const pedido = leerPedido();
  const imp = calcularImportes(disponibles, pedido);

  const botonFinalizar = hayAgotadas || !disponibles.length
    ? `<button class="boton boton--ancho" type="button" disabled aria-describedby="aviso-agotadas">Finalizar pedido</button>
       <p class="error-campo" id="aviso-agotadas">Quita las prendas agotadas para continuar.</p>`
    : '<a class="boton boton--ancho" href="checkout.html">Finalizar pedido</a>';

  contenido.innerHTML = `
    <div class="carrito-rejilla">
      <ul class="lineas">${todas.map(htmlLinea).join('')}</ul>
      <aside class="resumen" aria-labelledby="titulo-resumen">
        <h2 id="titulo-resumen">Resumen</h2>
        ${htmlEntrega(pedido.entrega)}
        ${htmlCodigo(imp)}
        ${htmlImportes(imp)}
        ${htmlFaltaEnvioGratis(imp)}
        ${botonFinalizar}
        <p class="pista">Tienda de demostración: no se realizará ningún pedido ni cargo.</p>
        <a class="enlace-seguir" href="tienda.html">Seguir comprando</a>
      </aside>
    </div>`;
}

/** Repinta y devuelve el foco al elemento con ese id (si sigue existiendo). */
function pintarManteniendoFoco(id) {
  pintar();
  if (id) document.getElementById(id)?.focus();
}

/** Tras repintar, devuelve el foco al mismo botón para no perder el sitio con el teclado. */
function recolocarFoco(clave, accion) {
  const linea = [...contenido.querySelectorAll('.linea')].find((li) => li.dataset.clave === clave);
  if (!linea) return;
  let boton = linea.querySelector(`[data-accion="${accion}"]`);
  if (boton?.disabled) boton = linea.querySelector(`[data-accion="${accion === 'sumar' ? 'restar' : 'sumar'}"]`);
  boton?.focus();
}

// ---------- Eventos ----------

// Cantidades y quitar líneas
contenido.addEventListener('click', (e) => {
  if (e.target.id === 'quitar-codigo') {
    errorCodigo = '';
    guardarPedido({ codigo: '' });
    estado.textContent = 'Código quitado.';
    document.getElementById('codigo')?.focus();
    return;
  }

  const boton = e.target.closest('button[data-accion]');
  if (!boton) return;
  const clave = boton.closest('.linea').dataset.clave;
  const linea = leerCarrito().find((l) => claveLinea(l) === clave);
  if (!linea) return;

  const accion = boton.dataset.accion;
  if (accion === 'quitar') {
    quitarLinea(clave);
    estado.textContent = 'Producto quitado del carrito.';
    titulo.focus();
    return;
  }

  cambiarCantidad(clave, linea.cantidad + (accion === 'sumar' ? 1 : -1));
  const nueva = leerCarrito().find((l) => claveLinea(l) === clave)?.cantidad;
  estado.textContent = `Cantidad: ${nueva}.`;
  recolocarFoco(clave, accion);
});

// Forma de entrega
contenido.addEventListener('change', (e) => {
  if (e.target.name !== 'entrega') return;
  guardarPedido({ entrega: e.target.value }); // lanza el evento → repinta
  const radio = contenido.querySelector(`input[name="entrega"][value="${e.target.value}"]`);
  radio?.focus();
});

// Código de descuento
contenido.addEventListener('submit', (e) => {
  if (e.target.id !== 'form-codigo') return;
  e.preventDefault();

  const texto = e.target.codigo.value;
  const disponibles = unirConCatalogo(leerCarrito(), catalogo).filter((l) => l.producto.stock);
  const resultado = validarCodigo(texto, calcularSubtotal(disponibles));

  if (!resultado.codigo) {
    errorCodigo = 'Escribe un código para aplicarlo.';
    pintarManteniendoFoco('codigo');
    return;
  }
  if (!resultado.valido) {
    // El código inventado NO se guarda: el total no cambia
    errorCodigo = resultado.error;
    pintarManteniendoFoco('codigo');
    estado.textContent = resultado.error;
    return;
  }

  errorCodigo = '';
  guardarPedido({ codigo: resultado.codigo }); // repinta con el descuento
  estado.textContent = `Código ${resultado.codigo} aplicado.`;
  document.getElementById('quitar-codigo')?.focus();
});

async function iniciar() {
  try {
    catalogo = await obtenerProductos();
  } catch {
    contenido.innerHTML = '<p class="mensaje-error" role="alert">No hemos podido cargar tu carrito. Recarga la página en unos segundos.</p>';
    return;
  }
  pintar();
  // Cualquier cambio del carrito (aquí o en otra pestaña) repinta la página
  document.addEventListener(EVENTO_CAMBIO, pintar);
}

iniciar();
