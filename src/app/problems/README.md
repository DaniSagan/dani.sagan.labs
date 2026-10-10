# Problemas

La organización sigue el patrón de `src/app/articles`: cada tema tiene un registro de componentes y cada problema tiene su propia carpeta.

```text
geometry/
  geometry-problems.ts
  potencia-de-un-punto/
    potencia-de-un-punto-problem.component.ts
    potencia-de-un-punto-problem.component.html
shared/
  problem.css
  problem-navigation.component.ts
```

La plantilla de cada problema contiene el enunciado, todos los pasos de la solución, el resultado, el error frecuente y las referencias. Las ecuaciones usan directamente `app-formula`. El componente declara `static title`, `static route` y los metadatos `static problem` que necesitan el menú y los filtros.

Los registros por tema se reúnen en `problems.data.ts`. Ese archivo organiza la colección y no contiene las soluciones. `problems-routing.module.ts` crea una ruta para cada componente, igual que en artículos. Las direcciones existentes se conservan.

Para añadir un problema:

1. Crea su carpeta, componente standalone y plantilla dentro del tema correspondiente. Sigue un problema del mismo tema como ejemplo y utiliza el CSS compartido.
2. Declara un título, una ruta única y los metadatos del catálogo. El campo `id` debe coincidir con `route`, y `category` y `topic` con el bloque y subtema del catálogo. El campo `statement` permite buscar el enunciado desde la colección.
3. Añade el componente al registro del tema. El menú, los filtros, las rutas y la navegación entre problemas se actualizan a partir del registro.
4. Si creas un tema nuevo, añade su registro y bloque en `problems.data.ts`.

La navegación anterior/siguiente usa el orden de los registros, sin depender del campo interno `number`. Los números no se muestran en los títulos ni en el menú.
