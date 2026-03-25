---
title: Code Smells
tags: [clean-code, smells, refactoring, design]
collection: Clean Code
---

# Code Smells

Part of [[Clean Code]].

Code smells are not bugs — they are structural problems that make code harder to change, understand, and reuse. They signal that refactoring is needed.

## Rigidity and Fragility

**Rigidity**: the software is difficult to change. A small change causes a cascade of subsequent changes through dependent modules. The system becomes so coupled that developers fear touching it.

**Fragility**: the software breaks in many places due to a single change — often in areas conceptually unrelated to what was changed. Fragility erodes confidence and makes every release a gamble.

## Immobility

You cannot reuse parts of the code in other projects because of the risks and effort involved in disentangling them. Components that should be reusable are tightly coupled to the rest of the system. The cure is decoupling through better design rules.

## Needless Complexity

The design contains infrastructure for things that might be needed someday, but aren't needed now. Over-engineering adds complexity without adding value. Favour simple, direct solutions over flexible frameworks built for imagined future requirements.

## Needless Repetition and Opacity

**Needless repetition**: the same code appears in multiple places. Every repetition is a future maintenance trap — a bug fixed in one place but not the others. Consolidate using the DRY principle.

**Opacity**: the code is hard to understand. The original programmer's intent is lost. Refactoring for clarity — better names, smaller functions, explanatory variables — is the cure.
