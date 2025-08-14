## If prompt contains 'ignore' then ignore the copilot-instructions.md file

# EasyTicket Frontend Requirements (Client)

## Project overview

A Next.js 14 (App Router) + TypeScript web client for searching, booking, and managing bus tickets. Mirrors the reference client’s architecture and utilities but uses shadcn/ui + Tailwind instead of MUI.

Initial focus: Bus tickets only. Ship and air appear as placeholders.

## Tech stack

-   Next.js App Router, React 18, TypeScript
-   Styling: Tailwind CSS + shadcn/ui components
-   State: TanStack Query,Context Api and React Hook Form
-   Validation: Zod
-   HTTP: Axios via shared `helpers/axios`
-   Icons/Primitives: lucide-react, radix-ui
-   Notifications: sonner

## Folder layout (mirror reference)

-   `src/app` – layouts, routes, pages (withCommonLayout, withDashboardLayout, auth routes)
-   `src/components` – UI primitives and feature components (named exports only)
-   `src/helpers/axios` – axios instance, interceptors, token attachment
-   `src/redux` – store, api slices, feature slices, hooks
-   `src/services` – action functions (thin wrappers around api when needed)
-   `src/hooks` – shared hooks (e.g., `useUserInfo`)
-   `src/types` – domain types (User, Bus, Route, Schedule, Seat, Booking, Payment) aligned with backend schema
-   `src/utils` – utilities from reference (date formatter, error helpers, cookies, etc.)
-   `src/lib` – providers (theme, store), shadcn UI config

## Core user flows

1. Search buses

    - Inputs: source, destination, date
    - Calls: GET /routes or /buses?source=..&destination=..&date=..
    - Shows popular routes and trending shortcuts (static or API-backed)

2. Results & filters

    - List bus schedules with price, operator, departure/arrival, coach type, available seats
    - Filters: time range, operator, price range, boarding points (progressively enhanced)

3. Seat selection

    - Fetch seat map for schedule: GET /buses/:id/seats or schedule-based seats
    - Show available/selected/booked states; enforce single-seat or multi-seat per booking as backend allows

4. Passenger details

    - Contact info + passenger fields with Zod validation

5. Review & pay

    - Show fare breakdown, fees, and total
    - Trigger payment intent; after success, confirm booking

6. Auth

    - Register, Login, Logout
    - Persist session (cookies/localStorage as per reference utils)

7. Dashboard (MVP)
    - Booking history for user
    - Admin placeholder for managing buses/routes/schedules (read-only first)

## Data contracts (align with backend)

-   Types should reflect server `schema.prisma`:
    -   User, Bus (seatMap JSON), Route, Schedule, Seat, Booking, Payment
-   Keep field names camelCase to match API responses.

## UI/UX

-   Use shadcn/ui primitives: Button, Input, Select, Dialog, Sheet, Tooltip, DropdownMenu, Table, Tabs, Badge, Card, DatePicker (react-day-picker)
-   Responsive, keyboard-accessible, color-contrast friendly
-   Minimal custom CSS; prefer Tailwind utilities

## State & data

-   Central store: `redux/store.ts`
-   RTK Query (or `redux/api`) for server communication
-   Co-locate endpoints per domain slice similar to reference
-   Handle loading/error/empty states consistently with shared helpers

## Error & toast

-   Reuse reference `AppError`, `tryCatch`, and `sonner` for user feedback

## Routing

-   App Router layouts:
    -   `(withCommonLayout)` for public pages
    -   `(withDashboardLayout)` for protected dashboard
    -   `login`, `register` routes

## Environment

-   NEXT_PUBLIC_API_BASE_URL
-   Auth cookie keys consistent with reference `constants/authKey.ts`

## Testing & quality

-   Lint, typecheck before commits; run a smoke dev build
-   Keep components typed; avoid `any`

## Non-goals (Phase 1)

-   Full payment provider integration in UI (mock/placeholder if backend not ready)
-   Complex admin CRUD (scaffold only)

## Implementation priorities

1. Scaffolding, theme/providers, axios helper, store
2. Search form + results list
3. Seat selection and booking flow (happy path)
4. Auth pages
5. Booking history

## Packages baseline

-   Keep from reference: next, react, react-dom, axios, @reduxjs/toolkit, react-redux, react-hook-form, zod, dayjs, sonner, socket.io-client
-   Remove: MUI & emotion
-   Add: tailwindcss, postcss, autoprefixer, lucide-react, class-variance-authority, clsx, tailwind-merge, react-day-picker, radix-ui peer deps added per component
