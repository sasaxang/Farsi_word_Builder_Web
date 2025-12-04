# Farsi Word Builder (Web Version)

A modern, responsive web application for generating random Persian words, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎲 **Random Word Generation**: Combine prefixes, roots, and suffixes.
- 📱 **Fully Responsive**: Optimized for mobile and desktop.
- 🇮🇷 **RTL Support**: Native Persian language support with Vazir font.
- 🔒 **Locking Mechanism**: Lock specific parts (prefix, root, suffix) while spinning others.
- ➕ **Add Custom Affixes**: Easily add new word parts.
- 🌓 **Bilingual**: Switch between Persian and English interfaces.

## Project Structure

This project is part of a monorepo:
- `web-app/`: This Next.js application.
- `streamlit-app/`: The original Streamlit prototype.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

This application is ready to be deployed on [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Go to Vercel and "Add New Project".
3. Import your repository.
4. **Important**: In the "Root Directory" setting, select `web-app`.
5. Click **Deploy**.

Vercel will automatically detect Next.js and build your application.

## Technologies

- [Next.js 14](https://nextjs.org/)
- [React 18](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
