# FaraUI

React UI components for Persian applications, with built-in Jalali date
and time controls and CSS hooks that can be overridden by consumers.

## Installation

```bash
npm install fara-ui
```

FaraUI currently supports React 19 and ReactDOM 19.

## Usage

Import components from the package entry point and import the bundled stylesheet
once in your application:

```tsx
import { Button, DatePicker } from "fara-ui";
import "fara-ui/styles.css";

export function Example() {
  return (
    <div dir="rtl">
      <Button onClick={() => console.log("clicked")}>ادامه</Button>
      <DatePicker onChange={(value) => console.log(value)} />
    </div>
  );
}
```

The package provides ESM, CommonJS, and TypeScript declaration outputs.

## Components

FaraUI exports buttons and form controls, overlays and feedback components,
navigation components, data display components, and Persian date/time controls:

- Button, Input, Textarea, Checkbox, Radio, Switch, Slider, Rating, OtpInput
- Select, Combobox, FileUpload, Form
- Modal, Drawer, Popover, Tooltip, DropdownMenu, ConfirmDialog
- Toast, Alert, Spinner, Skeleton, ProgressBar, Badge, NotificationBadge
- Tabs, Accordion, Breadcrumb, Sidebar, Stepper, Timeline, Divider, Card, Chip
- Table
- DatePicker, DateRangePicker, TimePicker

See [STYLING.md](./STYLING.md) for the stable `data-fara-*` styling hooks.

## Styling and directionality

Components ship with CSS Modules and a bundled stylesheet. The public
`data-fara-*` attributes are the recommended selectors for application-level
overrides. Set `dir="rtl"` on an application container or the document when
building a Persian interface. Direction-sensitive controls preserve their
intended interaction direction.

## Browser and SSR notes

The basic presentational components can be imported in SSR applications.
Components that render portals or depend on browser APIs must be rendered on the
client: `Modal`, `Drawer`, `Toast`/`Toaster`, `Popover`, `Tooltip`, `DropdownMenu`,
`Select`, `Combobox`, `DatePicker`, `DateRangePicker`, and `TimePicker`.

In Next.js, load these components with SSR disabled:

```tsx
import dynamic from "next/dynamic";

const ClientDatePicker = dynamic(
  () => import("./ClientDatePicker").then((module) => module.ClientDatePicker),
  { ssr: false },
);
```

Import `fara-ui/styles.css` from the application entry point. Full SSR support
for browser-dependent components is not part of the `0.1.0` contract.

```

## License

MIT
