[English](./README.md)

# FaraUI

کتابخانه‌ای از کامپوننت‌های React، طراحی‌شده برای اپلیکیشن‌های فارسی. جهت راست به چپ به‌صورت پیش‌فرض پشتیبانی می‌شود و کنترل‌های تاریخ و ساعت بر پایه‌ی تقویم جلالی به‌همراه متغیرهای طراحی قابل‌بازنویسی در اختیار توسعه‌دهنده قرار می‌گیرد.

## ویژگی‌ها

- **راست به چپ به‌عنوان معماری پایه:** کامپوننت‌ها از ابتدا برای رابط راست به چپ طراحی شده‌اند، نه به‌عنوان یک لایه‌ی تطبیقی اضافه.
- **پشتیبانی بومی از تقویم جلالی:** ⁦`DatePicker`⁩، ⁦`DateRangePicker`⁩ و ⁦`TimePicker`⁩ مستقیماً بر پایه‌ی تقویم جلالی پیاده‌سازی شده‌اند.
- **سازگاری کامل با رندر سمت سرور:** تمام کامپوننت‌ها بدون نیاز به پیکربندی اضافی در Next.js، از جمله App Router، قابل استفاده‌اند.
- **قابلیت شخصی‌سازی:** متغیرهای CSS و مجموعه‌ای مستند از ویژگی‌های ⁦`data-fara-*`⁩ رابط پایداری برای استایل‌دهی سطح برنامه فراهم می‌کنند.
- **پایه‌ی TypeScript:** کل کتابخانه با TypeScript توسعه یافته و فایل‌های تعریف نوع به‌همراه بسته منتشر می‌شوند.

## نصب

```bash
npm install fara-ui
```

نسخه‌ی فعلی از React 19 و ReactDOM 19 پشتیبانی می‌کند.

## شروع سریع

فایل استایل را یک‌بار، در نقطه‌ی ورود برنامه، وارد کنید:

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

برای رابط‌های فارسی، مقدار ⁦`dir="rtl"`⁩ باید روی عنصر ⁦`<html>`⁩ یا سطح ریشه‌ی برنامه تنظیم شود. بسته در سه قالب ⁦ESM⁩، ⁦CommonJS⁩ و اعلان‌های TypeScript منتشر می‌شود.

## رندر سمت سرور و Next.js

تمام کامپوننت‌ها با دستورالعمل ⁦`"use client"`⁩ علامت‌گذاری شده‌اند و بدون نیاز به بستن در ⁦`dynamic(..., { ssr: false })`⁩ در App Router قابل استفاده‌اند، از جمله در فایل‌هایی که به‌صورت Server Component تعریف شده‌اند:

```tsx
import { Modal, DatePicker } from "fara-ui";
```

کامپوننت‌هایی که در قالب یک portal رندر می‌شوند — ⁦`Modal`⁩، ⁦`Drawer`⁩، ⁦`Toaster`⁩، ⁦`Popover`⁩، ⁦`DropdownMenu`⁩ و کنترل‌های تاریخ و ساعت — در مرحله‌ی رندر سرور خروجی تولید نمی‌کنند و بلافاصله پس از هیدریت شدن صفحه در مرورگر نمایش داده می‌شوند. این رفتار به‌عمد طراحی شده و هشدار هیدریشن ایجاد نمی‌کند.

توابع مربوط به تاریخ و ساعت جلالی فاقد هرگونه وابستگی به محیط مرورگر هستند و از یک نقطه‌ی ورود مستقل منتشر می‌شوند تا در Server Component نیز قابل فراخوانی باشند:

```tsx
// app/some-page.tsx (Server Component)
import { formatJalali, getTodayJalali } from "fara-ui/jalali";

export default function Page() {
  return <p>{formatJalali(getTodayJalali())}</p>;
}
```

فایل ⁦`fara-ui/styles.css`⁩ باید یک‌بار از layout ریشه‌ی برنامه وارد شود: ⁦`app/layout.tsx`⁩ در App Router، یا ⁦`_app.tsx`⁩ در Pages Router.

## کامپوننت‌ها

**کنترل‌های فرم:** Button، Input، Textarea، Checkbox، Radio، Switch، Slider، Rating، OtpInput، Select، Combobox، FileUpload، Form

**بازخورد:** Modal، Drawer، Popover، Tooltip، DropdownMenu، ConfirmDialog، Toast، Alert، Spinner، Skeleton، ProgressBar

**ناوبری:** Tabs، Accordion، Breadcrumb، Sidebar، Stepper

**نمایش داده:** Table، Timeline، Card، Chip، Badge، NotificationBadge، Avatar، Divider

**تاریخ و ساعت:** DatePicker، DateRangePicker، TimePicker

## استایل‌دهی و تم

کامپوننت‌ها به‌همراه CSS Modules و یک فایل استایل یکپارچه (⁦`fara-ui/styles.css`⁩) منتشر می‌شوند. متغیرهای طراحی در قالب CSS custom properties در دسترس‌اند و هر کامپوننت مجموعه‌ای پایدار از ویژگی‌های ⁦`data-fara-*`⁩ را به‌عنوان selector عمومی برای بازنویسی در سطح برنامه ارائه می‌دهد. این ویژگی‌ها، برخلاف نام کلاس‌های داخلی که ممکن است میان نسخه‌ها تغییر کنند، مرجع پایداری برای استایل‌دهی محسوب می‌شوند.

فهرست کامل متغیرها و ویژگی‌ها در [STYLING.md](./STYLING.md) مستند شده است.

## مجوز

MIT
