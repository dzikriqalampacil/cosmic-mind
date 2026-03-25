---
title: Dispensables
tags: [refactoring, code-smells, cleanup]
collection: Refactoring Guru: Code Smells
---

# Dispensables

Part of [[Code Smells]].

A dispensable is something pointless or unneeded. Removing it makes the code cleaner, faster to read, and easier to maintain. When in doubt, delete it.

## Duplicate Code

The same code structure appears in more than one place. If you change logic in one copy you must remember to change all others — and you will forget. Extract the duplication into a single method or class and call it everywhere.

## Lazy Class

A class that does too little to justify its existence. Perhaps it was useful once but was scaled back, or it was created speculatively. If a class isn't pulling its weight, inline it into its caller or merge it with a related class.

## Data Class

A class that only has fields plus getters and setters, with no real behaviour of its own. It's a data bag being manipulated entirely by other classes. Move relevant behaviour into the data class so it can take responsibility for its own data.

## Dead Code

A variable, parameter, field, method, or class that is no longer used anywhere. It was probably left behind after requirements changed. Delete it — that's what version control is for.

## Speculative Generality

Code written for anticipated future requirements that never arrived: abstract base classes nobody extends, parameters nobody passes, hooks nobody calls. It adds complexity today for a benefit that may never come. Delete it and add it back if the need actually arises.

## Comments

A method is dense with comments explaining what the code does. Good comments explain *why*, not *what*. When comments are needed to explain *what*, that's a signal the code itself should be clearer — better names, smaller methods, explanatory variables.
