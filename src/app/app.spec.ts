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

    const inputs = fixture.nativeElement.querySelectorAll('input');

    expect(inputs).toHaveLength(81);
    expect(inputs[0].value).toBe('');
  });

  it('should validate an incorrect answer after 300 milliseconds', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

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
    const input = fixture.nativeElement.querySelectorAll('input')[21] as HTMLInputElement;

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
