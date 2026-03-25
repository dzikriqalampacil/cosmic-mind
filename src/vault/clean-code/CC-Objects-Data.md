---
title: Objects and Data Structures
tags: [clean-code, oop, data, design]
collection: Clean Code
---

# Objects and Data Structures

Part of [[Clean Code]].

Objects hide their data and expose behaviour. Data structures expose their data and have no meaningful behaviour. Mixing the two creates hybrids that are the worst of both worlds.

## Data Hiding

Objects should hide their internal structure. Don't just wrap fields in getters and setters — that exposes implementation without abstraction. Instead, expose methods that represent what the object *does*, not what it *contains*.

## Class Size and Focus

Classes should be small and do one thing. If your class has too many instance variables, it is probably doing more than one thing. Apply the Single Responsibility Principle: a class should have only one reason to change. Small, focused classes are easier to name, easier to test, and easier to reuse.

## Inheritance Principles

Base classes should know nothing about their derivatives. A superclass that imports or references a subclass is a design smell — it creates tight coupling in the wrong direction. Prefer composition over inheritance when the relationship is not a true "is-a".

## Static vs Instance

Prefer non-static methods to static methods. Static methods cannot be overridden, making them resistant to polymorphism and hard to substitute in tests. Use static only for pure utility functions that genuinely have no dependency on instance state.

## Data Structures vs Objects

It is better to have many functions than to pass code into a function to select a behaviour (via a flag or type check). Procedural code is good at adding new functions without changing data structures. Object-oriented code is good at adding new classes without changing existing functions. Choose the paradigm that matches how your system grows.
