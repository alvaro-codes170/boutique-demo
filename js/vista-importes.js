// ==========================================================
// vista-importes.js · cómo se MUESTRAN los importes
// (se usa en el carrito, en el checkout y en la confirmación)
// Los cálculos están en importes.js; aquí solo se pinta.
// ==========================================================

import { aEuros } from './importes.js';
import { formatearPrecio, escapar } from './productos.js';
import { ENTREGAS } from './config.js';

const euros = (centimos) => formatearPrecio(aEuros(centimos));

export function htmlImportes(imp) {
  const filaDescuento = imp.descuento > 0
    ? `<div class="importes__fila importes__fila--descuento">
         <dt>Descuento (${escapar(imp.codigo.codigo)}, ${imp.codigo.porcentaje} %)</dt>
         <dd>−${euros(imp.descuento)}</dd>
       </div>`
    : '';

  return `
    <dl class="importes">
      <div class="importes__fila"><dt>Subtotal de productos</dt><dd>${euros(imp.subtotal)}</dd></div>
      ${filaDescuento}
      <div class="importes__fila">
        <dt>${ENTREGAS[imp.entrega]}</dt>
        <dd>${imp.envio === 0 ? 'Gratis' : euros(imp.envio)}</dd>
      </div>
      <div class="importes__fila importes__fila--total"><dt>Total</dt><dd>${euros(imp.total)}</dd></div>
    </dl>
    <p class="iva importes__iva">IVA incluido</p>`;
}

/** Mensaje "Te faltan X € para el envío gratis", o vacío. */
export function htmlFaltaEnvioGratis(imp) {
  if (imp.entrega !== 'domicilio' || imp.faltaEnvioGratis === 0 || imp.subtotal === 0) return '';
  return `<p class="pista">Te faltan <strong>${euros(imp.faltaEnvioGratis)}</strong> para el envío gratis.</p>`;
}

export { euros };
