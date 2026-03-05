---
name: orchestrate
description: Orchestrate a complex multi-agent task — decompose, delegate, coordinate, deliver
argument-hint: <task-description>
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash, Agent
---

# Orchestrate

Task: $ARGUMENTS

## This skill invokes the Master Orchestrator pattern:

### Step 1: Decompose
Break the task into subtasks. Identify which specialist agents are needed.

### Step 2: Delegate
Spawn specialist agents in parallel where possible:
- Use `Agent` tool with appropriate subagent_type
- Give each agent clear, specific instructions with full context
- Set max_turns based on task complexity

### Step 3: Coordinate
- Collect outputs from all agents
- Resolve conflicts between recommendations
- Ensure consistency across all deliverables
- Chain dependent tasks sequentially

### Step 4: Verify
- Run code-reviewer agent on all code changes
- Run security-reviewer agent if auth/data handling involved
- Verify build: `cd ET && pnpm build`
- Run tests if applicable

### Step 5: Deliver
- Summarize what was done
- List all files created/modified
- Note any follow-up actions needed
- Report any unresolved issues

## Agent Reference (42 agents available)
See master-orchestrator.md for full agent catalog and when to use each.
