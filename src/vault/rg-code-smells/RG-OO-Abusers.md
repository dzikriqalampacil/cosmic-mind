---
title: Object-Orientation Abusers
tags: [refactoring, code-smells, oop]
collection: Refactoring Guru: Code Smells
---

# Object-Orientation Abusers

Part of [[Code Smells]].

These smells come from incomplete or incorrect application of object-oriented principles. The code works, but it fights against the language rather than working with it.

## Switch Statements

A complex switch or long if-else chain that appears in multiple places. When a new case is added, you have to find every switch and update each one. OOP solves this through polymorphism — the right object handles its own behaviour without needing a dispatcher.

## Temporary Field

An object has a field that is only set and used in certain circumstances, and is null or meaningless the rest of the time. This makes the object's state hard to reason about. Extract the conditional behaviour and its fields into a separate class.

## Refused Bequest

A subclass inherits methods and data from its parent but uses only some of them, ignoring or overriding the rest with empty implementations. This signals a wrong inheritance hierarchy — prefer composition, or restructure so the subclass only inherits what it actually needs.

## Alternative Classes with Different Interfaces

Two classes do the same thing but have different method names. Neither can substitute for the other despite serving the same purpose. Rename methods to match, then extract a common interface — or merge the classes entirely.
