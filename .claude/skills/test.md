# /test - Add Tests Skill

Add tests for existing code.

## Usage

```
/test [module or function name]
```

Or for property-based:

```
/test --property [module or function name]
```

## Instructions

When the user runs `/test`, follow this workflow:

1. **Analyze the Code**
   - Read the module/function
   - Identify behaviors to test
   - Identify edge cases

2. **Determine Test Type**
   - Unit test: specific inputs → outputs
   - Property test: invariants that always hold
   - Integration test: multiple components together

3. **Write Tests**
   - Happy path first
   - Edge cases
   - Error cases
   - Use factories from test/support/factory.ex

4. **Run and Verify**
   - Run `mix test [test_file]`
   - All tests should pass
   - Report coverage added

## Property Test Template

```elixir
property "description of invariant" do
  check all input <- generator() do
    result = Module.function(input)
    assert property_holds?(result)
  end
end
```

## Unit Test Template

```elixir
describe "function_name/arity" do
  test "happy path description" do
    # Arrange
    input = build(:factory)

    # Act
    result = Module.function(input)

    # Assert
    assert result == expected
  end

  test "edge case description" do
    # ...
  end

  test "error case description" do
    assert {:error, _} = Module.function(bad_input)
  end
end
```

## Example

User: `/test Accounts.create_user/1`

AI Response:
1. Analyzing create_user function...
2. Behaviors to test:
   - Creates user with valid params
   - Rejects invalid email
   - Rejects duplicate email
   - Returns proper error structure
3. Writing tests...
4. All tests passing
5. Coverage: 4 new test cases
