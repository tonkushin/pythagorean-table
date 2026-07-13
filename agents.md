# Project Agent Instructions

## Stack

- Angular 22
- Standalone
- No SSR
- TypeScript (strict)
- SCSS
- npm
- Vitest
- ESLint

## Working Principles

- Make the smallest correct change.
- Preserve existing behavior unless explicitly requested.
- Keep diffs focused.
- Do not modify unrelated files.
- Do not introduce unnecessary abstractions.

## Architecture

- Components contain presentation logic.
- Business logic belongs in services.
- Shared logic should be reusable.
- Prefer composition over inheritance.

## Before finishing

Always:

1. Fix TypeScript errors.
2. Run lint.
3. Run tests.
4. Run build.
5. Fix all issues introduced by your changes.

Use these commands:

```bash
npm run lint
npm test
npm run build
```

## Additional Instructions

For Angular development, follow:

- `.agents/angular.md`

For tests:

- `.agents/testing.md`