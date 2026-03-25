---
title: Ch8 Pragmatic Projects
tags: [teams, automation, testing, documentation, delivery]
collection: The Pragmatic Programmer
---

# Chapter 8 — Pragmatic Projects

Part of [[The Pragmatic Programmer]].

## 41. Pragmatic Teams

Pragmatic techniques that help an individual can work for teams.

### No Broken Windows

Quality is a team issue. Teams as a whole should not tolerate broken windows — those small imperfections that no one fixes.

### Communicate

There is a simple marketing trick that helps teams communicate as one: **generate a brand.**

### Don't Repeat Yourself

Appoint a member as the project librarian.

### Orthogonality

Analysis, design, coding, and testing cannot happen in isolation. These are different views of the same problem.

**Tip 60: Organize Around Functionality, Not Job Functions**

- Split teams by functionality (Database, UI, API)
- Let the teams organize themselves internally
- We're looking for cohesive, largely self-contained teams

## 42. Ubiquitous Automation

**Tip 61: Don't Use Manual Procedures**

We want to check out, build, test, and ship with a **single command**.

### Build Automation

A build is a procedure that takes an empty directory and builds the project from scratch:
1. Check out the source code from the repository
2. Build the project from scratch (marked with version number)
3. Create a distributable image
4. Run specified tests

**Nightly build** — run it every night.

## 43. Ruthless Testing

Pragmatic Programmers are driven to find our bugs *now*, so we don't have to endure the shame of others finding our bugs later.

**Tip 62: Test Early. Test Often. Test Automatically.**

**Tip 63: Coding Ain't Done 'Til All the Tests Run**

### What to Test
- Unit testing
- Integration testing
- Validation and verification
- Resource exhaustion, errors, and recovery
- Performance testing
- Usability testing

### How to Test
- Regression testing
- Test data (real-world and synthetic)
- Testing the tests themselves

**Tip 64: Use Saboteurs to Test Your Testing**

**Tip 65: Test State Coverage, Not Code Coverage**

### Tightening the Net

If a bug slips through, add a new test to trap it next time.

**Tip 66: Find Bugs Once**

## 44. It's All Writing

**Tip 67: Treat English as Just Another Programming Language**

**Tip 68: Build Documentation In, Don't Bolt It On**

Comments should discuss **why** something is done, its purpose and its goal.

Documentation and code are different views of the same underlying model.

## 45. Great Expectations

The success of a project is measured by how well it meets the expectations of its users.

**Tip 69: Gently Exceed Your Users' Expectations**

### The Extra Mile

Give users that little bit more than they were expecting:
- Balloon or ToolTip help
- Keyboard shortcuts
- A quick reference guide
- Log file analyzers
- Automated installation

### Pride and Prejudice

**Tip 70: Sign Your Work**

*"I wrote this, and I stand behind my work."*
