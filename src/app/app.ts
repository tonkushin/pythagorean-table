import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { applyEach, debounce, form, FormField, validate } from '@angular/forms/signals';
import { RouterOutlet } from '@angular/router';

type DifficultyLevel = 1 | 2 | 3;
type GameStatus = 'playing' | 'won' | 'lost';

interface Difficulty {
  readonly level: DifficultyLevel;
  readonly title: string;
  readonly description: string;
  readonly errorLimit: number | null;
  readonly timeLimit: number | null;
}

@Component({
  selector: 'pt-root',
  imports: [FormField, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly factors = Array.from({ length: 9 }, (_, index) => index + 1);
  readonly difficulties: readonly Difficulty[] = [
    {
      level: 1,
      title: '1 уровень',
      description: 'В таблице случайно скрыты 10 значений.',
      errorLimit: null,
      timeLimit: null,
    },
    {
      level: 2,
      title: '2 уровень',
      description: 'Заполните всю таблицу. Можно допустить до 5 ошибок.',
      errorLimit: 5,
      timeLimit: null,
    },
    {
      level: 3,
      title: '3 уровень',
      description: 'Только 3 ошибки и 3 минуты на решение.',
      errorLimit: 3,
      timeLimit: 180,
    },
  ];
  readonly selectedLevel = signal<DifficultyLevel>(2);
  readonly selectedDifficulty = computed(
    () => this.difficulties.find(({ level }) => level === this.selectedLevel()) ?? this.difficulties[1],
  );
  readonly blankCellKeys = signal<ReadonlySet<string>>(new Set());
  readonly answerValues = signal(this.createAnswerValues());
  readonly errorCount = signal(0);
  readonly remainingTime = signal(0);
  readonly gameStatus = signal<GameStatus>('playing');
  readonly formattedTime = computed(() => {
    const minutes = Math.floor(this.remainingTime() / 60);
    const seconds = this.remainingTime() % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });
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

  private readonly destroyRef = inject(DestroyRef);
  private readonly invalidAnswerKeys = new Set<string>();
  private timerId: ReturnType<typeof setInterval> | undefined;

  constructor() {
    effect(() => this.registerIncorrectAnswers());
    effect(() => this.finishCompletedGame());
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  selectLevel(level: DifficultyLevel): void {
    this.stopTimer();
    this.selectedLevel.set(level);
    this.blankCellKeys.set(level === 1 ? this.createBlankCellKeys() : new Set());
    this.answerValues.set(this.createAnswerValues());
    this.errorCount.set(0);
    this.remainingTime.set(this.selectedDifficulty().timeLimit ?? 0);
    this.gameStatus.set('playing');
    this.invalidAnswerKeys.clear();

    if (this.selectedDifficulty().timeLimit !== null) {
      this.timerId = setInterval(() => this.tick(), 1_000);
    }
  }

  restartGame(): void {
    this.selectLevel(this.selectedLevel());
  }

  isEditable(rowIndex: number, columnIndex: number): boolean {
    return this.selectedLevel() !== 1 || this.blankCellKeys().has(this.cellKey(rowIndex, columnIndex));
  }

  private createAnswerValues(): string[][] {
    return this.factors.map((row, rowIndex) =>
      this.factors.map((column, columnIndex) =>
        this.selectedLevel() === 1 && !this.blankCellKeys().has(this.cellKey(rowIndex, columnIndex))
          ? String(row * column)
          : '',
      ),
    );
  }

  private createBlankCellKeys(): ReadonlySet<string> {
    const cellKeys = this.factors.flatMap((_, rowIndex) =>
      this.factors.map((__, columnIndex) => this.cellKey(rowIndex, columnIndex)),
    );

    for (let index = cellKeys.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [cellKeys[index], cellKeys[randomIndex]] = [cellKeys[randomIndex], cellKeys[index]];
    }

    return new Set(cellKeys.slice(0, 10));
  }

  private registerIncorrectAnswers(): void {
    if (this.gameStatus() !== 'playing') {
      return;
    }

    const invalidKeys = new Set<string>();
    for (const [rowIndex] of this.factors.entries()) {
      for (const [columnIndex] of this.factors.entries()) {
        if (this.answerForm[rowIndex][columnIndex]().invalid()) {
          invalidKeys.add(this.cellKey(rowIndex, columnIndex));
        }
      }
    }

    const newMistakes = [...invalidKeys].filter((key) => !this.invalidAnswerKeys.has(key)).length;
    this.invalidAnswerKeys.clear();
    invalidKeys.forEach((key) => this.invalidAnswerKeys.add(key));

    if (newMistakes === 0) {
      return;
    }

    this.errorCount.update((count) => count + newMistakes);
    const errorLimit = this.selectedDifficulty().errorLimit;
    if (errorLimit !== null && this.errorCount() >= errorLimit) {
      this.endGame('lost');
    }
  }

  private finishCompletedGame(): void {
    if (this.gameStatus() !== 'playing' || this.answerForm().invalid()) {
      return;
    }

    const answers = this.answerValues();
    const isComplete = answers.every((row, rowIndex) =>
      row.every((answer, columnIndex) => Number(answer) === (rowIndex + 1) * (columnIndex + 1)),
    );

    if (isComplete) {
      this.endGame('won');
    }
  }

  private tick(): void {
    if (this.remainingTime() <= 1) {
      this.remainingTime.set(0);
      this.endGame('lost');
      return;
    }

    this.remainingTime.update((time) => time - 1);
  }

  private endGame(status: Exclude<GameStatus, 'playing'>): void {
    this.gameStatus.set(status);
    this.stopTimer();
  }

  private stopTimer(): void {
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  private cellKey(rowIndex: number, columnIndex: number): string {
    return `${rowIndex}-${columnIndex}`;
  }
}
