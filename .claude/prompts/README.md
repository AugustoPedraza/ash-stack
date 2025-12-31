# Prompt Templates

Structured prompts for multi-domain feature development.

## Quick Reference

| Template | When to Use |
|----------|-------------|
| `feature-design.md` | Starting a complex feature (full workflow) |
| `ux-focus.md` | Need to think through user flows only |
| `data-model-focus.md` | Need to design schema only |
| `implement-feature.md` | Ready to code (UX & data decided) |
| `ux-review.md` | Review existing UI for UX issues |

---

## Recommended Workflow

### For Complex Features

```
1. Start new conversation
   → Use feature-design.md template
   → Work through phases 1-5 sequentially
   → Fork if needed for deep-dives

2. When ready to implement
   → Use implement-feature.md
   → Backend first, then frontend
   → Test at each step
```

### For Quick Features

```
1. If UX is obvious
   → Skip to data-model-focus.md
   → Then implement-feature.md

2. If data model is obvious
   → Quick UX check with ux-focus.md
   → Then implement-feature.md
```

---

## Conversation Forking Strategy

For complex features, consider forking:

```bash
# Main feature conversation
claude --resume

# Fork for UX deep-dive
claude --continue --fork-session
/rename feature-x-ux

# Fork for data modeling
claude --continue --fork-session
/rename feature-x-data

# Back to main for implementation
claude --resume feature-x-main
```

---

## Example Prompts

### Starting a Feature
```
Let's design a new feature using the feature-design template.

Feature: [Name]
One-liner: [What it does]

Start with Phase 1: UX Analysis. Ask me clarifying questions.
```

### UX Only
```
I need UX help. No code yet.

Feature: [Name]
User goal: [What they want to achieve]

What questions do you have about the user flow?
```

### Data Model Only
```
I need help with the data model. No UI discussion.

Feature: [Name]
Current entities: [What exists]
Goal: [What needs to change]

What's the best schema design?
```

### Ready to Implement
```
I'm ready to implement. Context:

Feature: [Name]
UX: [Decided flow]
Data: [Decided schema]
API: [Decided endpoints]

Start with backend. What's first?
```

---

## Quality Checklist

Before marking a feature complete:

- [ ] UX documented
- [ ] Data model reviewed
- [ ] Backend tests passing
- [ ] Frontend using existing components
- [ ] Design tokens used (no raw colors)
- [ ] Loading/error/empty states handled
- [ ] `just verify-full` passes
