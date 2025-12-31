# Feature Design Template

Use this template for complex features that span multiple domains.
Work through each section **sequentially** - don't skip ahead to code.

---

## Feature: [NAME]

**One-liner:** [What does this feature do for the user?]

---

## Phase 1: UX Analysis (No Code)

### User Story
```
As a [user type]
I want to [action]
So that [benefit]
```

### User Flows
Describe the main paths:

1. **Happy path:**
   - Entry point →
   - Steps →
   - Success state →

2. **Alternative paths:**
   - [Describe variations]

3. **Error paths:**
   - [What can go wrong? How do we handle it?]

### States & Transitions
```
[State A] --action--> [State B] --action--> [State C]
```

### Edge Cases
- [ ] Empty state (no data)
- [ ] Loading state
- [ ] Error state
- [ ] Partial data
- [ ] Permission denied
- [ ] Offline/connectivity
- [ ] [Feature-specific edge cases]

### Open UX Questions
1. [Question for user/PM?]
2. [Unclear behavior?]

---

## Phase 2: Data Model

### Entities Affected
| Entity | Changes | New? |
|--------|---------|------|
| | | |

### Schema Changes
```
# New tables or fields needed:

# Example:
# contacts
#   + conversation_id: references conversations (nullable)
#   + registered_at: timestamp
```

### Relationships
```
[Entity A] --relationship--> [Entity B]
```

### Queries Needed
- [ ] [Describe key queries]
- [ ] [Consider indexes]

### Data Questions
1. [Migration strategy?]
2. [Backwards compatibility?]

---

## Phase 3: API Design

### Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| | | |

### Request/Response Examples
```json
// POST /api/endpoint
// Request:
{
}

// Response:
{
}
```

### Authorization
- [ ] Who can access?
- [ ] Row-level security?

### API Questions
1. [Pagination?]
2. [Real-time updates needed?]

---

## Phase 4: UI Components

### Components Needed
| Component | Exists? | Changes Needed |
|-----------|---------|----------------|
| | | |

### Component Hierarchy
```
PageComponent
├── HeaderSection
│   └── ContextMenu (3-dot menu)
├── MainContent
│   └── [...]
└── [...]
```

### UI States to Handle
- [ ] Loading
- [ ] Empty
- [ ] Error
- [ ] Success feedback

---

## Phase 5: Implementation Plan

### Backend Tasks
1. [ ] [Task with acceptance criteria]
2. [ ] [Task with acceptance criteria]

### Frontend Tasks
1. [ ] [Task with acceptance criteria]
2. [ ] [Task with acceptance criteria]

### Tests Needed
- [ ] Unit: [what?]
- [ ] Integration: [what?]
- [ ] E2E: [critical paths]

---

## Phase 6: Checklist Before Starting

- [ ] UX flows are clear (no ambiguity)
- [ ] Data model reviewed
- [ ] API design makes sense
- [ ] Components identified (reuse existing)
- [ ] Edge cases listed
- [ ] Questions answered

---

## Usage Instructions

**How to use this template with Claude:**

1. Copy this template
2. Fill in Feature name and one-liner
3. Prompt Claude: "Let's work through Phase 1 only. Ask me clarifying questions."
4. Complete Phase 1 fully before moving to Phase 2
5. At each phase, ask Claude to challenge your assumptions
6. Only start coding after Phase 5 is complete

**Example prompt:**
```
I'm designing a new feature. Let's use the feature-design template.

Feature: Inbox-Contacts Integration
One-liner: Link conversations to contacts, with ability to create contacts from unknown conversations.

Let's start with Phase 1: UX Analysis.
Ask me questions before we document the flows.
```
