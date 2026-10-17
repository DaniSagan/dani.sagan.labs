# La hormiga de Langton

Ruta: `/articles/langtons-ant`. Articulo independiente registrado en `DYNAMICAL_SYSTEMS_ARTICLES`; la coleccion alimenta rutas, modulo, busqueda y menu de `ArticlesProviderServiceService`. No existia contenido sustancial duplicado. Enlaces entrantes desde Regla 30 y Juego de la Vida.

## Convenios y arquitectura

- Blanco = estado 0 = R; negro = estado 1 = L. Leer, girar, incrementar modulo estados, avanzar. Origen (0,0), norte = +y.
- `langtons-ant.model.ts`: motor independiente de Angular, mapas dispersos de celdas y visitas, historial limitado a 100000 movimientos. Las visitas incluyen las posiciones iniciales y las llegadas. Retroceder restaura tambien estadisticas y limites.
- `ant-canvas.component.ts`: Canvas con DPR limitado a 2, zoom, seguimiento, desplazamiento por puntero o flechas y exportacion PNG de la vista.
- `langtons-ant-lab.component.ts`: lotes con presupuesto temporal de 7 ms y hasta 6000 movimientos por fotograma, fuera de Angular; publicacion visual aproximadamente a 20 Hz. Pausar cancela el objetivo pendiente. No se necesita un worker para estas velocidades.
- Las ediciones manuales establecen una nueva condicion inicial; reinician pasos, visitas e historial. Reiniciar recupera esa condicion inicial. Cambiar regla o cargar preset inicia un experimento nuevo.
- Varias hormigas: turnos secuenciales estables por identificador; cada paso mueve una sola hormiga. Es posible compartir posicion y cada agente lee las modificaciones ya aplicadas.
- Comparacion en tableros independientes y diferencias en coordenadas absolutas. Colores personalizados solo cambian el renderizado.
- Modo didactico: cinco fases de 500 ms; el motor confirma la transicion al terminar el avance. Giro y recoloreado previos son una previsualizacion.

## Periodicidad y fuentes

La prueba reproduce 100 ciclos desde el paso 11000, con periodo 104 y traslacion (-2,-2) bajo este convenio. El analizador clona el estado: compara los colores en la huella operacional de un periodo y las trazas completas de dos bloques. No modifica el experimento ni certifica repeticion global o perpetua.

La revision bibliografica distingue la conjetura general de soporte finito de resultados particulares. Fuentes primarias enlazadas en el articulo: Langton (1986), Hamann (2003), Gajardo/Moreira/Goles (2002), Gajardo/Lutfalla/Rao (2025). El repositorio de Hao Ke anuncia un resultado formalizado de una sola casilla negra: se identifica explicitamente como preprint pendiente de revision independiente; no se presenta como solucion general. La universalidad clasica citada requiere configuraciones infinitas finitamente descritas.

## Verificacion reproducible

```
npm run test:langtons-ant
npx ng build --configuration development
npm run test:langtons-ant:browser
```

El audit de Chrome usa el build de desarrollo, el protocolo CDP y MathJax local para no depender de la CDN. Comprueba ejecucion, pausa, reinicio, retroceso, fase didactica, autopista, edicion, comparador, reglas invalidas, varias hormigas, descubrimiento, PNG y puntero tactil a 390 y 320 px. Capturas en `tmp/langtons-ant-audit/`.

No se incluyen graficas temporales, configuraciones en URL ni una maquina universal completa. El PNG exporta la vista actual. La memoria del tablero y las visitas crece con las casillas distintas; el historial tiene el limite indicado en pantalla.

## Limite del build de produccion en este entorno

El comando normal de produccion no puede descargar Roboto de Google Fonts por la restriccion de red. La comprobacion alternativa conserva AOT, optimizacion de scripts/estilos y presupuestos originales, desactivando solo el inlining de fuentes externas mediante Architect con `json.schema.transforms.addUndefinedDefaults`. No se modifica `angular.json`.

Resultado final: 10 suites de motor, auditoria Chrome 1440/390/320 px y ejecucion pausable de 1000000 pasos correctas. Build de desarrollo correcto; build optimizado/AOT correcto sin inlining de fuentes, con presupuestos originales. Advertencias de CSS/CommonJS en componentes existentes.
