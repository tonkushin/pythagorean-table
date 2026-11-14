import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should render an empty multiplication table', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('input');

    expect(inputs).toHaveLength(81);
    expect(inputs[0].value).toBe('');
  });

  it('should save a correct answer', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.validateAnswer(2, 3, '6');

    expect(app.answers()).toEqual({ '2-3': 6 });
    expect(app.invalidAnswers()).toEqual({});
  });

  it('should show an error for an incorrect answer', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.validateAnswer(2, 3, '5');
    fixture.detectChanges();

    expect(app.answers()).toEqual({});
    expect(app.invalidAnswers()).toEqual({ '2-3': '5' });
    expect(fixture.nativeElement.querySelector('.error-message')?.textContent).toContain('Неверный ответ');
  });
});
