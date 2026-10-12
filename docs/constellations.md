# Reconocimiento de constelaciones

Componente standalone propio en `/games/constellations`, cargado de forma diferida e integrado en el menú de Juegos. No añade dependencias. Los colores, los títulos y los paneles usan las variables y familias tipográficas de la web.

## Contenido y juego

33 constelaciones distintas, con 390 estrellas del trazado identificadas por HIP. Las selecciones norte y sur tienen 17 figuras cada una: 16 características de cada región y Orión compartida por cruzar el ecuador celeste. Son selecciones didácticas, no listas de visibilidad exclusiva desde cada hemisferio terrestre. Tauro, Águila y otras figuras pueden verse desde ambos hemisferios según latitud y estación.

- Explorador: estrellas con nombres propios o designaciones, y líneas.
- Navegante: estrellas y líneas, sin nombres.
- Astrónomo: estrellas, sin nombres ni líneas del dibujo.
- Rondas de 10 o 17 preguntas, sin repetición, cuatro respuestas del mismo grupo.
- 100, 150 o 200 puntos por acierto, respectivamente; cada pista resta 50 puntos. Los errores no dan puntos.
- Después de responder se muestran nombres, trazado y una explicación de reconocimiento. Se pueden repasar solo los fallos; ese repaso no modifica récords, incluso si todos los intentos iniciales fueron incorrectos.
- Atlas libre con todas las figuras de cada selección y ampliación hasta 2×, con desplazamiento dentro de la carta.
- El progreso por figura y dificultad y los récords por hemisferio, nivel y longitud de ronda se guardan localmente. Acertar con pistas no concede dominio. La ronda en curso no se guarda.

## Datos y representación

Fuentes descargadas el 12 de octubre de 2026 de [d3-celestial](https://github.com/ofrohn/d3-celestial): `data/stars.6.json`, `data/starnames.json` y `data/constellations.lines.json`. El proyecto atribuye las posiciones a XHIP (Extended Hipparcos Compilation), las designaciones a sus catálogos cruzados y los trazados a las cartas de IAU con modificaciones de Olaf Frohn. Se conserva la licencia BSD de Olaf Frohn en `src/assets/licenses/d3-celestial.txt`, enlazada desde el juego.

SHA256 de las fuentes originales:

| Archivo | SHA256 |
| --- | --- |
| stars.6.json | 0297B8FA3ADFBCE1DC26566F61C4ABCC1DF4F29C6A28729CA06B56D1C6D25602 |
| starnames.json | 19C84BC885F8A97C3B8E1F6A380084C575A9758DEDFE35256E911A823EC3A695 |
| constellations.lines.json | 294F66BEF5D5CF50B1E17F16D2EFA1D97A15131612C68DD935ADEF6E7373E13C |

El catálogo generado conserva ascensión recta, declinación y magnitud. Una proyección gnomónica centrada en cada patrón, con norte arriba y este a la izquierda, evita errores al cruzar 0° de ascensión recta y en figuras cercanas al polo. La escala se ajusta para cada figura: las cartas no son comparables por tamaño angular ni simulan el cielo actual. Se incluyen hasta 80 estrellas reales del campo vecino por carta; no hay estrellas decorativas inventadas. El fondo difuso y la rejilla son recursos visuales. El tamaño de cada punto codifica brillo de forma orientativa.

Las constelaciones oficiales son regiones del cielo, no los segmentos dibujados entre estrellas. Véase [IAU, The Constellations](https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx) y [IAU, Orion](https://iauarchive.eso.org/public/images/detail/ann22042a/).

Para regenerar el extracto se pueden descargar las tres fuentes en una carpeta local con los nombres `stars.json`, `names.json`, `lines.json`, además de `LICENSE`, y ejecutar `node scripts/build-constellation-catalog.cjs <carpeta>`. Si no se especifica carpeta, se usa `danisagan-constellation-source` dentro del directorio temporal. La selección y los textos originales están en `scripts/constellation-curation.txt`. El juego usa el catálogo ya incorporado y no realiza consultas remotas.

## Validación

`npm run test:constellations` comprueba coordenadas, etiquetas, segmentos, dos selecciones, 80 rondas aleatorias completas, las seis combinaciones de hemisferio y nivel, puntuación, pistas, persistencia, salida y repaso de fallos.

Tras una compilación de desarrollo, `npm run test:constellations:browser` usa Chrome instalado para comprobar la ruta y el menú reales, seis rondas completas, las 33 cartas en el atlas, la ausencia de etiquetas y segmentos según dificultad, feedback, zoom, progreso y anchuras de 1440, 768, 390 y 320 px. Guarda capturas de escritorio y móvil en el directorio temporal.

La producción se puede validar con la alternativa `optimization.fonts=false` usada en este entorno de red restringida, sin cambiar `angular.json`. Los presupuestos de tamaño originales se mantienen.
