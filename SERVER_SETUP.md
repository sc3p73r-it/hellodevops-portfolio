# Laravel Server Setup & Installation Guide

This guide details how to set up a production server (Ubuntu 22.04/24.04) for a Laravel application using the LEMP stack (Linux, Nginx, MySQL, PHP).

## 1. Initial Server Setup

Login to your server via SSH and update the package manager.

```bash
ssh root@your_server_ip
sudo apt update && sudo apt upgrade -y
```

Install essential utility packages:

```bash
sudo apt install -y git curl zip unzip nano
```

## 2. Install Nginx (Web Server)

```bash
sudo apt install -y nginx
```

Start and enable Nginx:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 3. Install MySQL (Database)

```bash
sudo apt install -y mysql-server
```

Secure the installation (set root password, remove anonymous users):

```bash
sudo mysql_secure_installation
```

Create a database and user for your project:

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE hellodevops;
CREATE USER 'devops_user'@'localhost' IDENTIFIED BY 'P@ssw0rd';
GRANT ALL PRIVILEGES ON hellodevops.* TO 'devops_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4. Install PHP & Extensions

Add the PHP repository (if needed for latest versions) and install PHP 8.2 (or 8.3) and required extensions for Laravel.

```bash
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install -y php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-bcmath php8.2-curl php8.2-zip php8.2-intl php8.2-gd php8.2-common
```

## 5. Install Composer

Composer is the dependency manager for PHP.

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

## 6. Deploy Your Laravel Project

Navigate to the web root and clone your repository (assuming you have pushed your Laravel code to GitHub/GitLab).

```bash
cd /var/www
sudo git clone https://github.com/yourusername/hellodevops-portfolio.git hellodevops
```

Install PHP dependencies:

```bash
cd hellodevops
composer install --optimize-autoloader --no-dev
```

Set up the environment file:

```bash
cp .env.example .env
nano .env
```

*Update `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` and set `APP_ENV=production`, `APP_DEBUG=false`.*

Generate application key and run migrations:

```bash
php artisan key:generate
php artisan migrate --force
```

## 7. Configure Permissions

Laravel needs write access to specific directories.

```bash
sudo chown -R www-data:www-data /var/www/hellodevops
sudo chmod -R 775 /var/www/hellodevops/storage
sudo chmod -R 775 /var/www/hellodevops/bootstrap/cache
```

## 8. Configure Nginx

Create a new configuration file for your site.

```bash
sudo nano /etc/nginx/sites-available/hellodevops
```

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;
    root /var/www/hellodevops/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/hellodevops /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 9. SSL Certificate (HTTPS)

Secure your site with Let's Encrypt.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com -d www.your_domain.com
```