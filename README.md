# FaraUI

> English | [فارسی](#فارسی)

RTL-first React UI components for Persian applications, with built-in Jalali date
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

Popup, modal, drawer, and toast components use browser APIs and portals when
mounted. Render them on the client in SSR applications and import the package
stylesheet from the application entry point.

## Development

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

The generated package can be inspected without publishing it:

```bash
npm pack --dry-run
```

## License

MIT

---

<a id="فارسی"></a>

# FaraUI

مجموعه‌ای از کامپوننت‌های رابط کاربری React با پشتیبانی اولویت‌دار از راست‌به‌چپ
برای اپلیکیشن‌های فارسی، همراه با کنترل‌های تاریخ و زمان جلالی و hookهای CSS که
قابل سفارشی‌سازی توسط مصرف‌کننده هستند.

## نصب

```bash
npm install fara-ui
```

در حال حاضر FaraUI از React 19 و ReactDOM 19 پشتیبانی می‌کند.

## استفاده

کامپوننت‌ها را از ورودی اصلی پکیج و stylesheet همراه آن را یک‌بار در ورودی
اپلیکیشن import کنید:

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

این پکیج خروجی‌های ESM، CommonJS و declarationهای TypeScript را ارائه می‌دهد.

## کامپوننت‌ها

FaraUI شامل کامپوننت‌های دکمه و کنترل‌های فرم، overlayها و بازخورد، کامپوننت‌های
ناوبری، نمایش داده و کنترل‌های تاریخ و زمان فارسی است:

- Button، Input، Textarea، Checkbox، Radio، Switch، Slider، Rating، OtpInput
- Select، Combobox، FileUpload، Form
- Modal، Drawer، Popover، Tooltip، DropdownMenu، ConfirmDialog
- Toast، Alert، Spinner، Skeleton، ProgressBar، Badge، NotificationBadge
- Tabs، Accordion، Breadcrumb، Sidebar، Stepper، Timeline، Divider، Card، Chip
- Table
- DatePicker، DateRangePicker، TimePicker

برای مشاهده hookهای پایدار `data-fara-*` به [STYLING.md](./STYLING.md) مراجعه
کنید.

## استایل و جهت نوشتار

کامپوننت‌ها با CSS Modules و یک stylesheet تجمیع‌شده ارائه می‌شوند. ویژگی‌های
عمومی `data-fara-*` روش پیشنهادی برای override کردن استایل‌ها در سطح اپلیکیشن
هستند. هنگام ساخت رابط فارسی، `dir="rtl"` را روی یک container یا روی document
قرار دهید. کنترل‌هایی که ذاتاً جهت‌دار هستند، جهت تعامل موردنظر خود را حفظ
می‌کنند.

## نکات مرورگر و SSR

کامپوننت‌های popup، modal، drawer و toast هنگام mount شدن از APIهای مرورگر و
portal استفاده می‌کنند. در اپلیکیشن‌های SSR آن‌ها را در سمت client رندر کنید و
stylesheet پکیج را از ورودی اپلیکیشن import کنید.

## توسعه

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

برای بررسی محتوای package بدون انتشار آن:

```bash
npm pack --dry-run
```

## مجوز

MIT
