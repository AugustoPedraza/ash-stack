# Data Model Focus

**Mode:** Schema and data design only. No UI, no API details.

---

## Context
Feature: [NAME]
Summary: [WHAT DATA NEEDS TO BE STORED/RELATED]

---

## Analysis Framework

### 1. Entities
What "things" are involved?

| Entity | Already Exists? | Core Fields |
|--------|-----------------|-------------|
| | | |

### 2. Relationships
```
Entity A  ──[relationship]──>  Entity B

Examples:
- User ──[has_many]──> Conversations
- Conversation ──[belongs_to]──> Contact (optional)
```

### 3. New Fields/Tables

```elixir
# Table: table_name
#
# field :name, :type, constraints
# field :foreign_id, references(:other_table)
#
# Indexes:
# - [:field1, :field2] unique: true
```

### 4. State & Lifecycle
- What states can this entity be in?
- What transitions are valid?
- Soft delete or hard delete?

### 5. Queries
What queries will the app need?

| Query | Frequency | Filters | Needs Index? |
|-------|-----------|---------|--------------|
| | | | |

### 6. Migration Strategy
- [ ] Additive change (safe)?
- [ ] Breaking change (needs migration)?
- [ ] Backfill needed?

---

## Ash Framework Considerations

```elixir
# Resource structure
defmodule MyApp.Resource do
  use Ash.Resource

  attributes do
    # ...
  end

  relationships do
    # ...
  end

  actions do
    # What CRUD operations?
  end

  policies do
    # Who can do what?
  end
end
```

---

## Output: Schema Decision

```markdown
## Data Model: [Feature Name]

### Changes to Existing
- `conversations`: Add `contact_id` (nullable, references contacts)

### New Tables
[None / or describe]

### Indexes
- `conversations.contact_id` - for joining

### Migration
- Safe additive change
- No backfill required
```

---

## Prompt Example

```
I need help designing the data model. No UI or API - just schema.

Feature: Link conversations to contacts
Current state: Conversations and Contacts are separate
Goal: A conversation can optionally be linked to a contact

What's the best way to model this relationship?
```
