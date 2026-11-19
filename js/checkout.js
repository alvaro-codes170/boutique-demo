// ==========================================================
// checkout.js · finalizar pedido (SIMULADO)
// Los datos del formulario solo se usan para pintar la pantalla
// de confirmación: no se guardan ni se envían a ningún sitio.
// ==========================================================

import './layout.js';
import { obtenerProductos, formatearPrecio, precioFinal, escapar } from './productos.js';
import { leerCarrito, unirConCatalogo, leerPedido, guardarPedido, vaciarCarrito } from './carrito.js';
import { calcularImportes } from './importes.js';
import { htmlImportes } from './vista-importes.js';
import { validarPedido, validarCampo, CAMPOS } from './validacion.js';
import { METODOS_PAGO, ENTREGAS, TIENDA } from './config.js';

const contenido = document.getElementById('checkout-contenido');
const titulo = document.getElementById('titulo-checkout');

let lineas = [];
let intentado = false; // tras el primer intento, los errores se actualizan al escribir

// ---------- Plantillas ----------

function htmlCampo({ id, etiqueta, tipo = 'text', autocompletar, ayuda = '', extra = '' }) {
  const describe = [ayuda && `ayuda-${id}`, `error-${id}`].filter(Boolean).join(' ');
  return `
    <div class="campo campo--form" data-campo="${id}">
      <label for="${id}">${etiqueta}</label>
      ${ayuda ? `<p class="pista" id="ayuda-${id}">${ayuda}</p>` : ''}
      <input type="${tipo}" id="${id}" name="${id}" autocomplete="${autocompletar}" aria-describedby="${describe}" aria-required="true" ${extra}>
      <p class="error-campo" id="error-${id}" hidden></p>
    </div>`;
}

function htmlMetodosPago(entrega) {
  return METODOS_PAGO
    .filter((m) => !m.soloRecogida || entrega === 'recogida')
    .map((m) => `
      <label class="opcion-bloque">
        <input type="radio" name="pago" value="${m.valor}">
        <span><strong>${m.texto}</strong></span>
      </label>`).join('');
}

function htmlLineasResumen(ls) {
  return `
    <ul class="mini-lineas">
      ${ls.map((l) => `
        <li>
          <span>${l.cantidad} × ${escapar(l.producto.nombre)}<small>Talla ${escapar(l.talla)} · ${escapar(l.color)}</small></span>
          <span>${formatearPrecio(precioFinal(l.producto) * l.cantidad)}</span>
        </li>`).join('')}
    </ul>`;
}

function htmlFormulario(pedido) {
  return `
    <div class="carrito-rejilla">
      <form class="checkout" id="form-checkout" novalidate>
        <p class="pista">Todos los campos son obligatorios.</p>
        <fieldset class="bloque-form">
          <legend>Tus datos</legend>
          <div class="dos-columnas">
            ${htmlCampo({ id: 'nombre', etiqueta: 'Nombre', autocompletar: 'given-name' })}
            ${htmlCampo({ id: 'apellidos', etiqueta: 'Apellidos', autocompletar: 'family-name' })}
          </div>
          ${htmlCampo({ id: 'correo', etiqueta: 'Correo electrónico', tipo: 'email', autocompletar: 'email', extra: 'inputmode="email"' })}
          ${htmlCampo({ id: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', autocompletar: 'tel', extra: 'inputmode="tel"' })}
        </fieldset>

        <fieldset class="bloque-form" aria-describedby="error-entrega">
          <legend>Entrega</legend>
          <label class="opcion-bloque">
            <input type="radio" name="entrega" value="domicilio"${pedido.entrega === 'domicilio' ? ' checked' : ''}>
            <span><strong>${ENTREGAS.domicilio}</strong></span>
          </label>
          <label class="opcion-bloque">
            <input type="radio" name="entrega" value="recogida"${pedido.entrega === 'recogida' ? ' checked' : ''}>
            <span><strong>${ENTREGAS.recogida}</strong><small>${TIENDA.direccion}</small></span>
          </label>
          <p class="error-campo" id="error-entrega" hidden></p>

          <div id="grupo-direccion"${pedido.entrega === 'domicilio' ? '' : ' hidden'}>
            ${htmlCampo({ id: 'direccion', etiqueta: 'Dirección', autocompletar: 'street-address', ayuda: 'Calle, número, piso y localidad.' })}
            ${htmlCampo({ id: 'cp', etiqueta: 'Código postal', autocompletar: 'postal-code', extra: 'inputmode="numeric" maxlength="5"' })}
          </div>
        </fieldset>

        <fieldset class="bloque-form" aria-describedby="ayuda-pago error-pago">
          <legend>Método de pago</legend>
          <p class="pista" id="ayuda-pago">Es una demostración: no te pediremos ningún dato de pago.</p>
          <div id="metodos-pago">${htmlMetodosPago(pedido.entrega)}</div>
          <p class="error-campo" id="error-pago" hidden></p>
        </fieldset>

        <fieldset class="bloque-form">
          <legend>Condiciones</legend>
          <div class="campo--form" data-campo="condiciones">
            <label class="casilla casilla--texto">
              <input type="checkbox" id="condiciones" name="condiciones" aria-describedby="error-condiciones">
              <span>He leído y acepto las <a href="condiciones-venta.html" target="_blank" rel="noopener">condiciones de venta y desistimiento</a></span>
            </label>
            <p class="error-campo" id="error-condiciones" hidden></p>
          </div>
          <div class="campo--form" data-campo="privacidad">
            <label class="casilla casilla--texto">
              <input type="checkbox" id="privacidad" name="privacidad" aria-describedby="error-privacidad">
              <span>He leído y acepto la <a href="privacidad.html" target="_blank" rel="noopener">política de privacidad</a></span>
            </label>
            <p class="error-campo" id="error-privacidad" hidden></p>
          </div>
        </fieldset>

        <button class="boton boton--ancho" type="submit">Confirmar pedido de prueba</button>
        <p class="pista">Al confirmar no se realiza ningún pedido ni cargo, y no se guarda ninguno de tus datos.</p>
      </form>

      <aside class="resumen" aria-labelledby="titulo-resumen">
        <h2 id="titulo-resumen">Tu pedido</h2>
        ${htmlLineasResumen(lineas)}
        <div id="importes-checkout"></div>
        <a class="enlace-seguir" href="carrito.html">Volver al carrito</a>
      </aside>
    </div>`;
}

// ---------- Lectura y errores ----------

function leerFormulario(form) {
  return {
    nombre: form.nombre.value,
    apellidos: form.apellidos.value,
    correo: form.correo.value,
    telefono: form.telefono.value,
    entrega: form.querySelector('input[name="entrega"]:checked')?.value ?? '',
    direccion: form.direccion.value,
    cp: form.cp.value,
    pago: form.querySelector('input[name="pago"]:checked')?.value ?? '',
    condiciones: form.condiciones.checked,
    privacidad: form.privacidad.checked
  };
}

/** Muestra (o borra) el error junto a su campo. */
function mostrarError(campo, mensaje) {
  const error = document.getElementById(`error-${campo}`);
  if (!error) return;
  error.textContent = mensaje;
  error.hidden = !mensaje;
  // Campos de texto y casillas: se marcan como inválidos
  const input = document.getElementById(campo);
  if (input) input.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
}

/** Elemento al que llevar el foco si un campo tiene error. */
function elementoDeCampo(campo) {
  return document.getElementById(campo) ?? document.querySelector(`input[name="${campo}"]`);
}

function pintarImportes() {
  const imp = calcularImportes(lineas, leerPedido());
  document.getElementById('importes-checkout').innerHTML = htmlImportes(imp);
  return imp;
}

// ---------- Confirmación ----------

/** Número de pedido ficticio, por ejemplo LA-20261119-4821 */
export function numeroFicticio(fecha = new Date()) {
  const dia = fecha.toISOString().slice(0, 10).replace(/-/g, '');
  const azar = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `LA-${dia}-${azar}`;
}

function pintarConfirmacion(datos, imp, lineasPedido) {
  const metodo = METODOS_PAGO.find((m) => m.valor === datos.pago);
  const entrega = datos.entrega === 'domicilio'
    ? `${ENTREGAS.domicilio}: ${escapar(datos.direccion.trim())}, ${escapar(datos.cp.trim())}`
    : `${ENTREGAS.recogida}: ${TIENDA.direccion}. ${TIENDA.horario.join('. ')}.`;

  document.title = 'Pedido de prueba confirmado · Boutique Lino y Alba';
  titulo.textContent = 'Pedido de prueba confirmado';
  contenido.innerHTML = `
    <div class="confirmacion">
      <p class="confirmacion__saludo">Gracias, ${escapar(datos.nombre.trim())}.</p>
      <p>Número de pedido (ficticio): <strong class="confirmacion__numero">${numeroFicticio()}</strong></p>
      <p class="pista">No hemos guardado ni enviado tus datos, y no recibirás ningún correo.</p>

      <h2>Resumen</h2>
      <dl class="datos-pedido">
        <div><dt>Entrega</dt><dd>${entrega}</dd></div>
        <div><dt>Pago</dt><dd>${metodo.texto} (simulado)</dd></div>
        <div><dt>Contacto</dt><dd>${escapar(datos.correo.trim())} · ${escapar(datos.telefono.trim())}</dd></div>
      </dl>
      ${htmlLineasResumen(lineasPedido)}
      ${htmlImportes(imp)}

      <p class="centrado"><a class="boton" href="tienda.html">Volver a la tienda</a></p>
    </div>`;

  window.scrollTo(0, 0);
  titulo.focus();
}

// ---------- Eventos ----------

function activarFormulario() {
  const form = document.getElementById('form-checkout');

  form.addEventListener('change', (e) => {
    if (e.target.name === 'entrega') {
      const entrega = e.target.value;
      guardarPedido({ entrega }); // el carrito recuerda la elección
      document.getElementById('grupo-direccion').hidden = entrega !== 'domicilio';

      // El pago en tienda solo aparece con recogida
      const pagoActual = form.querySelector('input[name="pago"]:checked')?.value;
      document.getElementById('metodos-pago').innerHTML = htmlMetodosPago(entrega);
      const sigue = form.querySelector(`input[name="pago"][value="${pagoActual}"]`);
      if (sigue) sigue.checked = true;

      pintarImportes();
      if (intentado) ['direccion', 'cp', 'pago', 'entrega'].forEach((c) => mostrarError(c, validarCampo(c, leerFormulario(form))));
      return;
    }
    if (intentado && e.target.name) mostrarError(e.target.name, validarCampo(e.target.name, leerFormulario(form)));
  });

  form.addEventListener('input', (e) => {
    if (intentado && CAMPOS.includes(e.target.name)) {
      mostrarError(e.target.name, validarCampo(e.target.name, leerFormulario(form)));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    intentado = true;
    const datos = leerFormulario(form);
    const errores = validarPedido(datos);

    CAMPOS.forEach((campo) => mostrarError(campo, errores[campo] ?? ''));

    const primero = CAMPOS.find((c) => errores[c]);
    if (primero) {
      elementoDeCampo(primero)?.focus();
      return;
    }

    // Todo correcto: se calcula el resumen ANTES de vaciar el carrito
    const imp = calcularImportes(lineas, { ...leerPedido(), entrega: datos.entrega });
    const lineasPedido = lineas;
    vaciarCarrito();
    pintarConfirmacion(datos, imp, lineasPedido);
  });
}

async function iniciar() {
  let catalogo;
  try {
    catalogo = await obtenerProductos();
  } catch {
    contenido.innerHTML = '<p class="mensaje-error" role="alert">No hemos podido cargar tu pedido. Recarga la página en unos segundos.</p>';
    return;
  }

  const todas = unirConCatalogo(leerCarrito(), catalogo);

  if (!todas.length) {
    contenido.innerHTML = `
      <div class="sin-resultados">
        <h2>Tu carrito está vacío</h2>
        <p>Añade alguna prenda antes de finalizar el pedido.</p>
        <a class="boton" href="tienda.html">Ir a la tienda</a>
      </div>`;
    return;
  }

  if (todas.some((l) => !l.producto.stock)) {
    contenido.innerHTML = `
      <div class="mensaje-error">
        <p>Hay prendas agotadas en tu carrito. Quítalas para poder finalizar el pedido.</p>
        <a class="boton boton--pequeno" href="carrito.html">Volver al carrito</a>
      </div>`;
    return;
  }

  lineas = todas;
  contenido.innerHTML = htmlFormulario(leerPedido());
  pintarImportes();
  activarFormulario();
}

iniciar();
