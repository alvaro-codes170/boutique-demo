// ==========================================================
// layout.js · cabecera, pie, aviso de demo y WhatsApp
// Se escriben una sola vez aquí y se insertan en todas las páginas.
// Cada página indica cuál es con <body data-pagina="...">.
// ==========================================================

import { TIENDA, ENVIO, METODOS_PAGO } from './config.js';
import { contarUnidades, EVENTO_CAMBIO } from './carrito.js';

const ENLACES = [
  { pagina: 'inicio', href: 'index.html', texto: 'Inicio' },
  { pagina: 'tienda', href: 'tienda.html', texto: 'Tienda' },
  { pagina: 'informacion', href: 'informacion.html', texto: 'Información' }
];

const ICONO_BOLSA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>';
const ICONO_MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const ICONO_WHATSAPP = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';

function enlacesNav(paginaActual) {
  return ENLACES.map(({ pagina, href, texto }) =>
    `<li><a href="${href}"${pagina === paginaActual ? ' aria-current="page"' : ''}>${texto}</a></li>`
  ).join('');
}

function htmlCabecera(paginaActual) {
  return `
    <a class="saltar" href="#contenido">Saltar al contenido</a>
    <p class="aviso-demo">Tienda de demostración: ningún pedido ni pago es real.</p>
    <div class="cabecera">
      <div class="contenedor">
        <div class="cabecera__barra">
          <a class="logo" href="index.html">Lino <span>&amp;</span> Alba</a>
          <nav class="nav" aria-label="Principal">
            <ul>${enlacesNav(paginaActual)}</ul>
          </nav>
          <div class="cabecera__acciones">
            <a class="enlace-carrito" href="carrito.html" aria-label="Carrito"${paginaActual === 'carrito' ? ' aria-current="page"' : ''}>
              ${ICONO_BOLSA}
              <span class="contador" data-contador-carrito aria-hidden="true">0</span>
            </a>
            <button class="boton-menu" type="button" aria-expanded="false" aria-controls="nav-movil">
              ${ICONO_MENU}<span class="solo-lectores">Menú</span>
            </button>
          </div>
        </div>
        <nav class="nav-movil" id="nav-movil" aria-label="Principal (móvil)" hidden>
          <ul>${enlacesNav(paginaActual)}<li><a href="carrito.html">Carrito</a></li></ul>
        </nav>
      </div>
    </div>`;
}

function htmlPie() {
  const anio = new Date().getFullYear();
  return `
    <div class="contenedor">
      <div class="pie__rejilla">
        <div>
          <h2>Lino &amp; Alba</h2>
          <p>Moda de fibras naturales para mujer y hombre. Tienda de barrio en Fuente Alta desde 2014, ahora también online.</p>
        </div>
        <div>
          <h2>Visítanos</h2>
          <address>
            ${TIENDA.direccion}<br>
            <a href="tel:${TIENDA.telefonoEnlace}">${TIENDA.telefono}</a><br>
            <a href="mailto:${TIENDA.correo}">${TIENDA.correo}</a>
          </address>
        </div>
        <div>
          <h2>Horario</h2>
          <ul>${TIENDA.horario.map((linea) => `<li>${linea}</li>`).join('')}</ul>
        </div>
        <div>
          <h2>Ayuda y legal</h2>
          <ul>
            <li><a href="informacion.html">Envíos, cambios y devoluciones</a></li>
            <li><a href="condiciones-venta.html">Condiciones de venta y desistimiento</a></li>
            <li><a href="aviso-legal.html">Aviso legal</a></li>
            <li><a href="privacidad.html">Política de privacidad</a></li>
            <li><a href="cookies.html">Política de cookies</a></li>
          </ul>
        </div>
      </div>
      <p class="pie__legal">© ${anio} ${TIENDA.nombre} · Web de demostración con datos ficticios. Precios con IVA incluido.</p>
    </div>`;
}

function htmlWhatsapp() {
  const texto = encodeURIComponent('Hola, tengo una pregunta sobre la tienda.');
  return `
    <a class="whatsapp" href="https://wa.me/${TIENDA.whatsapp}?text=${texto}" target="_blank" rel="noopener">
      ${ICONO_WHATSAPP}<span>WhatsApp</span><span class="solo-lectores"> (se abre en una ventana nueva)</span>
    </a>`;
}

function activarMenuMovil() {
  const boton = document.querySelector('.boton-menu');
  const menu = document.getElementById('nav-movil');
  if (!boton || !menu) return;
  boton.addEventListener('click', () => {
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', String(!abierto));
    menu.hidden = abierto;
  });
}

/** Pone el número de prendas del carrito en el contador de la cabecera. */
export function actualizarContador(unidades = contarUnidades()) {
  document.querySelectorAll('[data-contador-carrito]').forEach((el) => {
    el.textContent = unidades;
  });
  const texto = unidades === 1 ? '1 producto' : `${unidades} productos`;
  document.querySelectorAll('.enlace-carrito').forEach((a) => {
    a.setAttribute('aria-label', `Carrito: ${texto}`);
  });
}

const formatoEuros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

/** Une una lista en español: ["a", "b", "c"] → "a, b y c" */
function unirLista(items) {
  return items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`;
}

/**
 * Datos que se repiten en los textos (información, condiciones de venta...).
 * En el HTML se escriben así: <span data-dato="envio-coste">4,95 €</span>
 * El texto de dentro es el de reserva; al cargar se sustituye por el valor
 * de config.js. Así, si cambia una regla, cambia en todas las páginas.
 */
const DATOS = {
  'envio-coste': () => formatoEuros.format(ENVIO.costeDomicilio),
  'envio-umbral': () => formatoEuros.format(ENVIO.umbralGratis),
  'metodos-pago': () => unirLista(METODOS_PAGO.map((m) => m.frase)),
  telefono: () => TIENDA.telefono,
  correo: () => TIENDA.correo,
  direccion: () => TIENDA.direccion,
  instagram: () => TIENDA.instagram
};

export function rellenarDatos(raiz = document) {
  raiz.querySelectorAll('[data-dato]').forEach((el) => {
    const valor = DATOS[el.dataset.dato];
    if (valor) el.textContent = valor();
  });
  raiz.querySelectorAll('[data-dato-horario]').forEach((ul) => {
    ul.innerHTML = TIENDA.horario.map((linea) => `<li>${linea}</li>`).join('');
  });
}

export function pintarLayout() {
  const pagina = document.body.dataset.pagina;
  const cabecera = document.getElementById('cabecera');
  const pie = document.getElementById('pie');
  if (cabecera) cabecera.innerHTML = htmlCabecera(pagina);
  if (pie) pie.innerHTML = htmlPie();
  document.body.insertAdjacentHTML('beforeend', htmlWhatsapp());
  activarMenuMovil();
  rellenarDatos();

  // El contador se pinta al cargar y cada vez que cambia el carrito
  // (en esta pestaña o en otra).
  actualizarContador();
  document.addEventListener(EVENTO_CAMBIO, (e) => actualizarContador(contarUnidades(e.detail.lineas)));
}

pintarLayout();
