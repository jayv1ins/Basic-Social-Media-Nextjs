# 1. Install dependencies
composer install

# 2. Generate key
php artisan key:generate

# 3. Migrate database with seed
php artisan migrate --seed

# 4. Link Storage
php artisan storage:link

# 5. indexes the model data
php artisan scout:import App\Models\Post 
php artisan scout:import App\Models\Blog 
php artisan scout:import App\Models\Event 
php artisan scout:import App\Models\User


# 6. Run the server
php artisan serve

# 7 Register and start posting and edit delete
/Register
