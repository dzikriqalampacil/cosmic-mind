---
title: Tests
tags: [clean-code, testing, quality]
collection: Clean Code
---

# Tests

Part of [[Clean Code]].

Test code is as important as production code. It enables refactoring, documents behaviour, and provides a safety net for change.

## F.I.R.S.T. Principles

Clean tests follow five rules:
- **Fast** — tests must run quickly or they won't be run
- **Independent** — tests must not depend on each other; any test should be runnable in isolation
- **Repeatable** — tests must produce the same result in any environment
- **Self-validating** — tests must have a boolean output: pass or fail, no manual inspection required
- **Timely** — write tests just before the production code they test; tests written after feel like a chore

## One Assert per Test

Each test should verify one logical concept. One assert per test keeps tests focused, makes failures immediately diagnostic, and keeps test names short and accurate. Tests with many assertions often reveal that the function under test is doing too much.

## Readability

Tests are the best documentation of what the system does — they are the only documentation guaranteed to be up to date. Write tests to be read. Use the BUILD-OPERATE-CHECK pattern: set up data, perform the operation, check the result. Names should read as sentences: `givenExpiredSession_redirectsToLogin`.

## Coverage Tools

Use a coverage tool to find untested code. But don't chase 100% coverage as a goal — coverage is a tool for finding gaps, not a metric of quality. A test suite with 80% meaningful coverage is better than one with 100% trivial coverage. Test state coverage (branches and conditions), not just line coverage.
