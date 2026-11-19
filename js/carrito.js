// ==========================================================
// carrito.js · el carrito guardado en localStorage
//
// Qué se guarda (clave "linoyalba_carrito"), como texto JSON:
//   [ { "id": 1, "talla": "M", "color": "blanco", "cantidad": 2 }, ... ]
//
// NO se guarda el precio ni el nombre: se leen siempre de
// productos.json, así un cambio de precio se ve también en los
// carritos que ya existían. Tampoco se guarda ningún dato personal.
//
// Este archivo no toca la página. Cada vez que el carrito cambia,
// lanza el evento "carrito:cambio" y quien quiera (la cabecera, la
// página del carrito) lo escucha y se actualiza.
// ==========================================================

import { CARRITO } from './config.js';

const { claveStorage, cantidadMin, cantidadMax } = CARRITO;

export const EVENTO_CAMBIO = 'carrito:cambio';

/** Mantiene una cantidad entre el mínimo y el máximo (1 y 5). */
export function limitarCantidad(cantidad) {
  const n = Math.floor(Number(cantidad)) || cantidadMin;
  return Math.min(cantidadMax, Math.max(cantidadMin, n));
}

/** Identificador de una línea: producto + talla + color. */
export function claveLinea({ id, talla, color }) {
  return `${id}|${talla}|${color}`;
}

function esLineaValida(l) {
  return l && Number.isInteger(l.id) && typeof l.talla === 'string'
    && typeof l.color === 'string' && Number.isFinite(l.cantidad);
}

/** Lee el carrito. Si no hay nada, o está estropeado, devuelve []. */
export function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(claveStorage) ?? '[]');
    if (!Array.isArray(datos)) return [];
    return datos.filter(esLineaValida).map((l) => ({ ...l, cantidad: limitarCantidad(l.cantidad) }));
  } catch {
    return []; // texto que no es JSON, o navegador sin localStorage
  }
}

function guardarCarrito(lineas) {
  try {
    if (lineas.length) localStorage.setItem(claveStorage, JSON.stringify(lineas));
    else localStorage.removeItem(claveStorage);
  } catch {
    // Navegación privada estricta o almacenamiento lleno: el carrito
    // seguirá funcionando en esta página, pero no se recordará.
  }
  document.dispatchEvent(new CustomEvent(EVENTO_CAMBIO, { detail: { lineas } }));
}

/**
 * Añade un producto. Si ya existe la misma combinación de
 * producto + talla + color, suma la cantidad (hasta 5).
 * Devuelve { cantidad, limitado } para poder avisar a quien compra.
 */
export function anadirAlCarrito({ id, talla, color, cantidad = 1 }) {
  const lineas = leerCarrito();
  const clave = claveLinea({ id, talla, color });
  const existente = lineas.find((l) => claveLinea(l) === clave);

  const deseada = (existente ? existente.cantidad : 0) + cantidad;
  const final = Math.min(cantidadMax, deseada);

  if (existente) existente.cantidad = final;
  else lineas.push({ id, talla, color, cantidad: final });

  guardarCarrito(lineas);
  return { cantidad: final, limitado: deseada > cantidadMax };
}

export function cambiarCantidad(clave, cantidad) {
  const lineas = leerCarrito();
  const linea = lineas.find((l) => claveLinea(l) === clave);
  if (!linea) return;
  linea.cantidad = limitarCantidad(cantidad);
  guardarCarrito(lineas);
}

export function quitarLinea(clave) {
  guardarCarrito(leerCarrito().filter((l) => claveLinea(l) !== clave));
}

/** Vacía el carrito y olvida también el código y la forma de entrega. */
export function vaciarCarrito() {
  borrarPedido();
  guardarCarrito([]);
}

/**
 * Une cada línea guardada con su producto del catálogo.
 * Si una línea apunta a un producto que ya no existe, se descarta.
 */
export function unirConCatalogo(lineas, productos) {
  return lineas
    .map((linea) => ({ ...linea, producto: productos.find((p) => p.id === linea.id) }))
    .filter((l) => l.producto);
}

// ----------------------------------------------------------
// Opciones del pedido (clave "linoyalba_pedido"):
//   { "codigo": "BIENVENIDA10", "entrega": "domicilio" }
// Solo eso: ni nombres, ni correos, ni direcciones.
// ----------------------------------------------------------
const CLAVE_PEDIDO = 'linoyalba_pedido';
const PEDIDO_INICIAL = { codigo: '', entrega: 'domicilio' };

export function leerPedido() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_PEDIDO) ?? '{}');
    return {
      codigo: typeof datos.codigo === 'string' ? datos.codigo : PEDIDO_INICIAL.codigo,
      entrega: datos.entrega === 'recogida' ? 'recogida' : 'domicilio'
    };
  } catch {
    return { ...PEDIDO_INICIAL };
  }
}

/** Guarda solo los campos que se pasen: guardarPedido({ entrega: 'recogida' }) */
export function guardarPedido(cambios) {
  const pedido = { ...leerPedido(), ...cambios };
  try {
    localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido));
  } catch { /* sin almacenamiento: no se recordará */ }
  document.dispatchEvent(new CustomEvent(EVENTO_CAMBIO, { detail: { lineas: leerCarrito() } }));
  return pedido;
}

export function borrarPedido() {
  try { localStorage.removeItem(CLAVE_PEDIDO); } catch { /* nada que hacer */ }
}

/** Número total de prendas (suma de cantidades), para el contador. */
export function contarUnidades(lineas = leerCarrito()) {
  return lineas.reduce((total, l) => total + l.cantidad, 0);
}

// Si el carrito cambia en OTRA pestaña, el navegador avisa con el
// evento "storage". Lo convertimos en nuestro propio evento.
window.addEventListener('storage', (e) => {
  if (e.key === claveStorage || e.key === 'linoyalba_pedido' || e.key === null) {
    document.dispatchEvent(new CustomEvent(EVENTO_CAMBIO, { detail: { lineas: leerCarrito() } }));
  }
});
