# ‌Back-End
## 📁 پروژه Node.js با Express

### توضیح خلاصه

این پروژه یک سرور ساده‌ی Node.js با استفاده از Express راه‌اندازی می‌کند که شامل مسیرهای مربوط به کاربران، داشبورد و دوره‌ها است. نمایه‌سازی با قالب EJS انجام می‌شود و کوکی‌ها نیز پشتیبانی می‌شوند.

### 📄 ساختار کلی

- `index.js`: فایل اصلی راه‌اندازی سرور
- مسیرهای زیر بارگذاری شده‌اند:
  - `/` → هدایت به `/login`
  - مسیرهای کاربران از `userRoutes.js`
  - داشبورد از `inventoryRoutes.js`
  - اطلاعات دوره‌ها از `notificationSalonRoutes.js`
- موتور نمایش: `EJS`
- پورت پیش‌فرض: `3000`

### 🧩 استفاده از پکیج‌ها

- `express`: فریم‌ورک اصلی
- `cookie-parser`: برای خواندن کوکی‌ها
- `path`: برای تنظیم مسیر پوشه `views`


# سیستم احراز هویت با JWT و Express.js

این پروژه یک سیستم ساده برای مدیریت کاربران است که با استفاده از Express.js، JWT و رمزنگاری SHA-256 ساخته شده است. کاربران می‌توانند ثبت نام کنند، وارد سیستم شوند و پروفایل خود را ویرایش کنند. همچنین، دسترسی‌ها بر اساس نقش‌های کاربری (admin، teacher، student) مدیریت می‌شود.

## امکانات

- ثبت نام کاربران با ذخیره رمز عبور به صورت هش شده (SHA-256)
- ورود امن کاربران و صدور توکن JWT
- ذخیره توکن در کوکی HttpOnly برای امنیت بیشتر
- کنترل دسترسی به مسیرها بر اساس نقش کاربری
- ویرایش پروفایل با احراز هویت JWT

## راه‌اندازی پروژه

1. نصب وابستگی‌ها:
   ```bash
   npm install express jsonwebtoken crypto
   ```

# Myapp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.10.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.