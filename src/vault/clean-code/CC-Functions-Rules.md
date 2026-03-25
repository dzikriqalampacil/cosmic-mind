---
title: Functions Rules
tags: [clean-code, functions, design]
collection: Clean Code
---

# Functions Rules

Part of [[Clean Code]].

Functions are the primary unit of organisation in code. Getting them right makes everything else easier.

## Small and Focused

Functions should be small — ideally 5–10 lines. They should do one thing, and they should do it well. If a function has sections separated by blank lines or comments, it is doing more than one thing. Extract those sections into their own named functions.

## Single Responsibility

A function should operate at one level of abstraction. Mixing high-level policy with low-level detail in the same function forces readers to context-switch mentally. Stepdown rule: the code should read like a series of TO paragraphs, each composed of the next level down.

## Arguments

Fewer arguments is better. Zero is ideal; one or two is acceptable; three requires justification; four or more is almost always a design smell. Many arguments are often a sign that a class is trying to get out — group related arguments into a parameter object.

## No Side Effects

A function should either do something (a command) or answer something (a query) — not both. A function called `checkPassword()` should not secretly log the user in. Unexpected side effects are a leading cause of bugs and broken trust in a codebase.

## Flag Arguments

Don't use boolean flag arguments. `render(true)` tells the reader nothing. Split the function: `renderForSuite()` and `renderForSingleTest()` are explicit about intent and eliminate the conditional inside.
