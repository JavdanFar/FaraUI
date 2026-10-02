import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import "./App.css";
import { formatJalali, gregorianToJalali, jalaliToGregorian } from "./jalali";
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Chip,
  Combobox,
  ConfirmDialog,
  DatePicker,
  DateRangePicker,
  Divider,
  Drawer,
  DropdownMenu,
  DropdownMenuItem,
  FileUpload,
  Form,
  Input,
  Modal,
  NotificationBadge,
  OtpInput,
  Popover,
  ProgressBar,
  RadioGroup,
  Rating,
  Select,
  Sidebar,
  SidebarItem,
  SidebarTrigger,
  Skeleton,
  Slider,
  Spinner,
  Stepper,
  Switch,
  Table,
  Tabs,
  Textarea,
  TimePicker,
  Timeline,
  Tooltip,
  showToast,
  Toaster,
  useStepper,
} from "./index";
import type {
  BreadcrumbItem,
  ComboboxOption,
  DatePickerValue,
  DateRangeValue,
  FormHandle,
  SelectOption,
  SliderRangeValue,
  SortState,
  StepperStep,
  TableColumn,
  TimelineItem,
  ToastPosition,
  UploadedFile,
} from "./index";

type Direction = "rtl" | "ltr";

const ICON_PATHS = {
  home: "M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10",
  chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  users: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  box: "M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8",
  settings: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  star: "M12 2l3 7 7 .6-5.3 4.6 1.7 7L12 17.6 5.6 21.2l1.7-7L2 9.6 9 9z",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6",
  mail: "M4 4h16v16H4zM4 7l8 6 8-6",
} as const;

function Icon({ name, size = 20 }: { name: keyof typeof ICON_PATHS; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

const NAV = [
  { id: "buttons", number: "۰۱", title: "دکمه‌ها و اکشن‌ها" },
  {
    id: "forms",
    number: "۰۲",
    title: "فرم‌ها",
    children: [
      { id: "forms-text", title: "ورودی متن" },
      { id: "forms-selection", title: "انتخاب" },
      { id: "forms-value", title: "کنترل مقدار" },
      { id: "forms-upload", title: "آپلود فایل" },
      { id: "forms-validation", title: "اعتبارسنجی فرم" },
    ],
  },
  {
    id: "datetime",
    number: "۰۳",
    title: "تاریخ و زمان",
    children: [
      { id: "datetime-picker", title: "انتخاب تاریخ" },
      { id: "datetime-range", title: "بازه تاریخ" },
      { id: "datetime-time", title: "ساعت" },
    ],
  },
  {
    id: "feedback",
    number: "۰۴",
    title: "بازخورد و وضعیت",
    children: [
      { id: "feedback-messages", title: "پیام‌ها" },
      { id: "feedback-loading", title: "بارگذاری و پیشرفت" },
      { id: "feedback-badges", title: "نشان‌ها" },
      { id: "feedback-confirm", title: "تایید عملیات" },
    ],
  },
  {
    id: "data",
    number: "۰۵",
    title: "نمایش داده",
    children: [
      { id: "data-table", title: "جدول" },
      { id: "data-content", title: "کارت و محتوا" },
      { id: "data-flow", title: "روند و مسیر" },
    ],
  },
  {
    id: "overlays",
    number: "۰۶",
    title: "لایه‌ها و ناوبری",
    children: [
      { id: "overlays-layers", title: "لایه‌ها" },
      { id: "overlays-navigation", title: "ناوبری" },
      { id: "overlays-sidebar", title: "سایدبار" },
    ],
  },
  {
    id: "compose",
    number: "۰۷",
    title: "نمونه‌های ترکیبی",
    children: [
      { id: "compose-auth", title: "ورود به حساب" },
      { id: "compose-dashboard", title: "داشبورد" },
      { id: "compose-settings", title: "تنظیمات" },
    ],
  },
];

function Nav({ dir, onToggleDir }: { dir: Direction; onToggleDir: () => void }) {
  return (
    <aside className="nav">
      <h1 className="navBrand">
        Fara<span>UI</span>
      </h1>
      <p className="navSubtitle">گالری کامپوننت‌ها — همراه با تمام حالات</p>
      <div className="navTools">
        <Button size="sm" variant="outline" onClick={onToggleDir}>
          جهت: {dir.toUpperCase()}
        </Button>
      </div>
      <ul className="navList">
        {NAV.map((section) => (
          <li key={section.id} className="navItem">
            <a href={`#${section.id}`}>
              <span className="navNumber">{section.number}</span>
              {section.title}
            </a>
            {section.children && (
              <ul className="navList">
                {section.children.map((sub) => (
                  <li key={sub.id} className="navItem navSubItem">
                    <a href={`#${sub.id}`}>{sub.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Section({
  id,
  number,
  title,
  description,
  children,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="section" id={id}>
      <div className="sectionHeader">
        <span className="sectionNumber">{number}</span>
        <h2 className="sectionTitle">{title}</h2>
      </div>
      <p className="sectionDescription">{description}</p>
      {children}
    </section>
  );
}

function Subsection({
  id,
  title,
  children,
  wide,
}: {
  id: string;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="subsection" id={id}>
      <h3 className="subsectionTitle">{title}</h3>
      <div className={wide ? "grid gridWide" : "grid"}>{children}</div>
    </div>
  );
}

function Demo({
  name,
  title,
  children,
  span,
}: {
  name: string;
  title: string;
  children: ReactNode;
  span?: "wide";
}) {
  return (
    <article
      className={span === "wide" ? "demo gridWide" : "demo"}
      style={span ? { gridColumn: "1 / -1" } : undefined}
    >
      <header className="demoHeader">
        <code className="demoName">{name}</code>
        <span className="demoTitle">{title}</span>
      </header>
      <div className="preview">{children}</div>
    </article>
  );
}

function Result({ children }: { children: ReactNode }) {
  return <span className="result">{children}</span>;
}

export default function App() {
  const [dir, setDir] = useState<Direction>("rtl");

  return (
    <div className="app" dir={dir}>
      <Nav dir={dir} onToggleDir={() => setDir((current) => (current === "rtl" ? "ltr" : "rtl"))} />

      <main className="content">
        <header className="pageHeader">
          <h1 className="pageTitle">کتابخانه کامپوننت فارسی</h1>
          <p className="pageSubtitle">
            ۴۰ کامپوننت آماده استفاده با منطق کامل — تقویم جلالی، فرم‌ها، جدول داده، لایه‌ها و
            ناوبری. برای تعامل با هر نمونه، کلیک و هاور کنید و با دکمه جهت، رفتار RTL و LTR را
            مقایسه کنید.
          </p>
        </header>

        <ButtonsSection />
        <FormsSection />
        <DateTimeSection />
        <FeedbackSection />
        <DataDisplaySection />
        <OverlaysSection />
        <ComposeSection />
      </main>
    </div>
  );
}

const BUTTON_VARIANTS = ["primary", "secondary", "danger", "success", "outline", "ghost"] as const;
const BUTTON_SIZES = ["sm", "md", "lg"] as const;

function ButtonsSection() {
  const [saving, setSaving] = useState(false);
  const [clicks, setClicks] = useState(0);

  function simulateSave() {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      showToast("تغییرات ذخیره شد", "success");
    }, 1500);
  }

  return (
    <Section
      id="buttons"
      number="۰۱"
      title="دکمه‌ها و اکشن‌ها"
      description="دکمه در شش واریانت و سه سایز، به‌همراه اکشن‌های تعاملی: تولتیپ، پاپ‌اور و منوی کشویی."
    >
      <Subsection id="buttons-variants" title="دکمه">
        <Demo name="Button" title="شش واریانت">
          <div className="row">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </Demo>

        <Demo name="Button" title="سایزها و حالت غیرفعال">
          <div className="row">
            <Button size="sm">کوچک</Button>
            <Button size="md">متوسط</Button>
            <Button size="lg">بزرگ</Button>
            <Button disabled>غیرفعال</Button>
          </div>
        </Demo>

        <Demo name="Button" title="ماتریس واریانت × سایز" span="wide">
          <div className="column">
            {BUTTON_SIZES.map((size) => (
              <div className="row" key={size}>
                {BUTTON_VARIANTS.map((variant) => (
                  <Button key={variant} variant={variant} size={size}>
                    {variant} / {size}
                  </Button>
                ))}
              </div>
            ))}
            <div className="row">
              {BUTTON_VARIANTS.map((variant) => (
                <Button key={variant} variant={variant} disabled>
                  {variant}
                </Button>
              ))}
            </div>
          </div>
        </Demo>

        <Demo name="Button" title="با آیکن و حالت بارگذاری">
          <div className="row">
            <Button>
              <Icon name="plus" size={16} />
              افزودن
            </Button>
            <Button variant="danger">
              <Icon name="trash" size={16} />
              حذف
            </Button>
            <Button variant="outline">
              <Icon name="mail" size={16} />
              ارسال ایمیل
            </Button>
            <Button onClick={simulateSave} disabled={saving}>
              {saving && <Spinner size="sm" />}
              {saving ? "در حال ذخیره..." : "ذخیره"}
            </Button>
          </div>
        </Demo>

        <Demo name="Button" title="عرض کامل، شمارنده و گروه دکمه">
          <div className="column">
            <Button style={{ width: "100%" }} onClick={() => setClicks((value) => value + 1)}>
              کلیک شده: {clicks.toLocaleString("fa-IR")}
            </Button>
            <div className="row" style={{ gap: 0 }}>
              <Button variant="outline" style={{ borderStartEndRadius: 0, borderEndEndRadius: 0 }}>
                روز
              </Button>
              <Button variant="outline" style={{ borderRadius: 0 }}>
                هفته
              </Button>
              <Button variant="outline" style={{ borderStartStartRadius: 0, borderEndStartRadius: 0 }}>
                ماه
              </Button>
            </div>
          </div>
        </Demo>
      </Subsection>

      <Subsection id="buttons-actions" title="اکشن‌های تعاملی">
        <Demo name="Tooltip" title="متن ساده و محتوای غنی">
          <div className="row">
            <Tooltip content="این یک توضیح کوتاه است">
              <Button variant="outline">هاور کن</Button>
            </Tooltip>
            <Tooltip
              content={
                <span>
                  میانبر: <strong>Ctrl + S</strong>
                </span>
              }
            >
              <Button variant="secondary">ذخیره</Button>
            </Tooltip>
            <Tooltip content="اعلان‌های جدید">
              <NotificationBadge count={5} variant="danger">
                <Button variant="ghost" aria-label="اعلان‌ها">
                  <Icon name="bell" />
                </Button>
              </NotificationBadge>
            </Tooltip>
            <Tooltip content="نمایه کاربر">
              <Avatar fallback="ف‌ج" />
            </Tooltip>
          </div>
        </Demo>

        <Demo name="Popover" title="تراز start و end">
          <div className="row">
            <Popover trigger={<Button variant="secondary">تراز start</Button>} align="start">
              محتوای popover با تراز start — می‌تواند هر چیزی باشد.
            </Popover>
            <Popover trigger={<Button variant="secondary">تراز end</Button>} align="end">
              محتوای popover با تراز end.
            </Popover>
          </div>
        </Demo>

        <Demo name="Popover" title="با فرم و لیست داخل آن">
          <div className="row">
            <Popover trigger={<Button variant="outline">ثبت نظر</Button>}>
              <div className="column" style={{ minWidth: 220 }}>
                <Rating value={4} readOnly />
                <Textarea placeholder="نظر شما..." rows={2} />
                <Button size="sm" onClick={() => showToast("نظر ثبت شد", "success")}>
                  ارسال
                </Button>
              </div>
            </Popover>
            <Popover trigger={<Button variant="outline">فیلترها</Button>} align="end">
              <div className="column" style={{ minWidth: 180 }}>
                <Checkbox label="فقط فعال‌ها" defaultChecked />
                <Checkbox label="فقط جدیدها" />
                <Switch label="مرتب‌سازی خودکار" />
              </div>
            </Popover>
          </div>
        </Demo>

        <Demo name="DropdownMenu" title="آیتم عادی، غیرفعال و danger" span="wide">
          <div className="row">
            <DropdownMenu trigger={<Button>عملیات</Button>}>
              <DropdownMenuItem onClick={() => showToast("ویرایش انجام شد", "info")}>
                ویرایش
              </DropdownMenuItem>
              <DropdownMenuItem disabled>اشتراک‌گذاری (غیرفعال)</DropdownMenuItem>
              <DropdownMenuItem danger onClick={() => showToast("حذف شد", "danger")}>
                حذف
              </DropdownMenuItem>
            </DropdownMenu>

            <DropdownMenu trigger={<Button variant="outline">منوی کاربر</Button>}>
              <DropdownMenuItem onClick={() => showToast("پروفایل", "info")}>
                پروفایل من
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => showToast("تنظیمات", "info")}>
                تنظیمات
              </DropdownMenuItem>
              <DropdownMenuItem danger onClick={() => showToast("خارج شدید", "info")}>
                خروج
              </DropdownMenuItem>
            </DropdownMenu>

            <DropdownMenu trigger={<Avatar fallback="س‌م" />}>
              <DropdownMenuItem onClick={() => showToast("سارا محمدی", "info")}>
                سارا محمدی
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => showToast("تغییر حساب", "info")}>
                تغییر حساب
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </Demo>
      </Subsection>
    </Section>
  );
}

const selectOptions: SelectOption[] = [
  { value: "tehran", label: "تهران" },
  { value: "isfahan", label: "اصفهان" },
  { value: "shiraz", label: "شیراز" },
  { value: "tabriz", label: "تبریز" },
];

const longSelectOptions: SelectOption[] = [
  "تهران",
  "مشهد",
  "اصفهان",
  "کرج",
  "شیراز",
  "تبریز",
  "قم",
  "اهواز",
  "کرمانشاه",
  "ارومیه",
  "رشت",
  "زاهدان",
].map((label, index) => ({ value: String(index), label }));

const comboboxOptions: ComboboxOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "qwik", label: "Qwik" },
];

type SignupValues = { name: string; email: string; city: string; terms: boolean };

const signupInitialValues: SignupValues = { name: "", email: "", city: "", terms: false };

function FormsSection() {
  const [city, setCity] = useState("");
  const [techStack, setTechStack] = useState<string[]>(["react"]);
  const [agree, setAgree] = useState(true);
  const [plan, setPlan] = useState("pro");
  const [notifications, setNotifications] = useState(false);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [features, setFeatures] = useState({ email: true, sms: false, push: true });
  const formRef = useRef<FormHandle<SignupValues>>(null);

  const usernameInvalid = username.length > 0 && !/^[a-z0-9_]{4,}$/.test(username);
  const allFeaturesOn = features.email && features.sms && features.push;

  return (
    <Section
      id="forms"
      number="۰۲"
      title="فرم‌ها"
      description="ورودی‌های متن، کنترل‌های انتخاب و کنترل‌های مقدار — همگی با پشتیبانی حالت خطا و غیرفعال."
    >
      <Subsection id="forms-text" title="ورودی متن">
        <Demo name="Input" title="عادی، خطا، غیرفعال و فقط‌خواندنی">
          <div className="column">
            <Input placeholder="نام کاربری" />
            <Input placeholder="ایمیل نامعتبر" error />
            <Input placeholder="غیرفعال" disabled />
            <Input defaultValue="مقدار اولیه" readOnly />
          </div>
        </Demo>

        <Demo name="Input" title="انواع type و جهت متن">
          <div className="column">
            <Input type="password" placeholder="رمز عبور" dir="ltr" />
            <Input type="email" placeholder="email@example.com" dir="ltr" />
            <Input type="number" placeholder="سن" min={0} max={120} />
            <Input type="search" placeholder="جستجو..." />
            <Input type="url" placeholder="https://" dir="ltr" />
          </div>
        </Demo>

        <Demo name="Input" title="کنترل‌شده با اعتبارسنجی لحظه‌ای">
          <div className="column">
            <Input
              placeholder="نام کاربری (حروف کوچک انگلیسی، حداقل ۴ کاراکتر)"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              error={usernameInvalid}
              dir="ltr"
            />
            {usernameInvalid && (
              <span className="fieldError">نام کاربری باید حداقل ۴ کاراکتر انگلیسی باشد</span>
            )}
            <Result>مقدار: {username || "—"}</Result>
          </div>
        </Demo>

        <Demo name="Textarea" title="عادی، autoResize، خطا و بدون تغییر اندازه">
          <div className="column">
            <Textarea placeholder="توضیحات..." rows={2} />
            <Textarea placeholder="با افزایش متن بزرگ می‌شود" autoResize rows={2} />
            <Textarea placeholder="متن با خطا" error rows={2} />
            <Textarea placeholder="غیرقابل تغییر اندازه" resizable={false} rows={2} />
          </div>
        </Demo>

        <Demo name="Textarea" title="کنترل‌شده با شمارنده کاراکتر">
          <div className="column">
            <Textarea
              placeholder="درباره خودتان بنویسید (حداکثر ۱۲۰ کاراکتر)"
              rows={3}
              maxLength={120}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              autoResize
            />
            <Result>
              {bio.length.toLocaleString("fa-IR")} / {(120).toLocaleString("fa-IR")}
            </Result>
          </div>
        </Demo>
      </Subsection>

      <Subsection id="forms-selection" title="انتخاب">
        <Demo name="Select" title="کنترل‌شده و غیرفعال">
          <div className="column">
            <Select
              options={selectOptions}
              value={city}
              onChange={setCity}
              placeholder="شهر را انتخاب کنید"
            />
            <Select options={selectOptions} placeholder="غیرفعال" disabled />
            <Result>انتخاب شما: {selectOptions.find((o) => o.value === city)?.label ?? "—"}</Result>
          </div>
        </Demo>

        <Demo name="Select" title="مقدار پیش‌فرض، لیست بلند و پیام خالی">
          <div className="column">
            <Select options={selectOptions} defaultValue="shiraz" />
            <Select options={longSelectOptions} placeholder="لیست بلند (قابل اسکرول)" />
            <Select options={[]} placeholder="بدون گزینه" emptyMessage="گزینه‌ای وجود ندارد" />
          </div>
        </Demo>

        <Demo name="Combobox" title="چندانتخابی با جستجو">
          <div className="column">
            <Combobox
              options={comboboxOptions}
              value={techStack}
              onChange={setTechStack}
              placeholder="فریمورک‌ها را انتخاب کنید"
            />
            <Result>انتخاب‌شده‌ها: {techStack.length ? techStack.join("، ") : "—"}</Result>
          </div>
        </Demo>

        <Demo name="Combobox" title="مقدار پیش‌فرض، غیرفعال و پیام خالی">
          <div className="column">
            <Combobox
              options={comboboxOptions}
              defaultValue={["vue", "svelte"]}
              placeholder="با مقدار پیش‌فرض"
            />
            <Combobox options={comboboxOptions} placeholder="غیرفعال" disabled />
            <Combobox options={[]} placeholder="بدون گزینه" emptyMessage="نتیجه‌ای یافت نشد" />
          </div>
        </Demo>

        <Demo name="Checkbox / Switch" title="تیک، سوییچ و حالت غیرفعال">
          <div className="column">
            <Checkbox
              label="قوانین را می‌پذیرم"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <Checkbox label="غیرفعال" disabled />
            <Checkbox label="غیرفعال و تیک‌خورده" disabled defaultChecked />
            <Switch
              label="اعلان‌ها"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <Switch label="غیرفعال" disabled />
            <Switch label="غیرفعال و روشن" disabled defaultChecked />
          </div>
        </Demo>

        <Demo name="Checkbox" title="گروه گزینه با انتخاب همه">
          <div className="column">
            <Checkbox
              label="انتخاب همه"
              checked={allFeaturesOn}
              onChange={(e) =>
                setFeatures({
                  email: e.target.checked,
                  sms: e.target.checked,
                  push: e.target.checked,
                })
              }
            />
            <Divider />
            <Checkbox
              label="ایمیل"
              checked={features.email}
              onChange={(e) => setFeatures((prev) => ({ ...prev, email: e.target.checked }))}
            />
            <Checkbox
              label="پیامک"
              checked={features.sms}
              onChange={(e) => setFeatures((prev) => ({ ...prev, sms: e.target.checked }))}
            />
            <Checkbox
              label="نوتیفیکیشن"
              checked={features.push}
              onChange={(e) => setFeatures((prev) => ({ ...prev, push: e.target.checked }))}
            />
          </div>
        </Demo>

        <Demo name="RadioGroup" title="گروه رادیو و حالت غیرفعال">
          <div className="column">
            <RadioGroup
              name="plan"
              value={plan}
              onChange={setPlan}
              options={[
                { value: "free", label: "رایگان" },
                { value: "pro", label: "حرفه‌ای" },
                { value: "enterprise", label: "سازمانی" },
              ]}
            />
            <RadioGroup
              name="plan-uncontrolled"
              defaultValue="b"
              options={[
                { value: "a", label: "گزینه الف" },
                { value: "b", label: "گزینه ب (پیش‌فرض)" },
              ]}
            />
            <RadioGroup
              name="plan-disabled"
              options={[{ value: "a", label: "گزینه غیرفعال" }]}
              disabled
            />
          </div>
        </Demo>
      </Subsection>

      <Subsection id="forms-value" title="کنترل مقدار">
        <FormsValueDemos />
      </Subsection>

      <Subsection id="forms-upload" title="آپلود فایل">
        <FileUploadDemos />
      </Subsection>

      <Subsection id="forms-validation" title="اعتبارسنجی فرم" wide>
        <Demo
          name="Form"
          title="قواعد declarative، touched، فوکوس روی اولین فیلد نامعتبر و کنترل با ref"
          span="wide"
        >
          <Form<SignupValues>
            ref={formRef}
            initialValues={signupInitialValues}
            rules={{
              name: { required: "نام الزامی است", minLength: [3, "نام باید حداقل ۳ حرف باشد"] },
              email: {
                required: "ایمیل الزامی است",
                pattern: [/^\S+@\S+\.\S+$/, "ایمیل معتبر نیست"],
              },
              city: { required: "شهر را انتخاب کنید" },
              terms: { required: "پذیرش قوانین الزامی است" },
            }}
            onSubmit={(values) => showToast(`خوش آمدید، ${values.name}`, "success")}
          >
            <div className="column">
              <Form.Field name="name">
                {(field, error, helpers) => (
                  <div className="column">
                    <Input placeholder="نام و نام خانوادگی" {...field} error={!!error} />
                    {error && (
                      <span className="fieldError" id={helpers.errorId}>
                        {error}
                      </span>
                    )}
                  </div>
                )}
              </Form.Field>

              <Form.Field name="email">
                {(field, error, helpers) => (
                  <div className="column">
                    <Input placeholder="ایمیل" dir="ltr" {...field} error={!!error} />
                    {error && (
                      <span className="fieldError" id={helpers.errorId}>
                        {error}
                      </span>
                    )}
                  </div>
                )}
              </Form.Field>

              <Form.Field name="city">
                {(field, error, helpers) => (
                  <div className="column">
                    <Select options={selectOptions} placeholder="شهر" {...field} />
                    {error && (
                      <span className="fieldError" id={helpers.errorId}>
                        {error}
                      </span>
                    )}
                  </div>
                )}
              </Form.Field>

              <Form.Field<boolean> name="terms">
                {(field, error, helpers) => (
                  <div className="column">
                    <Checkbox label="قوانین را می‌پذیرم" {...field} />
                    {error && (
                      <span className="fieldError" id={helpers.errorId}>
                        {error}
                      </span>
                    )}
                  </div>
                )}
              </Form.Field>

              <div className="row">
                <Button type="submit">ثبت‌نام</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    formRef.current?.setValues({
                      name: "سارا محمدی",
                      email: "sara@example.com",
                      city: "isfahan",
                      terms: true,
                    })
                  }
                >
                  پر کردن نمونه
                </Button>
                <Button type="button" variant="outline" onClick={() => formRef.current?.reset()}>
                  بازنشانی
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    showToast(JSON.stringify(formRef.current?.getValues()), "info", 4000)
                  }
                >
                  نمایش مقادیر
                </Button>
              </div>
            </div>
          </Form>
        </Demo>
      </Subsection>
    </Section>
  );
}

function FormsValueDemos() {
  const [volume, setVolume] = useState(40);
  const [priceRange, setPriceRange] = useState<SliderRangeValue>({ min: 20, max: 80 });
  const [otp, setOtp] = useState("");
  const [rating, setRating] = useState(3);
  const [temperature, setTemperature] = useState(22);
  const [tenStars, setTenStars] = useState(7);

  return (
    <>
      <Demo name="Slider" title="تکی و بازه‌ای (range)">
        <div className="column">
          <Slider label="صدا" value={volume} onChange={setVolume} showValue />
          <Slider
            label="بازه قیمت"
            range
            value={priceRange}
            onChange={setPriceRange}
            min={0}
            max={100}
            step={5}
            showValue
          />
        </div>
      </Demo>

      <Demo name="Slider" title="فرمت مقدار، گام و غیرفعال">
        <div className="column">
          <Slider
            label="دما"
            value={temperature}
            onChange={setTemperature}
            min={10}
            max={35}
            showValue
            formatValue={(value) => `${value.toLocaleString("fa-IR")}°C`}
          />
          <Slider label="گام ۱۰" defaultValue={50} step={10} showValue />
          <Slider label="غیرفعال" defaultValue={30} disabled />
        </div>
      </Demo>

      <Demo name="OtpInput" title="کد تایید — عادی، خطا و onComplete">
        <div className="column">
          <OtpInput
            length={5}
            value={otp}
            onChange={setOtp}
            onComplete={(code) => showToast(`کد تایید: ${code}`, "success")}
          />
          <OtpInput length={4} value="12" onChange={() => {}} error />
        </div>
      </Demo>

      <Demo name="OtpInput" title="شش رقمی، پیش‌فرض و غیرفعال">
        <div className="column">
          <OtpInput length={6} defaultValue="123" />
          <OtpInput length={4} defaultValue="1234" disabled />
        </div>
      </Demo>

      <Demo name="Rating" title="تعاملی و فقط‌خواندنی">
        <div className="column">
          <Rating value={rating} onChange={setRating} />
          <Rating value={4} readOnly />
          <Result>امتیاز: {rating.toLocaleString("fa-IR")}</Result>
        </div>
      </Demo>

      <Demo name="Rating" title="ده ستاره و نیمه‌پر">
        <div className="column">
          <Rating max={10} value={tenStars} onChange={setTenStars} />
          <Rating max={3} value={2} readOnly />
        </div>
      </Demo>
    </>
  );
}

function FileUploadDemos() {
  const [imageFiles, setImageFiles] = useState<UploadedFile[]>([]);
  const [listFiles, setListFiles] = useState<UploadedFile[]>([]);
  const [simulated, setSimulated] = useState<UploadedFile[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach((timer) => window.clearInterval(timer));
  }, []);

  function handleSimulatedChange(next: UploadedFile[]) {
    const known = new Set(simulated.map((item) => item.id));
    const fresh = next.filter((item) => !known.has(item.id));

    setSimulated(
      next.map((item) =>
        known.has(item.id) ? item : { ...item, status: "uploading", progress: 0 },
      ),
    );

    fresh.forEach((file) => {
      let progress = 0;
      const tooLarge = (file.size ?? 0) > 1024 * 1024;
      const timer = window.setInterval(() => {
        progress += 20;
        setSimulated((prev) =>
          prev.map((item) => {
            if (item.id !== file.id) return item;
            if (progress < 100) return { ...item, progress };
            return tooLarge
              ? { ...item, status: "error", progress: 100, errorMessage: "حجم فایل بیش از ۱ مگابایت" }
              : { ...item, status: "success", progress: 100 };
          }),
        );
        if (progress >= 100) window.clearInterval(timer);
      }, 400);
      timers.current.push(timer);
    });
  }

  return (
    <>
      <Demo name="FileUpload" title="پیش‌نمایش تصویر با اعتبارسنجی حجم و نوع">
        <FileUpload
          label="آپلود تصویر"
          hint="حداکثر ۲ مگابایت — فقط تصویر"
          accept="image/*"
          maxSize={2 * 1024 * 1024}
          variant="preview"
          files={imageFiles}
          onChange={(next) => {
            if (next.length > imageFiles.length) showToast("فایل انتخاب شد", "success");
            setImageFiles(next);
          }}
          onRejected={(rejected) => rejected.forEach((r) => showToast(r.message, "danger"))}
        />
      </Demo>

      <Demo name="FileUpload" title="لیست فایل‌ها با پیشرفت و حذف" span="wide">
        <FileUpload
          label="فایل‌ها را بکشید و رها کنید"
          hint="چند فایل، حداکثر ۳ عدد"
          multiple
          maxFiles={3}
          name="attachments"
          files={listFiles}
          onChange={setListFiles}
          onRejected={(rejected) => rejected.forEach((r) => showToast(r.message, "danger"))}
        />
      </Demo>

      <Demo name="FileUpload" title="شبیه‌سازی آپلود: پیشرفت، موفقیت و خطا (فایل بالای ۱ مگابایت)" span="wide">
        <FileUpload
          label="فایل‌ها را برای آپلود انتخاب کنید"
          hint="فایل‌های بالای ۱ مگابایت با خطا مواجه می‌شوند"
          multiple
          files={simulated}
          onChange={handleSimulatedChange}
        />
      </Demo>

      <Demo name="FileUpload" title="حالت uncontrolled با validate سفارشی">
        <FileUpload
          label="فقط PDF"
          hint="نام فایل نباید شامل فاصله باشد"
          accept="application/pdf"
          multiple
          validate={(file) => (file.name.includes(" ") ? "نام فایل نباید فاصله داشته باشد" : null)}
          onRejected={(rejected) => rejected.forEach((r) => showToast(r.message, "danger"))}
        />
      </Demo>

      <Demo name="FileUpload" title="غیرفعال و بدون مودال پیش‌نمایش">
        <div className="column">
          <FileUpload label="آپلود غیرفعال" disabled />
          <FileUpload
            label="بدون مودال پیش‌نمایش"
            accept="image/*"
            enablePreviewModal={false}
            multiple
          />
        </div>
      </Demo>
    </>
  );
}

function DateTimeSection() {
  return (
    <Section
      id="datetime"
      number="۰۳"
      title="تاریخ و زمان"
      description="انتخاب تاریخ با تقویم جلالی (به‌همراه نمایش میلادی)، انتخاب بازه تاریخ و انتخاب ساعت."
    >
      <DatePickerDemos />
      <DateRangeDemos />
      <TimePickerDemos />
    </Section>
  );
}

function DatePickerDemos() {
  const [date, setDate] = useState<DatePickerValue | null>(null);
  const [birthday, setBirthday] = useState<DatePickerValue | null>(null);

  const age = birthday ? new Date().getFullYear() - jalaliToGregorian(birthday.jalali).getFullYear() : null;

  return (
    <Subsection id="datetime-picker" title="انتخاب تاریخ">
      <Demo name="DatePicker" title="حالت تقویم — کنترل‌شده">
        <DatePicker value={date} onChange={setDate} placeholder="تاریخ را انتخاب کنید" />
        {date && <Result>انتخاب شما: {formatJalali(date.jalali)}</Result>}
      </Demo>

      <Demo name="DatePicker" title="با زمان، دکمه امروز و حالت scroll">
        <div className="column">
          <DatePicker placeholder="تاریخ و زمان" showTime showTodayButton includeGregorian />
          <DatePicker placeholder="حالت اسکرول" mode="scroll" />
          <DatePicker placeholder="غیرفعال" disabled />
        </div>
      </Demo>

      <Demo name="DatePicker" title="مقدار اولیه (امروز) و محدوده مجاز">
        <DatePicker
          defaultValue={{ jalali: gregorianToJalali(new Date()) }}
          minDate={{ year: 1400, month: 1, day: 1 }}
          maxDate={{ year: 1410, month: 12, day: 29 }}
          placeholder="با مقدار اولیه (امروز)"
        />
      </Demo>

      <Demo name="DatePicker" title="غیرفعال کردن جمعه‌ها (disabledDates)">
        <DatePicker
          placeholder="جمعه‌ها قابل انتخاب نیستند"
          disabledDates={(day) => day.getDay() === 5}
          showTodayButton
        />
      </Demo>

      <Demo name="DatePicker" title="فقط از امروز به بعد (minDate میلادی)">
        <DatePicker placeholder="رزرو از امروز به بعد" minDate={new Date()} showTodayButton />
      </Demo>

      <Demo name="DatePicker" title="تاریخ تولد با محاسبه سن، حالت scroll">
        <div className="column">
          <DatePicker
            mode="scroll"
            value={birthday}
            onChange={setBirthday}
            placeholder="تاریخ تولد"
            maxDate={new Date()}
          />
          {age !== null && <Result>سن تقریبی: {age.toLocaleString("fa-IR")} سال</Result>}
        </div>
      </Demo>
    </Subsection>
  );
}

function DateRangeDemos() {
  const [range, setRange] = useState<DateRangeValue | null>(null);

  return (
    <Subsection id="datetime-range" title="بازه تاریخ">
      <Demo name="DateRangePicker" title="انتخاب تاریخ شروع و پایان" span="wide">
        <DateRangePicker value={range} onChange={setRange} placeholder="بازه تاریخ را انتخاب کنید" />
        {range && (
          <Result>
            از {formatJalali(range.start)} تا {formatJalali(range.end)}
          </Result>
        )}
      </Demo>

      <Demo name="DateRangePicker" title="با تاریخ میلادی و غیرفعال">
        <div className="column">
          <DateRangePicker placeholder="بازه با تاریخ میلادی" includeGregorian />
          <DateRangePicker placeholder="غیرفعال" disabled />
        </div>
      </Demo>

      <Demo name="DateRangePicker" title="محدوده مجاز و مقدار اولیه">
        <div className="column">
          <DateRangePicker
            placeholder="فقط سال ۱۴۰۵"
            minDate={{ year: 1405, month: 1, day: 1 }}
            maxDate={{ year: 1405, month: 12, day: 29 }}
          />
          <DateRangePicker
            defaultValue={{
              start: { year: 1405, month: 1, day: 1 },
              end: { year: 1405, month: 1, day: 15 },
            }}
          />
        </div>
      </Demo>

      <Demo name="DateRangePicker" title="بدون جمعه‌ها (disabledDates)">
        <DateRangePicker
          placeholder="روزهای کاری"
          disabledDates={(day) => day.getDay() === 5}
        />
      </Demo>
    </Subsection>
  );
}

function TimePickerDemos() {
  const [time, setTime] = useState({ hour: 14, minute: 30 });

  return (
    <Subsection id="datetime-time" title="انتخاب ساعت">
      <Demo name="TimePicker" title="فرمت ۲۴ ساعته و ۱۲ ساعته با ثانیه">
        <div className="column">
          <TimePicker value={time} onChange={setTime} placeholder="ساعت (۲۴ ساعته)" />
          <TimePicker
            value={time}
            onChange={setTime}
            format="12h"
            showSeconds
            placeholder="ساعت (۱۲ ساعته)"
          />
          <Result>
            ساعت انتخابی: {String(time.hour).padStart(2, "0")}:{String(time.minute).padStart(2, "0")}
          </Result>
        </div>
      </Demo>

      <Demo name="TimePicker" title="شروع از صفر، ساعت جاری و غیرفعال">
        <div className="column">
          <TimePicker placeholder="شروع از ۰۰:۰۰" defaultTime="zero" />
          <TimePicker placeholder="شروع از ساعت جاری" defaultTime="current" />
          <TimePicker placeholder="با ثانیه" showSeconds defaultValue={{ hour: 9, minute: 5, second: 30 }} />
          <TimePicker placeholder="غیرفعال" disabled />
        </div>
      </Demo>
    </Subsection>
  );
}

function FeedbackSection() {
  return (
    <Section
      id="feedback"
      number="۰۴"
      title="بازخورد و وضعیت"
      description="پیام‌های سیستمی، نشانگرهای بارگذاری و پیشرفت، نشان‌ها و دیالوگ تایید عملیات."
    >
      <MessageDemos />
      <LoadingDemos />
      <BadgeDemos />
      <ConfirmDemo />
    </Section>
  );
}

const toastPositionOptions: SelectOption[] = [
  { value: "top-right", label: "بالا راست" },
  { value: "top-center", label: "بالا وسط" },
  { value: "top-left", label: "بالا چپ" },
  { value: "bottom-right", label: "پایین راست" },
  { value: "bottom-center", label: "پایین وسط" },
  { value: "bottom-left", label: "پایین چپ" },
];

function MessageDemos() {
  const [toastPosition, setToastPosition] = useState<ToastPosition>("bottom-center");
  const [showAlert, setShowAlert] = useState(true);

  return (
    <Subsection id="feedback-messages" title="پیام‌ها">
      <Demo name="Alert" title="چهار واریانت + قابل بستن" span="wide">
        <div className="column">
          <Alert variant="info">پیام اطلاع‌رسانی برای کاربر.</Alert>
          <Alert variant="success">عملیات با موفقیت انجام شد.</Alert>
          <Alert variant="warning">دقت کنید، این عملیات قابل بازگشت نیست.</Alert>
          <Alert variant="danger" closable onClose={() => showToast("Alert بسته شد", "info")}>
            خطایی رخ داده است.
          </Alert>
        </div>
      </Demo>

      <Demo name="Alert" title="آیکن سفارشی، محتوای غنی و closeLabel">
        <div className="column">
          <Alert variant="info" icon={<Icon name="bell" size={18} />}>
            شما ۳ اعلان خوانده‌نشده دارید.
          </Alert>
          <Alert variant="warning" closable closeLabel="بستن هشدار">
            اشتراک شما تا <strong>۳ روز</strong> دیگر به پایان می‌رسد.{" "}
            <a href="#compose">تمدید اشتراک</a>
          </Alert>
          <Alert variant="success" icon={<Icon name="star" size={18} />}>
            به سطح طلایی ارتقا یافتید!
          </Alert>
        </div>
      </Demo>

      <Demo name="Alert" title="نمایش شرطی و بازگردانی">
        <div className="column">
          {showAlert ? (
            <Alert variant="danger" closable onClose={() => setShowAlert(false)}>
              پرداخت شما ناموفق بود. لطفاً دوباره تلاش کنید.
            </Alert>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setShowAlert(true)}>
              نمایش دوباره هشدار
            </Button>
          )}
        </div>
      </Demo>

      <Demo name="Toast" title="سه واریانت + انتخاب موقعیت — با کلیک اجرا شود" span="wide">
        <div className="row">
          <Select
            options={toastPositionOptions}
            value={toastPosition}
            onChange={(value) => setToastPosition(value as ToastPosition)}
          />
          <Button variant="secondary" onClick={() => showToast("پیام اطلاع‌رسانی", "info")}>
            Toast اطلاع‌رسانی
          </Button>
          <Button variant="success" onClick={() => showToast("با موفقیت ذخیره شد", "success")}>
            Toast موفقیت
          </Button>
          <Button variant="danger" onClick={() => showToast("حذف ناموفق بود", "danger", 5000)}>
            Toast خطا (۵ ثانیه)
          </Button>
        </div>
      </Demo>

      <Demo name="Toast" title="پیام بلند، مدت‌زمان‌های مختلف و صف چندتایی" span="wide">
        <div className="row">
          <Button
            variant="outline"
            onClick={() =>
              showToast(
                "این یک پیام طولانی است تا رفتار Toast با متن چندخطی و عرض محدود بررسی شود.",
                "info",
                6000,
              )
            }
          >
            پیام بلند
          </Button>
          <Button variant="outline" onClick={() => showToast("پیام کوتاه (۱ ثانیه)", "success", 1000)}>
            ۱ ثانیه
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              showToast("مرحله ۱ انجام شد", "info");
              showToast("مرحله ۲ انجام شد", "success");
              showToast("مرحله ۳ با خطا مواجه شد", "danger");
            }}
          >
            سه Toast پشت‌سرهم
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              for (let i = 1; i <= 7; i += 1) showToast(`پیام شماره ${i.toLocaleString("fa-IR")}`, "info", 4000);
            }}
          >
            ۷ Toast (حداکثر ۵ نمایش)
          </Button>
        </div>
      </Demo>

      <Toaster position={toastPosition} />
    </Subsection>
  );
}

function LoadingDemos() {
  const [progress, setProgress] = useState(35);
  const [running, setRunning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          setRunning(false);
          return 100;
        }
        return value + 5;
      });
    }, 200);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <Subsection id="feedback-loading" title="بارگذاری و پیشرفت">
      <Demo name="Spinner" title="سه سایز">
        <div className="row">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </Demo>

      <Demo name="Spinner" title="کنار متن و داخل دکمه‌ها">
        <div className="column">
          <div className="row">
            <Spinner size="sm" />
            <span>در حال بارگذاری...</span>
          </div>
          <div className="row">
            <Button disabled>
              <Spinner size="sm" />
              در حال ارسال
            </Button>
            <Button variant="outline" disabled>
              <Spinner size="sm" />
              لطفاً صبر کنید
            </Button>
          </div>
        </div>
      </Demo>

      <Demo name="Skeleton" title="متن، دایره و مستطیل">
        <div className="column">
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <div className="row">
            <Skeleton variant="circle" width={48} height={48} />
            <div className="column">
              <Skeleton variant="text" width={120} />
              <Skeleton variant="text" width={80} />
            </div>
          </div>
          <Skeleton variant="rectangle" height={80} />
        </div>
      </Demo>

      <Demo name="Skeleton" title="جایگزین محتوا تا پایان بارگذاری">
        <div className="column">
          <Switch label="بارگذاری شد" checked={loaded} onChange={(e) => setLoaded(e.target.checked)} />
          <Card>
            {loaded ? (
              <div className="row">
                <Avatar fallback="س‌م" size="lg" />
                <div className="column" style={{ gap: 2 }}>
                  <strong>سارا محمدی</strong>
                  <span className="muted">مهندس نرم‌افزار — اصفهان</span>
                </div>
              </div>
            ) : (
              <div className="row">
                <Skeleton variant="circle" width={48} height={48} />
                <div className="column">
                  <Skeleton variant="text" width={140} />
                  <Skeleton variant="text" width={100} />
                </div>
              </div>
            )}
          </Card>
        </div>
      </Demo>

      <Demo name="ProgressBar" title="کنترل‌شده، واریانت‌ها و indeterminate" span="wide">
        <div className="column">
          <ProgressBar label="دانلود" value={progress} showValue />
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            aria-label="کنترل پیشرفت"
          />
          <div className="row">
            <ProgressBar value={80} variant="success" />
            <ProgressBar value={55} variant="danger" showValue />
          </div>
          <ProgressBar indeterminate />
        </div>
      </Demo>

      <Demo name="ProgressBar" title="شبیه‌سازی دانلود با شروع و توقف" span="wide">
        <div className="column">
          <ProgressBar
            label={progress >= 100 ? "تکمیل شد" : "در حال دانلود"}
            value={progress}
            variant={progress >= 100 ? "success" : "primary"}
            showValue
          />
          <div className="row">
            <Button
              size="sm"
              onClick={() => {
                if (progress >= 100) setProgress(0);
                setRunning(true);
              }}
              disabled={running}
            >
              شروع
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setRunning(false)} disabled={!running}>
              توقف
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setRunning(false);
                setProgress(0);
              }}
            >
              بازنشانی
            </Button>
          </div>
        </div>
      </Demo>
    </Subsection>
  );
}

function BadgeDemos() {
  const [unread, setUnread] = useState(4);

  return (
    <Subsection id="feedback-badges" title="نشان‌ها">
      <Demo name="Badge" title="چهار واریانت">
        <div className="row">
          <Badge>پیش‌فرض</Badge>
          <Badge variant="success">موفق</Badge>
          <Badge variant="danger">خطر</Badge>
          <Badge variant="secondary">ثانویه</Badge>
        </div>
      </Demo>

      <Demo name="Badge" title="کنار متن و داخل لیست">
        <div className="column">
          <div className="row">
            <span>وضعیت سفارش:</span>
            <Badge variant="success">تحویل شد</Badge>
          </div>
          <div className="row">
            <span>وضعیت پرداخت:</span>
            <Badge variant="danger">ناموفق</Badge>
          </div>
          <div className="row">
            <span>برچسب‌ها:</span>
            <Badge>جدید</Badge>
            <Badge variant="secondary">پرفروش</Badge>
            <Badge variant="success">تخفیف‌دار</Badge>
          </div>
        </div>
      </Demo>

      <Demo name="NotificationBadge" title="شمارنده روی المان و حالت صفر">
        <div className="row">
          <NotificationBadge count={3} variant="danger">
            <Button variant="outline">صندوق</Button>
          </NotificationBadge>
          <NotificationBadge count={0} showZero>
            <Button variant="outline">بدون آیتم</Button>
          </NotificationBadge>
          <NotificationBadge count={0}>
            <Button variant="outline">مخفی (صفر)</Button>
          </NotificationBadge>
        </div>
      </Demo>

      <Demo name="NotificationBadge" title="تعاملی، عدد بزرگ و روی آواتار">
        <div className="row">
          <NotificationBadge count={unread} variant="danger">
            <Button variant="ghost" aria-label="اعلان‌ها" onClick={() => setUnread((value) => Math.max(0, value - 1))}>
              <Icon name="bell" />
            </Button>
          </NotificationBadge>
          <Button size="sm" variant="secondary" onClick={() => setUnread((value) => value + 1)}>
            اعلان جدید
          </Button>
          <NotificationBadge count={128}>
            <Avatar fallback="ع‌ر" />
          </NotificationBadge>
        </div>
      </Demo>
    </Subsection>
  );
}

function ConfirmDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  function handleConfirm() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      showToast("حساب کاربری حذف شد", "success");
    }, 1500);
  }

  return (
    <Subsection id="feedback-confirm" title="تایید عملیات" wide>
      <Demo name="ConfirmDialog" title="حالت danger با شبیه‌سازی loading" span="wide">
        <div className="row">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            حذف حساب کاربری
          </Button>
        </div>
        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={handleConfirm}
          title="حذف حساب کاربری"
          message="آیا از حذف حساب کاربری خود اطمینان دارید؟ این عملیات قابل بازگشت نیست."
          confirmLabel="بله، حذف کن"
          danger
          loading={loading}
        />
      </Demo>

      <Demo name="ConfirmDialog" title="حالت عادی با برچسب‌های سفارشی و پیام غنی" span="wide">
        <div className="row">
          <Button onClick={() => setPublishOpen(true)}>انتشار مقاله</Button>
        </div>
        <ConfirmDialog
          open={publishOpen}
          onClose={() => setPublishOpen(false)}
          onConfirm={() => {
            setPublishOpen(false);
            showToast("مقاله منتشر شد", "success");
          }}
          title="انتشار مقاله"
          message={
            <span>
              مقاله <strong>«آشنایی با FaraUI»</strong> برای همه کاربران قابل مشاهده خواهد بود.
            </span>
          }
          confirmLabel="منتشر کن"
          cancelLabel="فعلاً نه"
        />
      </Demo>
    </Subsection>
  );
}

type User = { id: string; name: string; age: number; city: string; status: "active" | "pending" | "blocked" };

const STATUS_LABELS: Record<User["status"], string> = {
  active: "فعال",
  pending: "در انتظار",
  blocked: "مسدود",
};

const baseUsers: Omit<User, "id" | "status">[] = [
  { name: "فاروق جمالی", age: 32, city: "تهران" },
  { name: "سارا محمدی", age: 28, city: "اصفهان" },
  { name: "علی رضایی", age: 41, city: "شیراز" },
  { name: "مریم کریمی", age: 24, city: "تبریز" },
  { name: "حسین نوری", age: 36, city: "مشهد" },
  { name: "نگار احمدی", age: 30, city: "تهران" },
  { name: "بهرام صادقی", age: 45, city: "رشت" },
];

const statuses: User["status"][] = ["active", "pending", "blocked"];

const users: User[] = baseUsers.map((user, index) => ({
  ...user,
  id: String(index + 1),
  status: statuses[index % statuses.length],
}));

const manyUsers: User[] = Array.from({ length: 36 }, (_, index) => {
  const base = baseUsers[index % baseUsers.length];
  return {
    ...base,
    id: String(index + 1),
    age: base.age + (index % 5),
    status: statuses[index % statuses.length],
  };
});

const userColumns: TableColumn<User>[] = [
  { key: "name", header: "نام", sortable: true, filterable: true },
  { key: "age", header: "سن", sortable: true, accessor: (row) => row.age },
  { key: "city", header: "شهر", sortable: true, filterable: true },
];

const userColumnsWithStatus: TableColumn<User>[] = [
  ...userColumns,
  {
    key: "status",
    header: "وضعیت",
    sortable: true,
    accessor: (row) => STATUS_LABELS[row.status],
    render: (row) => (
      <Badge variant={row.status === "active" ? "success" : row.status === "blocked" ? "danger" : "secondary"}>
        {STATUS_LABELS[row.status]}
      </Badge>
    ),
  },
  {
    key: "actions",
    header: "عملیات",
    render: (row) => (
      <Button size="sm" variant="ghost" onClick={() => showToast(`ویرایش ${row.name}`, "info")}>
        ویرایش
      </Button>
    ),
  },
];

const timelineItems: TimelineItem[] = [
  {
    title: "ثبت سفارش",
    description: "سفارش شما با موفقیت ثبت شد",
    timestamp: "۱۴۰۴/۰۶/۱۲ — ۱۰:۳۰",
    variant: "primary",
  },
  {
    title: "پرداخت",
    description: "پرداخت آنلاین انجام شد",
    timestamp: "۱۴۰۴/۰۶/۱۲ — ۱۰:۳۵",
    variant: "primary",
  },
  {
    title: "ارسال",
    description: "بسته به پست تحویل داده شد",
    timestamp: "۱۴۰۴/۰۶/۱۴ — ۰۹:۰۰",
    variant: "secondary",
  },
  { title: "تحویل", description: "در انتظار تحویل به مشتری", variant: "secondary" },
];

const stepperSteps: StepperStep[] = [
  { label: "اطلاعات شخصی", description: "نام و مشخصات" },
  { label: "آدرس", description: "آدرس تحویل سفارش" },
  { label: "پرداخت", description: "انتخاب روش پرداخت" },
];

const wizardSteps: StepperStep[] = [
  {
    label: "حساب کاربری",
    description: "ایمیل و رمز عبور",
    content: (
      <div className="column">
        <Input placeholder="ایمیل" dir="ltr" />
        <Input type="password" placeholder="رمز عبور" dir="ltr" />
      </div>
    ),
  },
  {
    label: "پروفایل",
    description: "اطلاعات نمایشی",
    content: (
      <div className="column">
        <Input placeholder="نام نمایشی" />
        <Textarea placeholder="درباره من" rows={2} />
      </div>
    ),
  },
  {
    label: "تایید",
    description: "بررسی نهایی",
    content: <Alert variant="success">همه چیز آماده است. روی «پایان» کلیک کنید.</Alert>,
  },
];

function DataDisplaySection() {
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "خانه", href: "#" },
    { label: "محصولات", href: "#" },
    { label: "کتابخانه رابط کاربری", href: "#" },
    { label: "جزئیات محصول" },
  ];

  return (
    <Section
      id="data"
      number="۰۵"
      title="نمایش داده"
      description="جدول داده با قابلیت‌های کامل، کارت و اجزای محتوایی، و کامپوننت‌های نمایش روند."
    >
      <TableDemo onSelectionChange={setSelectedRows} selectedCount={selectedRows.length} />

      <ContentDemos breadcrumbItems={breadcrumbItems} />

      <DataFlowDemos />
    </Section>
  );
}

function TableDemo({
  onSelectionChange,
  selectedCount,
}: {
  onSelectionChange: (rows: User[]) => void;
  selectedCount: number;
}) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["2"]);
  const [loading, setLoading] = useState(false);

  function reload() {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1500);
  }

  return (
    <Subsection id="data-table" title="جدول" wide>
      <Demo
        name="Table"
        title="مرتب‌سازی + فیلتر ستون + جستجوی سراسری + صفحه‌بندی + انتخاب ردیف"
        span="wide"
      >
        <Table<User>
          columns={userColumns}
          data={users}
          rowKey={(row) => row.id}
          emptyMessage="داده‌ای موجود نیست"
          sorting={{ enabled: true }}
          filtering={{ enabled: true }}
          globalSearch={{ enabled: true, placeholder: "جستجو در جدول..." }}
          pagination={{ enabled: true, pageSize: 5, pageSizeOptions: [5, 10] }}
          selection={{
            enabled: true,
            onChange: (_keys, rows) => onSelectionChange(rows),
          }}
        />
        {selectedCount > 0 && <Result>{selectedCount.toLocaleString("fa-IR")} ردیف انتخاب شده است</Result>}
      </Demo>

      <Demo name="Table" title="سلول سفارشی (Badge و دکمه)، ارتفاع محدود و صفحه‌بندی" span="wide">
        <Table<User>
          columns={userColumnsWithStatus}
          data={manyUsers}
          rowKey={(row) => row.id}
          maxHeight="320px"
          sorting={{ enabled: true }}
          pagination={{ enabled: true, pageSize: 10, pageSizeOptions: [10, 20, 36] }}
        />
      </Demo>

      <Demo name="Table" title="انتخاب کنترل‌شده با selectedKeys" span="wide">
        <div className="row">
          <Button size="sm" variant="secondary" onClick={() => setSelectedKeys(users.map((u) => u.id))}>
            انتخاب همه
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedKeys([])}>
            پاک کردن انتخاب
          </Button>
          <Result>کلیدهای انتخابی: {selectedKeys.length ? selectedKeys.join("، ") : "—"}</Result>
        </div>
        <Table<User>
          columns={userColumns}
          data={users}
          rowKey={(row) => row.id}
          selection={{
            enabled: true,
            selectedKeys,
            onChange: (keys) => setSelectedKeys(keys),
          }}
        />
      </Demo>

      <Demo name="Table" title="حالت loading و حالت خالی" span="wide">
        <div className="row">
          <Button size="sm" onClick={reload}>
            بارگذاری مجدد
          </Button>
        </div>
        <Table<User> columns={userColumns} data={users.slice(0, 4)} rowKey={(row) => row.id} loading={loading} />
        <Table<User>
          columns={userColumns}
          data={[]}
          rowKey={(row) => row.id}
          emptyMessage="هیچ کاربری یافت نشد"
        />
      </Demo>

      <ServerTableDemo />
    </Subsection>
  );
}

function ServerTableDemo() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sort, setSort] = useState<SortState>({ key: null, direction: null });
  const [loaded, setLoaded] = useState<{ key: string; rows: User[] }>({ key: "", rows: [] });

  const requestKey = `${page}|${pageSize}|${sort.key}|${sort.direction}`;
  const loading = loaded.key !== requestKey;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const sorted = [...manyUsers];
      if (sort.key && sort.direction) {
        const key = sort.key as keyof User;
        const factor = sort.direction === "asc" ? 1 : -1;
        sorted.sort((a, b) => {
          const left = a[key];
          const right = b[key];
          if (typeof left === "number" && typeof right === "number") return (left - right) * factor;
          return String(left).localeCompare(String(right), "fa") * factor;
        });
      }
      const start = (page - 1) * pageSize;
      setLoaded({ key: requestKey, rows: sorted.slice(start, start + pageSize) });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [requestKey, page, pageSize, sort]);

  return (
    <Demo name="Table" title="حالت server — مرتب‌سازی و صفحه‌بندی سمت سرور (شبیه‌سازی‌شده)" span="wide">
      <Table<User>
        columns={userColumns}
        data={loaded.rows}
        rowKey={(row) => row.id}
        loading={loading}
        sorting={{ enabled: true, mode: "server", state: sort, onChange: setSort }}
        pagination={{
          enabled: true,
          mode: "server",
          page,
          pageSize,
          totalItems: manyUsers.length,
          pageSizeOptions: [5, 10],
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setPageSize(size);
            setPage(1);
          },
        }}
      />
      <Result>
        صفحه {page.toLocaleString("fa-IR")} — مرتب‌سازی: {sort.key ?? "ندارد"} {sort.direction ?? ""}
      </Result>
    </Demo>
  );
}

function ContentDemos({ breadcrumbItems }: { breadcrumbItems: BreadcrumbItem[] }) {
  const [tags, setTags] = useState(["React", "TypeScript", "Vite", "CSS Modules"]);
  const [tagInput, setTagInput] = useState("");
  const [filter, setFilter] = useState("all");

  function addTag() {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) return;
    setTags((prev) => [...prev, value]);
    setTagInput("");
  }

  return (
    <Subsection id="data-content" title="کارت و محتوا">
      <Demo name="Card" title="محتوای دلخواه داخل کارت">
        <Card>
          <h3 style={{ margin: 0, fontSize: 16 }}>عنوان کارت</h3>
          <p style={{ margin: 0, color: "var(--fara-color-text-secondary)", fontSize: 14 }}>
            متن توضیحات کارت. می‌توانید هر محتوایی داخل آن قرار دهید.
          </p>
          <Button size="sm">اقدام</Button>
        </Card>
      </Demo>

      <Demo name="Card" title="کارت پروفایل با آواتار، نشان و اکشن‌ها">
        <Card>
          <div className="row">
            <Avatar fallback="س‌م" size="lg" />
            <div className="column" style={{ gap: 2, flex: 1 }}>
              <strong>سارا محمدی</strong>
              <span className="muted">مهندس نرم‌افزار — اصفهان</span>
            </div>
            <Badge variant="success">آنلاین</Badge>
          </div>
          <Divider />
          <div className="row">
            <Button size="sm">دنبال کردن</Button>
            <Button size="sm" variant="outline">
              پیام
            </Button>
            <DropdownMenu trigger={<Button size="sm" variant="ghost">بیشتر</Button>}>
              <DropdownMenuItem onClick={() => showToast("گزارش شد", "info")}>گزارش</DropdownMenuItem>
              <DropdownMenuItem danger onClick={() => showToast("مسدود شد", "danger")}>
                مسدود کردن
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </Card>
      </Demo>

      <Demo name="Card" title="کارت محصول با امتیاز و نشان">
        <Card>
          <Skeleton variant="rectangle" height={90} />
          <div className="row" style={{ justifyContent: "space-between" }}>
            <strong>هدفون بی‌سیم</strong>
            <Badge variant="danger">۲۰٪ تخفیف</Badge>
          </div>
          <Rating value={4} readOnly />
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span>{(1850000).toLocaleString("fa-IR")} تومان</span>
            <Button size="sm">افزودن به سبد</Button>
          </div>
        </Card>
      </Demo>

      <Demo name="Avatar" title="سه سایز، fallback و خطای تصویر">
        <div className="row">
          <Avatar size="sm" fallback="ف‌ج" />
          <Avatar size="md" fallback="ف‌ج" />
          <Avatar size="lg" fallback="FJ" />
          <Avatar src="invalid-url.jpg" alt="کاربر" fallback="خطا" />
        </div>
      </Demo>

      <Demo name="Avatar" title="گروه آواتار هم‌پوشان و با نشان وضعیت">
        <div className="column">
          <div className="row" style={{ gap: 0 }}>
            {["ف‌ج", "س‌م", "ع‌ر", "م‌ک"].map((name, index) => (
              <span key={name} style={{ marginInlineStart: index === 0 ? 0 : -10 }}>
                <Avatar fallback={name} />
              </span>
            ))}
            <span style={{ marginInlineStart: 8 }} className="muted">
              +۱۲ نفر دیگر
            </span>
          </div>
          <div className="row">
            <NotificationBadge count={2} variant="danger">
              <Avatar fallback="ف‌ج" size="lg" />
            </NotificationBadge>
            <NotificationBadge count={9}>
              <Avatar fallback="س‌م" size="lg" />
            </NotificationBadge>
          </div>
        </div>
      </Demo>

      <Demo name="Chip" title="ساده و قابل حذف">
        <div className="row">
          <Chip>React</Chip>
          <Chip>TypeScript</Chip>
          <Chip onRemove={() => showToast("Chip حذف شد", "info")}>قابل حذف ✕</Chip>
        </div>
      </Demo>

      <Demo name="Chip" title="مدیریت تگ — افزودن با Enter و حذف">
        <div className="column">
          <div className="row">
            {tags.map((tag) => (
              <Chip
                key={tag}
                removeLabel={`حذف ${tag}`}
                onRemove={() => setTags((prev) => prev.filter((item) => item !== tag))}
              >
                {tag}
              </Chip>
            ))}
            {tags.length === 0 && <span className="muted">تگی وجود ندارد</span>}
          </div>
          <Input
            placeholder="تگ جدید و Enter"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag();
              }
            }}
          />
        </div>
      </Demo>

      <Demo name="Chip" title="فیلتر انتخابی با Chip">
        <div className="row">
          {[
            { value: "all", label: "همه" },
            { value: "active", label: "فعال" },
            { value: "archived", label: "بایگانی" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              className="chipButton"
              data-selected={filter === option.value || undefined}
              onClick={() => setFilter(option.value)}
            >
              <Chip>{option.label}</Chip>
            </button>
          ))}
          <Result>فیلتر: {filter}</Result>
        </div>
      </Demo>

      <Demo name="Divider" title="افقی، با لیبل و عمودی">
        <div className="column">
          <Divider />
          <Divider label="یا" />
          <div className="row" style={{ height: 40 }}>
            <span>قبل</span>
            <Divider orientation="vertical" />
            <span>بعد</span>
          </div>
        </div>
      </Demo>

      <Demo name="Divider" title="جداکننده بین بخش‌های فرم ورود">
        <div className="column">
          <Button variant="outline">ورود با گوگل</Button>
          <Divider label="یا با ایمیل" />
          <Input placeholder="ایمیل" dir="ltr" />
          <Button>ادامه</Button>
        </div>
      </Demo>

      <Demo name="Breadcrumb" title="ناوبری مسیر با جداکننده دلخواه">
        <div className="column">
          <Breadcrumb items={breadcrumbItems} separator="›" />
          <Breadcrumb items={breadcrumbItems.slice(0, 3)} separator="/" />
        </div>
      </Demo>

      <Demo name="Breadcrumb" title="آیتم با onClick به‌جای href">
        <Breadcrumb
          items={[
            { label: "پنل", onClick: () => showToast("رفتن به پنل", "info") },
            { label: "کاربران", onClick: () => showToast("رفتن به کاربران", "info") },
            { label: "ویرایش" },
          ]}
          separator="‹"
        />
      </Demo>
    </Subsection>
  );
}

function DataFlowDemos() {
  const stepper = useStepper({ totalSteps: stepperSteps.length });
  const wizard = useStepper({ totalSteps: wizardSteps.length });

  return (
    <Subsection id="data-flow" title="روند و مسیر">
      <Demo name="Timeline" title="عمودی — با مهر زمانی">
        <Timeline items={timelineItems} />
      </Demo>

      <Demo name="Timeline" title="افقی">
        <Timeline items={timelineItems.slice(0, 3)} orientation="horizontal" />
      </Demo>

      <Demo name="Timeline" title="فعالیت‌های اخیر با محتوای غنی">
        <Timeline
          items={[
            {
              title: "کامیت جدید",
              description: (
                <span>
                  <Badge variant="secondary">main</Badge> رفع باگ سایدبار
                </span>
              ),
              timestamp: "۱۰ دقیقه پیش",
              variant: "primary",
            },
            {
              title: "نسخه ۰.۴.۰ منتشر شد",
              description: <Badge variant="success">منتشر شد</Badge>,
              timestamp: "دیروز",
              variant: "primary",
            },
            { title: "تغییر نام پکیج", timestamp: "امروز", variant: "secondary" },
          ]}
        />
      </Demo>

      <Demo name="Stepper + useStepper" title="افقی — با ناوبری کامل">
        <div className="column">
          <Stepper
            steps={stepperSteps}
            activeStep={stepper.activeStep}
            completedSteps={stepper.completedSteps}
            onStepClick={stepper.goToStep}
          />
          <div className="row">
            <Button size="sm" variant="secondary" onClick={stepper.goBack} disabled={stepper.isFirstStep}>
              مرحله قبل
            </Button>
            <Button size="sm" onClick={stepper.goNext} disabled={stepper.isFinished}>
              {stepper.isLastStep ? "پایان" : "مرحله بعد"}
            </Button>
            {stepper.isFinished && <span>تمام شد ✅</span>}
          </div>
        </div>
      </Demo>

      <Demo name="Stepper" title="عمودی — با مرحله فعال و تکمیل‌شده">
        <Stepper
          steps={stepperSteps}
          activeStep={1}
          completedSteps={new Set([0])}
          orientation="vertical"
        />
      </Demo>

      <Demo name="Stepper" title="ویزارد عمودی با محتوای هر مرحله" span="wide">
        <div className="column">
          <Stepper
            steps={wizardSteps}
            activeStep={wizard.activeStep}
            completedSteps={wizard.completedSteps}
            orientation="vertical"
          />
          <div className="row">
            <Button size="sm" variant="secondary" onClick={wizard.goBack} disabled={wizard.isFirstStep}>
              قبلی
            </Button>
            <Button
              size="sm"
              onClick={() => {
                wizard.goNext();
                if (wizard.isLastStep) showToast("ثبت‌نام کامل شد", "success");
              }}
              disabled={wizard.isFinished}
            >
              {wizard.isLastStep ? "پایان" : "بعدی"}
            </Button>
          </div>
        </div>
      </Demo>
    </Subsection>
  );
}

function OverlaysSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerEndOpen, setDrawerEndOpen] = useState(false);
  const [drawerStartOpen, setDrawerStartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <Section
      id="overlays"
      number="۰۶"
      title="لایه‌ها و ناوبری"
      description="مودال و دراور با انیمیشن، تب‌ها، آکاردئون و سایدبار جمع‌شونده."
    >
      <Subsection id="overlays-layers" title="لایه‌ها">
        <Demo name="Modal" title="با فرم داخل آن — با Escape هم بسته می‌شود">
          <div className="row">
            <Button onClick={() => setModalOpen(true)}>نمایش Modal</Button>
          </div>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="ویرایش پروفایل">
            <div className="column">
              <Input placeholder="نام نمایشی" defaultValue="فاروق جمالی" />
              <Textarea placeholder="درباره من" rows={3} />
              <div className="row">
                <Button onClick={() => setModalOpen(false)}>ذخیره</Button>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  انصراف
                </Button>
              </div>
            </div>
          </Modal>
        </Demo>

        <Demo name="Modal + ConfirmDialog" title="مودال تو در تو و تایید حذف">
          <div className="row">
            <Button variant="secondary" onClick={() => setNestedOpen(true)}>
              مدیریت پروژه
            </Button>
          </div>
          <Modal open={nestedOpen} onClose={() => setNestedOpen(false)} title="تنظیمات پروژه">
            <div className="column">
              <Switch label="پروژه عمومی باشد" />
              <Select options={selectOptions} placeholder="مالک پروژه" />
              <Divider />
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                حذف پروژه
              </Button>
            </div>
          </Modal>
          <ConfirmDialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={() => {
              setConfirmOpen(false);
              setNestedOpen(false);
              showToast("پروژه حذف شد", "danger");
            }}
            title="حذف پروژه"
            message="با حذف پروژه، همه فایل‌ها و تنظیمات آن از بین می‌رود."
            confirmLabel="حذف"
            danger
          />
        </Demo>

        <Demo name="Drawer" title="باز شدن از دو سمت">
          <div className="row">
            <Button onClick={() => setDrawerEndOpen(true)}>Drawer از انتها</Button>
            <Button variant="secondary" onClick={() => setDrawerStartOpen(true)}>
              Drawer از ابتدا
            </Button>
          </div>
          <Drawer
            open={drawerEndOpen}
            onClose={() => setDrawerEndOpen(false)}
            title="پنل تنظیمات"
            side="end"
          >
            <p>محتوای drawer از سمت انتها (پیش‌فرض).</p>
          </Drawer>
          <Drawer
            open={drawerStartOpen}
            onClose={() => setDrawerStartOpen(false)}
            title="پنل اطلاعات"
            side="start"
          >
            <p>محتوای drawer از سمت ابتدا.</p>
          </Drawer>
        </Demo>

        <Demo name="Drawer" title="پنل فیلتر با کنترل‌های فرم">
          <div className="row">
            <Button variant="outline" onClick={() => setFilterOpen(true)}>
              فیلترها
            </Button>
          </div>
          <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} title="فیلتر محصولات">
            <div className="column">
              <Select options={selectOptions} placeholder="شهر" />
              <Slider label="حداکثر قیمت" defaultValue={60} showValue />
              <Checkbox label="فقط موجودها" defaultChecked />
              <Checkbox label="ارسال رایگان" />
              <RadioGroup
                name="drawer-sort"
                defaultValue="new"
                options={[
                  { value: "new", label: "جدیدترین" },
                  { value: "cheap", label: "ارزان‌ترین" },
                ]}
              />
              <div className="row">
                <Button
                  onClick={() => {
                    setFilterOpen(false);
                    showToast("فیلترها اعمال شد", "success");
                  }}
                >
                  اعمال
                </Button>
                <Button variant="secondary" onClick={() => setFilterOpen(false)}>
                  بستن
                </Button>
              </div>
            </div>
          </Drawer>
        </Demo>
      </Subsection>

      <NavigationDemos />
      <SidebarDemos />
    </Section>
  );
}

function NavigationDemos() {
  const [tab, setTab] = useState("profile");
  const [openItems, setOpenItems] = useState<string[]>(["a-1"]);

  return (
    <Subsection id="overlays-navigation" title="ناوبری">
      <Demo name="Tabs" title="تب عادی، دوم و غیرفعال">
        <Tabs.Root defaultValue="profile">
          <Tabs.List>
            <Tabs.Tab value="profile">پروفایل</Tabs.Tab>
            <Tabs.Tab value="settings">تنظیمات</Tabs.Tab>
            <Tabs.Tab value="logs" disabled>
              لاگ‌ها
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="profile">اطلاعات پروفایل کاربر اینجا نمایش داده می‌شود.</Tabs.Panel>
          <Tabs.Panel value="settings">تنظیمات حساب کاربری.</Tabs.Panel>
          <Tabs.Panel value="logs">—</Tabs.Panel>
        </Tabs.Root>
      </Demo>

      <Demo name="Tabs" title="کنترل‌شده با value و دکمه‌های بیرونی">
        <div className="column">
          <Tabs.Root value={tab} onValueChange={setTab}>
            <Tabs.List>
              <Tabs.Tab value="profile">پروفایل</Tabs.Tab>
              <Tabs.Tab value="billing">صورتحساب</Tabs.Tab>
              <Tabs.Tab value="security">امنیت</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="profile">نام، ایمیل و آواتار شما.</Tabs.Panel>
            <Tabs.Panel value="billing">فاکتورها و روش‌های پرداخت.</Tabs.Panel>
            <Tabs.Panel value="security">
              <div className="column">
                <Switch label="ورود دومرحله‌ای" />
                <Button size="sm" variant="outline">
                  تغییر رمز عبور
                </Button>
              </div>
            </Tabs.Panel>
          </Tabs.Root>
          <div className="row">
            <Button size="sm" variant="secondary" onClick={() => setTab("security")}>
              رفتن به امنیت
            </Button>
            <Result>تب فعال: {tab}</Result>
          </div>
        </div>
      </Demo>

      <Demo name="Tabs" title="تب‌ها با نشان و شمارنده">
        <Tabs.Root defaultValue="inbox">
          <Tabs.List>
            <Tabs.Tab value="inbox">
              صندوق ورودی <Badge variant="danger">۴</Badge>
            </Tabs.Tab>
            <Tabs.Tab value="sent">ارسال‌شده</Tabs.Tab>
            <Tabs.Tab value="draft">
              پیش‌نویس <Badge variant="secondary">۲</Badge>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="inbox">۴ پیام خوانده‌نشده دارید.</Tabs.Panel>
          <Tabs.Panel value="sent">پیام‌های ارسال‌شده.</Tabs.Panel>
          <Tabs.Panel value="draft">۲ پیش‌نویس ذخیره‌شده.</Tabs.Panel>
        </Tabs.Root>
      </Demo>

      <Demo name="Accordion" title="تکی (پیش‌فرض) و چندتایی (allowMultiple)">
        <div className="column">
          <Accordion.Root defaultOpen={["faq-1"]}>
            <Accordion.Item value="faq-1">
              <Accordion.Trigger value="faq-1">سوال اول — باز شدن پیش‌فرض</Accordion.Trigger>
              <Accordion.Panel value="faq-1">
                پاسخ سوال اول. در حالت تکی، باز کردن یک آیتم بقیه را می‌بندد.
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="faq-2">
              <Accordion.Trigger value="faq-2">سوال دوم</Accordion.Trigger>
              <Accordion.Panel value="faq-2">پاسخ سوال دوم.</Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>

          <Accordion.Root allowMultiple>
            <Accordion.Item value="m-1">
              <Accordion.Trigger value="m-1">چندتایی — بخش ۱</Accordion.Trigger>
              <Accordion.Panel value="m-1">چند آیتم همزمان باز می‌مانند.</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="m-2">
              <Accordion.Trigger value="m-2">چندتایی — بخش ۲</Accordion.Trigger>
              <Accordion.Panel value="m-2">این هم باز می‌ماند.</Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </Demo>

      <Demo name="Accordion" title="کنترل‌شده با open و دکمه باز/بستن همه">
        <div className="column">
          <div className="row">
            <Button size="sm" variant="secondary" onClick={() => setOpenItems(["a-1", "a-2", "a-3"])}>
              باز کردن همه
            </Button>
            <Button size="sm" variant="outline" onClick={() => setOpenItems([])}>
              بستن همه
            </Button>
          </div>
          <Accordion.Root allowMultiple open={openItems} onOpenChange={setOpenItems}>
            {["a-1", "a-2", "a-3"].map((value, index) => (
              <Accordion.Item value={value} key={value}>
                <Accordion.Trigger value={value}>
                  بخش {(index + 1).toLocaleString("fa-IR")}
                </Accordion.Trigger>
                <Accordion.Panel value={value}>
                  محتوای بخش {(index + 1).toLocaleString("fa-IR")} — وضعیت از بیرون کنترل می‌شود.
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </Demo>
    </Subsection>
  );
}

const SIDEBAR_ITEMS = [
  { key: "dashboard", label: "داشبورد", icon: "chart" },
  { key: "users", label: "کاربران", icon: "users" },
  { key: "products", label: "محصولات", icon: "box" },
  { key: "settings", label: "تنظیمات", icon: "settings" },
] as const;

function SidebarDemos() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState<string>("dashboard");
  const [plainCollapsed, setPlainCollapsed] = useState(false);
  const [innerCollapsed, setInnerCollapsed] = useState(true);

  return (
    <Subsection id="overlays-sidebar" title="سایدبار" wide>
      <Demo
        name="Sidebar + SidebarItem + SidebarTrigger"
        title="با آیکن — در حالت بسته فقط آیکن نمایش داده می‌شود؛ دکمه بیرون از سایدبار است"
        span="wide"
      >
        <div className="sidebarDemoBox">
          <Sidebar title="پنل مدیریت" collapsed={collapsed}>
            {SIDEBAR_ITEMS.map((item) => (
              <SidebarItem
                key={item.key}
                icon={<Icon name={item.icon} />}
                active={active === item.key}
                onClick={() => setActive(item.key)}
              >
                {item.label}
              </SidebarItem>
            ))}
            <Divider />
            <SidebarItem icon={<Icon name="logout" />} onClick={() => showToast("خروج", "info")}>
              خروج
            </SidebarItem>
          </Sidebar>
          <div className="sidebarDemoMain">
            <div className="sidebarDemoBar">
              <SidebarTrigger collapsed={collapsed} onClick={() => setCollapsed((value) => !value)} />
              <strong>{SIDEBAR_ITEMS.find((item) => item.key === active)?.label}</strong>
            </div>
            <div className="sidebarDemoContent">محتوای صفحه: {active}</div>
          </div>
        </div>
      </Demo>

      <Demo
        name="Sidebar + SidebarTrigger"
        title="بدون آیکن — در حالت بسته کاملاً بسته می‌شود و دکمه همبرگری در هدر باز می‌کند"
        span="wide"
      >
        <div className="sidebarDemoBox">
          <Sidebar title="منوی متنی" collapsed={plainCollapsed}>
            <SidebarItem active>صفحه اصلی</SidebarItem>
            <SidebarItem>مقالات</SidebarItem>
            <SidebarItem>درباره ما</SidebarItem>
            <SidebarItem>تماس با ما</SidebarItem>
          </Sidebar>
          <div className="sidebarDemoMain">
            <div className="sidebarDemoBar">
              <SidebarTrigger
                collapsed={plainCollapsed}
                onClick={() => setPlainCollapsed((value) => !value)}
              />
              <strong>وبلاگ</strong>
            </div>
            <div className="sidebarDemoContent">محتوای صفحه با عرض کامل</div>
          </div>
        </div>
      </Demo>

      <Demo
        name="SidebarTrigger"
        title="دکمه داخل خود سایدبار، آیکن سفارشی، لینک و آیتم غیرفعال"
        span="wide"
      >
        <div className="sidebarDemoBox">
          <Sidebar collapsed={innerCollapsed}>
            <SidebarTrigger
              collapsed={innerCollapsed}
              icon={<Icon name="settings" />}
              onClick={() => setInnerCollapsed((value) => !value)}
            />
            <SidebarItem icon={<Icon name="home" />} href="#overlays-sidebar" active>
              خانه
            </SidebarItem>
            <SidebarItem icon={<Icon name="mail" />} onClick={() => showToast("پیام‌ها", "info")}>
              پیام‌ها
            </SidebarItem>
            <SidebarItem icon={<Icon name="bell" />} disabled>
              اعلان‌ها (غیرفعال)
            </SidebarItem>
            <SidebarItem icon={<Icon name="star" />} onClick={() => showToast("علاقه‌مندی‌ها", "info")}>
              علاقه‌مندی‌ها
            </SidebarItem>
          </Sidebar>
          <div className="sidebarDemoContent">این سایدبار بسته شروع می‌شود</div>
        </div>
      </Demo>

      <Demo name="Sidebar" title="ثابت — بدون collapsed و بدون دکمه" span="wide">
        <div className="sidebarDemoBox">
          <Sidebar title="ثابت">
            <SidebarItem icon={<Icon name="home" />} active>
              خانه
            </SidebarItem>
            <SidebarItem icon={<Icon name="users" />}>تیم</SidebarItem>
          </Sidebar>
          <div className="sidebarDemoContent">سایدبار ثابت</div>
        </div>
      </Demo>
    </Subsection>
  );
}

function ComposeSection() {
  return (
    <Section
      id="compose"
      number="۰۷"
      title="نمونه‌های ترکیبی"
      description="ترکیب چند کامپوننت در سناریوهای واقعی: صفحه ورود، داشبورد و تنظیمات."
    >
      <AuthDemo />
      <DashboardDemo />
      <SettingsDemo />
    </Section>
  );
}

type LoginValues = { email: string; password: string; remember: boolean };

function AuthDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <Subsection id="compose-auth" title="ورود به حساب">
      <Demo name="Form + Card" title="فرم ورود با اعتبارسنجی و حالت loading">
        <Card>
          <h3 style={{ margin: 0 }}>ورود</h3>
          <Form<LoginValues>
            initialValues={{ email: "", password: "", remember: true }}
            rules={{
              email: {
                required: "ایمیل الزامی است",
                pattern: [/^\S+@\S+\.\S+$/, "ایمیل معتبر نیست"],
              },
              password: { required: "رمز عبور الزامی است", minLength: [6, "حداقل ۶ کاراکتر"] },
            }}
            onSubmit={() => {
              setLoading(true);
              window.setTimeout(() => {
                setLoading(false);
                showToast("با موفقیت وارد شدید", "success");
              }, 1200);
            }}
          >
            <div className="column">
              <Form.Field name="email">
                {(field, error, helpers) => (
                  <div className="column">
                    <Input placeholder="ایمیل" dir="ltr" {...field} error={!!error} />
                    {error && (
                      <span className="fieldError" id={helpers.errorId}>
                        {error}
                      </span>
                    )}
                  </div>
                )}
              </Form.Field>
              <Form.Field name="password">
                {(field, error, helpers) => (
                  <div className="column">
                    <Input type="password" placeholder="رمز عبور" dir="ltr" {...field} error={!!error} />
                    {error && (
                      <span className="fieldError" id={helpers.errorId}>
                        {error}
                      </span>
                    )}
                  </div>
                )}
              </Form.Field>
              <Form.Field<boolean> name="remember">
                {(field) => <Checkbox label="مرا به خاطر بسپار" {...field} />}
              </Form.Field>
              <Button type="submit" disabled={loading}>
                {loading && <Spinner size="sm" />}
                ورود
              </Button>
            </div>
          </Form>
        </Card>
      </Demo>

      <Demo name="OtpInput + Alert" title="تایید شماره موبایل">
        <Card>
          <h3 style={{ margin: 0 }}>کد تایید</h3>
          <Alert variant="info">کد ۵ رقمی به شماره ۰۹۱۲۳۴۵۶۷۸۹ ارسال شد.</Alert>
          <OtpInput length={5} onComplete={(code) => showToast(`کد ${code} تایید شد`, "success")} />
          <Button variant="ghost" size="sm" onClick={() => showToast("کد جدید ارسال شد", "info")}>
            ارسال مجدد کد
          </Button>
        </Card>
      </Demo>
    </Subsection>
  );
}

function DashboardDemo() {
  const stats = [
    { label: "فروش امروز", value: (12450000).toLocaleString("fa-IR"), delta: "+۱۲٪", variant: "success" as const },
    { label: "کاربران جدید", value: (342).toLocaleString("fa-IR"), delta: "+۵٪", variant: "success" as const },
    { label: "سفارش‌های لغو شده", value: (18).toLocaleString("fa-IR"), delta: "-۳٪", variant: "danger" as const },
  ];

  return (
    <Subsection id="compose-dashboard" title="داشبورد" wide>
      <Demo name="Card + ProgressBar + Table" title="کارت‌های آماری، پیشرفت اهداف و جدول سفارش‌ها" span="wide">
        <div className="statGrid">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <span className="muted">{stat.label}</span>
              <strong style={{ fontSize: 22 }}>{stat.value}</strong>
              <Badge variant={stat.variant}>{stat.delta}</Badge>
            </Card>
          ))}
        </div>

        <div className="statGrid">
          <Card>
            <ProgressBar label="هدف فروش ماهانه" value={72} showValue />
            <ProgressBar label="رضایت مشتریان" value={91} variant="success" showValue />
            <ProgressBar label="تیکت‌های باز" value={34} variant="danger" showValue />
          </Card>
          <Card>
            <strong>فعالیت‌های اخیر</strong>
            <Timeline
              items={[
                { title: "سفارش جدید #۱۲۴۵", timestamp: "۵ دقیقه پیش", variant: "primary" },
                { title: "پرداخت تایید شد", timestamp: "۲۰ دقیقه پیش", variant: "primary" },
                { title: "کاربر جدید ثبت‌نام کرد", timestamp: "۱ ساعت پیش", variant: "secondary" },
              ]}
            />
          </Card>
        </div>

        <Table<User>
          columns={userColumnsWithStatus}
          data={users}
          rowKey={(row) => row.id}
          sorting={{ enabled: true }}
          globalSearch={{ enabled: true, placeholder: "جستجوی کاربر..." }}
          pagination={{ enabled: true, pageSize: 5 }}
        />
      </Demo>
    </Subsection>
  );
}

function SettingsDemo() {
  const [tab, setTab] = useState("general");
  const [volume, setVolume] = useState(60);
  const [language, setLanguage] = useState("fa");

  return (
    <Subsection id="compose-settings" title="تنظیمات" wide>
      <Demo name="Tabs + Switch + Select + Slider" title="صفحه تنظیمات با ذخیره و بازنشانی" span="wide">
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List>
            <Tabs.Tab value="general">عمومی</Tabs.Tab>
            <Tabs.Tab value="notifications">اعلان‌ها</Tabs.Tab>
            <Tabs.Tab value="danger">منطقه خطر</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="general">
            <div className="column">
              <Select
                options={[
                  { value: "fa", label: "فارسی" },
                  { value: "en", label: "English" },
                ]}
                value={language}
                onChange={setLanguage}
              />
              <Slider label="صدای اعلان" value={volume} onChange={setVolume} showValue />
              <TimePicker placeholder="ساعت یادآوری روزانه" defaultValue={{ hour: 9, minute: 0 }} />
              <DatePicker placeholder="تاریخ شروع اشتراک" includeGregorian />
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="notifications">
            <div className="column">
              <Switch label="اعلان ایمیلی" defaultChecked />
              <Switch label="اعلان پیامکی" />
              <Switch label="اعلان مرورگر" defaultChecked />
              <Alert variant="info">تغییرات پس از ذخیره اعمال می‌شود.</Alert>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="danger">
            <div className="column">
              <Alert variant="warning">اقدامات این بخش قابل بازگشت نیستند.</Alert>
              <div className="row">
                <Button variant="danger" onClick={() => showToast("حساب غیرفعال شد", "danger")}>
                  غیرفعال‌سازی حساب
                </Button>
              </div>
            </div>
          </Tabs.Panel>
        </Tabs.Root>

        <Divider />
        <div className="row">
          <Button onClick={() => showToast("تنظیمات ذخیره شد", "success")}>ذخیره</Button>
          <Button
            variant="outline"
            onClick={() => {
              setLanguage("fa");
              setVolume(60);
              showToast("به حالت پیش‌فرض بازگشت", "info");
            }}
          >
            بازنشانی
          </Button>
        </div>
      </Demo>
    </Subsection>
  );
}
