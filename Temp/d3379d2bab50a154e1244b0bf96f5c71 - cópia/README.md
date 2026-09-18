<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1olF-W4cg9qSpgFMTCGwYVVz8s-1Ws7y6

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
 
Backend (PHP + MySQL)

1. Ensure you have PHP and MySQL (or MariaDB) installed.
2. Configure database credentials via environment variables or edit `api/config.php`:
   - `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`.
3. From the `api` folder run the setup script to create the database and tables:

```bash
php api/db_setup.php
```

4. Serve the frontend (e.g., `npm run dev`) and make sure PHP is available at `/api` (use built-in PHP server for development):

```bash
# from project root
php -S 127.0.0.1:8000 -t .
# then visit http://127.0.0.1:8000 and the frontend will call /api/index.php
```

5. Test an endpoint:

```bash
curl "http://127.0.0.1:8000/api/index.php?resource=categories"
```

Publishing to GitHub

1. Initialize git (if not already):

```bash
git init
git add .
git commit -m "Initial project with API and frontend"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Add `api/schema.sql` and `api/db_setup.php` so others can recreate the DB.

Security note: Do not commit production DB passwords. Use environment variables or secret management for deployments.

Uploads and images

- The app stores image URLs in the database and image files under `/uploads/` on the webroot (e.g. `/uploads/banners/`, `/uploads/logos/`).
- Ensure the `uploads/` folder exists and is writable by PHP (`chmod 755` or `775` depending on host).
- The project includes `api/upload.php` which accepts `multipart/form-data` (field `file`) and optional `dir` (subfolder). It returns JSON `{ "url": "/uploads/<dir>/<file>" }` on success.
- Example client upload using curl:

```bash
curl -F "file=@banner.jpg" -F "dir=banners" https://SEU-DOMINIO.COM/api/upload.php
```

