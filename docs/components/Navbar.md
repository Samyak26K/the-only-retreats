# THE ONLY RETREATS

# Component Specification

## Navbar

Version: 1.0

Status: Approved

---

# Purpose

The Navbar is the visitor's first interface with The Only Retreats.

Its purpose is not simply navigation.

Its purpose is to quietly introduce the brand while allowing the Hero section to remain the visual focus.

The Navbar should disappear into the storytelling.

It should never dominate the page.

---

# User Goal

Help visitors understand:

• Where they are

• What they can explore

• How to continue their journey

Navigation should feel effortless.

---

# Emotional Goal

Visitors should feel

Calm

Curious

Grounded

Confident

The Navbar should communicate trust before interaction.

---

# Design Philosophy

Inspired by:

Luxury editorial websites

Modern museums

High-end travel brands

Apple

Kinfolk

Aesop

Avoid traditional ecommerce navigation.

---

# Position

Sticky.

Always visible after scrolling.

Transparent over the Hero.

Transitions into a paper background after scrolling.

---

# Heights

Desktop

88px

Tablet

80px

Mobile

72px

---

# Desktop Layout

---

Logo

Journey

Origins

Collection

Heritage

About

Search

Account

Cart

---

The layout should remain balanced.

Large spacing between navigation items.

Never crowded.

---

# Mobile Layout

Top Row

Logo

↓

Hamburger

Full-screen navigation drawer.

The drawer should slide naturally from the right.

No modal popups.

---

# Logo

Position

Left

Rules

Maintain breathing room.

Never animate excessively.

Logo should reduce slightly after scrolling.

Maximum shrink:

10%

---

# Navigation Items

Journey

Origins

Collection

Heritage

About

Contact

Search

Account

Cart

Future additions should not require layout changes.

---

# Navigation Behaviour

At page load

Transparent

↓

Scroll begins

Soft blur

↓

Background becomes warm paper

↓

Subtle shadow appears

↓

Navigation remains sticky

Transitions should feel natural.

---

# Scroll Behaviour

Do not hide the Navbar.

Never disappear.

Only transform.

---

# Hover Behaviour

Text colour changes gently.

Underline fades in.

Duration

250ms

No dramatic animations.

---

# Active State

Current page

Forest Green

Small underline

Bold weight

Never use pills or filled buttons.

---

# Buttons

Primary CTA

"Enter the Source"

Displayed only on desktop.

Hidden on mobile.

---

# Search

Search icon only.

Expands into overlay when activated.

No always-visible search bar.

---

# Account

Simple outline icon.

Future:

Dropdown

Orders

Wishlist

Addresses

Logout

---

# Cart

Outline icon.

Small badge for quantity.

Badge should remain subtle.

---

# Mobile Navigation

Full-screen sheet.

Background

Warm Himalayan Sand.

Menu items

Large.

Easy to tap.

Minimum touch target

48px

---

# Drawer Animation

Slide

Fade

350ms

Close with:

Swipe

Tap outside

Escape

---

# Typography

Navigation

Manrope

16px

Medium

Letter spacing

Slightly increased

---

# Colours

Background

Transparent

↓

Warm Paper

Text

Charcoal

Hover

Forest Green

Accent

Muted Gold

---

# Accessibility

Keyboard navigation

Visible focus

ARIA labels

Escape closes drawer

Tab trapping

Screen reader friendly

---

# Performance

Minimal JavaScript.

Avoid unnecessary state.

Prefer CSS transitions.

---

# Future Scalability

Future navigation may include

Languages

Membership

Wholesale

Retreats

These additions should fit without redesigning the Navbar.

---

# Content Source

Navigation labels should come from

lib/content

Never hardcode.

---

# Definition of Done

✓ Responsive

✓ Sticky

✓ Accessible

✓ Build passes

✓ Mobile drawer works

✓ Keyboard navigation works

✓ No layout shift

✓ Uses typed content

✓ Matches Design System

---

# Final Principle

The Navbar should feel like the quiet cover of a beautifully printed Himalayan journal.

It introduces the journey without distracting from it.
