// ==========================================================
// ficha.js · producto.html?id=3
// Una sola página sirve para todos los productos: lee el número
// que va después de "?id=" en la dirección y busca ese producto
// en productos.json.
// ==========================================================

import './layout.js';
import { buscarPorId, htmlPrecio, escapar, estaEnOferta, precioFinal, formatearPrecio } from './productos.js';
import { anadirAlCarrito } from './carrito.js';
import { CATEGORIAS, CARRITO } from './config.js';

const contenedor = document.getElementById('ficha');
const migaActual = document.getElementById('miga-actual');

/** Lee el id de la URL. Devuelve un número entero o null. */
export function leerIdDeURL(search = location.search) {
  const valor = new URLSearchParams(search).get('id');
  if (!valor || !/^\d+$/.test(valor)) return null;
  return Number(valor);
}

function ponerMetadatos(titulo, descripcion) {
  document.title = `${titulo} · Boutique Lino y Alba`;
  document.querySelector('meta[name="description"]').setAttribute('content', descripcion);
}

function pintarNoEncontrado() {
  ponerMetadatos('Producto no encontrado', 'No hemos encontrado este producto en Boutique Lino y Alba.');
  // Pide a los buscadores que no guarden esta página de error
  document.head.insertAdjacentHTML('beforeend', '<meta name="robots" content="noindex">');
  migaActual.textContent = 'Producto no encontrado';
  contenedor.innerHTML = `
    <div class="sin-resultados">
      <h1>No hemos encontrado este producto</h1>
      <p>Puede que el enlace esté mal escrito o que la prenda ya no esté en la tienda.</p>
      <a class="boton" href="tienda.html">Ir a la tienda</a>
    </div>`;
}

/**
 * Grupo de opciones (talla o color) con botones de radio.
 * Si solo hay una opción, va marcada de serie.
 */
function htmlOpciones(nombre, titulo, opciones) {
  const unica = opciones.length === 1;
  const items = opciones.map((op, i) => `
    <label class="opcion">
      <input type="radio" name="${nombre}" value="${escapar(op)}"${unica || (nombre === 'color' && i === 0) ? ' checked' : ''}>
      <span>${escapar(op)}</span>
    </label>`).join('');

  return `
    <fieldset class="selector" aria-describedby="error-${nombre}">
      <legend>${titulo}</legend>
      <div class="selector__opciones">${items}</div>
      <p class="error-campo" id="error-${nombre}" hidden></p>
    </fieldset>`;
}

function pintarProducto(p) {
  const nombre = escapar(p.nombre);
  const categoria = CATEGORIAS[p.categoria] ?? p.categoria;

  ponerMetadatos(
    p.nombre,
    `${p.nombre} por ${formatearPrecio(precioFinal(p))} (IVA incluido). Tallas ${p.tallas.join(', ')}. Cambios y devoluciones en 14 días.`
  );
  migaActual.textContent = p.nombre;

  const etiquetas = [];
  if (!p.stock) etiquetas.push('<span class="etiqueta etiqueta--agotado">Agotado</span>');
  if (estaEnOferta(p)) etiquetas.push('<span class="etiqueta etiqueta--oferta">Oferta</span>');
  if (p.novedad) etiquetas.push('<span class="etiqueta etiqueta--novedad">Novedad</span>');

  const compra = p.stock
    ? `
      <form class="ficha__compra" id="form-compra" novalidate>
        ${htmlOpciones('talla', 'Talla', p.tallas)}
        ${htmlOpciones('color', 'Color', p.colores)}
        <button class="boton boton--ancho" type="submit">Añadir al carrito</button>
        <div class="aviso-anadido" id="aviso-anadido" role="status"></div>
      </form>`
    : `
      <div class="mensaje-error">
        <p><strong>Agotado de momento.</strong> Esta prenda no se puede comprar ahora mismo.</p>
        <p>Tallas: ${p.tallas.map(escapar).join(', ')} · Colores: ${p.colores.map(escapar).join(', ')}</p>
        <a class="boton boton--secundario boton--pequeno" href="tienda.html">Ver otras prendas</a>
      </div>`;

  contenedor.innerHTML = `
    <article class="ficha${p.stock ? '' : ' tarjeta--agotada'}">
      <div class="ficha__foto tarjeta__foto">
        <img src="${escapar(p.imagen)}" alt="${nombre}" width="600" height="750">
        ${etiquetas.length ? `<div class="etiquetas">${etiquetas.join('')}</div>` : ''}
      </div>
      <div class="ficha__info">
        <span class="antetitulo">${escapar(categoria)}</span>
        <h1>${nombre}</h1>
        <div class="ficha__precio">
          ${htmlPrecio(p)}
          <span class="iva">IVA incluido</span>
        </div>
        <p class="ficha__descripcion">${escapar(p.descripcion)}</p>
        ${compra}
        <aside class="ficha__devoluciones">
          <h2>Cambios y devoluciones</h2>
          <p>Tienes 14 días desde que recibes tu pedido para cambiarlo o devolverlo, siempre que la prenda esté sin usar y con su etiqueta. <a href="condiciones-venta.html">Ver condiciones</a></p>
          <p>¿Dudas con la talla? <a href="informacion.html">Escríbenos</a> y te ayudamos a elegir.</p>
        </aside>
      </div>
    </article>`;

  if (p.stock) activarCompra(p);
}

function mostrarError(nombre, mensaje) {
  const error = document.getElementById(`error-${nombre}`);
  error.textContent = mensaje;
  error.hidden = !mensaje;
}

function activarCompra(p) {
  const form = document.getElementById('form-compra');
  const aviso = document.getElementById('aviso-anadido');

  // Al elegir una opción, se borra el error de ese grupo
  form.addEventListener('change', (e) => mostrarError(e.target.name, ''));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const talla = form.talla.value;   // "" si no se ha elegido
    const color = form.color.value;

    mostrarError('talla', talla ? '' : 'Elige una talla para continuar.');
    mostrarError('color', color ? '' : 'Elige un color para continuar.');
    if (!talla || !color) {
      aviso.innerHTML = '';
      form.querySelector(`input[name="${!talla ? 'talla' : 'color'}"]`).focus();
      return;
    }

    const { cantidad, limitado } = anadirAlCarrito({ id: p.id, talla, color });
    const detalle = `${escapar(p.nombre)}, talla ${escapar(talla)}, ${escapar(color)}`;

    aviso.innerHTML = limitado
      ? `<p>Ya tienes ${cantidad} unidades de ${detalle} en tu carrito, que es el máximo por prenda (${CARRITO.cantidadMax}).</p>
         <a class="boton boton--pequeno" href="carrito.html">Ver carrito</a>`
      : `<p>Añadido: ${detalle}.${cantidad > 1 ? ` Ahora tienes ${cantidad} en tu carrito.` : ''}</p>
         <a class="boton boton--pequeno" href="carrito.html">Ver carrito</a>
         <a class="boton boton--secundario boton--pequeno" href="tienda.html">Seguir comprando</a>`;
  });
}

async function iniciar() {
  const id = leerIdDeURL();
  let producto;
  try {
    producto = id === null ? undefined : await buscarPorId(id);
  } catch {
    contenedor.innerHTML = '<p class="mensaje-error" role="alert">No hemos podido cargar el producto. Recarga la página en unos segundos.</p>';
    return;
  }
  if (producto) pintarProducto(producto);
  else pintarNoEncontrado();
}

iniciar();
