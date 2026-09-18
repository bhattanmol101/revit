# Revit design implementation plan

Status: planned. This document does not implement application changes.

## Outcome

Apply the approved spacious editorial design across Revit using the existing Expo 57, Expo Router, Uniwind, and React Native Reusables setup. Deliver equivalent light and dark themes with black/white surfaces, deep blue actions, compact serif headings, readable forms, and consistent spacing.

## Approved visual references

Use the latest revisions, not the earlier oversized headings:

- Ask and Share: `exec-7100d864-7b0a-4b60-9086-62719b613e41.png`
- Login and Signup: `exec-0aaea70b-9ef5-4b84-bc8b-c58786fce626.png`
- Create Forum and Forum Feed: `exec-41a46141-1c48-4672-b808-09a8982ca415.png`
- Home, Discover, and Review: `exec-fa67c01d-1e17-4272-b9cf-ac0955ae33a3.png`; apply the later compact typography and spacing decisions to these screens too.

The files currently live under `/Users/aeradron/.codex/generated_images/01a08fb4-29b6-79f1-9991-96f98d71faaf/`. At implementation start, copy selected references into `docs/design/references/` for durable review. Generated images are visual references, not exact font specifications or production content. Use real data and separately sourced, appropriately licensed assets in the app.

## 1. Align the design foundation

- Update `docs/UI_FOUNDATION.md`: replace its old 12px gutters, tight section spacing, lavender accents, and amber rating direction with the approved design. Its earlier restriction on changing Ask presentation is superseded by the approved redesign.
- Audit current theme consumers in `src/global.css`, `src/constants/theme.ts`, `src/lib/theme.ts`, and `src/app/_layout.tsx`. The root currently constructs its own navigation theme; determine whether the other navigation theme export is used before consolidating it.
- Establish one canonical palette with CSS semantic classes and a synchronized adapter for native APIs. Prefer supported Uniwind token resolution where practical; avoid independently maintained palettes. Verify the installed Uniwind version's documented native theme behavior.
- Keep system light/dark selection consistent across styles, navigation, status bar, icons, portals, and loading screens.
- Keep existing Supabase, query, route, and validation behavior throughout this visual migration.
- Read the exact Expo 57 documentation before implementation, and the relevant versioned Font and Router documentation for affected APIs.

Proposed starting tokens, subject to contrast verification:

| Token or dimension | Light | Dark |
| --- | --- | --- |
| Page background | `#FFFFFF` | `#0B0D12` |
| Raised/input surface | Pale neutral gray | `#161A23` |
| Primary action | `#3158B8` | `#3158B8` |
| Link/active icon | `#2447A8` | `#6888E0` |
| Primary text | Near black | Off-white |
| Rating | Deep blue | Readable blue |
| Page heading | 24px serif, about 30px line height | Same |
| Section heading | 18px | Same |
| Body/input text | 15–16px | Same |
| Supporting text | 13px | Same |
| Horizontal gutter | 24px | Same |
| Section spacing | 24px | Same |
| Label-to-control gap | 8px | Same |
| Main control minimum height | 48px | Same |
| Control/surface radius | 8px / 12px | Same |

Use separate action-fill and link tokens so blue text stays readable on dark surfaces. Preserve distinct success, warning, and destructive semantics. Numeric labels accompany ratings.

Completion: the documented values, semantic classes, native colors, and navigation all agree in both themes.

## 2. Refine shared components

- Select and bundle a licensed serif font that matches the references; keep a readable sans-serif body. Load fonts through the existing Expo font setup and coordinate readiness with splash dismissal, including a usable failure fallback.
- Refine `src/components/ui/text.tsx` with compact heading variants. Audit screen-level size overrides so they do not undo the new scale.
- Refine existing Button, Input, Textarea, Card, Badge, Avatar, SearchInput, and feedback primitives rather than adding competing versions.
- Add a shared heading block and labeled form-field wrapper only where current components do not provide them.
- Extract a shared photo attachment presentation from Ask/Share while retaining their existing upload limits and mutation behavior.
- Refine `sticky-action-footer.tsx` and page layout: consistent gutters, primary/secondary action sizing, safe-area padding, keyboard avoidance, and enough scroll space above actions.
- Choose a single header per route: retain a native header or intentionally replace it with the designed toolbar. Avoid stacking a native title above a duplicate custom toolbar.
- Keep large-text scaling enabled. Use minimum heights and wrapping instead of fixed boxes that clip text.

Completion: representative buttons, fields, headings, photos, and feedback states render consistently on mobile and web in both themes.

## 3. Implement the forum reference screens

Start with `src/features/forums/create-forum-screen.tsx`:

- Add visible labels and clear optional indicators for name, cover, description, and rules.
- Match the shallow cover preview, restrained heading, spacious form, and action footer.
- Preserve ownership, slug generation, limits, and submission behavior; retain accessible failure/pending feedback.

Then update `src/features/forums/forum-detail-screen.tsx`:

- Use a shallow cover, compact forum heading, membership metadata, and a clear New Post action.
- Present rules in a compact expandable section or existing accessible dialog.
- Space post entries with restrained separators and clear author/content/action hierarchy.
- Preserve join/leave behavior, owner controls, and destructive confirmation. A Joined label must still provide an understandable way to leave.
- Audit available post fields before adding author photos, timestamps, thumbnails, or reply counts from the mockup. Extend typed API selection and query adapters only for data already supported by the backend; omit unavailable decorative metadata instead of inventing values.
- Keep New Post available only under the existing membership rules.

Bring `forums-screen.tsx` and `forum-post-composer-screen.tsx` into the same shared style as adjacent routes. The approved Forum Feed mockup represents posts inside one forum, not an aggregate cross-forum feed.

Completion: users can create a forum, open it, join/leave where allowed, and create/open posts, with clear loading, empty, error, and pending states.

## 4. Migrate Ask and Share

- Update `ask-composer-screen.tsx` and `share-composer-screen.tsx` to the latest approved compact layouts.
- Apply shared heading, field, photo, and footer patterns.
- Preserve Ask title/details limits, three-image limits, permission handling, restaurant selection, integer star selection, and existing rating updates.
- Keep the star controls visually compact while retaining generous tap areas and spoken numeric labels.
- Verify content and publish actions remain reachable when the keyboard is open or text is enlarged.

Completion: create Ask, create Share, edit a rating, select/remove images, and recover from validation or submission errors.

## 5. Migrate authentication

- Refine `src/components/auth/auth-screen-layout.tsx` and `src/app/auth/index.tsx` to match the latest Login/Signup references.
- Add the compact wordmark, restrained photo strip, smaller heading, consistent fields, and separated actions.
- Add accessible password visibility controls while preserving email/password authentication.
- Preserve confirmation-email messaging, recovery links, session restoration, and onboarding routing.
- Check Reset, Update Password, and Onboarding for regressions from changes to their shared layout; apply consistent spacing without inventing new flows.
- Keep decorative image content independent from successful form loading and interaction.

Completion: sign in, sign up, email-confirmation messaging, password recovery, and onboarding continue to work with both themes and keyboard navigation.

## 6. Extend to remaining approved screens

- Apply the shared system to Home, Discover, post/review detail, and restaurant detail.
- Use the newest compact type scale even though their initial mockups have larger headings.
- Retain current navigation and data semantics. Suggested recommendations, distances, friend counts, and other example content must be backed by available data before appearing in production.
- Audit other consumers of shared primitives, including Picks, Profile, Activity, and web navigation, for layout and contrast regressions.
- Use constrained reading columns on desktop web instead of stretching mobile forms across the viewport.

Completion: the approved screens share one visual hierarchy, with no leftover incompatible color, spacing, or heading overrides.

## 7. Validate and deliver

- Run `pnpm check` for lint, API-boundary checks, and TypeScript; check formatting for changed files.
- Review screenshots in light and dark modes on a small phone viewport, a larger phone viewport, and desktop web. Check available native platforms; explicitly record anything not verified.
- Test keyboard-open forms, safe areas, long names/reviews, enlarged text, focus order, touch targets, theme changes, and actual contrast values.
- Exercise meaningful existing user flows after each affected phase. Add focused behavioral tests only where interaction logic changes; avoid tests that merely repeat style values.
- Use seeded or test accounts for creation flows, not unintended public production posts.
- Capture before/after screenshots and update the UI foundation with the final implemented values.

## Delivery sequence

1. Design guide, theme alignment, and fonts.
2. Shared primitives and layout patterns.
3. Create Forum and Forum Feed reference implementation.
4. Ask and Share.
5. Login and Signup with related auth checks.
6. Home, Discover, and detail screens.
7. Cross-platform visual and functional review.

Each phase should be a reviewable change with its relevant checks completed before proceeding. Final acceptance requires matching the approved visual direction, usable responsive layouts, equivalent themes, and functioning existing workflows.
