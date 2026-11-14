# Angular 22 Development Guide

## General

Use modern Angular APIs.

Prefer:

- standalone APIs
- Signals
- Signal Forms
- inject()
- control flow blocks
- lazy loading

Avoid legacy Angular patterns unless explicitly requested.

---

# Components

Use standalone components only.

Prefer:

- input()
- output()
- model()

Do not use:

- NgModules
- ViewEngine APIs

Keep components focused on presentation.

Move business logic into services.

Avoid components exceeding roughly 300 lines.

---

# Dependency Injection

Prefer

```ts
const router = inject(Router);
```

instead of constructor injection.

Keep providers close to usage.

Avoid unnecessary global providers.

---

# Signals

Signals are the default state management.

Prefer

- signal()
- computed()
- linkedSignal()

Use effect() only when side effects are required.

Do not use effect() for derived state.

Avoid unnecessary writable signals.

---

# Resources

When loading async data, prefer modern Angular Resource APIs when appropriate.

Avoid writing custom loading state if Resource solves the problem.

---

# RxJS

Use RxJS only for:

- HTTP
- Router
- WebSocket
- external streams

Do not use RxJS as component state.

Avoid manual subscribe().

Prefer:

- async interop
- toSignal()
- rxResource()

---

# Templates

Use

```html
@if

@for

@switch
```

Always use

```html
track
```

inside @for.

Avoid complex template expressions.

Avoid calling methods repeatedly.

---

# Signal Forms

Signal Forms are the preferred solution.

Prefer

- schema validation
- declarative validators
- computed validation

Avoid Reactive Forms unless compatibility requires them.

---

# Styling

Use SCSS.

Prefer component styles.

Avoid

```scss
::ng-deep
```

Use CSS variables instead of hardcoded colors.

---

# TypeScript

Never use

```ts
any
```

Avoid

```ts
!
```

Prefer

- readonly
- const
- discriminated unions

Prefer early return.

Avoid deeply nested if statements.

---

# Performance

Avoid duplicated state.

Avoid unnecessary effects.

Avoid recomputation.

Prefer lazy loading.

---

# Refactoring

Separate

- refactoring

from

- behavior changes

Do not change public APIs without being asked.