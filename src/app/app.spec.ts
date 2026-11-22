import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => vi.useRealTimers());

  it('should render an empty multiplication table', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('td input');

    expect(inputs).toHaveLength(81);
    expect(inputs[0].value).toBe('');
  });

  it('should show three selectable difficulty levels', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('input[type="radio"]')).toHaveLength(3);
    expect(fixture.nativeElement.textContent).toContain('3 минуты на решение');
  });

  it('should leave ten cells empty on the first level', () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance.selectLevel(1);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('td input')).toHaveLength(10);
    expect(fixture.nativeElement.querySelectorAll('td').length).toBe(81);
  });

  it('should congratulate the user after completing the first level', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance.selectLevel(1);
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('td input') as NodeListOf<HTMLInputElement>;
    inputs.forEach((input) => {
      const factors = input.getAttribute('aria-label')?.match(/\d+/g) ?? [];
      const row = Number(factors[0]);
      const column = Number(factors[1]);
      input.value = String(row * column);
      input.dispatchEvent(new Event('input'));
    });
    await vi.advanceTimersByTimeAsync(300);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Молодец!');
    expect(fixture.nativeElement.textContent).toContain('Ты прошел таблицу.');
    expect(fixture.nativeElement.querySelector('.success-message button')?.textContent).toContain('Начать заново');
  });

  it('should show an encouraging message when time runs out on the third level', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance.selectLevel(3);
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(180_000);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Не сдавайся!');
  });

  it('should validate an incorrect answer after 300 milliseconds', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('td input') as HTMLInputElement;

    input.value = '5';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(299);

    expect(fixture.componentInstance.answerForm[0][0]().invalid()).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    fixture.detectChanges();

    expect(fixture.componentInstance.answerForm[0][0]().invalid()).toBe(true);
    expect(fixture.nativeElement.querySelector('.error-message')?.textContent).toContain('Неверный ответ');
  });

  it('should validate only the final value after the debounce', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelectorAll('td input')[21] as HTMLInputElement;

    input.value = '1';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(100);
    input.value = '12';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(300);
    fixture.detectChanges();

    expect(fixture.componentInstance.answerValues()[2][3]).toBe('12');
    expect(fixture.componentInstance.answerForm[2][3]().invalid()).toBe(false);
  });
});
