---
title: Bloaters
tags: [refactoring, code-smells, bloaters]
collection: Refactoring Guru: Code Smells
---

# Bloaters

Part of [[Code Smells]].

Bloaters are methods and classes that have grown so large they are difficult to work with. They accumulate gradually as the program evolves — nobody adds 500 lines at once, but nobody cleans them up either.

## Long Method

A method contains too many lines of code. As a rule of thumb, any method longer than ten lines should make you start questioning. Long methods are hard to understand, test, and reuse. The cure is to aggressively extract smaller methods with descriptive names — the name itself documents intent better than a comment ever could.

## Large Class

A class contains too many fields, methods, or lines of code. When a class tries to do too much, it usually results in duplicated code elsewhere. Extract subclasses or separate classes to distribute the responsibilities.

## Primitive Obsession

Using primitives (int, string, array) instead of small objects for simple domain concepts — e.g. a currency as a plain float, or a phone number as a plain string. Primitives carry no validation, no behaviour, and no meaning. Replace with small value objects that encapsulate the concept.

## Long Parameter List

A method has more than three or four parameters. Long parameter lists are hard to understand and easy to get wrong. Group related parameters into a parameter object, or pass an existing object that already contains the data.

## Data Clumps

Different parts of the code contain identical groups of variables that always appear together — e.g. database connection fields always passed as three separate params. If you removed one from the group and the rest become meaningless, you have a data clump. Consolidate them into their own class.
