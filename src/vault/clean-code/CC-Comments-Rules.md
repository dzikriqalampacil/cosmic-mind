---
title: Comments Rules
tags: [clean-code, comments, documentation]
collection: Clean Code
---

# Comments Rules

Part of [[Clean Code]].

Comments are a necessary evil — necessary when code cannot be made clear enough on its own, evil when used to mask poor naming or explain the obvious.

## Code as Documentation

Always try to explain yourself in code first. A well-named function eliminates the need for a comment above it. Before writing a comment, ask whether the code itself can be restructured to be self-evident. If it can, do that instead.

## Good Comment Types

Some comments are genuinely valuable:
- **Intent** — explains *why* a decision was made, not *what* the code does
- **Clarification** — translates an obscure algorithm or regex into human language
- **Warning of consequences** — flags a slow operation, a non-obvious side effect, or a known fragility
- **TODO** — marks known issues that will be addressed later (but keep the list short)

## Bad Comment Patterns

Redundant comments that restate the code add noise without value (`i++; // increment i`). Closing-brace comments (`} // end of for loop`) are a sign the function is too long. Journal comments (change history in the file) belong in version control, not the source.

## Dead Code in Comments

Never comment out code. Just delete it. Version control will remember it if you ever need it back. Commented-out code rots: it becomes out of date, confuses readers, and rarely gets cleaned up. It is the broken window of comments.
