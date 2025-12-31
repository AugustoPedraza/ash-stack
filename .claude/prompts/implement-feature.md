# Implementation Mode

**Mode:** Code execution. UX and data model already decided.

---

## Pre-Implementation Checklist

Before coding, confirm:

- [ ] UX flows documented
- [ ] Data model decided
- [ ] API endpoints defined
- [ ] Components identified

**If any are missing, stop and complete those first.**

---

## Context (Fill Before Starting)

```markdown
Feature: [NAME]

UX Decision: [One sentence - what's the flow?]
Data Model: [What entities/fields?]
API: [What endpoints?]

Components to use: [List from components.json]
Components to create: [If any new ones needed]
```

---

## Implementation Order

### 1. Backend First
```
□ Schema/migration
□ Ash resource changes
□ Actions (create, read, update)
□ Policies (authorization)
□ Tests for actions
```

### 2. API Layer
```
□ Controller/route
□ Request validation
□ Response format
□ Error handling
□ API tests
```

### 3. Frontend
```
□ API client/hooks
□ Page component
□ Sub-components
□ Loading/error states
□ Component tests (if complex)
```

### 4. Integration
```
□ E2E happy path test
□ Manual testing
□ Edge cases verified
```

---

## Quality Gates

After each section, verify:

**Backend:**
```bash
mix compile --warnings-as-errors
mix test test/path/to/feature_test.exs
```

**Frontend:**
```bash
just lint-tokens
npm run lint --prefix assets
```

**Full:**
```bash
just verify-full
```

---

## Prompt Example

```
I'm ready to implement. Here's the context:

Feature: Contact creation from conversation
UX: User clicks "Save Contact" in conversation header → modal with name field → saves and links
Data: conversations.contact_id (nullable) references contacts
API: POST /api/conversations/:id/link-contact

Let's start with the backend. The Ash resource changes first.
```

---

## Anti-Patterns to Avoid

1. **Don't** start coding without clear UX
2. **Don't** create new components if existing ones work
3. **Don't** skip tests for "simple" features
4. **Don't** implement frontend before backend is tested
5. **Don't** commit without running quality checks
