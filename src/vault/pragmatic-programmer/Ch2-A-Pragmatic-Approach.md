---
title: Ch2 A Pragmatic Approach
tags: [dry, design, prototyping, estimation]
collection: The Pragmatic Programmer
---

# Chapter 2 — A Pragmatic Approach

Part of [[The Pragmatic Programmer]].

## 7. The Evils of Duplication

Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.

**Tip 11: DRY — Don't Repeat Yourself**

Types of duplication:
- **Imposed duplication** — the environment seems to require it
- **Inadvertent duplication** — developers don't realise they're duplicating
- **Impatient duplication** — lazy shortcut
- **Interdeveloper duplication** — multiple people duplicate across the team

**Tip 12: Make It Easy to Reuse**

## 8. Orthogonality

Two or more things are orthogonal if changes in one do not affect any of the others. Write "shy" code.

**Tip 13: Eliminate Effects Between Unrelated Things**

Benefits:
- Changes are localized
- Promotes reuse
- Diseased sections of code are isolated
- Better tested, not tied to a platform

## 9. Reversibility

Be prepared for changes.

**Tip 14: There Are No Final Decisions**

## 10. Tracer Bullets

We're looking for something that gets us from a requirement to some aspect of the final system quickly, visibly, and repeatably.

**Tip 15: Use Tracer Bullets to Find the Target**

Advantages:
- Users get to see something working early
- Developers build a structure to work in
- You have an integration platform
- You have a better feel for progress

> Tracer code is lean but complete, and forms part of the skeleton of the final system.

## 11. Prototypes and Post-it Notes

We build prototypes to analyze and expose risk, and to offer chances for correction at greatly reduced cost.

**Tip 16: Prototype to Learn**

Prototype anything that: carries risk, hasn't been tried before, is absolutely critical, is experimental, or is doubtful.

Avoid worrying about: Correctness, Completeness, Robustness, Style.

**Never deploy the prototype.**

## 12. Domain Languages

**Tip 17: Program Close to the Problem Domain**

## 13. Estimating

**Tip 18: Estimate to Avoid Surprises**

| Duration      | Quote estimate in                     |
|---------------|---------------------------------------|
| 1–15 days     | days                                  |
| 3–8 weeks     | weeks                                 |
| 8–30 weeks    | months                                |
| 30+ weeks     | think hard before giving an estimate  |

Process:
1. Understand What's Being Asked
2. Build a Model of the System
3. Break the Model into Components
4. Give Each Parameter a Value
5. Calculate the Answers
6. Keep Track of Your Estimating Prowess

**Tip 19: Iterate the Schedule with the Code**

When asked for an estimate: **"I'll get back to you."**
