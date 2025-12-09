# Welcome to your Lovable project

## Project info

**URL**: [https://lovable.dev/projects/7408e193-6900-494a-9080-4f305693207b](https://axevora.com/)

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project]([https://lovable.dev/projects/7408e193-6900-494a-9080-4f305693207b](https://axevora.com/)) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7408e193-6900-494a-9080-4f305693207b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Deploy with GitHub + Cloudflare Pages

Run the site using GitHub as the source and Cloudflare for hosting/DNS.

### Cloudflare Pages Settings
- Project: Connect this GitHub repo in Cloudflare Pages.
- Build command:
  ```sh
  npm ci && npm run generate-sitemap && npm run build
  ```
- Output directory: `dist`
- Node version: `18` (or `20`)
- Environment variables:
  - `VITE_ENABLE_DOWNLOADERS=true`
  - `CI=true` (optional)

### Custom Domain
- Add `axevora.com` under Pages → Custom domains.
- Add `www.axevora.com` as an alias and set `axevora.com` as the primary.
- Enable “Redirect traffic to the primary domain” for www → apex 301 redirects.

### DNS (Cloudflare)
- Nameservers: point to Cloudflare (already done).
- Records:
  - `axevora.com` → Cloudflare Pages-managed CNAME to your `*.pages.dev` domain, proxied.
  - `www` → CNAME to `axevora.com`, proxied.
- SSL/TLS: set to “Full”.

### GitHub Configuration
- Settings → Pages: Disabled (Cloudflare Pages is the origin).
- Workflows:
  - Keep `.github/workflows/sitemap.yml` (generates sitemap and pings Google).
  - Remove GitHub Pages deploy workflows (already removed).
- Files:
  - `CNAME` and `public/CNAME` are not used by Cloudflare Pages; optional to delete.

### Post-Deploy Checklist
- Purge Cloudflare cache: Caching → Purge everything.
- Verify homepage meta:
  - `canonical`, `og:url`, and `twitter:url` point to `https://axevora.com/`.
- Verify `https://axevora.com/sitemap.xml` resolves and contains site URLs.
- Test deep links (e.g., `/tools/validators`) and `www` → apex redirect.

### Notes
- No Ezoic integration: ensure Cloudflare Apps/Zaraz/Workers/Rules do not inject Ezoic/CMP scripts.

### Email Setup (Contact Forms)
- Environment variables (Pages → Settings → Environment variables):
  - `RESEND_API_KEY`: your Resend API key (required).
  - `RESEND_FROM`: an allowed sender (optional; e.g., `notifications@axevora.com`).
- Function endpoint: form submissions POST to `/api/send-email` (Cloudflare Pages Function).
- Sender domain: if using a custom `RESEND_FROM`, verify the domain in Resend; otherwise the default `onboarding@resend.dev` works until verification.
- Testing:
  - After deploy, submit the forms at `https://axevora.com/contact`.
  - Emails are delivered to `admin@axevora.com`. If you use Cloudflare Email Routing, confirm the forward target inbox.
  - Check Cloudflare Logs/Analytics if you need to trace function requests.

---

## Ads.txt Setup & Verification (Google AdSense)

Our site serves `ads.txt` from the root and provides a well-known alias to maximize crawler compatibility.

- File location: `public/ads.txt`
- Live URLs:
  - `https://axevora.com/ads.txt`
  - `https://www.axevora.com/ads.txt` (redirects to apex; path preserved)
  - `https://axevora.com/.well-known/ads.txt` → redirected to `/ads.txt`
- Headers: `_headers` sets `Content-Type: text/plain` and `Cache-Control: no-cache, max-age=0, must-revalidate` for `/ads.txt`.
- Routing: `_redirects` includes explicit rules to serve `/ads.txt` (and the well-known path) and avoid SPA rewrites.

### Verify ads.txt
1. Open the live URL `https://axevora.com/ads.txt` and confirm it returns HTTP 200 with this line:
   ```
   google.com, pub-7510164795562884, DIRECT, f08c47fec0942fa0
   ```
2. Check on both apex and `www`.
3. In AdSense → Sites → axevora.com → Ads.txt, click “Check again”.
4. AdSense crawler may take 24–48 hours (sometimes up to 72) to reflect the status change.

### Cloudflare cache purge (optional)
- Pages dashboard → Caching → Purge Cache → Custom Purge → add path `/ads.txt`.
- Alternatively, “Purge Everything” after deploy if you changed `ads.txt`.

### Troubleshooting
- Ensure HTTPS is enabled and returns 200 for both apex and www.
- Confirm `_redirects` contains:
  ```
  /ads.txt /ads.txt 200
  /.well-known/ads.txt /ads.txt 200
  /* /index.html 200
  ```
- Confirm `_headers` contains:
  ```
  /ads.txt
    Content-Type: text/plain; charset=utf-8
    Cache-Control: no-cache, max-age=0, must-revalidate
  ```
- Wait for the AdSense crawler; use “Check again” to nudge a refresh.
