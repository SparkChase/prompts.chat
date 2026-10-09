# Richard · 邪王真眼档案馆

## Design direction

A Rikka-themed personal prompt workspace. Richard opens it at work, at home in the evening, and on a phone: the main controls stay crisp and familiar, with a night-library default and an equally legible light theme. This is a visual overhaul of an existing application, preserving routes, filtering, forms, data, and authentication behavior.

## Audit of the starting point

The original uses neutral shadcn tokens, an indigo primary color, Inter, a 48px header, a narrow filter sidebar, and an unhelpful zero-result screen. The original conference banner, external app advertisements, community footer, and hardcoded page metadata belong to prompts.chat. Existing Radix controls, filter URLs, pagination, theme switching, and translations are retained. No public SEO migration is needed for this not-yet-deployed fork; existing route paths remain stable.

## Visual system

- Dark: blue-black background, indigo-tinted surfaces, lavender active states, muted gold for the eye/contract motif.
- Light: cool near-white background, white surfaces, deep violet controls, brown-gold details.
- Main UI uses existing sans-serif fonts with Chinese system fallbacks. Hero headings use Chinese serif fallbacks for a storybook quality; functional controls remain sans-serif.
- Cards have 12–16px radii and a crisp border, without broad decorative shadows. Buttons have clear focus states and 40–44px touch targets.
- A short character banner introduces the library; artwork never sits behind functional text. The collection and its filters remain visible directly below.
- Concentric ring details refer to the character's magical-eye motif. Keep them static; transitions communicate hover, expansion, copy feedback, and theme changes only.
- Preserve reduced-motion preferences. No audio or parallax.

## Components

Branded header, responsive navigation with secondary routes in a menu, compact character hero and search, filter panel, prompt cards, a useful honest empty state, an explicitly labeled copyable example, themed login presentation, and compact attribution footer.

## References

- Rikka official character page: https://www.anime-chu-2.com/tv2nd/character/rikka/ — character silhouette, eye-patch, purple/blue palette.
- Mizuki: https://mizuki.mysqil.com — separation between character imagery and readable content.
- Existing prompts.chat — Radix/shadcn controls, data flow, keyboard behavior.

## Implementation constraints

Use existing dependencies and Lucide icons. Keep all new UI strings in next-intl message namespaces. Do not insert mock prompts into Neon. Keep art provenance separate from MIT code licensing. Verify mobile, both themes, keyboard focus, search, filter clearing, copy feedback, and empty results.

## Source map for learning

- `prompts.config.ts`: Richard's brand name, asset paths, default locale and clone-brand switch.
- `src/app/richard.css`: scoped light/dark tokens, responsive layout and state styling.
- `src/components/archive/`: header, character hero, search, honest empty state, copyable example, homepage and footer.
- `src/app/layout.tsx`: chooses the branded shell and derives page metadata from the configuration.
- `src/app/prompts/page.tsx`: retains the original database queries and filter parameters, then composes the new UI around them.
- `messages/zh.json` / `messages/en.json`: the `archive` namespace. Other locales have English fallback text for the new namespace.
- `public/richard/ASSETS.md`: illustration and icon provenance.

## Verification

Verified in the running app: Chinese and English; dark and light themes; a 390px mobile viewport with no horizontal overflow; mobile navigation and filter expansion; prompt-type filtering and clearing; keyword search with its value retained, then correctly cleared; example input and clipboard output; homepage entry and login presentation. Category and tag pages return successfully after increasing the local Neon connection timeout.

`npm run lint` completes with zero errors and existing warnings. An application-source TypeScript check passes. The repository-wide compiler also includes pre-existing API test typing errors (`Request` versus `NextRequest`, among others); those tests were not rewritten or excluded in the committed tsconfig. Production build and OAuth authorization were not part of this styling verification.

No prompts, categories, user accounts or other content were inserted into the database by this redesign.
