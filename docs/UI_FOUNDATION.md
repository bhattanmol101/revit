# UI foundation

The product uses a confident social-editorial visual system. New work must extend this system instead of introducing a separate screen-specific style.

## Visual language

- `background` is the cool page canvas.
- `card` is the primary elevated content surface.
- `primary` is the softened royal-blue brand/action color (`#3158B8`).
- `secondary` is a neutral supporting surface for prompts and social actions.
- `accent` is a restrained blue supporting surface for discovery and positive context.
- `rating` uses the blue rating token and always includes a numeric/text alternative.
- `success` and `destructive` communicate outcomes, not decoration.
- Light and dark themes must provide equivalent hierarchy and contrast.

## Composition

- Prefer spacing, typography, and surface changes over nested borders.
- Use `rounded-lg` surfaces and `rounded-md` controls. Reserve `rounded-full`
  for avatars, status dots, and compact count badges only.
- Use cards for meaningful grouped content, not every section.
- Keep primary reading columns narrow while allowing expressive hero areas to be wider.
- Default to 24px mobile gutters, 12px surface padding, 8px label/control gaps,
  and 24px between major sections.
- Home and post-detail social cards may run edge to edge on mobile. Page headers,
  forms, discovery, lists, profiles, and other secondary screens retain the 24px
  mobile gutter.
- Mobile touch targets must be at least 44 points tall.

## Implementation rules

- Use Uniwind utilities and the shared `src/components/ui` primitives.
- Do not use `StyleSheet.create`, one-off hard-coded theme colors, or duplicate primitives.
- Use semantic token classes such as `bg-primary`, `text-muted-foreground`, and `text-rating`.
- Direct style objects are limited to library APIs that do not accept `className`, such as navigator options.
- Feature screens must include designed loading, empty, error, disabled, pressed, and pending states.
- Motion must be brief, respect reduced-motion settings, and never delay interaction.
- Haptics are limited to meaningful native actions and must not be required for understanding an interaction.
- New screens must be reviewed on mobile and desktop web in system light and dark modes.
- Ask, Share, and forum creation screens use the approved compact editorial
  layouts as density references. Keep headings restrained and leave deliberate
  breathing room around form sections and sticky actions.

## Social content rules

- Author identity, content, and actions must have a clear reading order.
- Ratings use the blue `rating` token and always include a numeric/text alternative.
- Replies are visually subordinate to their parent without becoming nested cards inside cards.
- Destructive actions require confirmation and remain visually distinct from primary actions.
