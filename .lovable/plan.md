

## Plan: Collapsible Accordion Settings

Wrap the three settings sections (Tag Manager, WordPress Integration, User Management) in an `Accordion` component from the existing Radix accordion primitives.

### Changes

**`src/pages/Settings.tsx`** — Replace the three standalone `<Card>` components with an `<Accordion type="multiple">` containing three `<AccordionItem>` entries. Each item's trigger shows the section icon + title + description, and the content renders the existing component internals.

The existing components (`TagManager`, `WordPressIntegration`, `UserManagement`) each wrap themselves in a `<Card>` with `<CardHeader>` and `<CardContent>`. Two approaches:

**Approach: Refactor Settings.tsx only** — Keep existing components as-is, but wrap each in an `AccordionItem` where:
- `AccordionTrigger` shows the icon, title, and description (extracted/duplicated from each component's CardHeader)
- `AccordionContent` renders the full component

This is simpler but means the Card header info appears twice (once in trigger, once inside the component). Better approach: remove the `<Card>` wrapper from each component and let Settings.tsx provide the accordion structure.

**Chosen approach**: Modify all four files:
1. **`src/pages/Settings.tsx`** — Import `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`. Wrap each section in an accordion item with appropriate titles/icons.
2. **`src/components/settings/TagManager.tsx`** — Remove outer `<Card>`/`<CardHeader>`, export just the content (the card body).
3. **`src/components/settings/WordPressIntegration.tsx`** — Same: remove `<Card>`/`<CardHeader>`, export content only. Keep the connection badge visible in the accordion trigger instead.
4. **`src/components/settings/UserManagement.tsx`** — Same treatment.

The accordion triggers will show each section's icon, title, and short description inline. `type="multiple"` allows opening several at once.

