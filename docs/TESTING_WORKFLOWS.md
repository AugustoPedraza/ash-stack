# Testing Workflows for AI-Assisted Development

> Pragmatic testing strategies optimized for vibe coding.

## TL;DR

| Scenario | Best Approach |
|----------|---------------|
| **Bug fixing** | Error-Driven (reproduce → fix → verify) |
| **New feature** | TDD (test → implement → refactor) |
| **Data logic** | Property-Based (define invariants) |
| **Complex flows** | E2E with Playwright |
| **Acceptance criteria** | Structured ExUnit (not Gherkin) |

---

## Bug Fixing Workflow (Error-Driven)

**Most AI-friendly for bugs.** No ceremony, just fix.

### The Prompt

```
"I have this error:

[PASTE ERROR HERE]

1. Write a test that reproduces this error
2. Run the test (should fail)
3. Fix the code
4. Run the test (should pass)
5. Run just verify-full"
```

### Example

```
You: "I have this error:

** (KeyError) key :user not found in: %{messages: [...]}

at lib/my_app_web/live/chat_live.ex:45

Write a test that reproduces this, then fix it."

AI: [Writes test]
    test "chat_live handles missing user assign" do
      assert_raise KeyError, fn ->
        render_component(&ChatLive.render/1, %{messages: []})
      end
    end

AI: [Runs test - fails as expected]
AI: [Fixes mount/2 to include :user assign]
AI: [Runs test - now passes]
AI: "Fixed. The issue was missing @user assign in mount."
```

### Why This Works

- Error message = perfect context for AI
- Test = proof the bug is fixed
- No guessing, no back-and-forth
- Regression prevented

---

## New Feature Workflow (TDD)

**Best for new features.** Test describes behavior, implementation follows.

### The Prompt

```
"Implement [FEATURE] using TDD:

1. Write a test describing the expected behavior
2. Run test (should fail)
3. Implement minimum code to pass
4. Run test (should pass)
5. Refactor if needed
6. Run just verify-full"
```

### Example

```
You: "Implement user email validation using TDD.
Requirements:
- Email must contain @
- Email must not be empty
- Duplicate emails rejected"

AI: [Writes tests first]
    describe "create_user/1" do
      test "accepts valid email" do
        assert {:ok, user} = Accounts.create_user(%{email: "test@example.com"})
        assert user.email == "test@example.com"
      end

      test "rejects email without @" do
        assert {:error, _} = Accounts.create_user(%{email: "invalid"})
      end

      test "rejects empty email" do
        assert {:error, _} = Accounts.create_user(%{email: ""})
      end

      test "rejects duplicate email" do
        Accounts.create_user(%{email: "taken@example.com"})
        assert {:error, _} = Accounts.create_user(%{email: "taken@example.com"})
      end
    end

AI: [Runs tests - all fail]
AI: [Implements validation]
AI: [Runs tests - all pass]
```

---

## Data Logic Workflow (Property-Based)

**Best for data transformations.** Define rules, generate 100s of test cases.

### The Prompt

```
"Implement [FUNCTION] with property-based tests:

Properties that must hold:
- [Invariant 1]
- [Invariant 2]

Use StreamData to generate test cases."
```

### Example

```
You: "Implement phone number formatting with property tests.

Properties:
- Any 10 digits → valid formatted number
- Format is always (XXX) XXX-XXXX
- Non-digits are stripped"

AI: [Writes property tests]
    property "formats any 10 digits correctly" do
      check all digits <- string(?0..?9, length: 10) do
        result = Phone.format(digits)
        assert result =~ ~r/\(\d{3}\) \d{3}-\d{4}/
      end
    end

    property "strips non-digits before formatting" do
      check all noise <- string(:printable),
                digits <- string(?0..?9, length: 10) do
        noisy_input = noise <> digits <> noise
        clean_input = digits

        assert Phone.format(noisy_input) == Phone.format(clean_input)
      end
    end

AI: [Implements function]
AI: [Runs 100 generated test cases]
```

---

## Acceptance Criteria (Structured ExUnit)

**Better than Gherkin for AI.** Same clarity, less ceremony.

### Instead of Gherkin

```gherkin
# ❌ More files, more ceremony
Feature: User Login
  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    Then I should see the dashboard
```

### Use Structured ExUnit

```elixir
# ✅ Same clarity, one file, AI-friendly
describe "User Login" do
  @tag :acceptance
  test "successful login redirects to dashboard" do
    # Given: user exists
    user = insert(:user, email: "test@example.com")

    # When: user logs in with valid credentials
    conn = post(build_conn(), "/login", %{
      email: "test@example.com",
      password: "password"
    })

    # Then: redirected to dashboard
    assert redirected_to(conn) == "/dashboard"
  end

  @tag :acceptance
  test "invalid credentials show error" do
    # Given: no user exists

    # When: attempt login
    conn = post(build_conn(), "/login", %{
      email: "wrong@example.com",
      password: "wrong"
    })

    # Then: see error
    assert html_response(conn, 200) =~ "Invalid credentials"
  end
end
```

### Why This Is Better

- AI generates this directly (no Gherkin translation)
- Comments provide Given/When/Then structure
- One file instead of two
- Runs faster
- Same readability

---

## Complex User Flows (E2E)

**For critical paths only.** Slow but comprehensive.

### The Prompt

```
"Write a Playwright E2E test for [USER FLOW]:

Steps:
1. [Step 1]
2. [Step 2]
3. [Expected outcome]

Use data-testid selectors."
```

### Example

```typescript
// e2e/checkout.spec.ts
test.describe('Checkout Flow', () => {
  test('user can complete purchase', async ({ page }) => {
    // Given: user is logged in with items in cart
    await loginAs(page, 'buyer@test.com');
    await addToCart(page, 'product-123');

    // When: user completes checkout
    await page.goto('/checkout');
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="expiry"]', '12/25');
    await page.fill('[data-testid="cvc"]', '123');
    await page.click('[data-testid="pay-button"]');

    // Then: order is confirmed
    await expect(page.getByTestId('order-confirmation')).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText(/ORD-\d+/);
  });
});
```

---

## Decision Tree

```
What are you doing?
        │
        ├── Fixing a bug?
        │   └── ERROR-DRIVEN: reproduce → fix → verify
        │
        ├── New feature?
        │   └── TDD: test → implement → refactor
        │
        ├── Data transformation?
        │   └── PROPERTY-BASED: define invariants → generate cases
        │
        ├── User journey?
        │   └── E2E: Playwright for critical paths only
        │
        └── Acceptance criteria?
            └── STRUCTURED EXUNIT: comments as Given/When/Then
```

---

## AI Prompting Patterns

### For Bugs

```
"Error: [paste error]
File: [file path]

1. Write test reproducing this
2. Fix it
3. Verify test passes"
```

### For Features

```
"Implement [feature] using TDD.
Requirements: [list requirements]

Write tests first, then implement."
```

### For Refactoring

```
"Refactor [module/function].
Goal: [what should improve]

1. Ensure existing tests pass
2. Refactor
3. Ensure tests still pass
4. Add tests if coverage gaps found"
```

---

## Summary

| Don't | Do |
|-------|-----|
| BDD/Gherkin (extra ceremony) | Structured ExUnit |
| Write tests after code | TDD (tests first) |
| Manual bug reproduction | Error-driven tests |
| Test every edge case manually | Property-based tests |
| E2E for everything | E2E for critical paths only |
