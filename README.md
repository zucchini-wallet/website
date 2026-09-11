# Zucchini website

A static Three.js landing site for **zucchinifi.xyz**, focused on self-custody and shielded Zcash. No framework, build step, CDN dependency, analytics, or wallet connection is required.

## Preview and validate

From this repository:

```sh
python3 -m http.server 4180 --bind 127.0.0.1 --directory dist
python3 scripts/check.py
node --check dist/assets/site.js
node --check dist/assets/scene.js
```

Open http://127.0.0.1:4180. Serve over HTTP; ES modules do not work by opening index.html as a file.

## Contents

- `dist/index.html`: landing page with feature, workflow and extension sections.
- `dist/assets/scene.js`: restrained, pointer-responsive Three.js sculpture, pause control, reduced-motion support, offscreen suspension and image fallback.
- `dist/privacy/`, `dist/terms/`: clearly marked draft legal pages.
- `dist/404.html`: custom not-found page.
- `dist/sitemap.xml`, `dist/robots.txt`, `dist/site.webmanifest`: indexing and browser metadata.
- `dist/_headers`: static hosting security/cache headers, including a hash for the inline JSON-LD.
- `dist/vendor/`: locally served Three.js 0.180.0 ES modules and MIT license.

## Publishing

Deploy `dist` as the static document root, with clean directory index routing and `404.html` as the not-found response. No environment variables are needed. `.openai/hosting.json` identifies the private Sites preview. The GitHub origin remains the website repository.

For the production domain, connect `zucchinifi.xyz` to the selected host, configure HTTPS, redirect `www` to the canonical domain, and verify the three sitemap URLs. `_headers` is supported by Cloudflare Pages; other hosts must translate these headers into their own configuration. Recompute the CSP hash if editing the inline structured data. Private preview publishing does not change production DNS.

## Before public launch

1. Confirm the operator, private contact, hosting log retention and legal terms. The draft pages are not approved production policies for X OAuth.
2. Replace the development-source CTA with a verified extension-store URL once a release is available. Do not advertise unreleased registry/mobile functionality as live.
3. Confirm public source and social links, domain routing and production security headers.

## Asset provenance

The PNG brand mark and icons were supplied by the Zucchini extension repository (`web/apps/extension/public/icon-{512,32,128}.png`). The 3D sculpture is generated from geometry in this repository; no external model or texture is fetched. Three.js is distributed under its included MIT license. Fonts use system Arial/Helvetica and Georgia. No license to the Zucchini trademark is implied.

## Cloudflare Pages

Deploy using `npx wrangler pages deploy dist --project-name zucchini-website --branch main`. The Pages project serves the committed static output directly. For Git integration, select this repository, use no framework/build command and set the output directory to `dist`.
