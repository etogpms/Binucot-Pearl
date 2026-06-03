# Binucot Pearl Boutique Resort Website

A premium, modern web application for **Binucot Pearl Boutique Resort**—the "Little Boracay" of Tablas Island, Romblon, Philippines. This website showcases the resort's beachfront accommodations, dining experiences, island adventures, and handles direct booking requests.

---

## 🌴 Project Overview

Binucot Pearl is a beachfront boutique resort on Binucot Beach in Ferrol, Tablas Island. The website acts as the digital gateway for guests, allowing them to explore accommodations, plan their travel, and make direct online reservation requests.

### Key Features
* **Interactive Booking System**: Guests can submit booking details, contact information, special requests, and airport transfer preferences.
* **Multilingual Support**: Integrates Google Translate for international guests.
* **Automated Webhooks & Notifications**: Utilizes Supabase database webhooks and Edge Functions combined with the Resend API to notify the resort staff instantly of any new reservation requests.

---

## 📂 Site Structure

The project has a pre-built, static-optimized directory layout:
* `index.html` - Home page featuring the hero section, guest stories, accommodations summary, and interactive availability quick-check.
* `/rooms/` - Accommodation options detailing:
  * **The Horse Room** (Sea view, strength theme)
  * **The Fish Room** (Reef-side, flow theme)
  * **The Bird Room** (Treetop, lightness theme)
  * **The Gecko Room** (Coming soon)
* `/dining/` - Beach Bar & Restaurant and guest barbecue information.
* `/explore/` - Nearby attractions (Binucot Beach, snorkeling reefs, and island hopping adventures).
* `/contact/` - Contact details, location, and social media handles.
* `/book/` - Complete reservation form interface.
* `/assets/` - Pre-bundled JavaScript, CSS, and high-quality image assets.

---

## 🛠️ Technology Stack

1. **Frontend**:
   * HTML5, Vanilla CSS3 (curated custom theme properties), and ES6+ JavaScript.
   * Google Translate element for localization.
   
2. **Backend (Supabase)**:
   * Local development environment orchestrated by the Supabase CLI.
   * `bookings` table for recording guest reservation details.
   * **Database Webhook**: Listens for `INSERT` operations on the `bookings` table to trigger the notification service.
   * **Edge Function (`send-booking-notification`)**: Written in TypeScript (Deno runtime) to generate and send transactional emails using the [Resend API](https://resend.com).

3. **Hosting (Firebase)**:
   * Configurations defined in `firebase.json` and `.firebaserc`.
   * Fast static asset delivery via Firebase Hosting CDN.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (for serving or deploying)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (required for local Supabase emulator)
* [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/installation)
* [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)

### Local Development

1. **Serve the Frontend Locally**:
   You can serve the static files using any local development server (e.g., Live Server, Vite, or simple Python server):
   ```bash
   npx serve .
   ```

2. **Run Supabase Locally**:
   Ensure Docker Desktop is running, then initialize and start the Supabase emulator:
   ```bash
   # Start the Supabase local environment
   supabase start
   ```
   This spins up the local database, auth, storage, and studio (available at `http://127.0.0.1:54323`).

3. **Set Up Edge Function Secrets**:
   To test the booking notifications locally, configure your Resend API key and receiving email address in your local Supabase `.env` or `.env.local` file:
   ```env
   RESEND_API_KEY=re_your_api_key
   NOTIFICATION_EMAIL=binucotpearl.ph@gmail.com
   ```
   Deploy the secrets locally:
   ```bash
   supabase secrets set --env-file ./supabase/.temp/.env
   ```

4. **Run Edge Functions Locally**:
   ```bash
   supabase functions serve send-booking-notification --no-verify-jwt
   ```

---

## 📦 Deployment

### Deploying the Website to Firebase
1. Authenticate with Firebase:
   ```bash
   firebase login
   ```
2. Deploy assets to production:
   ```bash
   firebase deploy
   ```

### Deploying Edge Functions to Supabase Cloud
1. Link your local project to your live Supabase project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
2. Deploy the notification edge function:
   ```bash
   supabase functions deploy send-booking-notification
   ```
3. Set production environment secrets on the Supabase Dashboard:
   ```bash
   supabase secrets set RESEND_API_KEY=your_production_key NOTIFICATION_EMAIL=your_resort_email
   ```
