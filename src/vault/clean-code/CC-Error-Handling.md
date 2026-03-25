---
title: Error Handling
tags: [clean-code, errors, exceptions, robustness]
collection: Clean Code
---

# Error Handling

Part of [[Clean Code]].

Error handling is important, but if it obscures logic, it is wrong. Keep the happy path and the error path separate.

## Separation of Concerns

Don't mix error handling and business logic. A function that handles errors should do nothing else. Use try/catch blocks to isolate error-handling code from the main flow — and consider extracting the try/catch body into its own function.

## Exceptions over Error Codes

Use exceptions instead of returning error codes. Error codes require the caller to check the return value immediately — and callers often forget or defer the check. Exceptions cannot be silently ignored; they propagate until caught, making failures impossible to miss.

## Null Safety

Don't return null from a method. When you return null, you are creating work for the caller and inviting NullPointerExceptions. Return a special-case object, an empty collection, or throw an exception instead. Similarly, don't pass null as an argument — a function that accepts null must defend against it with conditionals throughout.

## Context in Exceptions

Throw exceptions with context. An exception message should describe the operation that failed and the reason for the failure. Without context, the stack trace alone may not be enough to diagnose the problem in production. Wrap low-level exceptions in domain-specific exceptions that communicate what went wrong at the business level.
