---
title: Ch5 Bend or Break
tags: [coupling, metaprogramming, concurrency, mvc, architecture]
---

# Chapter 5 — Bend or Break

Part of [[The Pragmatic Programmer]].

## 26. Decoupling and the Law of Demeter

Be careful about how many other modules you interact with and how you came to interact with them.

```java
// Avoid this:
book.pages().last().text()

// Prefer this:
book.textOfLastPage()
```

**Tip 36: Minimize Coupling Between Modules**

### The Law of Demeter for Functions

Any method of an object should call only methods belonging to:
- Itself
- Any parameters that were passed to the method
- Any object it created
- Any directly held component

## 27. Metaprogramming

"Out with the details!" Get them out of the code. Make our code highly configurable and "soft" — easily adaptable to changes.

**Tip 37: Configure, Don't Integrate**

**Tip 38: Put Abstractions in Code, Details in Metadata**

*Program for the general case, and put the specifics somewhere else — outside the compiled code base.*

Benefits:
- Forces you to decouple your design
- You can customize the application without recompiling
- Metadata can be expressed closer to the problem domain

## 28. Temporal Coupling

Two aspects of time:
- **Concurrency**: things happening at the same time
- **Ordering**: the relative positions of things in time

Reduce any time-based dependencies.

**Tip 39: Analyze Workflow to Improve Concurrency**

**Tip 40: Design Using Services**

**Tip 41: Always Design for Concurrency**

If we design to allow for concurrency, we can more easily meet scalability or performance requirements when the time comes.

## 29. It's Just a View

### Model-View-Controller

Separates the model from both the GUI that represents it and the controls that manage the view.

**Tip 42: Separate Views from Models**

- **Model** — abstract data model, no direct knowledge of views or controllers
- **View** — subscribes to changes in the model and logical events from the controller
- **Controller** — publishes events to both the model and the view

## 30. Blackboards

A blackboard system lets us decouple objects completely — a forum where knowledge consumers and producers can exchange data anonymously and asynchronously.

Functions a Blackboard system should have:
- **read** — search for and retrieve data
- **write** — put an item into the space
- **take** — like read, but removes the item
- **notify** — fire when an object matching the template is written

**Tip 43: Use Blackboards to Coordinate Workflow**
