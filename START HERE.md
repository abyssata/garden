# The Garden — how it works

- `content/` is your Obsidian garden vault. Everything in it is published, except the `content/private/` folder.
- `quartz.config.yaml` controls the site's title, fonts, colours and features.

## One-time setup
1. Create a free GitHub account at github.com.
2. Install GitHub Desktop (desktop.github.com) and sign in.
3. In GitHub Desktop: File → Add Local Repository → choose Documents/garden.
4. Click "Publish repository". Name it `garden` and UNTICK "Keep this code private" (free GitHub Pages needs a public repository).
5. On github.com, open the repository → Settings → Pages → under "Source" choose "GitHub Actions".
6. (Done: `baseUrl` is set to abyssata.github.io/garden.)
7. After about a minute your garden is live at https://abyssata.github.io/garden (progress shows under the repository's "Actions" tab).

## Analytics (GoatCounter)
Connected to abyssata.goatcounter.com. Visits appear in your GoatCounter dashboard once the site is live.

## Obsidian
Open Obsidian → "Open folder as vault" → choose Documents/garden/content.

## Publishing, day to day
Write in Obsidian → open GitHub Desktop → type a short summary → "Commit to v5" → "Push origin".
