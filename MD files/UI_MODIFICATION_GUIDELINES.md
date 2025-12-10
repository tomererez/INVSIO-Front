# INVSIO UI Modification Guidelines

You are assisting in the development of INVSIO, a next-generation AI trading and analysis platform.

Our goal is to upgrade the entire UI layer using new components and layouts created in Google Studio AI, while preserving all existing backend logic, data flow, and functional behavior.

Use the following guidelines for every merge or UI integration task:

## 1. Logic stays exactly the same

Keep all hooks, state logic, calculations, react-query calls, mutations, API access, and variable names unchanged.

The functional layer is already correct — don’t rewrite or optimize it unless explicitly asked.

## 2. New UI fully replaces old UI

Feel free to use the new layout, component structure, spacing, visual hierarchy, and updated copy from the new designs.

New placeholders and better text from the design are allowed and even preferred.

UI arrangement, grouping, and composition can be improved as you see fit — as long as it does not change the underlying logic.

## 3. Replace all static demo values with real variables

Studio AI components often contain example values.
You must:

*   Connect everything to the existing logic variables,
*   Remove temporary hardcoded numbers or labels,
*   Ensure everything is dynamically driven by INVSIO’s original logic.

## 4. Engineering freedom within safe boundaries

You are allowed to:

*   Clean unused imports
*   Adjust component structure
*   Improve accessibility
*   Simplify JSX
*   Break UI into subcomponents if needed
*   Fix minor layout inconsistencies

You are not allowed to:

*   Introduce new business logic
*   Create new state variables unless necessary for UI behavior
*   Change how data is fetched, calculated, or stored

## 5. Output requirement

Each task should generate a single final merged file where:

*   Logic comes from the old INVSIO file
*   UI comes from the new Studio AI component
*   Everything compiles immediately
*   Design strictly follows INVSIO’s “Dark Space / Glass” visual system
*   The code is clean, readable, and production-ready

## 6. Your mindset

Think like a senior frontend engineer performing a controlled UI migration:
Reliable, stable, aesthetic, non-destructive, and always connected to real data.
