---
title: General Rules
tags: [clean-code, principles, simplicity]
collection: Clean Code
---

# General Rules

Part of [[Clean Code]].

Foundational principles that apply everywhere in a codebase — not tied to a single language or paradigm.

## Standard Conventions

Follow the conventions established by your team or language community. Consistency across the codebase reduces cognitive load. If the project uses a naming convention, a formatting standard, or a test structure — stick to it everywhere.

## Simplicity

Keep it simple. Simpler is always better. Reduce complexity as much as possible. Every time you add a clever trick, an extra abstraction, or a nested conditional, ask: does this actually need to be this complex?

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler

## Boy Scout Rule

Leave the campground cleaner than you found it. When you touch a file, improve it slightly — rename a confusing variable, break up a long method, add a missing test. Small improvements compound over time.

## Root Cause Analysis

Always look for the root cause of a problem. Treating symptoms leads to fragile fixes. When a bug appears repeatedly or a design keeps breaking down, stop and ask *why* — trace it back to the underlying issue.

## Principle of Least Surprise

Code should do what its name and structure suggest. A method called `getUser()` should not send an email. A class called `Calculator` should not write to a database. Surprising behavior erodes trust in the codebase.

## DRY & Safety

Don't repeat yourself — every piece of knowledge should have a single, authoritative representation. And do not override safeties: error handling, access controls, and validation exist for a reason.
