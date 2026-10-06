# 囍 Chinese Wedding Invitation

A React + Vite wedding invitation with a double-door hero, event timeline, and
a built-in RSVP form — ready to run locally or deploy for free on GitHub Pages.

## 1. Customize

Open **`src/config.js`**. Everything on the page — names, date, story text,
schedule, venue, RSVP deadline, and the host passcode — is read from that one
file.

## 2. Run it locally

You'll need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`) in your browser.
Changes to any file are reflected instantly.

Other useful commands:

```bash
npm run build      # produces an optimized build in dist/
npm run preview    # serves that build locally, to sanity-check before deploying
```

## 3. Deploy to GitHub Pages

1. Create a new GitHub repository and push this project to it:

   ```bash
   git init
   git add .
   git commit -m "Wedding invitation"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. Open **`vite.config.js`** and set `base` to match your repo name:

   ```js
   base: '/<your-repo>/',
   ```

   (If this repo is a "user/organization site" named exactly
   `<your-username>.github.io`, set `base: '/'` instead.)

3. Install the deploy helper and ship it:

   ```bash
   npm install
   npm run deploy
   ```

   This builds the app and pushes the `dist/` folder to a `gh-pages` branch.

4. In your GitHub repo, go to **Settings → Pages** and set the source to
   the `gh-pages` branch (folder `/`, if asked). After a minute or two your
   site will be live at:

   ```
   https://<your-username>.github.io/<your-repo>/
   ```

Whenever you edit `src/config.js` (or anything else) and want to re-publish,
just run `npm run deploy` again.

## About the RSVP data

This is a fully static site — there's no server. By default, RSVPs are saved
to the guest's own browser (`localStorage`), namespaced under the key in
`CONFIG.storageNamespace`.

**This means the "Couple / host view" only shows RSVPs submitted from the
same browser/device.** It's fine for trying the app out locally, but for
a real wedding you'll want every guest's RSVP to land in one shared place.

To get that, swap the implementation in `src/lib/storage.js` for a small
managed database — the rest of the app only calls `storageGet`,
`storageSet`, and `storageList`, so nothing else needs to change. Good free
options that work well with a static GitHub Pages site:

- **[Firebase Firestore](https://firebase.google.com/docs/firestore)** —
  generous free tier, a few lines of setup, good docs for exactly this kind
  of "static site + shared database" use case.
- **[Supabase](https://supabase.com)** — Postgres-based, also has a generous
  free tier and a simple JS client.
- **Google Forms / Sheets** — the simplest option if you're comfortable
  swapping the RSVP form for a Google Form embed instead; less flexible but
  requires no code changes to a storage adapter at all.

## Host passcode

The "Couple / host view" (which lists every RSVP and lets you export a CSV)
is gated behind a passcode set in `CONFIG.hostPasscode`. Keep in mind this
is a static site — the passcode ships inside the built JavaScript, so this
stops guests from casually tapping into it, but isn't real security. Don't
rely on it to protect sensitive information.

## Project structure

```
src/
  config.js              ← edit names/date/schedule/venue here
  App.jsx                ← composes all sections
  styles.css              ← all styling
  lib/storage.js          ← RSVP persistence (see "About the RSVP data" above)
  hooks/useReveal.js       ← scroll-reveal animation hook
  components/
    DoorHero.jsx           ← animated double-door hero
    Announce.jsx           ← names & date
    Story.jsx               ← "our story" blurb
    Schedule.jsx             ← event timeline
    Venue.jsx                 ← venue card
    RsvpSection.jsx            ← RSVP form + host guest list + CSV export
    Footer.jsx
```
