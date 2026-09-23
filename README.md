[پارسی](./README.fa.md)

# FaraUI

React UI components for Persian applications — RTL by default, with
built-in Jalali (Persian) date and time controls, CSS Modules, and design
tokens that consuming applications can override.

## Features

- **RTL-first** — components are built for right-to-left interfaces from the
  ground up, not adapted afterward.
- **Persian calendar built in** — `DatePicker`, `DateRangePicker`, and
  `TimePicker` work natively with the Jalali calendar.
- **SSR-ready** — every component works out of the box in Next.js and other
  server-rendering frameworks, including the App Router.
- **Themeable** — CSS custom properties and a documented set of
  `data-fara-*` attributes give applications stable hooks for styling,
  without depending on internal class names.
- **Typed** — written in TypeScript, with declaration files published
  alongside the package.

## Installation

```bash
npm install fara-ui
```

FaraUI currently supports React 19 and ReactDOM 19.

## Quick start

Import the stylesheet once, near the root of your application, and start
using components:

```tsx
import "fara-ui/styles.css";
import { Button, DatePicker } from "fara-ui";

export function Example() {
  return (
    <div dir="rtl">
      <Button onClick={() => console.log("clicked")}>ادامه</Button>
      <DatePicker onChange={(value) => console.log(value)} />
    </div>
  );
}
```

Set `dir="rtl"` on `<html>` or an application container when building a
Persian interface. The package ships ESM, CommonJS, and TypeScript
declaration outputs.

## SSR and Next.js

All components are marked `"use client"` and can be imported directly in
Next.js App Router projects, including from within Server Components — no
`dynamic(..., { ssr: false })` wrapper is needed:

```tsx
import { Modal, DatePicker } from "fara-ui";
```

Components that render into a portal (`Modal`, `Drawer`, `Toaster`,
`Popover`, `DropdownMenu`, and the date/time pickers) render nothing on the
server and appear right after the page hydrates in the browser. This is
expected and does not produce hydration warnings.

Pure Jalali date/time helpers have no client-only code and are published as
a separate entry point, so they can be called from Server Components as
well:

```tsx
// app/some-page.tsx (Server Component)
import { formatJalali, getTodayJalali } from "fara-ui/jalali";

export default function Page() {
  return <p>{formatJalali(getTodayJalali())}</p>;
}
```

Import `fara-ui/styles.css` once from the root layout — `app/layout.tsx` in
the App Router, or `_app.tsx` in the Pages Router.

## Components

**Form controls:** Button, Input, Textarea, Checkbox, Radio, Switch, Slider,
Rating, OtpInput, Select, Combobox, FileUpload, Form

**Overlays and feedback:** Modal, Drawer, Popover, Tooltip, DropdownMenu,
ConfirmDialog, Toast, Alert, Spinner, Skeleton, ProgressBar

**Navigation:** Tabs, Accordion, Breadcrumb, Sidebar, Stepper

**Data display:** Table, Timeline, Card, Chip, Badge, NotificationBadge,
Avatar, Divider

**Date and time:** DatePicker, DateRangePicker, TimePicker

## Styling and theming

Components ship with CSS Modules and a single bundled stylesheet
(`fara-ui/styles.css`). Design tokens are exposed as CSS custom properties,
and every component also exposes a stable set of `data-fara-*` attributes
as public selectors for application-level overrides — these are safer to
rely on than internal class names, which may change between versions.

See [STYLING.md](./STYLING.md) for the full list of tokens and hooks.

## License

MIT
