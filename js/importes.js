// ==========================================================
// importes.js · cálculo de importes del pedido
//
// Todas las cuentas se hacen en CÉNTIMOS ENTEROS (24,90 € → 2490).
// JavaScript suma mal los decimales (0.1 + 0.2 = 0.30000000000000004);
// con enteros no hay ese problema. Solo al mostrar se pasa a euros.
//
// Orden (sección 7 del briefing):
//   1. subtotal de productos
//   2. descuento (sobre los productos, nunca sobre el envío)
//   3. productos con descuento = subtotal − descuento
//   4. envío, según el modo y el umbral (mirado DESPUÉS del descuento)
//   5. total = productos con descuento + envío
//
// Son funciones pequeñas y "puras": reciben datos y devuelven un
// resultado, sin tocar la página ni localStorage. Por eso se pueden
// probar una a una desde la consola del navegador.
// ==========================================================

import { ENVIO, CODIGOS } from './config.js';
import { precioFinal, formatearPrecio } from './productos.js';

/** 24.9 → 2490 */
export function aCentimos(euros) {
  return Math.round(euros * 100);
}

/** 2490 → 24.9 */
export function aEuros(centimos) {
  return centimos / 100;
}

/** Paso 1. lineas: [{ producto, cantidad }] → céntimos */
export function calcularSubtotal(lineas) {
  return lineas.reduce((suma, l) => suma + aCentimos(precioFinal(l.producto)) * l.cantidad, 0);
}

/** Pone el código como se guarda en CODIGOS: sin espacios y en mayúsculas. */
export function normalizarCodigo(texto) {
  return String(texto ?? '').trim().toUpperCase();
}

/**
 * Comprueba un código contra un subtotal (en céntimos).
 * Devuelve { valido, codigo, porcentaje, error }.
 */
export function validarCodigo(texto, subtotal) {
  const codigo = normalizarCodigo(texto);
  if (!codigo) return { valido: false, codigo, porcentaje: 0, error: '' };

  const regla = CODIGOS[codigo];
  if (!regla) {
    return { valido: false, codigo, porcentaje: 0, error: `El código «${codigo}» no existe. Revisa que esté bien escrito.` };
  }
  if (subtotal < aCentimos(regla.minimo)) {
    return { valido: false, codigo, porcentaje: 0, error: `El código ${codigo} es válido para pedidos de ${formatearPrecio(regla.minimo)} o más.` };
  }
  return { valido: true, codigo, porcentaje: regla.porcentaje, error: '' };
}

/** Paso 2. Descuento en céntimos, redondeado al céntimo. */
export function calcularDescuento(subtotal, porcentaje) {
  return Math.round(subtotal * porcentaje / 100);
}

/** Paso 4. productosConDescuento en céntimos; entrega: "domicilio" | "recogida". */
export function calcularEnvio(productosConDescuento, entrega) {
  if (entrega === 'recogida') return aCentimos(ENVIO.costeRecogida);
  if (productosConDescuento === 0) return 0; // carrito vacío: no hay nada que enviar
  if (productosConDescuento >= aCentimos(ENVIO.umbralGratis)) return 0;
  return aCentimos(ENVIO.costeDomicilio);
}

/** Cuánto falta (en céntimos) para el envío gratis. 0 si ya se llega. */
export function faltaParaEnvioGratis(productosConDescuento) {
  return Math.max(0, aCentimos(ENVIO.umbralGratis) - productosConDescuento);
}

/**
 * Todos los pasos juntos.
 * pedido: { codigo: "BIENVENIDA10" | "", entrega: "domicilio" | "recogida" }
 * Devuelve todos los importes en céntimos y el resultado del código.
 */
export function calcularImportes(lineas, { codigo = '', entrega = 'domicilio' } = {}) {
  const subtotal = calcularSubtotal(lineas);
  const resultadoCodigo = validarCodigo(codigo, subtotal);
  const descuento = resultadoCodigo.valido ? calcularDescuento(subtotal, resultadoCodigo.porcentaje) : 0;
  const productos = subtotal - descuento;
  const envio = calcularEnvio(productos, entrega);
  const total = productos + envio;

  return {
    subtotal,
    descuento,
    productos,
    envio,
    total,
    entrega,
    codigo: resultadoCodigo,
    faltaEnvioGratis: entrega === 'domicilio' ? faltaParaEnvioGratis(productos) : 0
  };
}
