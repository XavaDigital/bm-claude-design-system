# @beastmode/ui

The shared BeastMode fleet design system. One look across every BeastMode app.

Nine apps are all React plus Ant Design, so they *could* share one theme — but
each one carried its own private copy of "the theme", three never applied one
at all, and 8,188 hand-written inline styles bypass the theme entirely. This
package is the single definition they all point at instead.

Evidence and rationale live in the bm-sales repo:

- `docs/fleet-style-audit.md` — what was measured across ten frontends.
- `docs/fleet-design-system-spec.md` — the full build specification.

---

## Quick start

An app that is entirely staff-facing needs two lines.

```tsx
import { BeastModeRoot } from "@beastmode/ui";
import "@beastmode/ui/vars.css";

export default function App() {
  return (
    <BeastModeRoot mode="system">
      <YourApp />
    </BeastModeRoot>
  );
}
```

That is the whole integration. Delete your local theme file afterwards.

## Apps with customer-facing sections

Three apps contain both audiences in one bundle: bm-order-confirmation,
bm-designflow and BM-estore. Mark the customer sections.

```tsx
import { BeastModeRoot, Surface } from "@beastmode/ui";

<BeastModeRoot mode="system">
  <Routes>
    {/* inherits staff: indigo accent, Inter body */}
    <Route path="/admin/*" element={<AdminShell />} />

    {/* brand red accent, Montserrat body, Archivo headings either way */}
    <Route
      path="/orders/:id"
      element={
        <Surface kind="customer" brand="estore">
          <CustomerOrderPage />
        </Surface>
      }
    />
  </Routes>
</BeastModeRoot>
```

`staff` is the default, deliberately: an unmarked surface rendering indigo is
an internal cosmetic miss, whereas an unmarked surface rendering brand red puts
a customer identity on an internal screen. It also means every customer surface
in the fleet is one `rg 'kind="customer"'` away.

---

## What varies, and what does not

A surface is either `staff` or `customer`. That single setting carries both the
accent and the body font — they are not separate knobs.

| | staff | customer |
|---|---|---|
| Accent | indigo `#4f46e5` / `#6366f1` | brand red |
| Body font | Inter | Montserrat |
| Headings | Archivo | Archivo |

Everything else is shared and must not vary: the surface ramps, text tones,
corner radii, spacing, status colours, elevation, and the chart palette.

**Surface ramps.** The dark ramp has four steps and `chrome` is *darker* than
`page` — the header and sidebar recede, the working area sits above them.
Getting this backwards inverts the depth model of every screen.

```
dark    chrome #141414  →  page #191919  →  panel #212121  →  elevated #2a2a2a
light   chrome #ffffff  →  page #f8fafc  →  panel #ffffff  →  subtle   #f1f5f9
```

---

## Three things that will bite you

**Import overlays from this package, not from `antd`.** `Modal` and `Drawer`
ignore the setting that keeps every other popup inside its surface, so a
customer-styled modal renders in the right colour but the wrong font. This
package re-exports them fixed. Enforce it:

```js
// eslint.config.js
"no-restricted-imports": ["error", {
  paths: [{
    name: "antd",
    importNames: ["Modal", "Drawer", "Tooltip", "Popover", "Popconfirm", "Dropdown"],
    message: "Import these from @beastmode/ui so overlays stay inside their surface.",
  }],
}]
```

**Use `App.useApp()` for messages.** A static `message.success()` imported from
`antd` cannot reach React context, so it renders unthemed. `BeastModeRoot`
mounts the provider; call the hook.

```tsx
const { message } = App.useApp();
message.success("Quote sent");
```

**Never set `hashed={false}` on `StyleProvider`.** With hashing off, two
surfaces emit identical class names and the second silently overwrites the
first — staff chrome inherits customer red, with no error anywhere.

**Audit your global stylesheet for bare element selectors before migrating.**
Rules like `nav a { … }`, `footer { … }` or `section p { … }` reach inside Ant
Design components, because they render real `<nav>`, `<footer>` and `<p>`
elements. This package's own preview page hit it: a pill style meant for its
jump links captured the Breadcrumb link and drew a bordered pill around it with
the text pushed to the bottom. It looks like a design system bug and is not one.

```bash
# The rules most likely to leak. Check what each one actually matches.
rg '^\s*(nav|footer|header|section|main|aside|ul|ol|li|p|a|button|input|table)\s*[,{]' --glob '*.css'
```

Scope them to a class, or wrap them in `:not(.bm-surface *)`. The apps most at
risk are the ones still shipping an unmodified starter stylesheet — the audit
found two.

---

## Consumers that cannot run React

Roughly a third of the fleet's colour surface never touches the React layer.
Three build outputs cover it.

| Output | For |
|---|---|
| `@beastmode/ui/tokens.json` | PDF renderers, email templates, canvas, chart libraries |
| `@beastmode/ui/vars.css` | bm-identity, which has no build step by design |
| `dist/global.css` | Archivo headings, which Ant Design has no token for |

```js
import tokens from "@beastmode/ui/tokens.json";
const { surface, text } = tokens.surfaces["customer.estore.dark"];
```

### Pre-paint scripts

Four apps set the background before the app boots, to avoid a flash of the
wrong colour. Those scripts run before any bundle loads, so they cannot import
from here — copy the value and keep it in step. Today bm-sales stamps a colour
its own theme does not use, which is exactly the drift this warns about.

---

## The red-brand danger protocol

On a customer surface the accent is red and the error colour is red — measured
9.1 degrees apart in hue, which is the same colour to a person. A red "Buy now"
beside a red "Delete" on a page taking payments is a real failure, and hue
cannot fix it.

- Solid fill is reserved for the affirmative action. Destructive buttons render
  outlined: use `<Button danger>`, never `<Button danger type="primary">`.
- The one permitted solid danger fill is the confirm button inside a
  destructive dialog, which uses `dangerSolid` — separated by darkness, not
  hue.
- Destructive actions always carry a leading icon and sit secondary in the
  action row. The affirmative action never carries one.
- The focus ring keeps the brand; the invalid-field state shifts to the dark
  maroon family with a heavier border and an icon. A thin bright glow means
  focused, a heavy dark edge means wrong.

---

## Accessibility, stated plainly

Two positions here are deliberate rather than accidental.

**Control borders are split by surface.** WCAG 1.4.11 wants 3:1 for boundaries
that identify a control. The fleet's quiet borders measure about 1.25:1. David
ruled on 2026-08-16 to accept that on internal tools, where light mode and
staff familiarity carry the load. Customer surfaces do not get that exemption —
BM-estore is a live shop and GotYaBack takes public donations — so
`controlBorders.customer` uses conformant values. Point both keys at the same
set to make the fleet uniform again.

**Light mode has two text tones, not three.** The light secondary sits at
4.76:1 on white with almost no headroom, so any tone visibly dimmer fails.
`text.light.tertiary` is therefore disabled-only. Do not use it for
placeholders that carry information.

---

## Development

```bash
npm install
npm run typecheck
npm test          # includes the brand-coverage guard
npm run build     # dist/ + tokens.json + vars.css + global.css
```

### The brand-coverage guard

`src/theme/brand-coverage.test.ts` varies only the brand and asserts that the
set of theme values which changed is exactly the set declared in
`src/theme/followsBrand.ts`.

It exists because of the worst defect found in review: a component map that
hardcodes the accent renders a red-brand app half-red — primary button red, tab
underline and slider still indigo. Every individual line looks plausible, so it
survives review easily. The test catches it by name.

Adding a brand-following slot means adding it to `FOLLOWS_BRAND` in the same
change. That is the point, not an inconvenience.

---

## Rollout order

Prove the package on the smallest, safest app; leave the live shop for last.

1. **bm-team-engage** — smallest, internal only, already on the ruled ramp.
2. **bm-order-confirmation** — validates fonts, status colours and the PDF path.
3. **bm-identity** — forces the build-step-free CSS output. Deploy carefully; a
   failure here is a fleet-wide login outage.
4. **bm-email** — already correct, so it proves the package causes no visual
   change where an app already matches.
5. **bm-sales** — the app the ramp ruling actually changes.
6. **bm-designflow** — 1,708 hand-styled elements make the follow-through long.
7. **bm-configurator** — public, and about fifteen of its colours are customer
   artwork including a Pantone dye specification. Fence those off first.
8. **bm-gotyaback** — first real test of the red brand seam.
9. **BM-estore** — highest business risk in the fleet. Last.

ReviewUs is not in the fleet.

### Never colour-sweep these

Customer artwork and product data, anything printed, email templates, Stripe
and Google-rendered frames, and colours already saved in the database as user
choices. Changing a default does not change existing records, so a careless
migration leaves boards showing two generations of the same thing.
