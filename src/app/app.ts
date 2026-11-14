import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

type Answers = Record<string, number>;
type InvalidAnswers = Record<string, string>;

@Component({
  selector: 'pt-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly factors = Array.from({ length: 9 }, (_, index) => index + 1);
  readonly answers = signal<Answers>({});
  readonly invalidAnswers = signal<InvalidAnswers>({});
  readonly errorMessage = computed(() =>
    Object.keys(this.invalidAnswers()).length > 0
      ? 'Неверный ответ. Проверьте произведение и попробуйте снова.'
      : null,
  );

  validateAnswer(row: number, column: number, value: string): void {
    const key = this.cellKey(row, column);
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
      this.removeAnswer(key);
      this.removeInvalidAnswer(key);
      return;
    }

    const answer = Number(trimmedValue);

    if (!Number.isInteger(answer) || answer !== row * column) {
      this.removeAnswer(key);
      this.invalidAnswers.update((invalidAnswers) => ({
        ...invalidAnswers,
        [key]: value,
      }));
      return;
    }

    this.answers.update((answers) => ({ ...answers, [key]: answer }));
    this.removeInvalidAnswer(key);
  }

  cellKey(row: number, column: number): string {
    return `${row}-${column}`;
  }

  private removeAnswer(key: string): void {
    this.answers.update((answers) => this.withoutKey(answers, key));
  }

  private removeInvalidAnswer(key: string): void {
    this.invalidAnswers.update((invalidAnswers) => this.withoutKey(invalidAnswers, key));
  }

  private withoutKey<T>(values: Record<string, T>, key: string): Record<string, T> {
    return Object.fromEntries(Object.entries(values).filter(([entryKey]) => entryKey !== key));
  }
}
