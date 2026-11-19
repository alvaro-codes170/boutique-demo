// ==========================================================
// config.js · datos de la tienda en un solo sitio
// Si cambia el teléfono, el horario o (más adelante) una regla
// de envío o un código de descuento, se cambia solo aquí.
// ==========================================================

export const TIENDA = {
  nombre: 'Boutique Lino y Alba',
  direccion: 'Calle Mayor 5, bajo, 28996 Fuente Alta',
  telefono: '600 000 003',
  telefonoEnlace: '+34600000003',
  whatsapp: '34600000003',
  correo: 'tienda@linoyalba.example',
  instagram: '@linoyalba',
  horario: [
    'Lunes a viernes: 10:00 a 14:00 y 17:00 a 20:30',
    'Sábados: 10:00 a 14:00',
    'Domingos: cerrado'
  ]
};

// Reglas del carrito (sección 7 del briefing)
export const CARRITO = {
  claveStorage: 'linoyalba_carrito', // nombre con el que se guarda en localStorage
  cantidadMin: 1,
  cantidadMax: 5
};

// Reglas de envío (sección 4 del briefing). Importes en euros.
export const ENVIO = {
  costeDomicilio: 5.50,
  umbralGratis: 60,     // envío gratis si los productos, YA con descuento, suman esto o más
  costeRecogida: 0
};

// Códigos de descuento. Clave en MAYÚSCULAS.
// porcentaje: se aplica solo a los productos, nunca al envío.
// minimo: importe mínimo de productos (antes del descuento) para poder usarlo; 0 = sin mínimo.
export const CODIGOS = {
  BIENVENIDA10: { porcentaje: 10, minimo: 0 }
};

// Formas de entrega
export const ENTREGAS = {
  domicilio: 'Envío a domicilio',
  recogida: 'Recogida en tienda'
};

// Métodos de pago (simulados). soloRecogida: solo se ofrece si se recoge en tienda.
export const METODOS_PAGO = [
  // texto: en los botones del checkout · frase: dentro de una frase en los textos
  { valor: 'tarjeta', texto: 'Tarjeta', frase: 'tarjeta', soloRecogida: false },
  { valor: 'bizum', texto: 'Bizum', frase: 'Bizum', soloRecogida: false },
  { valor: 'tienda', texto: 'Pago en tienda al recoger', frase: 'pago en tienda al recoger', soloRecogida: true }
];

// Nombres visibles de las categorías (en el JSON van en minúsculas y sin tildes)
export const CATEGORIAS = {
  camisetas: 'Camisetas',
  camisas: 'Camisas',
  vestidos: 'Vestidos',
  pantalones: 'Pantalones',
  jerseys: 'Jerseys',
  abrigos: 'Abrigos',
  faldas: 'Faldas',
  accesorios: 'Accesorios'
};
