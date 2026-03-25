---
title: Change Preventers
tags: [refactoring, code-smells, coupling]
collection: Refactoring Guru: Code Smells
---

# Change Preventers

Part of [[Code Smells]].

These smells mean that changing one thing forces changes in many other places. The cost of every modification balloons beyond what it should be, making the codebase progressively harder to evolve.

## Divergent Change

One class is changed for many different reasons. Every time a new feature touches this class for a different concern, it's a sign the class carries too many responsibilities. Apply the Single Responsibility Principle — split the class so each piece changes for one reason only.

## Shotgun Surgery

The opposite of divergent change. A single logical change requires making many small edits scattered across many different classes. The behaviour that should be in one place is spread everywhere. Move and consolidate the related code into a single class.

## Parallel Inheritance Hierarchies

Every time you create a subclass in one hierarchy, you have to create a corresponding subclass in another. The two trees are coupled by design. Eliminate the duplication by merging the hierarchies or using references instead of inheritance.
