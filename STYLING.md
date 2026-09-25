# Styling hooks — `data-fara-*` attributes

FaraUI ships unstyled-in-spirit: logic lives in the components, styling is fully overridable.
Every structural element carries a stable `data-fara-*` attribute so consumers can target it
from their own CSS without relying on hashed CSS-module classnames.

## Naming convention

- Root element of a component: `data-fara-<component-kebab>` (e.g. `data-fara-progress-bar`)
- Inner elements: `data-fara-<component-kebab>-<part>` (e.g. `data-fara-progress-track`, `data-fara-progress-fill`)
- State/variant flags: plain `data-*` on the part they describe
  (e.g. `data-variant="success"`, `data-open`, `data-selected`) — state stays separate from structure hooks.

Common state flags across the library: `data-variant`, `data-size`, `data-open`, `data-active`,
`data-selected`, `data-disabled`, `data-error`, `data-loading`, `data-today`, `data-orientation`,
`data-side`, `data-read-only`. Some parts also carry a name flag to distinguish identical siblings:
`data-column` (wheel columns), `data-direction` (prev/next nav buttons), `data-handle` (slider thumbs).

## Popups render in a portal

Open/close popups (date/time panels, Select/Combobox dropdowns, menus, popovers) render into
`document.body` via a portal and are positioned `fixed` — ancestor `overflow` can never clip them.
Their panel element carries `data-fara-<component>-panel` (e.g. `data-fara-date-picker-panel`).

## Directionality

Some components are directional by nature (ProgressBar fills left-to-right, Rating, Slider, ...)
and must not flip in RTL contexts — they stay LTR even on fully Persian pages. Those set
`direction: ltr` in their own module CSS on the relevant element. Do not remove it.

## Example — ProgressBar

```css
/* Change the track height and color */
[data-fara-progress-track] {
    height: 4px;
    background-color: #e2e8f0;
}

/* Change the fill color for the danger variant */
[data-fara-progress-fill][data-variant="danger"] {
    background-color: hotpink;
}
```

## Hook reference

Hooks are listed in short form: `-track` on `ProgressBar` means `data-fara-progress-track`.

### Popup components

- **DatePicker**: `date-picker` (root), `-input`, `-panel`, `-header`, `-nav-button` (`data-direction`), `-month-year-group`, `-month-button`, `-year-button`, `-days-grid`, `-weekday`, `-day-cell` (`data-selected`, `data-today`), `-footer`, `-footer-button`, `-time-column`, `-time-row`, `-column-label`, `-time-list`, `-time-item` (`data-selected`), `-months-grid`, `-month-cell` (`data-selected`), `-years-grid`, `-year-cell` (`data-selected`), `-scroll-header`, `-scroll-container`, `-scroll-column` (`data-column: year|month|day|hour|minute`), `-scroll-item` (`data-selected`), `-confirm-row`, `-confirm-button`
- **TimePicker**: `time-picker` (root), `-input`, `-panel`, `-header`, `-column-label`, `-scroll-container`, `-column` (`data-column: hour|minute|second|period`), `-separator`, `-item` (`data-selected`), `-confirm-row`, `-confirm-button`
- **DateRangePicker**: `date-range-picker` (root), `-input`, `-panel`, `-header`, `-nav-button` (`data-direction`), `-months-row`, `-month-column`, `-month-title`, `-days-grid`, `-weekday`, `-day-cell` (`data-selected`, `data-in-range`, `data-today`), `-footer`, `-footer-button`
- **Select**: `select` (root), `-trigger`, `-dropdown` (panel), `-option-list`, `-option` (`data-selected`, `data-active`), `-empty`
- **Combobox**: `combobox` (root), `-trigger` (`data-disabled`), `-chip`, `-search-input`, `-dropdown` (panel), `-option-list`, `-option` (`data-active`), `-empty`
- **DropdownMenu**: `dropdown-menu` (root), `-trigger`, `-menu` (panel), `-list`, `-item` (`data-danger`, `data-disabled`)
- **Popover**: `popover` (root), `-trigger`, `-content` (panel)
- **Table**: `table` (root), `-search-input`, `-loading-overlay`, `-table`, `-head`, `-header-cell`, `-sort-icon` (`data-active`), `-checkbox-cell`, `-checkbox`, `-body`, `-row` (`data-selected`), `-cell`, `-empty`, `-filter`, `-filter-button` (`data-active`), `-filter-popover` (panel), `-filter-input`, `-pagination`, `-pagination-info`, `-pagination-controls`, `-page-size-select`, `-pagination-button`, `-pagination-current`

### Form controls

- **Form**: `form` (the `<form>` element) — `Form.Field` renders no DOM of its own and passes field props (`value`/`checked`, `onChange`, `onBlur`, `ref`, `aria-invalid`, `aria-describedby`) to whatever you render. Its render prop receives `(fieldProps, error, helpers)`; put `helpers.errorId` on the element that renders `error` so the message is announced and referenced by the control.

- **Input**: `input` (the element itself is the root, `data-error`, `data-size`)
- **Textarea**: `textarea` (root, `data-error`)
- **Checkbox**: `checkbox` (root), `-input`
- **Radio**: `radio` (root), `-input`; **RadioGroup**: `radio-group` (root)
- **Switch**: `switch` (root), `-input`, `-track`, `-thumb` (checked state styleable via `[data-fara-switch-input]:checked + [data-fara-switch-track]`)
- **Slider**: `slider` (root, `data-range`, `data-disabled`), `-label-row`, `-value`, `-track`, `-fill`, `-thumb` (`data-handle: min|max`, `data-active`), `-input`
- **Rating**: `rating` (root, `data-read-only`), `-star` (`data-filled`)
- **OtpInput**: `otp-input` (root), `-slot` (`data-error`, `data-filled`)
- **FileUpload**: `file-upload` (root), `-dropzone` (`data-variant`, `data-drag-active`, `data-error`, `data-disabled`), `-icon`, `-label`, `-hint`, `-input`, `-preview-image`, `-preview-remove`, `-rejections`, `-rejection`, `-file-list`, `-item` (`data-status`, `data-clickable`), `-item-preview`, `-item-placeholder`, `-item-progress`, `-item-status` (`data-status`), `-item-footer`, `-item-name`, `-item-error-text`, `-item-size`, `-item-remove`, `-preview-large`

### Overlays & feedback

- **Modal**: `modal-overlay` (`data-open`), `modal` (`data-open`), `-header`, `-title`, `-close`
- **Drawer**: `drawer-overlay` (`data-open`), `drawer` (`data-open`, `data-side`), `-header`, `-title`, `-close`, `-body`
- **ConfirmDialog** (renders through Modal): `-message`, `-actions` (`data-loading`), `-cancel`, `-confirm` (`data-danger`)
- **Alert**: `alert` (root, `data-variant`, `data-open`), `-content`, `-close`
- **Toast**: `toaster` (portal container, `data-position: top-left|top-center|top-right|bottom-left|bottom-center|bottom-right`), `toast` (`data-variant`, `data-closing`), `-message`, `-close`, `-progress`
- **Tooltip**: `tooltip-wrapper`, `tooltip` (`data-open`, `data-placement: top|bottom`), `-arrow`
- **Skeleton**: `skeleton` (root, `data-variant: text|circle|rectangle`)
- **Spinner**: `spinner` (root, `data-size`)
- **Badge**: `badge` (root, `data-variant`)
- **NotificationBadge**: `notification-badge` (root), `-count` (`data-variant`)
- **Avatar**: `avatar` (root, `data-size`, `data-fallback`), `-image`
- **Divider**: `divider` (root, `data-orientation`, `data-with-label`), `-label`
- **Card**: `card` (root)

### Navigation & compound

- **Accordion**: `accordion` (Root), `-item` (`data-open`), `-trigger` (`data-open`), `-icon`, `-panel` (`data-open`), `-panel-inner`, `-panel-content`
- **Breadcrumb**: `breadcrumb` (root), `-list`, `-item` (`data-current`), `-current`, `-link`, `-separator`
- **Button**: `button` (root, `data-variant`, `data-size`)
- **Chip**: `chip` (root, `data-removable`), `-remove`
- **Sidebar**: `sidebar` (root, `data-collapsed`), `-header`, `-header-content`, `-toggle`, `-body`
- **Stepper**: `stepper` (root, `data-orientation`), `-list`, `-step` (`data-active`, `data-completed`), `-header`, `-circle` (`data-active`, `data-completed`), `-check-icon`, `-text`, `-label`, `-description`, `-connector` (`data-completed`), `-content`
- **Tabs**: `tabs` (Root), `-list`, `-tab` (`data-active`, `data-disabled`, `data-value`), `-panel` (`data-active`)
- **Timeline**: `timeline` (root, `data-orientation`), `-item`, `-marker-column`, `-dot` (`data-variant`), `-connector`, `-content`, `-title`, `-timestamp`, `-description`

### Progress

- **ProgressBar**: `progress-bar` (root), `-label-row`, `-track`, `-fill` (`data-variant`, `data-indeterminate`)
