---
title: Ch3 The Basic Tools
tags: [tools, debugging, editors, version-control]
collection: The Pragmatic Programmer
---

# Chapter 3 — The Basic Tools

Part of [[The Pragmatic Programmer]].

**Tip 20: Keep Knowledge in Plain Text**

## 14. The Power of Plain Text

### The Power of Text
- Insurance against obsolescence
- Leverage: virtually every tool in computing can operate on plain text
- Easier testing

## 15. Shell Games

**Tip 21: Use the Power of Command Shells**

A benefit of GUIs is *WYSIWYG* — what you see is what you get. The disadvantage is *WYSIAYG* — what you see is **all** you get.

## 16. Power Editing

**Tip 22: Use a Single Editor Well**

Editor "must" features:
- Configurable, Extensible, Programmable
- Syntax highlighting, Auto-completion, Auto-indentation
- IDE-like features (compile, debug, etc.)

## 17. Source Code Control

**Tip 23: Always Use Source Code Control**

## 18. Debugging

**Tip 24: Fix the Problem, Not the Blame**

**Tip 25: Don't Panic**

Don't waste a neuron on "but that can't happen" — because quite clearly it can, and has. Try to discover the **root cause**, not just this particular appearance of it.

### Debugging Strategies

- **Bug Reproduction** — make it reproducible with a single command
- **Visualize Your Data** — use debugger tools, pen and paper
- **Tracing** — know what happens before and after
- **Rubber Ducking** — explain the bug to someone else
- **Process of Elimination** — the bug is most likely in your application

**Tip 26: "select" Isn't Broken**

**Tip 27: Don't Assume It — Prove It**

### Debugging Checklist
- Is the problem a direct result of the underlying bug, or merely a symptom?
- Is the bug really in the compiler? The OS? Or your code?
- If you explained this problem in detail to a coworker, what would you say?
- Are the unit tests complete enough?
- Do the conditions that caused this bug exist anywhere else in the system?

## 19. Text Manipulation

**Tip 28: Learn a Text Manipulation Language**

## 20. Code Generators

**Tip 29: Write Code That Writes Code**

Two main types:
- **Passive code generators** — run once to produce a result (parameterized templates)
- **Active code generators** — used each time their results are required; take a single representation and convert it into all forms your application needs

Keep the input format simple, and the code generator becomes simple.
