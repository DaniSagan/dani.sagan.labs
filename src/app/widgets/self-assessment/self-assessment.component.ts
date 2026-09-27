import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ExerciseDefinition {
  title: string;
  question: string;
  hints: readonly string[];
  solution: string;
  answer?: string;
  choices?: readonly string[];
}
interface ExerciseState extends ExerciseDefinition {
  input: string;
  revealed: number;
  solved: boolean;
  feedback: string;
}

@Component({
  selector: 'app-self-assessment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './self-assessment.component.html',
  styleUrl: './self-assessment.component.css',
})
export class SelfAssessmentComponent {
  @Input({ required: true }) quizId = '';
  @Input() title = 'Pon a prueba tus argumentos';
  @Input({ required: true }) set questions(
    value: readonly ExerciseDefinition[],
  ) {
    this.exercises = value.map((exercise) => ({
      ...exercise,
      input: '',
      revealed: 0,
      solved: false,
      feedback: '',
    }));
  }
  exercises: ExerciseState[] = [];
  check(exercise: ExerciseState): void {
    const input = exercise.input.trim();
    if (!input) {
      exercise.feedback = 'Escribe o selecciona una respuesta.';
      return;
    }
    const correct = exercise.choices
      ? input === exercise.answer
      : /^[+-]?\d{1,30}$/.test(input) &&
        BigInt(input) === BigInt(exercise.answer!);
    exercise.feedback = correct
      ? 'Correcto. Comprueba también la justificación.'
      : 'Todavía no. Revisa el razonamiento o abre una pista.';
  }
}
