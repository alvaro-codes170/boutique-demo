// ==========================================================
// inicio.js · productos destacados de la portada
// ==========================================================

import './layout.js';
import { obtenerProductos, htmlTarjeta, estaEnOferta } from './productos.js';

const NUM_DESTACADOS = 4;

/**
 * Primero, los productos con stock marcados como novedad u oferta.
 * Si no llegan a 4 (en el catálogo actual hay 3), se completa con
 * los siguientes productos con stock, en el orden del catálogo.
 */
export function elegirDestacados(productos) {
  const conStock = productos.filter((p) => p.stock);
  const marcados = conStock.filter((p) => p.novedad || estaEnOferta(p));
  const resto = conStock.filter((p) => !marcados.includes(p));
  return [...marcados, ...resto].slice(0, NUM_DESTACADOS);
}

async function iniciar() {
  const rejilla = document.getElementById('destacados');
  try {
    const productos = await obtenerProductos();
    rejilla.innerHTML = elegirDestacados(productos).map(htmlTarjeta).join('');
  } catch {
    rejilla.innerHTML = '<li class="mensaje-error">No hemos podido cargar los productos destacados. <a href="tienda.html">Ver la tienda</a></li>';
  }
}

iniciar();
