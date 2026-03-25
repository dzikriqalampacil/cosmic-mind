# Claude Code Guidelines

## Code Quality

- Remove unused code (variables, imports, functions, components) whenever encountered — do not leave dead code behind.
- Resolve all red-line diagnostics (errors and warnings) introduced by any code change before finishing.

## Vault Content Rules

- Wikilinks (`[[...]]`) in vault `.md` files must only point **up** (to the parent/root node) or **down** (to a child node). Never link sideways to sibling nodes at the same level — e.g. a chapter file must not wikilink to another chapter file.
