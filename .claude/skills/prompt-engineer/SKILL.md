---
name: prompt-engineer
description: Design, optimize, and test LLM prompts for AI features
argument-hint: <use-case> (e.g., "chatbot system prompt", "content generator", "classifier")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Prompt Engineering

Use Case: $ARGUMENTS

## Prompt Design Principles
1. **Clear role definition**: "You are a [role] that [does what]"
2. **Explicit constraints**: What the model should/shouldn't do
3. **Output format**: Specify exactly how to structure the response
4. **Examples**: Include 2-3 examples (few-shot) for complex tasks
5. **Edge cases**: Handle gracefully (unknown answers, refusals)

## Prompt Structure Template
```
[System Prompt]
Role: Who the AI is
Context: Background information
Task: What to do
Constraints: Rules and limitations
Output Format: How to structure the response
Examples: Input/output pairs

[User Prompt]
{user_input}
```

## Optimization Techniques
- Test with diverse inputs (edge cases, adversarial, multilingual)
- A/B test prompt variations on quality metrics
- Minimize token count without losing quality
- Use structured output (JSON) for programmatic parsing
- Add chain-of-thought for complex reasoning tasks
- Temperature tuning (0 for deterministic, 0.7 for creative)
