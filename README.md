# UmweltMetrik React

نسخه React/Vite پروژه UmweltMetrik.

## اجرا در سیستم محلی

```bash
npm install
npm run dev
```

برای build نهایی:

```bash
npm run build
```

## فرم تماس

فرم تماس به Cloudflare Worker فعلی متصل است:

`https://umweltmetrik-contact.alibahramali.workers.dev`

Resend API Key نباید داخل React یا GitHub قرار بگیرد. کلید باید فقط در Cloudflare Worker به عنوان Secret با نام `RESEND_API_KEY` ذخیره شود.

## انتشار روی GitHub Pages

Workflow آماده در `.github/workflows/deploy.yml` قرار دارد.

1. همه فایل‌های این پروژه را روی branch `main` قرار دهید.
2. در GitHub به `Settings > Pages` بروید.
3. در بخش `Build and deployment > Source` گزینه `GitHub Actions` را انتخاب کنید.
4. Push جدید انجام دهید یا workflow را دستی اجرا کنید.
5. فایل `public/CNAME` باعث می‌شود دامنه سفارشی `umweltmetrik.de` داخل build نهایی حفظ شود.

## نکته DNS

تبدیل پروژه به React مشکل DNS/SSL دامنه را حل نمی‌کند. GitHub Pages همچنان باید DNS دامنه را صحیح تشخیص دهد تا HTTPS certificate صادر شود.
