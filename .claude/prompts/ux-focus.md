# UX-Focused Analysis

**Mode:** UX/Product thinking only. No implementation details.

---

## Context
Feature: [NAME]
User goal: [WHAT THE USER WANTS TO ACHIEVE]

---

## Questions to Answer

### 1. Entry Points
- How does the user get here?
- What state are they in when they arrive?

### 2. Primary Action
- What's the ONE main thing they want to do?
- What does success look like?

### 3. Secondary Actions
- What else might they want to do?
- Priority order?

### 4. Navigation
- Where can they go from here?
- How do they go back?

### 5. Feedback
- How do we confirm actions worked?
- How do we show errors?

### 6. Edge Cases
- What if there's no data?
- What if something fails?
- What if they don't have permission?

---

## Output Format

After discussion, document:

```markdown
## User Flow: [Name]

**Entry:** [How user arrives]
**Goal:** [What they want]

### Happy Path
1. User sees [...]
2. User clicks [...]
3. System shows [...]
4. User confirms [...]
5. Success: [...]

### Error Handling
- If [error]: Show [message], allow [recovery action]

### States
- Empty: [what to show]
- Loading: [what to show]
- Error: [what to show]
```

---

## Prompt Example

```
I need UX help. No code - just flows and decisions.

Feature: Contact creation from unknown conversation
User goal: Save an unknown phone number as a contact while viewing the conversation

Let's map out the flow. What questions do you have?
```
