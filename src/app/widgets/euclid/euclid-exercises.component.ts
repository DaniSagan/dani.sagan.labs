import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Exercise {
  title: string;
  question: string;
  hints: string[];
  solution: string;
  answer?: string;
  choices?: string[];
  input: string;
  revealed: number;
  solved: boolean;
  feedback: string;
}

@Component({
  selector: 'app-euclid-exercises', standalone: true, imports: [FormsModule],
  templateUrl: './euclid-exercises.component.html', styleUrl: './euclid-widgets.css'
})
export class EuclidExercisesComponent {
  exercises: Exercise[] = [
    {
      title: 'Nivel 1 · Ejecutar Euclides', question: 'Calcula MCD(414, 662). Anota todas las divisiones antes de responder.',
      answer: '2', hints: ['Empieza con 414 = 662·0 + 414. El orden inicial no afecta al resultado.', 'Continúa: 662 = 414 + 248; 414 = 248 + 166.'],
      solution: '414 = 662·0 + 414; 662 = 414·1 + 248; 414 = 248·1 + 166; 248 = 166·1 + 82; 166 = 82·2 + 2; 82 = 2·41 + 0. El último resto no nulo es 2.'
    },
    {
      title: 'Nivel 2 · Recuperar un coeficiente', question: 'Completa la identidad 18 = 252·x + 198·(−5). ¿Cuánto vale x?',
      answer: '4', hints: ['Despeja 252·x = 18 + 990.', 'También puedes sustituir 18 = 54 − 36, usando 36 = 198 − 3·54 y 54 = 252 − 198.'],
      solution: 'La cadena es 54 = 252 − 198; 36 = 198 − 3·54; 18 = 54 − 36. Así, 18 = 4·54 − 198 = 4·252 − 5·198, por lo que x = 4. Comprueba: 1008 − 990 = 18.'
    },
    {
      title: 'Nivel 2 · Detectar un error', question: 'Se escribe 84 = 30·2 + 24, 30 = 24·1 + 6, 24 = 6·3 + 6. ¿Qué falla en la última línea?',
      choices: ['La igualdad numérica es falsa.', 'La igualdad es cierta, pero el resto no es menor que el divisor.', 'No hay ningún error.'],
      answer: 'La igualdad es cierta, pero el resto no es menor que el divisor.',
      hints: ['Comprueba por separado la igualdad y la condición del resto.', 'En la división euclídea exigimos 0 ≤ r < divisor.'],
      solution: '6·3 + 6 = 24, pero r = 6 no es menor que el divisor 6. La división euclídea es 24 = 6·4 + 0. El MCD es 6. La igualdad de divisores comunes sigue siendo cierta, pero un resto no reducido no garantiza el descenso del algoritmo.'
    },
    {
      title: 'Nivel 2 · Entender el cero', question: '¿Por qué MCD(0, 0) = 0 necesita una convención?',
      choices: ['Porque cero no tiene divisores positivos.', 'Porque todos los enteros positivos dividen a cero y no hay un máximo.', 'Porque MCD siempre debe ser negativo.'],
      answer: 'Porque todos los enteros positivos dividen a cero y no hay un máximo.',
      hints: ['Para cualquier d > 0, se cumple 0 = d·0.', '¿Tiene máximo el conjunto de todos los enteros positivos?'],
      solution: 'Todo entero positivo es divisor común de 0 y 0, y ese conjunto no tiene máximo. La definición mediante el mayor divisor positivo excluye este par; asignarle 0 permite extender las identidades algebraicas.'
    },
    {
      title: 'Nivel 3 · Demostrar una propiedad', question: 'Demuestra que MCD(ka, kb) = |k|·MCD(a, b), también cuando k = 0 o a = b = 0.',
      hints: ['Para k ≠ 0 y (a,b) ≠ (0,0), escribe d = ax + by.', 'El número |k|d divide a ka y kb. A la inversa, cualquier divisor común de ka y kb divide kd.'],
      solution: 'Sea D = MCD(ka,kb). Para k ≠ 0 y d = MCD(a,b) > 0, |k|d es divisor común, luego |k|d ≤ D. Por Bézout, kd = (ka)x + (kb)y, así que D divide a kd y D ≤ |k|d. Ambas desigualdades dan la igualdad. Si k = 0 o a = b = 0, ambos miembros son 0 por convención.'
    },
    {
      title: 'Nivel 3 · Una aplicación modular', question: 'Halla el inverso de 17 módulo 43, representado entre 0 y 42.',
      answer: '38', hints: ['43 = 17·2 + 9; 17 = 9 + 8; 9 = 8 + 1.', 'Sustituye hasta llegar a 1 = 2·43 − 5·17.'],
      solution: '1 = 9 − 8 = 2·9 − 17 = 2·43 − 5·17. Así, 17·(−5) ≡ 1 (mod 43). El representante pedido es −5 + 43 = 38; 17·38 = 646 = 43·15 + 1.'
    },
    {
      title: 'Nivel 3 · Justificar la existencia', question: '¿Tiene soluciones enteras 24x + 36y = 10? Justifica tu respuesta antes de comprobar.',
      choices: ['Sí.', 'No.'], answer: 'No.',
      hints: ['Todo divisor común del lado izquierdo debe dividir al derecho.', 'MCD(24,36) = 12.'],
      solution: 'No: 12 divide a 24x + 36y para cualquier par de enteros, pero no divide a 10. En general, para (a,b) ≠ (0,0), ax + by = c tiene solución si y solo si MCD(a,b) divide a c; la suficiencia se obtiene multiplicando una identidad de Bézout.'
    },
    {
      title: 'Nivel 2 · Volver a coincidir', question: 'Dos señales se repiten cada 84 y 30 segundos y coinciden al inicio. ¿Tras cuántos segundos vuelven a coincidir por primera vez?',
      answer: '420', hints: ['Busca el menor múltiplo positivo común, no el MCD.', 'MCD(84,30) = 6. Usa MCM = 84·30 / 6.'],
      solution: 'MCM(84,30) = (84/6)·30 = 420 segundos. Es múltiplo de ambos periodos; cualquier coincidencia positiva es un múltiplo común y por ello no puede ocurrir antes del MCM.'
    }
  ].map(exercise => ({ ...exercise, input: '', revealed: 0, solved: false, feedback: '' }));

  check(exercise: Exercise): void {
    const input = exercise.input.trim();
    if (!input) { exercise.feedback = 'Escribe o selecciona una respuesta.'; return; }
    const correct = exercise.choices ? input === exercise.answer
      : /^[+-]?\d{1,30}$/.test(input) && BigInt(input) === BigInt(exercise.answer!);
    exercise.feedback = correct ? 'Correcto. Contrasta también tu razonamiento con la solución.'
      : 'Todavía no. Revisa tu razonamiento o abre una pista.';
  }
}
