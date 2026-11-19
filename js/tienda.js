// ==========================================================
// tienda.js · conecta el formulario de filtros con filtros.js
// Lee los controles → arma un objeto "criterios" → pide la lista
// filtrada y ordenada → la pinta.
// ==========================================================

import './layout.js';
import { obtenerProductos, htmlTarjeta } from './productos.js';
import { CRITERIOS_INICIALES, aplicarCriterios } from './filtros.js';

const formulario = document.getElementById('filtros-form');
const rejilla = document.getElementById('rejilla');
const contador = document.getElementById('num-resultados');
const vacio = document.getElementById('sin-resultados');
const selectOrden = document.getElementById('orden');
const rango = document.getElementById('precio-max');
const rangoValor = document.getElementById('precio-max-valor');

const PRECIO_SIN_LIMITE = Number(rango.max);

let productos = [];

/** Lee los controles del formulario y devuelve los criterios. */
function leerCriterios() {
  const precio = Number(rango.value);
  return {
    texto: formulario.texto.value,
    categoria: formulario.categoria.value,
    talla: formulario.talla.value,
    precioMax: precio >= PRECIO_SIN_LIMITE ? null : precio,
    soloOfertas: formulario.soloOfertas.checked,
    orden: selectOrden.value
  };
}

function textoRango() {
  const precio = Number(rango.value);
  const texto = precio >= PRECIO_SIN_LIMITE ? 'Sin límite' : `Hasta ${precio} €`;
  rangoValor.textContent = texto;
  rango.setAttribute('aria-valuetext', texto);
}

function pintar() {
  textoRango();
  const lista = aplicarCriterios(productos, leerCriterios());

  rejilla.innerHTML = lista.map(htmlTarjeta).join('');
  contador.textContent = lista.length === 1 ? '1 producto' : `${lista.length} productos`;
  vacio.hidden = lista.length > 0;
  rejilla.hidden = lista.length === 0;
}

function limpiarFiltros() {
  formulario.reset();
  selectOrden.value = CRITERIOS_INICIALES.orden;
  pintar();
}

/** Permite enlaces como tienda.html?categoria=accesorios o tienda.html?q=lino. */
function aplicarParametrosURL() {
  const params = new URLSearchParams(location.search);
  const texto = params.get('q');
  if (texto) formulario.texto.value = texto;
  const categoria = params.get('categoria');
  if (categoria && [...formulario.categoria.options].some((o) => o.value === categoria)) {
    formulario.categoria.value = categoria;
  }
}

async function iniciar() {
  try {
    productos = await obtenerProductos();
  } catch (error) {
    contador.textContent = '';
    rejilla.innerHTML = `
      <li class="mensaje-error" role="alert">
        No hemos podido cargar el catálogo. Recarga la página en unos segundos.
        <br><small>(Si estás probando en local, abre la web con Live Server: los archivos JSON no se cargan abriendo el HTML con doble clic.)</small>
      </li>`;
    return;
  }

  // En pantallas grandes el panel de filtros va siempre abierto;
  // en el móvil empieza plegado para que se vean antes los productos.
  const panel = document.getElementById('panel-filtros');
  const escritorio = window.matchMedia('(min-width: 980px)');
  if (escritorio.matches) panel.open = true;
  // En escritorio no se puede plegar (ni con el ratón ni con el teclado)
  panel.addEventListener('toggle', () => {
    if (escritorio.matches && !panel.open) panel.open = true;
  });

  aplicarParametrosURL();
  pintar();

  formulario.addEventListener('input', pintar);
  formulario.addEventListener('submit', (e) => e.preventDefault());
  selectOrden.addEventListener('change', pintar);
  document.querySelectorAll('[data-limpiar]').forEach((b) => b.addEventListener('click', limpiarFiltros));
}

iniciar();
