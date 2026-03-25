---
title: Understandability Tips
tags: [clean-code, readability, clarity]
collection: Clean Code
---

# Understandability Tips

Part of [[Clean Code]].

Code is read far more often than it is written. These tips reduce the mental effort required to understand what the code does.

## Consistency

If you do something a certain way, do all similar things the same way. Inconsistency forces the reader to wonder whether the difference is intentional. Consistent naming, consistent structure, and consistent patterns let readers apply what they learn in one place everywhere else.

## Explanatory Variables

Introduce intermediate variables with meaningful names to clarify the intent of complex expressions. Instead of one long conditional or calculation, break it into named steps that read like a sentence.

```js
// unclear
if (user.age >= 18 && user.country === 'US' && !user.banned) { ... }

// clear
const isAdult = user.age >= 18
const isEligible = user.country === 'US' && !user.banned
if (isAdult && isEligible) { ... }
```

## Boundary Conditions

Boundary conditions — off-by-one errors, edge cases, null inputs — are where bugs live. Encapsulate boundary logic in a single place rather than scattering it throughout the code. Name the concept explicitly so readers know what is being guarded.

## Value Objects

Prefer dedicated value objects to primitive types. A `Money` object with currency and amount is clearer and safer than a bare `float`. Primitives lack the context needed to interpret their meaning and prevent misuse.

## Logical & Conditional Clarity

Avoid logical dependency: don't write methods that only work correctly based on some hidden state elsewhere in the class. Avoid negative conditionals: `if (!isNotValid)` forces the reader to double-negate mentally. Rewrite as `if (isValid)`.
