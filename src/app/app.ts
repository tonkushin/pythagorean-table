import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { applyEach, debounce, form, FormField, validate } from '@angular/forms/signals';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'pt-root',
  imports: [FormField, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly factors = Array.from({ length: 9 }, (_, index) => index + 1);
  readonly answerValues = signal(this.factors.map(() => this.factors.map(() => '')));
  readonly answerForm = form(this.answerValues, (answers) => {
    applyEach(answers, (row) => {
      applyEach(row, (cell) => {
        debounce(cell, 300);
        validate(cell, ({ pathKeys, value }) => {
          const [rowIndex, columnIndex] = pathKeys().map(Number);
          const answer = value().trim();

          if (answer === '' || Number(answer) === (rowIndex + 1) * (columnIndex + 1)) {
            return undefined;
          }

          return {
            kind: 'incorrect-answer',
            message: 'Неверный ответ. Проверьте произведение и попробуйте снова.',
          };
        });
      });
    });
  });
}
