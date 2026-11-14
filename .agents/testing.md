# Testing Guide

Testing framework:

- Vitest

---

## General

Every behavior change should include tests.

Do not remove tests to make the build pass.

Update existing tests when behavior changes.

---

## Unit Tests

Prefer

- small
- isolated
- deterministic

tests.

Mock only external dependencies.

Avoid mocking business logic.

---

## Component Tests

Test:

- rendered output
- user interaction
- signals
- forms

Avoid testing implementation details.

---

## Services

Test only public API.

Avoid testing private methods.

---

## Signals

Verify:

- computed values
- updates
- derived state

Do not test Angular internals.

---

## Forms

Test

- valid state
- invalid state
- validation messages
- submit logic

---

## Naming

Use

```ts
should
...
```

style descriptions.

Example

```ts
should
update
total
when
quantity
changes
```

---

## Before finishing

Ensure:

- tests pass
- no skipped tests
- no focused tests