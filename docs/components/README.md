# Component Specifications

This folder contains the official specifications for every reusable component and homepage section used in The Only Retreats.

Each specification defines:

- Purpose
- User Goal
- Emotional Goal
- Layout
- Desktop Behaviour
- Tablet Behaviour
- Mobile Behaviour
- Content Source
- Accessibility Requirements
- Animation Behaviour
- Future Scalability

These documents are the implementation contract between design and development.

---

# General Rules

Every component must follow:

Project Overview

↓

Brand Guidelines

↓

Design System

↓

Information Architecture

↓

Component Specification

If conflicts arise, higher-level documents always take precedence.

---

# Component Principles

Every component exists for a reason.

A component should solve exactly one problem.

Avoid creating "smart" components that perform multiple unrelated responsibilities.

Components should remain:

Reusable

Accessible

Typed

Responsive

Maintainable

Composable

---

# Naming Convention

Use PascalCase.

Examples:

Hero

Navbar

Origins

FeaturedCollection

ProductCard

ValleyCard

Founder

Footer

---

# File Naming

Each specification file should match the component name.

Example:

Hero.md

Navbar.md

ProductCard.md

---

# Standard Structure

Every component specification should contain:

1. Purpose

2. User Goal

3. Emotional Goal

4. Content Source

5. Desktop Layout

6. Tablet Layout

7. Mobile Layout

8. Typography

9. Colours

10. Imagery

11. Animations

12. Accessibility

13. Performance Notes

14. Future Scalability

15. Definition of Done

This structure should remain consistent across all component specifications.

---

# Implementation Order

Homepage Components

Navbar

↓

Hero

↓

Origins

↓

Certification

↓

Featured Collection

↓

Heritage

↓

Our Story

↓

Founder

↓

Footer

Shared Components

Buttons

Inputs

Cards

Badges

Product Cards

Valley Cards

Forms

Navigation

Footer

Future Components

Search

Product Filters

Wishlist

Checkout

Dashboard

Admin

These specifications will expand as the project grows.

---

# Cursor Usage

When implementing a component, Cursor should read:

01_PROJECT_OVERVIEW.md

02_BRAND_GUIDELINES.md

03_DESIGN_SYSTEM.md

Relevant Component Specification

08_TECHNICAL_RULES.md

Only the relevant component specification should be loaded.

Do not load unrelated specifications.

This minimizes context usage and improves implementation consistency.

---

# Final Principle

A component specification is the single source of truth for that component.

If the implementation differs from the specification, the implementation should be updated—not the other way around—unless the specification has been intentionally revised.
