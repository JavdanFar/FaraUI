import { useState } from "react";
import "./App.css";
import "./index";
import { formatJalali, gregorianToJalali } from "./entry-points/jalali";
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
  SelectOption,
  StepperStep,
  TableColumn,
  TimelineItem,
  ToastPosition,
  UploadedFile,
} from "./index";

/* ============================================================
   Layout primitives
   ============================================================ */

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
    ],
  },
];

function Nav() {
  return (
    <aside className="nav">
      <h1 className="navBrand">
        Fara<span>UI</span>
      </h1>
      <p className="navSubtitle">گالری کامپوننت‌ها — همراه با تمام حالات</p>
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
  children: React.ReactNode;
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
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="subsection" id={id}>
      <h3 className="subsectionTitle">{title}</h3>
      <div className="grid">{children}</div>
    </div>
  );
}

function SubsectionWide({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="subsection" id={id}>
      <h3 className="subsectionTitle">{title}</h3>
      <div className="grid gridWide">{children}</div>
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
  children: React.ReactNode;
  span?: "wide" | "two";
}) {
  const className = span === "wide" ? "demo gridWide" : span === "two" ? "demo gridTwo" : "demo";
  return (
    <article className={className} style={span ? { gridColumn: "1 / -1" } : undefined}>
      <header className="demoHeader">
        <code className="demoName">{name}</code>
        <span className="demoTitle">{title}</span>
      </header>
      <div className="preview">{children}</div>
    </article>
  );
}

export default function App() {
  return (
    <div className="app" dir="rtl">
      <Nav />

      <main className="content">
        <header className="pageHeader">
          <h1 className="pageTitle">کتابخانه کامپوننت فارسی</h1>
          <p className="pageSubtitle">
            ۳۹ کامپوننت آماده استفاده با منطق کامل — تقویم جلالی، فرم‌ها، جدول داده و لایه‌ها. برای
            تعامل با هر نمونه، کلیک و هاور کنید.
          </p>
        </header>

        <ButtonsSection />
        <FormsSection />
        <DateTimeSection />
        <FeedbackSection />
        <DataDisplaySection />
        <OverlaysSection />
      </main>
    </div>
  );
}

/* ============================================================
   ۰۱ — دکمه‌ها و اکشن‌ها
   ============================================================ */

function ButtonsSection() {
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
      </Subsection>

      <Subsection id="buttons-actions" title="اکشن‌های تعاملی">
        <Demo name="Tooltip" title="نمایش با هاور">
          <div className="row">
            <Tooltip content="این یک توضیح کوتاه است">
              <Button variant="outline">هاور کن</Button>
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
          </div>
        </Demo>
      </Subsection>
    </Section>
  );
}

/* ============================================================
   ۰۲ — فرم‌ها
   ============================================================ */

const selectOptions: SelectOption[] = [
  { value: "tehran", label: "تهران" },
  { value: "isfahan", label: "اصفهان" },
  { value: "shiraz", label: "شیراز" },
  { value: "tabriz", label: "تبریز" },
];

const comboboxOptions: ComboboxOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

function FormsSection() {
  const [city, setCity] = useState("");
  const [techStack, setTechStack] = useState<string[]>(["react"]);
  const [agree, setAgree] = useState(true);
  const [plan, setPlan] = useState("pro");
  const [notifications, setNotifications] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [listFiles, setListFiles] = useState<UploadedFile[]>([]);

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

        <Demo name="Textarea" title="عادی، autoResize، خطا و بدون تغییر اندازه">
          <div className="column">
            <Textarea placeholder="توضیحات..." rows={2} />
            <Textarea placeholder="با افزایش متن بزرگ می‌شود" autoResize rows={2} />
            <Textarea placeholder="متن با خطا" error rows={2} />
            <Textarea placeholder="غیرقابل تغییر اندازه" resizable={false} rows={2} />
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
          </div>
        </Demo>

        <Demo name="Combobox" title="چندانتخابی با جستجو">
          <Combobox
            options={comboboxOptions}
            value={techStack}
            onChange={setTechStack}
            placeholder="فریمورک‌ها را انتخاب کنید"
          />
        </Demo>

        <Demo name="Checkbox / Switch" title="تیک، سوییچ و حالت غیرفعال">
          <div className="column">
            <Checkbox
              label="قوانین را می‌پذیرم"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <Checkbox label="غیرفعال" disabled />
            <Switch
              label="اعلان‌ها"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <Switch label="غیرفعال" disabled />
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
        <Demo name="FileUpload" title="پیش‌نمایش تصویر با اعتبارسنجی حجم و نوع">
          <FileUpload
            label="آپلود تصویر"
            hint="حداکثر ۲ مگابایت — فقط تصویر"
            accept="image/*"
            maxSize={2 * 1024 * 1024}
            variant="preview"
            files={uploadedFiles}
            onFilesSelected={(picked) => {
              setUploadedFiles((prev) => [...prev, ...picked]);
              showToast("فایل انتخاب شد", "success");
            }}
            onRemoveFile={(id) => setUploadedFiles((prev) => prev.filter((f) => f.id !== id))}
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
            onFilesSelected={(picked) => setListFiles((prev) => [...prev, ...picked])}
            onRemoveFile={(id) => setListFiles((prev) => prev.filter((f) => f.id !== id))}
          />
        </Demo>
      </Subsection>

      <Subsection id="forms-validation" title="اعتبارسنجی فرم">
        <Demo
          name="Form"
          title="قواعد declarative، touched و فوکوس روی اولین فیلد نامعتبر"
          span="wide"
        >
          <Form
            initialValues={{ name: "", email: "", city: "", terms: false }}
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
                    <Input placeholder="ایمیل" {...field} error={!!error} />
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

              <Button type="submit">ثبت‌نام</Button>
            </div>
          </Form>
        </Demo>
      </Subsection>
    </Section>
  );
}

function FormsValueDemos() {
  const [volume, setVolume] = useState(40);
  const [priceRange, setPriceRange] = useState({ min: 20, max: 80 });
  const [otp, setOtp] = useState("");
  const [rating, setRating] = useState(3);

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
          />
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

      <Demo name="Rating" title="تعاملی و فقط‌خواندنی">
        <div className="column">
          <Rating value={rating} onChange={setRating} />
          <Rating value={4} readOnly />
        </div>
      </Demo>
    </>
  );
}

/* ============================================================
   ۰۳ — تاریخ و زمان
   ============================================================ */

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

  return (
    <Subsection id="datetime-picker" title="انتخاب تاریخ">
      <Demo name="DatePicker" title="حالت تقویم — کنترل‌شده">
        <DatePicker value={date} onChange={setDate} placeholder="تاریخ را انتخاب کنید" />
        {date && <span>انتخاب شما: {formatJalali(date.jalali)}</span>}
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
    </Subsection>
  );
}

function DateRangeDemos() {
  const [range, setRange] = useState<DateRangeValue | null>(null);

  return (
    <Subsection id="datetime-range" title="بازه تاریخ">
      <Demo name="DateRangePicker" title="انتخاب تاریخ شروع و پایان" span="wide">
        <DateRangePicker
          value={range}
          onChange={setRange}
          placeholder="بازه تاریخ را انتخاب کنید"
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
        </div>
      </Demo>
    </Subsection>
  );
}

/* ============================================================
   ۰۴ — بازخورد و وضعیت
   ============================================================ */

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

      <Toaster position={toastPosition} />
    </Subsection>
  );
}

function LoadingDemos() {
  const [progress, setProgress] = useState(35);

  return (
    <Subsection id="feedback-loading" title="بارگذاری و پیشرفت">
      <Demo name="Spinner" title="سه سایز">
        <div className="row">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
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
    </Subsection>
  );
}

function BadgeDemos() {
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

      <Demo name="NotificationBadge" title="شمارنده روی المان و حالت صفر">
        <div className="row">
          <NotificationBadge count={3} variant="danger">
            <Button variant="outline">صندوق</Button>
          </NotificationBadge>
          <NotificationBadge count={0} showZero>
            <Button variant="outline">بدون آیتم</Button>
          </NotificationBadge>
        </div>
      </Demo>
    </Subsection>
  );
}

function ConfirmDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleConfirm() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      showToast("حساب کاربری حذف شد", "success");
    }, 1500);
  }

  return (
    <SubsectionWide id="feedback-confirm" title="تایید عملیات">
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
    </SubsectionWide>
  );
}

/* ============================================================
   ۰۵ — نمایش داده
   ============================================================ */

type User = { id: string; name: string; age: number; city: string };

const users: User[] = [
  { id: "1", name: "فاروق جمالی", age: 32, city: "تهران" },
  { id: "2", name: "سارا محمدی", age: 28, city: "اصفهان" },
  { id: "3", name: "علی رضایی", age: 41, city: "شیراز" },
  { id: "4", name: "مریم کریمی", age: 24, city: "تبریز" },
  { id: "5", name: "حسین نوری", age: 36, city: "مشهد" },
  { id: "6", name: "نگار احمدی", age: 30, city: "تهران" },
  { id: "7", name: "بهرام صادقی", age: 45, city: "رشت" },
];

const userColumns: TableColumn<User>[] = [
  { key: "name", header: "نام", sortable: true, filterable: true },
  { key: "age", header: "سن", sortable: true, accessor: (row) => row.age },
  { key: "city", header: "شهر", sortable: true, filterable: true },
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

        <Demo name="Avatar" title="سه سایز، fallback و خطای تصویر">
          <div className="row">
            <Avatar size="sm" fallback="ف‌ج" />
            <Avatar size="md" fallback="ف‌ج" />
            <Avatar size="lg" fallback="FJ" />
            <Avatar src="invalid-url.jpg" alt="کاربر" fallback="خطا" />
          </div>
        </Demo>

        <Demo name="Chip" title="ساده و قابل حذف">
          <div className="row">
            <Chip>React</Chip>
            <Chip>TypeScript</Chip>
            <Chip onRemove={() => showToast("Chip حذف شد", "info")}>قابل حذف ✕</Chip>
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

        <Demo name="Breadcrumb" title="ناوبری مسیر با جداکننده دلخواه">
          <Breadcrumb items={breadcrumbItems} separator="›" />
        </Demo>
      </Subsection>

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
  return (
    <SubsectionWide id="data-table" title="جدول">
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
        {selectedCount > 0 && <span>{selectedCount} ردیف انتخاب شده است</span>}
      </Demo>
    </SubsectionWide>
  );
}

function DataFlowDemos() {
  const stepper = useStepper({ totalSteps: stepperSteps.length });

  return (
    <Subsection id="data-flow" title="روند و مسیر">
      <Demo name="Timeline" title="عمودی — با مهر زمانی">
        <Timeline items={timelineItems} />
      </Demo>

      <Demo name="Timeline" title="افقی">
        <Timeline items={timelineItems.slice(0, 3)} orientation="horizontal" />
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
            <Button
              size="sm"
              variant="secondary"
              onClick={stepper.goBack}
              disabled={stepper.isFirstStep}
            >
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
    </Subsection>
  );
}

/* ============================================================
   ۰۶ — لایه‌ها و ناوبری
   ============================================================ */

function OverlaysSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerEndOpen, setDrawerEndOpen] = useState(false);
  const [drawerStartOpen, setDrawerStartOpen] = useState(false);

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
      </Subsection>

      <NavigationDemos />
    </Section>
  );
}

function NavigationDemos() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

      <Demo name="Sidebar" title="جمع‌شونده — با کلیک روی آیکن" span="wide">
        <div className="sidebarDemoBox">
          <Sidebar
            title="پنل مدیریت"
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          >
            <nav className="sidebarNav">
              <span>📊 داشبورد</span>
              <span>👥 کاربران</span>
              <span>📦 محصولات</span>
              <span>⚙️ تنظیمات</span>
            </nav>
          </Sidebar>
        </div>
      </Demo>
    </Subsection>
  );
}
