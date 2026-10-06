import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️ For GitHub Pages: set `base` to "/<your-repo-name>/" (with slashes
// on both ends) before running `npm run deploy`. If your repo is named
// e.g. "our-wedding", this should be "/our-wedding/".
// If you're deploying to a custom domain or to <username>.github.io
// (a "user/organization site" repo), set base back to '/'.
export default defineConfig({
  plugins: [react()],
  base: '/wedding-invitation/',
})
