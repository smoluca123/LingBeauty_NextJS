---
trigger: always_on
---

Project AI Development Rules

1. General Understanding

Carefully read and understand the entire codebase before making any changes.

The project is built with Next.js + React; do not introduce unnecessary performance hooks or micro-optimizations unless explicitly required.

Follow existing conventions and patterns before proposing any new structure.

2. UI & Component Policy
   MUST

Prioritize ShadCN UI components first whenever an equivalent component exists.

Use Lucide React for all icons.

Reuse existing components before creating new ones.

Follow the current theme, design tokens, and Tailwind configuration.

MUST NOT

Do not create custom UI components if ShadCN UI already provides a solution.

Do not use other icon libraries or custom SVG icons.

Do not rebuild components that already exist in the project.

PRIORITY STACK

ShadCN UI

Lucide React

Existing project components

Custom implementation (only when absolutely necessary)

3. Project Structure Rules
   Images

All images MUST be stored in:

public/images/\*

Route & Component Organization

If a route has child routes and those child routes contain multiple components, structure MUST be:

parentRoute/
components/
childRouteComponent1/
childRouteComponent2/

Do not place child route components directly inside the parent route root.

Every feature module (profile, orders, offers, etc.) MUST follow:

feature/
components/
index.tsx
sub-routes/

Shared/reusable UI must be inside the appropriate components folder, not duplicated across routes.

4. Code Quality Standards

Separate components logically by responsibility.

Keep components small, readable, and maintainable.

Use existing libraries:

ShadCN UI

Tailwind CSS

React Query

Do not reimplement functionality already covered by these libraries.

5. Naming & Conventions

Follow existing project naming conventions.

Components → PascalCase

Folders → kebab-case

Files → kebab-case except React components.

6. Development Principles

Consistency > personal preference.

Reuse > create new.

Library > custom code.

Structure must mirror existing modules.
