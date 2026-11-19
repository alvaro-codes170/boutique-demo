// ==========================================================
// validacion.js · reglas del formulario de finalizar pedido
// Funciones puras: reciben los datos y devuelven los errores.
// ==========================================================

import { METODOS_PAGO } from './config.js';

const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RE_CP = /^\d{5}$/;

/** Quita espacios, guiones, puntos y el prefijo +34 / 0034. */
export function limpiarTelefono(texto) {
  return String(texto).replace(/[\s.\-()]/g, '').replace(/^(\+34|0034)/, '');
}

const reglas = {
  nombre: (d) => (d.nombre.trim().length >= 2 ? '' : 'Escribe tu nombre.'),
  apellidos: (d) => (d.apellidos.trim().length >= 2 ? '' : 'Escribe tus apellidos.'),
  correo: (d) => {
    if (!d.correo.trim()) return 'Escribe tu correo electrónico.';
    return RE_CORREO.test(d.correo.trim()) ? '' : 'Revisa el correo: debe tener la forma nombre@dominio.es.';
  },
  telefono: (d) => {
    if (!d.telefono.trim()) return 'Escribe tu teléfono.';
    return /^[6789]\d{8}$/.test(limpiarTelefono(d.telefono))
      ? '' : 'Revisa el teléfono: deben ser 9 cifras, por ejemplo 600 000 000.';
  },
  entrega: (d) => (['domicilio', 'recogida'].includes(d.entrega) ? '' : 'Elige cómo quieres recibir tu pedido.'),
  // Dirección y código postal solo se exigen con envío a domicilio
  direccion: (d) => {
    if (d.entrega !== 'domicilio') return '';
    return d.direccion.trim().length >= 5 ? '' : 'Escribe la dirección de entrega (calle, número, piso y localidad).';
  },
  cp: (d) => {
    if (d.entrega !== 'domicilio') return '';
    if (!d.cp.trim()) return 'Escribe el código postal.';
    return RE_CP.test(d.cp.trim()) ? '' : 'El código postal debe tener 5 cifras, por ejemplo 28996.';
  },
  pago: (d) => {
    const metodo = METODOS_PAGO.find((m) => m.valor === d.pago);
    if (!metodo) return 'Elige un método de pago.';
    if (metodo.soloRecogida && d.entrega !== 'recogida') return 'El pago en tienda solo es posible si recoges el pedido en la tienda.';
    return '';
  },
  condiciones: (d) => (d.condiciones ? '' : 'Tienes que aceptar las condiciones de venta para continuar.'),
  privacidad: (d) => (d.privacidad ? '' : 'Tienes que aceptar la política de privacidad para continuar.')
};

/** Orden de los campos en el formulario (para llevar el foco al primer error). */
export const CAMPOS = Object.keys(reglas);

/** Devuelve el mensaje de error de un campo, o "" si está bien. */
export function validarCampo(campo, datos) {
  return reglas[campo](datos);
}

/** Devuelve { campo: mensaje } solo con los campos que tienen error. */
export function validarPedido(datos) {
  const errores = {};
  for (const campo of CAMPOS) {
    const error = validarCampo(campo, datos);
    if (error) errores[campo] = error;
  }
  return errores;
}
