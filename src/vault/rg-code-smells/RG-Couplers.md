---
title: Couplers
tags: [refactoring, code-smells, coupling]
collection: Refactoring Guru: Code Smells
---

# Couplers

Part of [[Code Smells]].

These smells contribute to excessive coupling between classes, or arise when coupling is replaced by excessive delegation. Tight coupling means changes ripple unpredictably and classes cannot be reused independently.

## Feature Envy

A method that seems more interested in the data of another class than its own. It reaches into another object's fields to do its calculations. Move the method to the class it envies — the logic belongs where the data lives.

## Inappropriate Intimacy

Two classes know too much about each other's internals. They dig into private fields and methods that should be hidden. Reduce the connection: extract a shared helper, move behaviour to one side, or introduce a formal interface between them.

## Message Chains

A client asks one object for another, then asks that object for another, and so on: `a.getB().getC().getD().doSomething()`. The client is tightly coupled to the entire navigation path. If any step changes, the chain breaks. Apply the Law of Demeter — only talk to your immediate neighbours.

## Incomplete Library Class

A library class doesn't do quite what you need, but you can't modify it. Developers work around it by duplicating code or adding hacks in callers. Use wrapper classes or extension methods to add the missing behaviour in one controlled place.
