// ==========================================================
// filtros.js · lógica pura de filtros y ordenación
// No toca la página: recibe datos y devuelve datos.
// Así se puede probar en la consola sin tocar el HTML.
// ==========================================================

import { precioFinal, estaEnOferta } from './productos.js';

/** Criterios "vacíos": con estos se ven todos los productos. */
export const CRITERIOS_INICIALES = Object.freeze({
  texto: '',
  categoria: 'todas',
  talla: 'todas',
  precioMax: null,      // null = sin límite
  soloOfertas: false,
  orden: 'novedades'
});

/** Minúsculas y sin tildes: "Jérsey " → "jersey" */
export function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

// Cada filtro es una pregunta de sí o no sobre un producto.
// Si el criterio está vacío, la respuesta es siempre "sí".
const comprobaciones = [
  (p, c) => !c.texto || normalizar(p.nombre).includes(normalizar(c.texto)),
  (p, c) => c.categoria === 'todas' || p.categoria === c.categoria,
  (p, c) => c.talla === 'todas' || p.tallas.includes(c.talla),
  (p, c) => c.precioMax == null || precioFinal(p) <= c.precioMax,
  (p, c) => !c.soloOfertas || estaEnOferta(p)
];

/** Un producto pasa solo si responde "sí" a TODAS las comprobaciones. */
export function cumpleCriterios(producto, criterios) {
  return comprobaciones.every((comprobar) => comprobar(producto, criterios));
}

export function filtrar(productos, criterios) {
  return productos.filter((p) => cumpleCriterios(p, criterios));
}

/**
 * Ordena sin modificar la lista original.
 * "novedades": primero los marcados como novedad y después el resto,
 * en el orden del catálogo (el briefing no da fechas de llegada).
 */
export function ordenar(productos, modo) {
  const copia = [...productos];
  const porId = (a, b) => a.id - b.id;

  switch (modo) {
    case 'precio-asc':
      return copia.sort((a, b) => precioFinal(a) - precioFinal(b) || porId(a, b));
    case 'precio-desc':
      return copia.sort((a, b) => precioFinal(b) - precioFinal(a) || porId(a, b));
    case 'novedades':
    default:
      return copia.sort((a, b) => Number(b.novedad) - Number(a.novedad) || porId(a, b));
  }
}

/** Filtrar y ordenar en un solo paso. */
export function aplicarCriterios(productos, criterios) {
  return ordenar(filtrar(productos, criterios), criterios.orden);
}
