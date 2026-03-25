---
title: Code Smells
tags: [refactoring, code-smells, design]
collection: Refactoring Guru: Code Smells
---

# Code Smells

Code smells are surface indicators of deeper problems in the code. They don't prevent the program from working, but signal that design is drifting toward something harder to change and understand.

Code smells are not bugs — they are warning signs. The fix is refactoring: improving internal structure without changing external behaviour.

## Categories

- [[Bloaters]] — code grown so large it's hard to work with
- [[Object-Orientation Abusers]] — OOP principles applied incompletely or incorrectly
- [[Change Preventers]] — changes in one place force changes everywhere
- [[Dispensables]] — pointless code whose removal would improve things
- [[Couplers]] — excessive coupling or delegation between classes
