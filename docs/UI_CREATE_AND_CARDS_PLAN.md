# Create pages and cards implementation plan

## Goal

Implement the approved Create Ask, Create Share, Create Forum, and Forum Feed designs in the actual Expo app, then update the cards that represent those objects in Home, Discover, Forum Feed, and detail screens.

## Phase 1: shared desktop and mobile structure

- Keep the existing authenticated shell and top bar visual treatment.
- Use the same content column and responsive gutters across mobile and desktop web.
- Use one compact top action per Create page: dismiss on the left, context title, submit on the right.
- Keep keyboard avoidance, safe areas, loading, error, disabled, and pending states.
- Preserve existing API/query boundaries and route behavior.

## Phase 2: Create Ask

Update `src/features/create/ask-composer-screen.tsx` to match the approved layout:

- Compact page title and supporting description.
- Clear Title and Details labels with character counts.
- Optional photo area with three image slots, remove controls, and Add images action.
- Single top-right Publish action; remove duplicate footer actions.
- Preserve current title/body limits, image validation, permission handling, and publish mutation.

Update `src/features/posts/ask-post-card.tsx`:

- Match the same card hierarchy: author row, Ask badge, title, body, optional image strip, and reply action.
- Keep the card readable in Home, Discover, Forum Feed, and detail contexts.
- Use responsive image sizing and avoid nested full cards inside cards.

## Phase 3: Create Share

Update `src/features/create/share-composer-screen.tsx`:

- Compact restaurant selector card with Change action.
- Five-star control with generous touch targets and a numeric score.
- Optional review and photo sections with the approved spacing.
- Single top-right Publish/Update action.
- Preserve restaurant search, add-restaurant fallback, score selection, image limits, and create/update mutations.

Update `src/features/posts/share-post-card.tsx`:

- Add the approved restaurant identity row, score badge, review text, photo strip, and action hierarchy.
- Keep the score numeric and accessible; use the semantic rating token.
- Ensure the card works in Home, Discover, Forum Feed, and restaurant detail without duplicating surface chrome.

## Phase 4: Create Forum and Forum Feed

Update `src/features/forums/create-forum-screen.tsx`:

- Match the approved compact form with Forum name, cover image, Description, Rules, and ownership hint.
- Use the existing app top bar styling and one top-right Create action.
- Remove duplicate bottom actions while preserving validation and creation behavior.

Update `src/features/forums/forums-screen.tsx` and `src/features/forums/forum-detail-screen.tsx`:

- Forum list cards use cover image, title, description, member count, and clear tap target.
- Forum detail uses cover, compact identity block, membership action, rules, Conversations heading, New post action, and spacious post cards.
- Keep owner delete confirmation and membership rules.

Update `src/features/forums/forum-post-composer-screen.tsx` and `src/features/posts/post-detail-screen.tsx` so forum Ask/Share cards reuse the same visual primitives.

## Phase 5: shared card primitives

- Create small shared primitives only where the same author row, score badge, photo strip, or metadata row appears in three or more contexts.
- Do not duplicate data fetching or bypass `src/api` and `src/queries` boundaries.
- Use semantic classes (`bg-card`, `text-primary`, `text-rating`, `border-border`) instead of screen-specific colors.
- Keep card actions at least 44 points tall and ensure pressed/focus states remain visible in both themes.

## Phase 6: validation

- Review the desktop web composition shown in the approved mockup and a small mobile viewport.
- Test long titles, empty optional fields, three images, missing cover images, loading/error states, keyboard-open forms, and dark/light transitions.
- Run `pnpm check` after each phase and before delivery.
- Confirm that all create mutations and card links still route to their existing destinations.
