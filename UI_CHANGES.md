# UI Changelog

This document tracks all changes made to the frontend UI, to help backend developers implement functionality correctly.

## Phase 1 Updates
- **Routing**: Added `react-router-dom` to support direct URL navigation for different apps and settings pages.
- **Top Bar**: Changed "Konfigurer" to "Indstillinger" to act as the entry point for User Settings (`/settings/profile`).
- **Left Navigation**: Made the ET logo link back to the main dashboard (`/`). Changed the bottom-left settings button to be the organization company settings (`/settings/company`).
- **User Settings Page**: Created a User profile settings page supporting text updates, avatar upload + crop (using `react-image-crop`), and content preference tags.
- **Company Settings Page**: Created a placeholder for the global Erhvervslivets Tænketank (ET) organization settings.

## Phase 2 UX Updates
- **Auto-save Implementation**: Removed global "Save" button in the Profile Settings. Added `onBlur` events to inputs that simulate an auto-save API call, displaying a green checkmark animation (`lucide-react` CheckCircle2) upon successful save. 
- **Password Validation UI**: Added inline visual requirements beneath the New Password field.
- **SSO Connections**: Added Google and Microsoft SSO integration buttons to the User settings for account linking.
- **Global Header**: Replaced "Indstillinger" text Link in `SourceStrip.tsx` with a standard User Profile dropdown/icon button.
- **LeftNav Bottom Footer**: Updated the Organization settings block to prominently feature the ET logo instead of generic text.
- **LeftNav Navigation Links**: Updated primary sidebar links to use react-router `Link` elements so clicking them from the Settings pages successfully navigates the user back to the application dashboard (`/`).

## Phase 3 Card Visualizations
- **Data Model update**: Extended `Citation` type in `AnswerArea.tsx` to include optional `flagImg` and `logoImg` parameters. 
- **Article Cards**: Redesigned output RAG cards in `AnswerArea.tsx` to be cleaner, using a soft-shadow box style and integrating country flags alongside small company/organization logos into the card header.
- **Related Questions**: Redesigned standard buttons in `RightSidebar.tsx` into soft, rounded glass-morphic pills to distinguish discovery navigation from heavy article reading.

## Phase 4: News Card Visual Identifiers
- **Component**: `AnswerArea.tsx`
- **Goal**: Improved scanability of search results by grouping visual locators (flags, logos, topics) distinctly from the main text body.
- **API Contract Change (`Citation` interface)**:
  ```typescript
  interface Citation {
    id: number;
    source: string;
    title: string;
    date: string;
    excerpt: string;
    url: string;
    relevance?: number;
    topic?: string;        // [NEW] Add a specific category or topic string (e.g. "Tech Regulation")
    flagImg?: string;      // [MODIFIED] Expects a valid image URL for standard country flags
    orgLogo?: string;      // [NEW] Replaces old generic logo processing for publisher source logos
    companyLogo?: string;  // [NEW] Entity-specific logo (e.g. the specific company mentioned)
  }
  ```
