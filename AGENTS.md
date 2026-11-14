# Project Instructions

## Project profile

- Angular 22 standalone client-side application (no SSR or prerendering configured).
- TypeScript 6, SCSS, npm, Vitest, ESLint, and Stylelint.
- Angular component selector prefix: `pt`.
- Use `npm`; the repository declares `npm@11.16.0`.

## Working principles

- Make the smallest correct change and keep diffs focused.
- Preserve existing behavior unless the task explicitly changes it.
- Do not modify unrelated files, dependencies, build configuration, or lint configuration without need.
- Preserve pre-existing working-tree changes.
- Do not introduce abstractions until reuse or complexity justifies them.
- Keep presentation logic in components; put reusable business logic in services.
- Respect the repository's source-available license; do not upload project code to third-party services.

## Angular

- Use standalone APIs only; do not introduce NgModules.
- Prefer modern Angular APIs already used by the project: `signal`, `computed`, Signal Forms, `inject()`, and `@if` / `@for` / `@switch`.
- Use `track` in every `@for`.
- Prefer signal-based inputs, outputs, and models for new component APIs.
- Use `effect()` only for genuine side effects, never for derived state.
- Prefer Signal Forms for new forms; do not migrate an existing form implementation unless requested.
- Use RxJS for external streams such as HTTP, router events, or WebSockets, not as local component state.
- Keep routes explicit. Add lazy loading only when it benefits a non-trivial feature.
- Keep components focused; move reusable non-presentation logic to services.

For detailed Angular guidance, follow `.agents/angular.md`.

## TypeScript and templates

- Do not use `any`; prefer explicit types, `unknown`, unions, and type guards.
- Avoid non-null assertions unless correctness is proven at that boundary.
- Prefer `const`, `readonly`, early returns, and simple control flow.
- Do not rely on TypeScript strict mode being globally enabled; preserve and satisfy the compiler options actually configured in `tsconfig.json`.
- Keep template expressions simple and avoid repeated method calls from templates.

## Styling

- Use SCSS and place feature-specific styles with their component.
- Avoid `::ng-deep`.
- Follow the existing Stylelint configuration; do not introduce a CSS framework or global design system without an explicit request.
- Preserve the existing CSS ordering and style conventions in files you touch.

## Tests

- Use Vitest with Angular TestBed.
- Add or update focused, deterministic tests for behavior changes.
- Test public behavior, rendered output, and user interaction rather than private implementation details.
- Do not delete, skip, or focus tests to make checks pass.
- If a check already fails before the task, report it instead of changing unrelated code.

For detailed testing guidance, follow `.agents/testing.md`.

## Validation

For source, test, configuration, or style changes, run the relevant checks before finishing:

```bash
npm run lint
npm run stylelint
npm test
npm run build
```

Fix issues introduced by the change. Clearly report unrelated pre-existing failures.
