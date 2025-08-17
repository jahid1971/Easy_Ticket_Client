---
trigger: always_on
alwaysApply: true
---

# GitHub Copilot Instructions (Client)

## Context

-   Current workspace: easy_ticket_client (Next.js App Router, TypeScript)
-   Reference repos:

-   https://github.com/jahid1971/Netra_Health_Care_Client.git

-   https://github.com/jahid1971/SPORTSTOCK_inventory_managemen.git

-   local codebase of reference is in `reference/`

-   Goal: Follow the reference client’s conventions and utilities, but use shadcn/ui instead of Material UI.

-   Give top priority to reusing code.

## Follow reference conventions

-   Give top priority to reusing code. Do not create or install new thing or component untill you dont find it or similar thing in my current project or in referencefolder.
-   Reuse and adapt existing code , utilities from `reference/Netra_Health_Care_Client/src` wherever possible ( utils, hooks, patterns). Do not introduce new architectural patterns without approval.
-   Mirror the reference repo’s folder layout and responsibilities under `src/`: `app/`, `components/`, `services/`, `hooks/`,`hook-forms`, `helpers/axios`, `utils/`, `types/`, `lib/` and others.

-   Keep consistency in export import styles.
-   Use the App Router (`src/app/...`) layout and route organization exactly like the reference (common layout, dashboard layout, auth routes).

## UI System

-   If any ui component needed which is not already in the project search the shadcn doc and execute shadcn command with npx shadcn add [component].

-   Use shadcn/ui + Tailwind CSS instead of MUI. Before adding or applying new ui , check if it's already available in shadcn/ui.if there is custom ui component like start with C\_ give priority to them.
-   Maintain responsive, accessible, modern UI. Avoid custom CSS where Tailwind utilities suffice. Keep components reusable.

-   Ui should look beautiful and follow modern ui design principles.

-   try to use react-icon where they needs

## Code Style and Readability



- Follow dry . Do not repeat yourself. mainitain resuability.

-   try to mainatain type safety . avoid unnecessary types. Create and reuse types in `src/types` folder mirroring the reference naming style.
-   4 spaces indentation. Add empty lines between logical blocks for readability.
-   Use optional chaining and nullish coalescing where appropriate.
-   Keep components small and composable. Avoid deep nesting; extract helpers.
-   Try to write less code. Prefer declarative patterns.
-   Always reuse existing utils, utilities/hooks,components before adding new ones.
-   Always give conventional,popular and meaningful names to variables, functions, components, and types.

## State, Data, and APIs

-   use my existing api design pattern with tanstack.
-   If it is needed install required packages.

## Testing and Verification

-   check and fix errors and ensure no previous error or new errors in your modified or added code.

# validations 

- validation schemas will be only for user input validations as a client-side validations.

## Comments and Docs

-   Only add comments for non-obvious logic. Keep code self-explanatory. Prefer clear naming. try to avoid unnecessary comments.

## Chat Rules

-   Keep answers concise and practical. Be critical when needed.

## Planning and requirements

-   If a prompt includes the word "plans" or requires significant feature work, read:
    -   `FRONTEND_REQUIREMENTS.md` (client scope), and
    -   `server/Easy_Ticket_Server/BACKEND_REQUIREMENTS.md` + `server/Easy_Ticket_Server/prisma/schema.prisma` (API contracts).
-   Focus on planning the implementation and aligning with these docs before writing code.

## Delivery

-   Edit code directly in-place. Update all relevant files. Prefer minimal diffs. Keep exports named. Ensure responsive UI.
