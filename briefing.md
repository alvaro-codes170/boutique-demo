# BRIEFING: Web de Boutique Lino y Alba (cliente ficticio)

## 1. Datos del negocio
- Nombre: Boutique Lino y Alba, moda de calidad para mujer y hombre
- Tipo: tienda de ropa de barrio con venta presencial desde hace años; quiere empezar a vender también por internet
- Fundada: 2014 por Alba Montero
- Equipo: 3 personas (Alba, Irene y Samuel)
- Dirección: Calle Mayor 5, bajo, 28996 Fuente Alta (dirección inventada)
- Teléfono: 600 000 003 (ficticio)
- WhatsApp: 600 000 003 (ficticio)
- Correo: tienda@linoyalba.example (ficticio)
- Instagram: @linoyalba (ficticio)
- Horario de tienda: lunes a viernes de 10:00 a 14:00 y de 17:00 a 20:30; sábados de 10:00 a 14:00; domingos cerrado

## 2. Propuesta de valor (lo que debe transmitir la web)
- Prendas de fibras naturales (lino, algodón, lana) y buen corte
- Colecciones pequeñas y cuidadas, sin ropa de usar y tirar
- Asesoramiento personal: "te ayudamos a elegir talla y combinar"
- Cambios fáciles: 14 días para devolver o cambiar
- Atención cercana de tienda de barrio, también online

## 3. Catálogo (12 productos, ficticios; precios con IVA incluido)
| Id | Producto | Categoría | Precio | Tallas | Colores | Notas |
|---|---|---|---|---|---|---|
| 1 | Camiseta de lino básica | Camisetas | 24,90 € | S, M, L, XL | blanco, arena, azul | Novedad |
| 2 | Camisa de lino manga larga | Camisas | 39,90 € | S, M, L, XL | blanco, azul | |
| 3 | Vestido midi estampado | Vestidos | 54,90 € | S, M, L | floral verde | Novedad |
| 4 | Vaquero recto | Pantalones | 49,90 € | 38, 40, 42, 44 | azul oscuro | |
| 5 | Pantalón chino | Pantalones | 44,90 € | 38, 40, 42, 44 | beige, verde oliva | |
| 6 | Jersey de punto de algodón | Jerseys | 42,90 € (oferta: 34,90 €) | S, M, L, XL | crudo, mostaza | En oferta |
| 7 | Chaqueta vaquera | Abrigos | 69,90 € | S, M, L | azul claro | |
| 8 | Falda plisada | Faldas | 34,90 € | S, M, L | negro, burdeos | |
| 9 | Sudadera con capucha | Jerseys | 36,90 € | S, M, L, XL | gris, verde | |
| 10 | Cinturón de cuero | Accesorios | 19,90 € | talla única | marrón, negro | |
| 11 | Bufanda de lana | Accesorios | 17,90 € | talla única | gris, mostaza | **Sin stock** |
| 12 | Gorro de punto | Accesorios | 12,90 € | talla única | crudo, negro | |

- Cada producto tiene: id, nombre, categoría, precio, precio de oferta (opcional), tallas, colores, descripción corta (la web puede redactarla con lo que se sabe del producto, sin inventar composiciones ni medidas), imagen y stock (disponible o no).
- Todos los productos del catálogo son ficticios; las descripciones deben ser genéricas.

## 4. Reglas de la tienda
- Los precios incluyen IVA; la web debe indicarlo ("IVA incluido").
- **Envío a domicilio:** 4,95 €; gratis si el importe de los productos, **ya aplicado el descuento**, es de 50 € o más.
- **Recogida en tienda:** gratis, siempre.
- **Código de descuento `BIENVENIDA10`:** 10 % sobre el importe de los productos (no sobre el envío). Solo se puede usar un código por pedido.
- Cambios y devoluciones: 14 días desde la recepción, con el producto sin usar y con etiqueta.
- Pagos (en la demo, simulados): tarjeta, Bizum y pago en tienda al recoger.
- En la demo, **ningún pedido es real**: la web debe dejarlo claro en el checkout y en un aviso visible.

## 5. Qué quiere el cliente en la web
- **Inicio:** portada con colección destacada, 4 productos destacados (los marcados como novedad u oferta), propuesta de valor y botón "Ver tienda"
- **Tienda:** catálogo completo con filtros (ver sección 6)
- **Ficha de producto:** foto, nombre, precio (con el precio tachado si está en oferta), selector de talla y color, botón "Añadir al carrito", descripción y aviso de cambios y devoluciones
- **Carrito:** lista de productos con cantidad editable, quitar producto, código de descuento, resumen de importes, elección de envío o recogida y botón "Finalizar pedido"
- **Finalizar pedido (checkout simulado):** formulario y pantalla de confirmación
- **Información:** envíos, cambios y devoluciones, horario, mapa y contacto
- Contador de productos del carrito visible en la cabecera de todas las páginas
- Botón de WhatsApp visible en el móvil
- Una persona sin experiencia debe poder comprar en menos de 2 minutos desde el móvil

## 6. Filtros y ordenación de la tienda
- Filtro por categoría (todas, camisetas, camisas, vestidos, pantalones, jerseys, abrigos, faldas, accesorios)
- Filtro por talla (S, M, L, XL, 38, 40, 42, 44, talla única)
- Precio máximo (deslizador o casillas por tramos)
- Casilla "Solo ofertas"
- Búsqueda por texto en el nombre
- Ordenar por: novedades, precio de menor a mayor, precio de mayor a menor
- Los filtros se pueden combinar; muestran el número de resultados y un botón "Limpiar filtros"
- Si no hay resultados: mensaje amable con botón para limpiar filtros
- Los productos sin stock se muestran, pero con la etiqueta "Agotado" y sin botón de compra

## 7. Reglas del carrito
- El carrito se guarda en el navegador (sigue si se recarga la página)
- Cada línea del carrito es una combinación producto + talla + color (la misma camiseta en M y en L son dos líneas)
- Cantidad mínima 1 y máxima 5 por línea
- Se puede quitar una línea; si el carrito queda vacío, mensaje y botón "Ir a la tienda"
- El código de descuento se valida: si no existe, mensaje de error claro
- Orden de cálculo: subtotal de productos → descuento → envío (según umbral y modo) → total

## 8. Formulario de finalizar pedido (simulado)
- Datos: nombre, apellidos, correo, teléfono, modo de entrega (domicilio o recogida), dirección (solo si es domicilio), código postal (5 dígitos), método de pago (simulado)
- Casillas obligatorias: aceptar las condiciones de venta y la política de privacidad
- Validación de todos los campos con mensajes claros junto a cada campo
- Al confirmar: pantalla de resumen del "pedido" con un número ficticio, y vaciar el carrito
- Aviso permanente: "Esto es una demostración. No se ha realizado ningún pedido ni cargo."

## 9. Preferencias de diseño
- Estilo: elegante, natural, sereno; mucho aire y fotos protagonistas
- Colores: crudo (#F6F1EA), verde salvia oscuro (#4F6B58) y terracota suave (#C8795A) como acento; texto en gris cálido (#2B2927)
- Tipografía: títulos con serif refinada y texto con sans legible
- Tarjetas de producto con esquinas suaves, foto cuadrada o vertical y precio claro
- Tono de los textos: cercano, delicado y sin exageraciones; en segunda persona del singular (tú)
- Debe verse perfecto en móvil: el 85 % de las compras online de moda se hace desde el teléfono
- Modo oscuro: no hace falta

## 10. Requisitos técnicos y legales
- HTML, CSS y JavaScript sencillos, sin frameworks ni librerías externas
- Catálogo desde `data/productos.json`; carrito en `localStorage`
- Código de la lógica del carrito y de los filtros separado en archivos (por ejemplo `carrito.js`, `filtros.js`)
- Carga rápida (imágenes comprimidas y `loading="lazy"`), accesible (etiquetas en formularios, foco visible, botones con texto claro) y con SEO básico (título y descripción únicos por página, `sitemap.xml`, `robots.txt`)
- Páginas de aviso legal, política de privacidad, política de cookies y **condiciones de venta y desistimiento** (plantillas genéricas para revisar por un profesional), enlazadas desde el pie
- No guardar ni enviar datos personales reales: el checkout es de prueba

## 11. Presupuesto del proyecto web (para el freelance)
| Concepto | Importe |
|---|---|
| Diseño y maquetación (inicio, tienda, ficha, carrito, información) | 520 € |
| Catálogo y filtros combinados | 160 € |
| Ficha de producto | 90 € |
| Carrito con reglas de importes | 180 € |
| Checkout simulado con validación | 80 € |
| Páginas legales, incluidas condiciones de venta (plantillas) | 90 € |
| SEO básico | 60 € |
| Dominio y hosting, primer año | 80 € |
| **Total** | **1.260 €** |
- Plazo de entrega: 4 semanas
- Mantenimiento opcional: 40 €/mes (alta de productos, cambios de precio y de fotos)
- Pago: 50 % al empezar y 50 % al entregar
- Nota para el cliente: esta versión es una demostración visual. Para vender de verdad hará falta una pasarela de pago y gestión de pedidos (presupuesto aparte).
