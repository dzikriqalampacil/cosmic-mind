---
title: Source Code Structure
tags: [clean-code, formatting, structure]
collection: Clean Code
---

# Source Code Structure

Part of [[Clean Code]].

Formatting is about communication. The formatting choices you make reflect how much you care about your craft and your teammates.

## Vertical Formatting

Separate concepts vertically with blank lines — they act as visual paragraph breaks. Related code should appear vertically dense, without blank lines between it. Think of a source file like a newspaper: the most important things at the top, details below.

## Variable Proximity

Declare variables close to their first use. Local variables should appear just before they are needed. Instance variables should be declared at the top of the class. Dependent functions should be close to one another — the caller above, the callee below.

## Function Ordering

Place functions in the downward direction. When a function calls another, the callee should appear below the caller. This lets the file read top-to-bottom like a narrative, with high-level concepts first and details later.

## Line Length

Keep lines short — aim for under 80–120 characters. Long lines make the reader scroll horizontally, break the visual rhythm, and usually signal that a line is doing too much. Don't use horizontal alignment of variables or assignments; it draws the eye to the wrong thing and is tedious to maintain.

## Indentation and White Space

Don't break indentation for the sake of short if-bodies or loop-bodies. Always use braces. Use white space to associate related things and disassociate weakly related things. Indentation level should clearly reflect scope — never flatten it for visual style.
