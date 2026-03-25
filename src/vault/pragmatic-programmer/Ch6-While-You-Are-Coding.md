---
title: Ch6 While You Are Coding
tags: [coding, refactoring, testing, algorithms, deliberate-practice]
collection: The Pragmatic Programmer
---

# Chapter 6 — While You Are Coding

Part of [[The Pragmatic Programmer]].

## 31. Program by Coincidence

We should avoid programming by coincidence — relying on luck and accidental successes.

**Tip 44: Don't Program by Coincidence**

### How to Program Deliberately
- Always be aware of what you are doing
- Don't code blindfolded
- Proceed from a plan
- Rely only on reliable things
- Document your assumptions (Design by Contract)
- Don't just test your code, but test your assumptions as well
- Prioritize your effort
- Don't be a slave to history — don't let existing code dictate future code

## 32. Algorithm Speed

Pragmatic Programmers estimate the resources that algorithms use — time, processor, memory.

### Big O Notation
- **O(1)**: Constant — access element in array, simple statements
- **O(lg n)**: Logarithmic — binary search
- **O(n)**: Linear — sequential search
- **O(n lg n)**: Worse than linear but not much (quicksort, heapsort average)
- **O(n²)**: Square law — selection and insertion sorts
- **O(Cⁿ)**: Exponential — travelling salesman, set partitioning

**Tip 45: Estimate the Order of Your Algorithms**

**Tip 46: Test Your Estimates**

Be pragmatic about choosing appropriate algorithms — the fastest one is not always the best for the job. Beware of premature optimization.

## 33. Refactoring

Code needs to evolve; it's not a static thing.

### When Should You Refactor?
- You've discovered a violation of the DRY principle
- You've discovered code that could be more orthogonal
- Outdated knowledge — requirements drift
- Performance improvements needed

**Tip 47: Refactor Early, Refactor Often**

### How Do You Refactor?
1. Don't try to refactor and add functionality at the same time
2. Make sure you have good tests before you begin
3. Take short, deliberate steps

## 34. Code That's Easy to Test

Build testability into the software from the very beginning.

**Tip 48: Design to Test**

There's no better way to fix errors than by avoiding them in the first place. Build the tests before you implement the code.

### Using Test Harnesses
- A standard way to specify setup and cleanup
- A method for selecting individual tests or all available tests
- A means of analyzing output for expected (or unexpected) results
- A standardized form of failure reporting

**Tip 49: Test Your Software, or Your Users Will**

## 35. Evil Wizards

If you use a wizard and you don't understand all the code it produces, you won't be in control of your own application.

**Tip 50: Don't Use Wizard Code You Don't Understand**
