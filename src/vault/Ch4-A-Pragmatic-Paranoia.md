---
title: Ch4 A Pragmatic Paranoia
tags: [contracts, assertions, exceptions, resources, defensive-programming]
---

# Chapter 4 — A Pragmatic Paranoia

Part of [[The Pragmatic Programmer]].

**Tip 30: You Can't Write Perfect Software**

No one in the brief history of computing has ever written a piece of perfect software. Pragmatic Programmers don't trust themselves, either.

## 21. Design by Contract

A correct program is one that does no more and no less than it claims to do.

Use:
- **Preconditions** — what must be true before the routine is called
- **Postconditions** — what the routine guarantees when it finishes
- **Invariants** — conditions that remain true during execution

**Tip 31: Design with Contracts**

Write "lazy" code: be strict in what you will accept before you begin, and promise as little as possible in return.

### Implementing DBC

Simply enumerate at design time:
- What the input domain range is
- What the boundary conditions are
- What the routine promises to deliver (and what it doesn't)

### Invariants
- **Loop Invariants**: true before and during the loop, therefore also when it finishes
- **Semantic Invariants**: err on the side of not processing a transaction rather than processing a duplicate

## 22. Dead Programs Tell No Lies

All errors give you information. If there is an error, something very, very bad has happened.

**Tip 32: Crash Early**

`A dead program normally does a lot less damage than a crippled one.`

## 23. Assertive Programming

**Tip 33: If It Can't Happen, Use Assertions to Ensure That It Won't**

- Assertions are also useful checks on an algorithm's operation
- Don't use assertions in place of real error handling
- Leave Assertions Turned On, unless you have critical performance issues

## 24. When to Use Exceptions

**Tip 34: Use Exceptions for Exceptional Problems**

The program must run if all the exception handlers are removed. If your code tries to open a file for reading and that file does not exist, should an exception be raised?

- **Yes**: If the file *should* have been there
- **No**: If you have no idea whether the file should exist or not

## 25. How to Balance Resources

When managing resources — memory, transactions, threads, timers — we have to close, finish, delete, deallocate them when done.

**Tip 35: Finish What You Start**

### Nest Allocations
1. Deallocate resources in the **opposite order** to which you allocate them
2. When allocating the same set of resources in different places, always allocate them in the **same order** (prevent deadlocks)

Use `finally` to free resources.
