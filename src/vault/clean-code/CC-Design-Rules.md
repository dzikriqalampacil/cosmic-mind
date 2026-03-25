---
title: Design Rules
tags: [clean-code, design, architecture, oop]
collection: Clean Code
---

# Design Rules

Part of [[Clean Code]].

Structural choices that determine how well a system can grow and change without becoming brittle.

## High-Level Configuration

Keep configurable data — constants, thresholds, environment-specific values — at high levels of the system. They should be easy to find and easy to change without touching business logic deep inside the code.

## Polymorphism over Conditionals

Prefer polymorphism to `if/else` or `switch/case` chains. When you find yourself switching on a type repeatedly, that is a signal to use an interface or abstract class instead. Open/Closed Principle: open for extension, closed for modification.

## Dependency Injection

Depend on abstractions, not concretions. Inject dependencies rather than hard-coding them. This makes components independently testable and swappable without modifying the consuming class.

## Law of Demeter

A class should know only its direct dependencies — not the internals of what those dependencies return. Avoid chains like `a.getB().getC().doSomething()`. This tight coupling makes changes in B or C ripple unexpectedly.

## Threading & Coupling

Separate multi-threading code from single-threaded business logic. Concurrency bugs are extremely hard to reproduce and diagnose. Keep threading concerns isolated so the rest of the code can be reasoned about simply. Prevent over-configurability — too many knobs make a system hard to understand and test.
