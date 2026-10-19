# Revisión de imágenes de src/assets sin uso

Fecha: 2026-10-19.

En el inventario inicial se revisaron 254 imágenes: 26 tienen referencias estáticas en la aplicación y 224 se cargan mediante los catálogos reales de curvas implícitas y campos vectoriales. Quedan **cuatro imágenes sin referencias**. Se excluyeron documentación, registros de atribución y generadores como prueba de incorporación a la interfaz. El inventario completo está en [unused-assets-audit.json](unused-assets-audit.json).

Las cuatro candidatas se abrieron y revisaron visualmente. La revisión inicial evaluó su encaje. Tras la confirmación del usuario se incorporaron las dos candidatas recomendadas; no se eliminan activos.

| Imagen | Contenido observado | Destino posible | Valoración |
|---|---|---|---|
| src/assets/img/shortest-math-paper.jpg | Reproducción del artículo de L. J. Lander y T. R. Parkin, con título, autores, identidad de quintas potencias y referencia | /articles/euler-conjecture-counterexample | **La mejor candidata.** Ilustra precisamente la brevedad de la publicación de la que habla el relato. Podría sustituir al retrato genérico de Euler, después de la narración, con pie bibliográfico y enlace a la fuente. |
| src/assets/img/taxicab.jpg | Montaje de fotogramas de Futurama: hijo 1729, universo 1729, nave BP-1729 y taxi 87539319 | /articles/taxicab-numbers | **Buen encaje como curiosidad cultural**, al final de la explicación. Conviene distinguir 1729 del número de tres representaciones 87539319 y no presentarlo como ilustración histórica de Hardy o Ramanujan. El archivo mide 5648 × 4357 y ocupa 986823 bytes: convendría publicar una copia optimizada, conservando este original. |
| src/assets/img/taxicab-2.webp | Meme de reacción con una recreación en inglés de la conversación entre Hardy y Ramanujan | /articles/hardy-ramanujan-taxicab, como posibilidad temática | **No recomiendo incorporarlo al relato actual.** La escena ya está contada; el meme repite el contenido, cambia su tono y puede confundirse con una cita literal. No es una fotografía de ninguno de los protagonistas. |
| src/assets/img/images.jpg | Meme sobre grupos de Galois de cuerpos ciclotómicos; la supuesta demostración dice “Ask a toddler on the street” | /articles/cyclotomic-polynomials o /articles/galois-solvability, solo por afinidad temática | **No recomiendo incorporarlo.** Exige conocimientos avanzados para entender el chiste y el comentario de la demostración no ayuda a quien está aprendiendo. Tampoco es una demostración ni un documento histórico acreditado. |

## Contraste de contenido y procedencia

- Se abrió el [artículo original de Lander y Parkin, 1966, p. 1079](https://marktomforde.com/academic/miscellaneous/images/ShortestPaper.pdf). El contenido de la imagen coincide con ese trabajo. La reproducción local no incluye una declaración de licencia. Identificar el artículo no equivale a confirmar condiciones de redistribución de esta imagen.
- Se localizaron referencias a los guiños de Futurama y a la relación del taxi 87539319 con las sumas de cubos en [la entrevista/reportaje de WIRED con David X. Cohen](https://www.wired.com/2007/11/ff-futurama-geekiestshow/). Se pudo consultar el resultado indexado, no la entrevista completa; no se usa para acreditar la autoría del montaje.
- En el repositorio no aparece documentación de autoría o licencia de estas cuatro imágenes. El montaje de Futurama y los memes no deben confundirse con recursos de dominio público o Creative Commons verificados. Tampoco se ha identificado al autor de cada montaje.
- El documento maestro de la colección pedía evitar recursos de licencia dudosa. La confirmación posterior del usuario acredita su comprobación de licencia libre; no se presupone una variante CC concreta ni dominio público.

## Integración propuesta

1. Priorizar el facsímil de Lander y Parkin en su anécdota: aporta información documental y ocupa solo 47219 bytes. Incluir título, autores, año, revista, página y fuente; texto alternativo que identifique la igualdad y enlace a la versión accesible del trabajo.
2. Reservar el montaje de Futurama para una sección breve de cultura matemática en el artículo explicativo de números taxicab, con pie que lo identifique como montaje de fotogramas y atribución acreditada. Optimizar una copia para lectura en móvil y escritorio.
3. Mantener los dos memes fuera de los artículos actuales. No se borran; la exclusión es editorial.
4. Usar rutas relativas a la base de la aplicación, como assets/img/shortest-math-paper.jpg, para que funcionen en GitHub Pages. Añadir dimensiones intrínsecas, carga diferida y estilos que conserven la proporción.

Actualización: el usuario ha confirmado que las fuentes tienen licencia libre. Se registra esa confirmación en src/assets/img/SOURCES.json sin inventar un identificador de licencia. Se ha sustituido el retrato de Euler por el facsímil en /articles/euler-conjecture-counterexample y se ha incorporado el montaje a /articles/taxicab-numbers, en una copia de 1280 × 987 y 173160 bytes, con acceso al original. Los dos memes se mantienen fuera por motivos editoriales. El inventario JSON se actualiza tras la integración.

Validación de la integración: compilación Angular de desarrollo correcta; pruebas de la colección y de números taxicab correctas; las dos imágenes comprobadas en Chrome a 1440, 390 y 320 px, cargadas, proporcionadas, con textos alternativos y pies, sin desbordamientos. Inventario actualizado: 255 imágenes, 29 con referencias estáticas y 224 con referencias dinámicas; solo los dos memes quedan sin uso.
