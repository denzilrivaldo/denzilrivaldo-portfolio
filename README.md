# Denzil Rivaldo Amalraj — Portfolio (Static + Admin)

This portfolio is a lightweight static website with an optional Admin panel powered by **Decap CMS** (Netlify CMS successor).

## Local preview
Because this site fetches JSON, use a local server (not file://):

### Option A (Python)
python -m http.server 8000

Then open: http://localhost:8000

## Recommended hosting (Netlify)
Netlify is the easiest option for:
- one-click Git deploys,
- free HTTPS,
- simple custom domains,
- and enabling **Identity + Git Gateway** so you can upload images and edit content from /admin.

## Enable Admin (image uploads + content editing)
1. Deploy to Netlify from a GitHub repo (drag-and-drop also works, but Git deploy is required for CMS edits).
2. In Netlify:
   - Site settings → **Identity** → Enable
   - Identity → **Registration**: set to "Invite only" (recommended)
   - Identity → **Services** → Enable **Git Gateway**
3. Visit: https://<your-site>.netlify.app/admin/
4. Invite yourself (Identity tab) and log in.
5. Use Projects → upload images (stored in assets/img) and add captions.

## Where to add images manually
- assets/img/

## Content files
CMS-friendly:
- content/cms/projects.cms.json
- content/cms/experience.cms.json
- content/cms/education.cms.json
- content/cms/skills.cms.json
- content/site.json

The site auto-loads CMS files when present.

## Notes
- This is a static site (no server needed).
- For a dedicated blog or deeper routing, you could migrate to Next.js + Vercel later.
