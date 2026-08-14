# TimeVally Platform - Frontend Guidelines (`timevally-frontend`)

## Context

TimeVally is an online educational platform. High-performance, secure, and fully responsive RTL Arabic UI.

## Tech Stack

- **Framework**: Next.js 14+ (App Router), React, TypeScript (Strict).
- **Styling**: Tailwind CSS, `globals.css` (Custom CSS/Animations).
- **UI & Animations**: `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`.
- **State & Networking**: React Hooks, Axios/Fetch, `socket.io-client`.

## Directory Structure (`src/`)

- `app/(auth)/`: Authentication pages (`/login`, `/register`).
- `app/(dashboard)/`: Student (`/student`) and Admin (`/admin`) portals.
- `app/diplomas/`: Diplomas, lessons, and video player pages.
- `app/community/`: Social discussions and live chat.
- `components/ui/`: Atomic elements (buttons, inputs, modals).
- `components/common/`: Reusable cards, banners, empty states.
- `components/layout/`: Navbar, Footer, Sidebar.
- `services/`: REST API clients connecting to NestJS backend (`http://localhost:3001/api`).
- `hooks/`: Custom hooks (auth, sockets, player progress).
- `types/`: Shared TypeScript models and interfaces.
- `utils/`: Helper functions, formatters, and `mockData.ts`.
- `public/images/`: Asset storage (`logos/`, `team/`).

## Coding Standards & Agent Rules

1. **TypeScript**: Strict typing required. No `any`. Define interfaces in `src/types/`.
2. **Components**: Functional components only. Add `'use client';` explicitly at the top of client-side interactive components.
3. **UI/UX**: RTL-first (Arabic). Use Tailwind CSS utility classes matching the provided design/demo.
4. **Assets**: Use Next.js `<Image />` component for images stored in `/public/images/`.
5. **Data**: Keep mock data isolated in `src/utils/mockData.ts` until REST APIs are linked.
6. **Integrations**: Prepare components to connect with NestJS REST APIs, Bunny Stream signed video embeds, and Socket.io gateways.
