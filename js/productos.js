// ==========================================================
// productos.js · cargar el catálogo y pintar tarjetas
// ==========================================================

let cache = null;

/** Carga data/productos.json una sola vez y lo reutiliza. */
export async function obtenerProductos() {
  if (cache) return cache;
  const respuesta = await fetch('data/productos.json');
  if (!respuesta.ok) throw new Error('No se pudo cargar el catálogo');
  cache = await respuesta.json();
  return cache;
}

/** Devuelve el producto con ese id, o undefined si no existe. */
export async function buscarPorId(id) {
  const productos = await obtenerProductos();
  return productos.find((p) => p.id === Number(id));
}

/** El precio que se paga: el de oferta si existe, si no el normal. */
export function precioFinal(producto) {
  return producto.precioOferta ?? producto.precio;
}

export function estaEnOferta(producto) {
  return producto.precioOferta != null && producto.precioOferta < producto.precio;
}

const formato = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

/** 24.9 → "24,90 €" */
export function formatearPrecio(euros) {
  return formato.format(euros);
}

/** Evita que un texto del JSON se interprete como HTML. */
export function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** HTML del precio, con el precio anterior tachado si está en oferta. */
export function htmlPrecio(producto) {
  if (estaEnOferta(producto)) {
    return `
      <p class="precio precio--oferta">
        <span class="precio__actual"><span class="solo-lectores">Precio de oferta: </span>${formatearPrecio(producto.precioOferta)}</span>
        <del class="precio__anterior"><span class="solo-lectores">Antes: </span>${formatearPrecio(producto.precio)}</del>
      </p>`;
  }
  return `<p class="precio"><span class="precio__actual">${formatearPrecio(producto.precio)}</span></p>`;
}

/** HTML de una tarjeta de producto para las rejillas. */
export function htmlTarjeta(producto) {
  const enlace = `producto.html?id=${producto.id}`;
  const nombre = escapar(producto.nombre);

  const etiquetas = [];
  if (!producto.stock) etiquetas.push('<span class="etiqueta etiqueta--agotado">Agotado</span>');
  if (estaEnOferta(producto)) etiquetas.push('<span class="etiqueta etiqueta--oferta">Oferta</span>');
  if (producto.novedad) etiquetas.push('<span class="etiqueta etiqueta--novedad">Novedad</span>');

  const pie = producto.stock
    ? `<a class="boton boton--pequeno" href="${enlace}" aria-label="Elegir talla de ${nombre}">Elegir talla</a>`
    : '<span class="agotado-texto">Agotado</span>';

  return `
    <li>
      <article class="tarjeta${producto.stock ? '' : ' tarjeta--agotada'}">
        <div class="tarjeta__foto">
          <img src="${escapar(producto.imagen)}" alt="${nombre}" width="600" height="750" loading="lazy" decoding="async">
          ${etiquetas.length ? `<div class="etiquetas">${etiquetas.join('')}</div>` : ''}
        </div>
        <div class="tarjeta__cuerpo">
          <h3 class="tarjeta__nombre"><a href="${enlace}">${nombre}</a></h3>
          ${htmlPrecio(producto)}
          <p class="tarjeta__tallas">Tallas: ${producto.tallas.map(escapar).join(', ')}</p>
          <div class="tarjeta__pie">${pie}</div>
        </div>
      </article>
    </li>`;
}
