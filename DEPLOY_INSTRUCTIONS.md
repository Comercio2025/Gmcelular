# Deploy Instructions for cPanel

## 1. Database Setup
1. Log in to cPanel -> **MySQL Database Wizard**.
2. Create a database (e.g., `gmcelular_db`).
3. Create a user (e.g., `gmcelular_user`) and password.
4. Give **ALL PRIVILEGES** to the user on that database.
5. Go to **phpMyAdmin**, select your new database, and Import the standard tables using the SQL below (or just let the app auto-create them if you visit the admin panel).

## 2. File Upload
1. Run `npm run build` on your local machine if you haven't (I can do this for you).
2. Use **File Manager** (or FTP) to upload the contents of the `dist` folder to your `public_html`.
3. Create a folder named `api` inside `public_html`.
4. Upload all files from your local `api` folder into `public_html/api`.

## 3. Configuration
1. Edit `public_html/api/config.php`.
2. Update the credentials with the ones you created in step 1:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'gmcelular_user');
   define('DB_PASS', 'your_password');
   define('DB_NAME', 'gmcelular_db');
   ```

## 4. Permissions
- Ensure folders have `755` permission.
- Ensure files have `644` permission.
