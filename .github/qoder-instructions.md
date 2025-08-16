# GitHub Copilot Instructions (Client)

## Context
- Current workspace: easy_ticket_client (Next.js App Router, TypeScript)
- Reference repos:

 - https://github.com/jahid1971/Netra_Health_Care_Client.git

 - https://github.com/jahid1971/SPORTSTOCK_inventory_managemen.git

-  local codebase of reference  is in `reference/`

- Goal: Follow the reference client’s conventions and utilities, but use shadcn/ui instead of Material UI.

## Follow reference  conventions
- Give top priority to reusing code. Reuse and adapt existing code , utilities from `reference/Netra_Health_Care_Client/src` wherever possible ( utils, hooks,  patterns). Do not introduce new architectural patterns without approval.
- Mirror the reference repo’s folder layout and responsibilities under `src/`: `app/`, `components/`, `services/`, `hooks/`, `helpers/axios`, `utils/`, `types/`, `lib/` and others.

-  Keep consistency in export import styles.
- Use the App Router (`src/app/...`) layout and route organization exactly like the reference (common layout, dashboard layout, auth routes).

## UI System

- If any ui component  needed which is not already in the project search the shadcn doc and execute shadcn command with npx shadcn add [component].

- Use shadcn/ui + Tailwind CSS instead of MUI. Before adding or applying new ui , check if it's already available in shadcn/ui.if there is custom ui component like start with C_ give  priority to them.
- Maintain responsive, accessible, modern UI. Avoid custom CSS where Tailwind utilities suffice. Keep components reusable.

- Ui should look beautiful and follow modern ui design principles.

## Code Style and Readability
- try to mainatain type safety  . avoid  unnecessary types. Create and reuse types in `src/types` folder mirroring the reference naming style.
- 4 spaces indentation. Add empty lines between logical blocks for readability.
- Use optional chaining and nullish coalescing where appropriate.
- Keep components small and composable. Avoid deep nesting; extract helpers.
- Try to write less code. Prefer declarative patterns.
- Always reuse existing utils, utilities/hooks,components before adding new ones.
- Always give conventional,popular and meaningful names to variables, functions, components, and types.


## State, Data, and APIs

 - use my existing api design pattern with tanstack.
 - If it is needed install required packages.

## Testing and Verification
-  check and fix  errors and ensure no previous error or new  errors in your modified or added code.
- Smoke-test key routes/pages you modify  and fix broken imports/usages.

## Comments and Docs
- Only add comments for non-obvious logic. Keep code self-explanatory. Prefer clear naming. try to avoid unnecessary comments.

## Chat Rules
- Keep answers concise and practical. Be critical when needed.

## Planning and requirements
- If a prompt includes the word "plans" or requires significant feature work, read:
  - `FRONTEND_REQUIREMENTS.md` (client scope), and
  - `server/Easy_Ticket_Server/BACKEND_REQUIREMENTS.md` + `server/Easy_Ticket_Server/prisma/schema.prisma` (API contracts).
- Focus on planning the implementation and aligning with these docs before writing code.

## Delivery
- Edit code directly in-place. Update all relevant files. Prefer minimal diffs. Keep exports named. Ensure responsive UI.
