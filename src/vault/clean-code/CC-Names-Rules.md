---
title: Names Rules
tags: [clean-code, naming, readability]
collection: Clean Code
---

# Names Rules

Part of [[Clean Code]].

Names are the most pervasive form of documentation. A good name eliminates the need for a comment.

## Descriptive and Unambiguous Names

Choose names that reveal intent. The name of a variable, function, or class should answer: why it exists, what it does, and how it is used. If a name requires a comment to explain it, the name is not good enough.

## Meaningful Distinctions

Make meaningful distinction between names. Don't use noise words — `ProductData` vs `ProductInfo` conveys no real difference. Don't number variables (`a1`, `a2`). If two things need different names, the names should reflect how they actually differ.

## Pronounceable and Searchable Names

Use pronounceable names so you can discuss the code out loud. Use searchable names — single-letter variables and numeric constants are hard to grep for. The length of a name should correspond to the size of its scope.

```js
// hard to discuss, impossible to search
int d; // elapsed days

// clear and searchable
int elapsedDays;
```

## Named Constants

Replace magic numbers with named constants. The number `86400` buried in code is meaningless; `SECONDS_IN_A_DAY` is self-documenting and easy to find and change.

## Avoid Encodings

Don't append prefixes or type information to names (`strName`, `iCount`, `m_value`). Modern IDEs surface type information on demand. Encoding type into a name creates noise and makes renaming harder. Hungarian notation is obsolete.
