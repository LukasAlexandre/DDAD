# 1. Record architecture decisions

Date: TODO (fill in when this is finalized)

## Status

Accepted

## Context

We need to record the architectural decisions made on this project so that future contributors — human or AI agent — understand *why* the system looks the way it does, not just *what* it looks like. Code and comments capture the "what"; they rarely capture the "why," and that context is exactly what an AI agent needs to avoid re-litigating settled decisions or silently undoing them.

## Decision

We will use Architecture Decision Records, as described by Michael Nygard, for all significant decisions on this project.

Each ADR is a new numbered file in this directory (`NNNN-title-with-dashes.md`), using this template. ADRs are immutable once accepted — if a decision changes, write a new ADR that supersedes the old one rather than editing it.

A decision is "significant" if reversing it later would require non-trivial rework. When in doubt, write the ADR.

## Consequences

- Every significant decision has a discoverable, dated record.
- AI agents implementing against [02-architecture.md](../02-architecture.md) should check this directory before proposing a change that contradicts a prior decision.
- This adds a small amount of overhead per decision, traded for avoiding repeated re-litigation and silent regressions.
